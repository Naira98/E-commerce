const express = require("express");
const { body } = require("express-validator");

const router = express.Router();

const adminController = require("../controllers/admin.js");
const isAuth = require("../middleware/is-auth.js");

router.get("/add-product", isAuth, adminController.getAddProduct);

router.get("/products", isAuth, adminController.getAdminProducts);

router.post(
  "/add-product",
  [
    body("title").trim().isString().isLength({ min: 3, max: 50 }),
    body("imageUrl").isURL(),
    body("price", 'Price must be greater than 0 $').isFloat({gt: 0}),
    body("description").trim().isLength({ min: 5, max: 400 }),
  ],
  isAuth,
  adminController.postAddProduct
);

router.get("/edit-product/:productId", isAuth, adminController.getEditProduct);

router.post(
  "/edit-product",
  [
    body("title").trim().isString().isLength({ min: 3, max: 50 }),
    body("imageUrl").isURL(),
    body("price", 'Price must be greater than 0 $').isFloat({gt: 0}),
    body("description").trim().isLength({ min: 5, max: 400 }),
  ],
  isAuth,
  adminController.postEditProduct
);

router.post("/delete-product", isAuth, adminController.postDeleteProduct);

module.exports = router;
