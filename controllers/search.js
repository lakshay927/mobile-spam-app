const Sequelize = require("sequelize");
const User = require("../models/user");
const SpamNumber = require("../models/spamNumber");

// search by name or phone number
const search = async (req, res) => {
  try {
    const { query, searchBy } = req.query;

    if (searchBy === "name") {
      // Search by name
      const results = await User.findAll({
        where: {
          name: {
            [Sequelize.Op.or]: [
              { [Sequelize.Op.startsWith]: query },
              { [Sequelize.Op.substring]: query },
            ],
          },
        },
        attributes: ["name", "phoneNumber"],
        include: [
          {
            model: SpamNumber,
            attributes: ["phoneNumber"],
          },
        ],
      });

      res.status(200).json({ name: results });
    } else if (searchBy === "phoneNumber") {
      // Search by phone number
      const registeredUser = await User.findOne({
        where: { phoneNumber: query },
        attributes: ["name", "phoneNumber", "email"],
        include: [
          {
            model: SpamNumber,
            attributes: ["phoneNumber"],
          },
        ],
      });

      if (registeredUser) {
        // registered user
        const isContact = await SpamNumber.findOne({
          where: { phoneNumber: query, UserId: registeredUser.uniqno },
        });

        if (isContact) {
          res.json([
            {
              ...registeredUser.toJSON(),
              email: registeredUser.email,
            },
          ]);
        } else {
          res.json([registeredUser]);
        }
      } else {
        const results = await User.findAll({
          where: { phoneNumber: query },
          attributes: ["name", "phoneNumber"],
          include: [
            {
              model: SpamNumber,
              attributes: ["phoneNumber"],
            },
          ],
        });

        res.status(200).json({ data: results });
      }
    } else {
      res.status(400).json({ error: "Invalid searchBy parameter" });
    }
  } catch (err) {
    res.status(500).json({ msg: err });
  }
};

module.exports = {
  search,
};
