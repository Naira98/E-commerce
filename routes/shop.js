const express = require("express");

const router = express.Router();

const shopController = require("../controllers/shop.js");

const isAuth = require("../middleware/is-auth.js");

router.get("/", shopController.getIndex);

router.get("/products", shopController.getProducts);

router.get("/products/:productId", shopController.getProductDetails);

router.get("/cart", isAuth, shopController.getCart);

router.post("/delete-from-cart", isAuth, shopController.postDeleteFromCart);

router.post("/cart", isAuth, shopController.postCart);

router.get("/checkout", isAuth, shopController.getCheckout);

router.get("/checkout/success", shopController.postOrder);

router.get("/checkout/cancel", shopController.getCheckout);

router.get("/orders", isAuth, shopController.getOrders);

router.get("/orders/:orderId", isAuth, shopController.getInvoice);

module.exports = router;
