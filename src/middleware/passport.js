import config from "../config.js";
import passport from "passport";
import bcrypt from "bcrypt";
import passportLocal from "passport-local";
import { carritosService, usuariosService } from "../services/index.js";
import logger from "../lib/logger.js";
import { sendMail } from "../lib/mailer.js";
import { validImageFile, deleteFile, WSErrorResponse } from "../lib/util.js";
import { MESSAGE_INVALID_USER } from "../const.js";
import { app } from "../global.js";

const LocalStrategy = passportLocal.Strategy;

function passportConfig() {
  app.use(passport.initialize());
  app.use(passport.session());
  passport.use(
    "login",
    new LocalStrategy(
      {
        usernameField: "email",
        passReqToCallback: true,
      },
      async function (req, email, password, done) {
        let usuario = await usuariosService.find({ email: email.toLocaleLowerCase() });

        if (!usuario) {
          logger.warn("Usuario no encontrado: ", email);
          return done(null, false, MESSAGE_INVALID_USER);
        } else {
          if (!isValidPassword(usuario, password)) {
            logger.warn("Contraseña no valida para usuario: ", email);
            return done(null, false, MESSAGE_INVALID_USER);
          } else {
            // Devolver el id de carrito como parte del usuario
            // si por alguna razon no existe, crearlo
            let carrito = await carritosService.find({ usuario: usuario.id });
            if (!carrito) {
              carrito = {};
              carrito.id = await carritosService.save({ usuario: usuario.id, productos: [] });
            }
            usuario.carrito = carrito.id;
            usuario.redirUrl = req.session.redirUrl;
            return done(null, usuario);
          }
        }
      }
    )
  );

  passport.use(
    "signup",
    new LocalStrategy(
      {
        usernameField: "email",
        passReqToCallback: true,
      },
      async function (req, email, password, done) {
        try {
          let usuario = await usuariosService.find({ email });

          if (usuario) {
            logger.info("Usuario existente: " + email);
            try {
              deleteFile(req.file.path);
            } catch (error) {}
            done(null, false, "El email ya está registrado.");
            return;
          } else {
            if (!(req && req.file && req.file.path && validImageFile(req.file.path))) {
              try {
                deleteFile(req.file.path);
              } catch (error) {}
              done(null, false, "La imagen de perfil no es valida.");
              return;
            }

            let newUser = {
              nombreApellido: req.body.name,
              direccion: req.body.address,
              email: email.toLowerCase(),
              edad: req.body.age,
              telefono: req.body.phoneNumber,
              password: createHash(password),
              avatar: req.file.filename,
              isAdmin: false,
            };

            let id;
            try {
              id = await usuariosService.save(newUser);
            } catch (error) {
              if (error instanceof WSErrorResponse) {
                done(null, false, error.message);
                return;
              } else {
                throw error.message;
              }
            }
            newUser = await usuariosService.getById(id);
            let carritoId = await carritosService.save({ usuario: newUser.id, productos: [] });
            newUser.carrito = carritoId;

            // Mail con nuevo usuario
            const htmlRegistro = `Datos del nuevo usuario registrado:<br>
            Nombre y Apellido: ${newUser.nombreApellido}<br>
            Direccion: ${newUser.direccion}<br>
            Email: ${newUser.email}<br>
            Edad: ${newUser.edad}<br>
            Telefono: ${newUser.telefono}
            `;
            sendMail(
              "WineHouse - Tienda de vinos",
              config.adminMail,
              "Nuevo registro",
              htmlRegistro
            );

            const htmlBienvenida = `Hola, ${newUser.nombreApellido} ya estas registrado en WineHouse - Tienda de vinos.<br>`;
            sendMail(
              "WineHouse - Tienda de vinos",
              newUser.email,
              "Bienvenido a WineHouse - Tienda de vinos",
              htmlBienvenida
            );
            done(null, newUser);
            return;
          }
        } catch (error) {
          let message = error;
          if (error.message) {
            message = error.message;
          }
          logger.error(`Error signup:  ${message}`);
          try {
            deleteFile(req.file.path);
          } catch (error) {}
          done(null, false, "Fallo en la registración.");
        }
      }
    )
  );
}

const isValidPassword = (user, password) => {
  return bcrypt.compareSync(password, user.password);
};

const createHash = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
  let user = await usuariosService.getById(id);
  // Devolver el id de carrito como parte del usuario
  // si por alguna razon no existe, crearlo
  if (user) {
    let carrito = await carritosService.find({ usuario: user.id });
    if (!carrito) {
      carrito = {};
      carrito.id = await carritosService.save({ usuario: user.id, productos: [] });
    }
    user.carrito = carrito.id;
    return done(null, user);
  }
  return done(null, false, "Usuario no encontrado");
});

export { passport, passportConfig, createHash };
