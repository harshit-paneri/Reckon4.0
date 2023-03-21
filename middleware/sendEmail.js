const nodemailer = require("nodemailer");

module.exports = async (email , subject , text) => {
    try{
        const transporter = nodemailer.createTransport({
            host : process.env.HOST,
            service : process.env.SERVICE,
            port : 465,
            secure : true,
            
            auth :{
                user : process.env.Email ,
                pass : process.env.PASS,
            },
            tls:{
                rejectUnauthorized:false
            }
        })
        console.log("=====email password ================",process.env.PASS);
        console.log("=====email ================",process.env.Email);
        

        await transporter.sendMail({
            from : 'offlineattendance@gmail.com',
            to : email,
            subject : subject,
            text:text
        })

        console.log("Email sent successfully");
        return true
    }
    catch(err){
        console.log(err,"email not sent!");
        return err
    }
}