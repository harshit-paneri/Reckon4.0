const User = require("../database/models/user").userModel;

exports.generateOTP = (otp_length) => {
    // Declare a digits variable
    // which stores all digits
    var digits = "0123456789";
    let OTP = "";
    for (let i = 0; i < otp_length; i++) {
      OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
  };

exports.sendSMS = async({ message, contactNumber }) => {
    const accountSid = process.env.twilioSID; // Your Account SID from www.twilio.com/console
    const authToken = process.env.twilioAuthToken; // Your Auth Token from www.twilio.com/console

    console.log(accountSid);
    console.log(authToken);

    const client = require('twilio')(accountSid, authToken);

    client.messages
    .create({
        body: message,
        to: contactNumber, // Text this number
        from: '+15073575460', // From a valid Twilio number
    })
    .then((message) => console.log(message.sid));

} 

exports.clearOtp = async (phone) => {
    try{

        const phoneExist = await User.findOne({ phone });
        console.log(phoneExist)
        if(phoneExist){
            phoneExist.otp = null
            await phoneExist.save()
        }
        

    }catch(err)
    {
        return err
    }

}