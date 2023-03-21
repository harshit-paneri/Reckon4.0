const express = require('express');
const router = express.Router();
const weatherapi = require("../controllers/coords2data.controller");



router.post("/",weatherapi.coords2data);


module.exports = router;