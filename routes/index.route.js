const express = require('express');
const router = express.Router();

// const urlRoutes = require("./url.route");
const userRoute = require("./user.route");
const weatherDataRoute = require("./weatherdata.route");
const pin2coords = require("../routes/pin.route");
// const urlController = require("../controllers/url.controller");

// const userRoutes = require("./user.route");
const authRoutes = require("./auth.routes")
// const password_reset_Routes = require("./password_reset.route");

// router.use("/password-reset",password_reset_Routes);

// const authMiddleware = require("../middleware/auth.middleware");


router.use("/auth",authRoutes);

// router.use("/url",authMiddleware.verifyTokenMiddleware,urlRoutes);
// router.use("/",authMiddleware.verifyTokenMiddleware,userRoute);
router.use("/",userRoute);
router.use("/weatherdata",weatherDataRoute);
router.use("/pin",pin2coords);
// router.use("/user",userRoutes);

// router.get("/*",urlController.redirect);

module.exports = router;