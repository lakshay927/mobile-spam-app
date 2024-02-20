const express = require("express");
const { userRegister, userLogin } = require("../controllers/auth");
const { search } = require("../controllers/search");

const router = express.Router();

router.route("/register").post(userRegister);
router.route("/login").post(userLogin);

router.route("/search").get(search);

module.exports = router;
