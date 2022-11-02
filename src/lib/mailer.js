import config from "../config.js";
import nodemailer from "nodemailer";
import logger from "./logger.js";

const transporter = nodemailer.createTransport({
  service: config.nodeMailerService,
  port: config.nodeMailerPort,
  auth: {
    user: config.nodeMailerUser,
    pass: config.nodeMailerPass,
  },
});

async function sendMail(from, to, subject, html) {
  const mailOptions = {
    from,
    to,
    subject,
    html,
  };

  const info = await transporter.sendMail(mailOptions);
  logger.info("Email enviado " + info.messageId);
}

export { sendMail };
