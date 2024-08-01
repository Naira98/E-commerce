const path = require("path");
const bodyParser = require("body-parser");
const express = require("express");
const session = require("express-session");
var MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");
const dotenv = require("dotenv");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");
const errorController = require("./controllers/error.js");

const User = require("./models/user");

// const mongoConnect = require("./util/database").mongoConnect;
const mongoose = require("mongoose");

const app = express();
dotenv.config();

const MOGODB_URI = `mongodb+srv://naira:${process.env.MONGOOSE_PASSWORD}@cluster0.xk4dvlj.mongodb.net/shop?retryWrites=true&w=majority`;
const csrfProtection = csrf();

const store = new MongoDBStore({
  uri: MOGODB_URI,
  collection: "sessions",
});

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  if (!req.session.user) return next();
  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

// mongoConnect(() => {
//   app.listen(3000);
// });

mongoose
  .connect(MOGODB_URI)
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => console.log(err));
