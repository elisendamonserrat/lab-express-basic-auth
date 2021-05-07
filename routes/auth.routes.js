const { Router } = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User.model");
const mongoose = require("mongoose");

const router = new Router();

const saltRounds = 10;

router.get("/sign-up", (req, res) => {
  res.render("auth/signup");
});

router.post("/sign-up", (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.render("auth/signup", {
      errorMessage:
        "All fields are mandatory. Please provide a username and a password.",
    });
    return;
  }

    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!regex.test(password)) {
      res
        .status(500)
        .render('auth/signup', { errorMessage: 'Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.' });
      return;
    }

  bcrypt
    .genSalt(saltRounds)
    .then((salt) => bcrypt.hash(password, salt))
    .then((hashedPassword) => {
      console.log(hashedPassword);
      return User.create({
        username,
        passwordHash: hashedPassword,
      });
    })
    .then(() => res.redirect("/"))
    .catch((error) => {
      if (error.code === 11000) {
        res
          .status(500)
          .render("auth/signup", {
            errorMessage:
              "Username and email need to be unique. Either username or email is already used.",
          });
      } else {
        next(error);
      }
    });
});

router.get("/login", (req, res) => res.render("auth/login"));

router.post("/login", (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.render("auth/login", {
      errorMessage: "Please enter both, email and password to login.",
    });
    return;
  }

  User.findOne({ username })
    .then((user) => {
      if (!user) {
        res.render("auth/login", {
          errorMessage:
            "This username is not registered. Try with another username.",
        });
        return;
      } else if (bcrypt.compareSync(password, user.passwordHash)) {
        const { _id, username: name } = user
        req.session.currentUser = {
          _id,
          name
        };
        return res.redirect('/profile');
      } else {
        res.render("auth/login", { errorMessage: "Incorrect password." });
      }
    })
    .catch((error) => next(error));
});

router.get("/profile", (req, res) => {
  console.log(req.session.currentUser)
  res.render("users/profile", { userInSession: req.session.currentUser })
});

router.post('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
