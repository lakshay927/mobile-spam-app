const jwt = require("jsonwebtoken");

// middleware
const secretKey = process.env.JWT_SECRET;

function isAuthenticated(req, res, next) {
  const token = req.cookies["token"];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Authentication failed: No token provided" });
  }

  // Verify the token
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res
        .status(401)
        .json({ message: "Authentication failed: Invalid token" });
    }

    req.admin = decoded;
    next();
  });
}

module.exports = isAuthenticated;
