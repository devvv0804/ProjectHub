import Mailgen from "mailgen";
import nodemailer from "nodemailer";
//first we will learn how to generate the mail
//this file only focuses on creating the email, not sending it!

//mails we can send using services like aws ses and brevo for production for test purpose we can use test mail platforms like mailtrap!

const emailVerificationfromMailgenContent = (username, verificationUrl) => {
  return {
    body: {
      name: username,
      intro: "Welcome to our App!",
      action: {
        instructions:
          "To verify your email please click on the following button",
        button: {
          color: "#1aae5aff",
          text: "Verify your email",
          link: verificationUrl,
        },
      },
    },
    outro:
      "Need help, or have questions? Just reply to this email, we'd love to help",
  };
};

const forgotPasswordMailgenContent = (username, passwordResetUrl) => {
  return {
    body: {
      name: username,
      intro: "We got a request to reset the password of your account",
      action: {
        instructions:
          "To reset your password please click on the following button",
        button: {
          color: "#1aae5aff",
          text: "Reset Password",
          link: passwordResetUrl,
        },
      },
    },
    outro:
      "Need help, or have questions? Just reply to this email, we'd love to help",
  };
};

//to send mails now
// we will use nodemailer

const sendEmail = async (options) => {
  //initialise the mail gen
  const mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Task Manager",
      link: "https://taskmanagerlink.com",
    },
  });

  const emailTextual = mailGenerator.generatePlaintext(options.mailgenContent);

  const emailHtml = mailGenerator.generatePlaintext(options.mailgenContent);

  const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_SMTP_HOST,
    port: process.env.MAILTRAP_SMTP_PORT,
    auth: {
      user: process.env.MAILTRAP_SMTP_USER,
      pass: process.env.MAILTRAP_SMTP_PASS,
    },
  });

  const mail = {
    from: "devsrivastava080405@gmail.com",
    to: options.email,
    subject: options.subject,
    text: emailTextual,
    html: emailHtml,
  };

  try {
    await transporter.sendMail(mail);
  } catch (error) {
    console.error(
      "Email service failed silently, make sure you have provided your MAILTRAP credentials in the .env file!",
    );
    console.error(error);
  }
};
export {
  emailVerificationfromMailgenContent,
  forgotPasswordMailgenContent,
  sendEmail,
};
