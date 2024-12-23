const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  resetToken: String,
  resetTokenExpiration: Date,
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
  },
});

userSchema.methods.addToCart = function (product) {
  const cartProductIndex = this.cart.items.findIndex((cp) => {
    return cp.productId.toString() === product._id.toString();
  });

  let newQuantity = 1;
  const updatedCartItems = [...this.cart.items];

  if (cartProductIndex >= 0) {
    newQuantity = this.cart.items[cartProductIndex].quantity + 1;
    updatedCartItems[cartProductIndex].quantity = newQuantity;
  } else {
    updatedCartItems.push({ productId: product._id, quantity: newQuantity });
  }

  this.cart = { items: updatedCartItems };
  return this.save();
};

userSchema.methods.DeleteFromCart = function (productId) {
  const updatedCartItems = this.cart.items.filter((item) => {
    return item._id.toString() !== productId.toString();
  });
  this.cart = { items: updatedCartItems };
  return this.save();
};

userSchema.methods.decreaseQunatity = function (product) {
  const cartProductIndex = this.cart.items.findIndex((cp) => {
    return cp.productId.toString() === product._id.toString();
  });

  let updatedCartItems = [...this.cart.items];
  newQuantity = this.cart.items[cartProductIndex].quantity - 1;

  updatedCartItems[cartProductIndex].quantity = newQuantity;

  if (newQuantity <= 0) {
    updatedCartItems = this.cart.items.filter((item) => {
      return item.productId.toString() !== product._id.toString();
    });
  }

  this.cart = { items: updatedCartItems };
  return this.save();
};

userSchema.methods.clearCart = function () {
  this.cart = { items: [] };
  return this.save();
};

module.exports = mongoose.model("User", userSchema);

// const mongodb = require("mongodb");
// const getDb = require("../util/database").getDb;

// class User {
//   constructor(username, email, cart, id) {
//     this.name = username;
//     this.email = email;
//     this.cart = cart; //{items:[]};
//     this._id = id;
//   }

//   save() {
//     const db = getDb();
//     return db.collection("users").insertOne(this);
//   }

//   addToCart(product) {
//     const cartProductIndex = this.cart.items.findIndex((cp) => {
//       return cp.productId.toString() === product._id.toString();
//     });

//     const newQuantity = 1;
//     const updatedCartItems = [...this.cart.items];

//     if (cartProductIndex >= 0) {
//       newQuantity = this.cart.items[cartProductIndex].quantity + 1;
//       updatedCartItems[cartProductIndex].quantity = newQuantity;
//     } else {
//       updatedCartItems.push({ productId: product._id, quantity: newQuantity });
//     }

//     const updatedCart = { items: updatedCartItems };
//     const db = getDb();
//     return db
//       .collection("users")
//       .updateOne({ _id: this._id }, { $set: { cart: updatedCart } });
//   }

//   static findById(userId) {
//     const db = getDb();
//     return db
//       .collection("users")
//       .findOne({ _id: mongodb.ObjectId.createFromHexString(userId) })
//       .then((user) => {
//         return user;
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }
// }

// module.exports = User;
