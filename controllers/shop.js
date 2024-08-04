const path = require("path");
const fs = require("fs");

const PDFDocument = require("pdfkit");

const Product = require("../models/product");
const Order = require("../models/order");

const ITEMS_PER_PAGE = 3;

exports.getIndex = (req, res, next) => {
  const page = +req.query.page || 1;
  let totalItems;

  Product.countDocuments()
    .then((itemsCount) => {
      totalItems = itemsCount;
      return Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then((products) => {
      res.render("shop/index", {
        products: products,
        pageTitle: "Shop",
        path: "/",
        pageNums: Math.ceil(totalItems / ITEMS_PER_PAGE),
        currentPage: page,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(error);
    });
};

exports.getProducts = (req, res, next) => {
  const page = +req.query.page || 1;
  let totalItems;

  Product.countDocuments()
    .then((itemsCount) => {
      totalItems = itemsCount;
      return Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then((products) => {
      res.render("shop/product-list", {
        products: products,
        pageTitle: "Shop",
        path: "/product-list",
        pageNums: Math.ceil(totalItems / ITEMS_PER_PAGE),
        currentPage: page,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(error);
    });
};
exports.getProductDetails = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product) => {
      res.render("shop/product-details", {
        pageTitle: product.title,
        path: "/product-list",
        product: product,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(error);
    });
};

exports.getCart = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    // .execPopulate()
    .then((user) => {
      const products = user.cart.items;
      res.render("shop/cart", {
        pageTitle: "Cart",
        path: "/cart",
        products: products,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(error);
    });
};

exports.postCart = (req, res, next) => {
  const productId = req.body.productId;
  Product.findById(productId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(error);
    });
};

exports.postDeleteFromCart = (req, res, next) => {
  const productId = req.body.productId;
  req.user
    .DeleteFromCart(productId)
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(error);
    });
};

exports.getOrders = (req, res, next) => {
  Order.find({ "user.userId": req.user._id })
    .then((orders) => {
      res.render("shop/orders", {
        pageTitle: "My Orders",
        path: "/orders",
        orders: orders,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(error);
    });
};

exports.postOrder = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items.map((i) => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });

      const order = new Order({
        user: {
          email: req.user.email,
          userId: req.user,
        },
        products,
      });
      return order.save();
    })
    .then(() => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect("/orders");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(error);
    });
};

exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;

  Order.findById(orderId)
    .then((order) => {
      if (!order) return next(new Error("No order found."));

      if (order.user.userId.toString() !== req.user._id.toString())
        return next(new Error("Unauthorized"));

      const fileName = "invoice-" + orderId + ".pdf";
      const invoicePath = path.join("data", "invoices", fileName);

      const pdfDoc = new PDFDocument();
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        'inline;filename="' + fileName + '"'
      );
      pdfDoc.pipe(fs.createWriteStream(invoicePath));
      pdfDoc.pipe(res);

      pdfDoc.fontSize(26).text("Invoice", {
        underline: true,
      });
      let totalPrice = 0;
      order.products.forEach((prod) => {
        totalPrice += prod.quantity * prod.product.price;
        pdfDoc
          .fontSize(16)
          .text(
            `${prod.product.title} - ${prod.quantity}x $${prod.product.price}`
          );
      });
      pdfDoc.text("----------------------");
      pdfDoc.fontSize(20).text(`Total Price: $${totalPrice}`);

      pdfDoc.end();

      // fs.readFile(invoicePath, (err, buffer) => {
      //   console.log(buffer);
      //   if (err) return next(err);
      //   res.setHeader("Content-Type", "application/pdf");
      //   res.setHeader(
      //     "Content-Disposition",
      //     'attachment;filename="' + fileName + '"'
      //   );
      //   res.send(buffer);
      // });

      // const file = fs.createReadStream(invoicePath);
      // res.setHeader("Content-Type", "application/pdf");
      // res.setHeader(
      //   "Content-Disposition",
      //   'attachment;filename="' + fileName + '"'
      // );
      // file.pipe(res);
    })
    .catch((err) => next(err));
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    pageTitle: "Checkout",
    path: "/checkout",
    isAuthenticated: req.session.user,
  });
};
