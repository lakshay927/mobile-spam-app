const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

// register
const userRegister = async (req, res) => {
  try {
    const { name, phoneNumber, email, password } = req.body;

    const existingUser = await User.findOne({ where: { phoneNumber } });

    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Phone number is already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      phoneNumber,
      email,
      password: hashedPassword,
    });

    const result = await newUser.save();
    return res.status(201).json({ result });
  } catch (err) {
    return res.status(500).json({ msg: err });
  }
};

// login
const userLogin = async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;

    const user = await User.findOne({ where: { phoneNumber } });

    if (!user) {
      return res.status(404).json({ msg: "User not available" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(400).send({ msg: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id }, "secret");

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.status(201).send({ user, token: token });
  } catch (err) {
    res.status(500).json({ msg: err });
  }
};

module.exports = {
  userRegister,
  userLogin,
};
