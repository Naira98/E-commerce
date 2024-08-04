exports.get404 = (req, res, next) => {
  res
    .status(404)
    .render("404", {
      pageTitle: "Not Found",
      path: "/404",
      isAuthenticated: req.session.user,
    });
};
exports.get500 = (req, res, next) => {
  res
    .status(500)
    .render("500", {
      pageTitle: "Error",
      path: "/500",
      isAuthenticated: req.session.user,
    });
};
