const express = require('express');
const router = express.Router();
const pin2coords = require("../controllers/pin2coords.controller");



router.post("/add",pin2coords.addpin);
router.get("/",pin2coords.pin2coords);


module.exports = router;