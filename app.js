require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const Sequelize = require("./db/connection");

const users = require("./routes/user");
const spamNumber = require("./routes/spamNumber");

const app = express();
const port = 3002;

// middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.get("/next", (req, res) => res.send("Hello World!"));
app.use("/api/users", users);
app.use("/api/spamNumber", spamNumber);

(() => {
  Sequelize.sync()
    .then(() => {
      console.log("Connection has been established successfully.");
      app.listen(port, () =>
        console.log(`Express App listening on port ${port}!`)
      );
    })
    .catch((error) => {
      console.error("Unable to connect to the database:", error);
      console.log(`[error], ${error}`);
      process.exit(1);
    });
})();
