const express = require("express");
const { markNumberAsSpam } = require("../controllers/spamNumber");

const router = express.Router();

router.route("/").post(markNumberAsSpam);

module.exports = router;
