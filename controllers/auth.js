const bcrypt = require("bcryptjs");

const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/login", {
    pageTitle: "Login",
    path: "/login",
    errorMessage: message,
  });
};

exports.postLogin = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email: email }).then((user) => {
    if (!user) {
      req.flash("error", "Invalid email or password.");
      return res.redirect("/login");
    }
    bcrypt
      .compare(password, user.password)
      .then((doMatch) => {
        if (doMatch) {
          console.log(doMatch);
          req.session.user = user;
          req.session.isLoggedIn = true;
          return req.session.save((err) => {
            console.log(err);
            res.redirect("/");
          });
        } else {
          req.flash("error", "Invalid email or password.");
          return res.redirect("/login");
        }
      })
      .catch((err) => console.log(err));
  });
};

exports.getSignup = (req, res) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/signup", {
    pageTitle: "Signup",
    path: "/signup",
    errorMessage: message,
  });
};

exports.postSignup = (req, res, next) => {
  const { email, password, confirmPassword } = req.body;
  User.findOne({ email: email })
    .then((userDocs) => {
      if (userDocs) {
        req.flash("error", "Email already exists");
        return res.redirect("/signup");
      }
      return bcrypt.hash(password, 12).then((hashedPassword) => {
        const user = new User({
          email,
          password: hashedPassword,
          cart: { items: [] },
        });
        return user.save();
      });
    })
    .then(() => {
      return res.redirect("/login");
    })
    .catch((err) => console.log(err));
};
exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};
