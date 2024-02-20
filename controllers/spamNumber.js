const SpamNumber = require("../models/spamNumber");

// mark a number as spam
const markNumberAsSpam = async (req, res) => {
  try {
    const { phoneNumber, UserId } = req.body;

    const existingSpam = await SpamNumber.findOne({
      where: { phoneNumber },
    });

    if (existingSpam) {
      return res
        .status(400)
        .json({ error: "Number already marked as spam by this user" });
    }

    const spamNumber = await SpamNumber.create({ phoneNumber, UserId });

    return res.status(201).json({ spamNumber });
  } catch (err) {
    return res.status(500).json({ msg: err });
  }
};

module.exports = {
  markNumberAsSpam,
};
