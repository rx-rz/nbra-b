import { NextResponse } from "next/server";
const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: "roqeebatbolarinwa@gmail.com",
    pass: "McaysqWQbEZFJPzr",
  },
});

export async function POST(req: Request) {
  const { subscribers, message } = await req.json();
  let info = await transporter.sendMail({
    from: "roqeebatbolarinwa@gmail.com",
    to: subscribers,
    subject: "Hello 👍",
    text: message,
  });
  console.log("Message sent: %s", info.messageId);
  return NextResponse.json({ info });
}
