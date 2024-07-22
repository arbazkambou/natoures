import nodemailer from "nodemailer";
import {
  GenerateConfirmEmailText,
  GenerateForgotPasswordText,
  GenerateWelcomeText,
} from "./GenerateMessages.js";

export class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(" ")[0];
    this.url = url;
    this.from = `Arbaz Shoukat <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === "development") {
      return nodemailer.createTransport({
        host: process.env.BREVO_HOST,
        port: process.env.BREVO_PORT,
        auth: {
          user: process.env.BREVO_USERNAME,
          pass: process.env.BREVO_PASSWORD,
        },
      });
    }
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async send(subject, text) {
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      text,
    };

    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send(
      "Welcome",
      `${GenerateWelcomeText(this.firstName, this.url)}`,
    );
  }

  async sendForgotPassword() {
    await this.send(
      "Your password reset token (valid only for 10 mins)",
      `${GenerateForgotPasswordText(this.firstName, this.url)}`,
    );
  }

  async sendConfirmEmail() {
    await this.send(
      "Confirm your email please! (valid only for 10 mins)",
      `${GenerateConfirmEmailText(this.firstName, this.url)}`,
    );
  }
}
