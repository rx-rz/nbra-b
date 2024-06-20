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
  for (const subscriber of subscribers) {
    const info = await transporter.sendMail({
      from: "roqeebatbolarinwa@gmail.com",
      to: subscriber, 
      subject: "", 
      html: message, 
    });
  }

  return NextResponse.json({ success: true });
}
  