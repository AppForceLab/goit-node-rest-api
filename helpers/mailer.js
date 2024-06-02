import nodemailer from "nodemailer";
import "dotenv/config";

const { UKR_NET_PASS, UKR_NET_FROM } = process.env;

const nodmailerConfig = {
  host: "smtp.ukr.net",
  port: 465,
  secure: true,
  auth: {
    user: UKR_NET_FROM,
    pass: UKR_NET_PASS,
  },
};

const transporter = nodemailer.createTransport(nodmailerConfig);

const sendEmail = data => {
    const email = {...data, from: UKR_NET_FROM};
    return transporter.sendMail(email);
}

export default sendEmail;
