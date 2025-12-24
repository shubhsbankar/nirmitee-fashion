import nodemailer from 'nodemailer';

export const sendMail = async (subject, receiver, body) => {
   /*    const transporter = nodemailer.createTransport({
         host: process.env.NODEMAILER_HOST,
         port: process.env.NODEMAILER_PORT,
         secure: false,
         auth: {
           user: process.env.NODEMAILER_EMAIL ,
           pass: process.env.NODEMAILER_PASSWORD 
         }
       });*/
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASSWORD,
  },
});
       console.log(process.env.NODEMAILER_HOST,process.env.NODEMAILER_PORT,process.env.NODEMAILER_EMAIL,process.env.NODEMAILER_PASSWORD)
       const options = {
         from : `"Nirmitee Fashion" <${process.env.NODEMAILER_EMAIL}>`,
         to: receiver,
         subject: subject,
         html: body
       }

       try {
         await transporter.sendMail(options);
         console.log("Mail is send to ", receiver);
         return { success : true };
       }
       catch(error){
         return { success : false, message : error.message};
       }

}
