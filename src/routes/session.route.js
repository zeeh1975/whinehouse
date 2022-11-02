import multer from "multer";
import { Router } from "express";
import logger from "../lib/logger.js";
import { passport } from "../middleware/passport.js";
import { sessionController, usuariosController } from "../controllers/index.js";

const router = Router();

var storageAvatars = multer.diskStorage({
  destination: (req, files, cb) => {
    cb(null, "uploads/avatars");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

var uploadAvatar = multer({ storage: storageAvatars });

function errorHandler(err, req, res, next) {
  logger.error(err.message);
  return res.status(401).send({ success: false, message: "No se encuentra autorizado" });
}

router
  .route("/login")
  .get(sessionController.getLoginPage)
  .post(
    passport.authenticate("login", { failureRedirect: "/loginFailed", failureMessage: true }),
    sessionController.postLogin,
    errorHandler
  );

router
  .route("/loginFailed")
  .get(sessionController.postLoginFailed)
  .post(sessionController.postLoginFailed);

router.route("/logout").get(sessionController.getLogoutPage);

router
  .route("/signup")
  .get(sessionController.getSignupPage)
  .post(
    uploadAvatar.single("avatar"),
    passport.authenticate("signup", { failureRedirect: "/signupFailed", failureMessage: true }),
    sessionController.postSignup,
    errorHandler
  );

router
  .route("/signupFailed")
  .get(sessionController.postSignupFailed)
  .post(sessionController.postSignupFailed);

router.route("/user").get(usuariosController.getUser);

export default router;
