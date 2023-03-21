const express = require('express');
const router = express.Router();

const user = require("../controllers/user.controller")
const pin = require("../controllers/pin2coords.controller")

// router.get("/", user.getUserDetails);
// router.get("/", pin.pin2coords);
router.get("/", user.hello);
router.post("/", user.setUserDetails);
router.post("/delUser",user.delUserAccount);
router.post("/ChangePassword",user.ChangePassword);

module.exports = router;