const path = require("path");

const bodyParser = require("body-parser");
const express = require("express");
const session = require("express-session");
var MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");
const multer = require("multer");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");
const errorController = require("./controllers/error.js");

const User = require("./models/user");
// const mongoConnect = require("./util/database").mongoConnect;
const mongoose = require("mongoose");
const {
  PORT,
  MONGOOSE_USER,
  MONGOOSE_PASSWORD,
  MONGOOSE_DATABASE,
  SESSION_SECRET,
} = require("./util/config.js");

const app = express();

const MOGODB_URI = `mongodb+srv://${MONGOOSE_USER}:${MONGOOSE_PASSWORD}@cluster0.xk4dvlj.mongodb.net/${MONGOOSE_DATABASE}?retryWrites=true&w=majority`;

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const csrfProtection = csrf();

const store = new MongoDBStore({
  uri: MOGODB_URI,
  collection: "sessions",
});

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ storage: fileStorage, fileFilter }).single("image"));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use((req, res, next) => {
  // throw new Error('Sync Error')
  if (!req.session.user) return next();
  User.findById(req.session.user._id)
    .then((user) => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch((err) => {
      next(new Error(err));
    });
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

// Express error handling middleware with 4 arguments
app.use((error, req, res, next) => {
  res.status(500).render("500", {
    pageTitle: "Error",
    path: "/500",
    isAuthenticated: req.session.user,
  });
});

// mongoConnect(() => {
//   app.listen(3000);
// });

mongoose
  .connect(MOGODB_URI)
  .then(() => {
    app.listen(PORT || 3000);
  })
  .catch((err) => console.log(err));
