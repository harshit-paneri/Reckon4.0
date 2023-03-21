const fetch = require('node-fetch');

const User = require("../database/models/user").userModel;

const {
    PHONE_NOT_FOUND_ERR,
  
    PHONE_ALREADY_EXISTS_ERR,
    USER_NOT_FOUND_ERR,
    INCORRECT_OTP_ERR,
    ACCESS_DENIED_ERR,
  } = require("../errors");

// const { checkPassword, hashPassword } = require("../utils/password.util");
const { createJwtToken } = require("../utils/token.util");
const { generateOTP, sendSMS , clearOtp } = require("../utils/otp.util");


exports.createNewUser = async (req, res, next) => {
    try {
      let { phone, fullName , pincode } = req.body;
  
  
      // check duplicate phone Number
      const phoneExist = await User.findOne({ phone });
  
      if (phoneExist) {
        next({ status: 400, message: PHONE_ALREADY_EXISTS_ERR });
        return;
      }

      // create new user
    const createUser = new User({
        phone,
        fullName,
        role : "USER" , 
        pincode
      });


      // generate otp
      const otp = generateOTP(6);
      
      // send otp to phone number
      await sendSMS(
        {
          message: `For registering yourself on AgroVision, Your OTP is ${otp} it will expire in 5 minutes`,
          contactNumber: phone,
        }
      );
  
      // save user
  
      const user = await createUser.save();
      // save otp to user collection
      user.otp = otp;
      await user.save();


  
      res.status(200).json({
        type: "success",
        message: "Account created OTP sended to mobile number ",
        data: {
          userId: user._id,
        },
      });


      setTimeout(clearOtp,300000,phone);
      
      
    } catch (error) {
      next(error);
    }
  };
  
  // ------------ login with phone otp ----------------------------------

exports.loginWithPhoneOtp = async (req, res, next) => {
    try {
  
      const { phone } = req.body;
      const user = await User.findOne({ phone });
  
      if (!user) {
        next({ status: 400, message: PHONE_NOT_FOUND_ERR });
        return;
      }
  
      res.status(201).json({
        type: "success",
        message: "OTP sended to your registered phone number",
        data: {
          userId: user._id,
        },
      });
  
      // generate otp
      const otp = generateOTP(6);
      // save otp to user collection
      user.phoneOtp = otp;
      // user.isAccountVerified = true;
      await user.save();
      // send otp to phone number
      await sendSMS(
        {
          message: `Your OTP is ${otp}`,
          contactNumber: user.phone,
        },
        next
      );
    } catch (error) {
      next(error);
    }
  };
  
  // ---------------------- verify phone otp -------------------------
  
  exports.verifyPhoneOtp = async (req, res, next) => {
    try {
      const { otp, userId } = req.body;
      const user = await User.findById(userId);
      if (!user) {
        next({ status: 400, message: USER_NOT_FOUND_ERR });
        return;
      }
  
      if (user.phoneOtp !== otp) {
        next({ status: 400, message: INCORRECT_OTP_ERR });
        return;
      }
      const token = createJwtToken({ userId: user._id });
  
      user.phoneOtp = "";
      await user.save();
  
      res.status(201).json({
        type: "success",
        message: "OTP verified successfully",
        data: {
          token,
          userId: user._id,
        },
      });
    } catch (error) {
      next(error);
    }
  };
  
  
  // --------------- fetch current user -------------------------
  
  exports.fetchCurrentUser = async (req, res, next) => {
    try {
      const currentUser = res.locals.user;
  
  
      return res.status(200).json({
        type: "success",
        message: "fetch current user",
        data: {
          user:currentUser,
        },
      });
    } catch (error) {
      next(error);
    }
  };
  