import { connections } from "mongoose";
import nodemailer from "nodemailer";

export const sendEmail = async({email, emailType, userId}) =>{
try{
    
    // Create a transporter using Ethereal test credentials.
    // For production, replace with your actual SMTP server details.
    const transporter = nodemailer.createTransport({
        // TODO: CONFIGURE MAIL FOR USAGE
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // Use true for port 465, false for port 587
      auth: {
        user: "maddison53@ethereal.email",
        pass: "jn7jnAPss4f63QBp6D",
      },
    });
    
    // Send an email using async/await
    // (async () => {
    //   const info = await transporter.sendMail({
    //     from: '"Maddison Foo Koch" <maddison53@ethereal.email>',
    //     to: email,
    //     subject: emailType==="VERIFY" ? "Verification Email for LANGLE" : "Password change request- LANGLE",
    //     html: "<b>Hello world?</b>", // HTML version of the message
    //   });
    // 
    //   console.log("Message sent:", info.messageId);
    // })();
    const mailOptions = {
            from: '"Maddison Foo Koch" <maddison53@ethereal.email>',
        to: email,
        subject: emailType==="VERIFY" ? "Verification Email for LANGLE" : "Password change request- LANGLE",
        html: "<b>Hello world?</b>", // HTML version of the message
    }
    const mailResponse = await transporter.sendMail(mailOptions)
    return mailResponse
} catch (err) {
    throw new Error(err.message)
}

}