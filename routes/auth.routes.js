const express = require('express');
const router = express.Router();
const {
    fetchCurrentUser,
    loginWithPhoneOtp,
    createNewUser,
    verifyPhoneOtp
    
  } = require("../controllers/auth.controllers");



router.post("/register", createNewUser);

router.post("/login_with_phone", loginWithPhoneOtp);


router.post("/verify", verifyPhoneOtp);


// router.get("/me", checkAuth, fetchCurrentUser);

module.exports = router;