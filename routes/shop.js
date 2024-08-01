const express = require("express");

const router = express.Router();

const shopController = require("../controllers/shop.js");
const isAuth = require("../middleware/is-auth.js");

router.get("/", shopController.getIndex);

router.get("/products", shopController.getProducts);

router.get("/products/:productId", shopController.getProductDetails);

router.get("/cart", isAuth, shopController.getCart);

router.post("/cart", isAuth, shopController.postCart);

router.post("/delete-from-cart", isAuth, shopController.postDeleteFromCart);

router.get("/orders", isAuth, shopController.getOrders);

router.post("/create-order", isAuth, shopController.postOrder);

// router.get("/checkout", shopController.getCheckout);

module.exports = router;
