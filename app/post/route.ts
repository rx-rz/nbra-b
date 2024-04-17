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
  // const {subscribers, } = req.body;
  let info = await transporter.sendMail({
    from: "roqeebatbolarinwa@gmail.com",
    to: "adeleyetemiloluwa674@gmail.com",
    subject: "Hello 👍",
    text: "Hello. This is the latest on my blog post thingy.",
  });
  console.log("Message sent: %s", info.messageId);
  return NextResponse.json({ info });
}
