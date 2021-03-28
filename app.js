//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const { Schema } = mongoose;

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new Schema({
  email: String,
  password: String,
});

const secret = process.env.SECRET;
console.log(secret);
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ["password"] });

const User = new mongoose.model("User", userSchema);

const user1 = new User({
  email: "ebrima@gamil.com",
  password: "quooch8O",
});
// user1.save();

app.get("/", (req, res) => {
  res.render("home");
});
app.get("/login", (req, res) => {
  res.render("login");
});
app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/secrets", (req, res) => {
  res.render("secrets");
});

app.post("/register", (req, res) => {
  // console.log(req.body);
  const username = req.body.username;
  const password = req.body.password;

  const newUser = new User({
    email: username,
    password: password,
  });

  User.findOne({ email: username }, (err, user) => {
    if (!err) {
      if (user) {
        res.send("There exists an account with that username");
      } else {
        newUser.save((err) => {
          if (err) {
            console.log(err);
          } else {
            res.render("secrets");
          }
        });
      }
    } else {
      res.send(err);
    }
  });
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({ email: username }, (err, user) => {
    if (err) {
      console.log(err);
    } else {
      if (user) {
        if (user.password === password) {
          res.render("secrets");
        } else {
          res.send("Password is incorrect, please try again");
        }
      } else {
        res.send("There is no user with that username");
      }
    }
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
