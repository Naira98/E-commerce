const dotenv = require("dotenv");
dotenv.config();

exports.MONGOOSE_PASSWORD = process.env.MONGOOSE_PASSWORD;
exports.SESSION_SECRET = process.env.SESSION_SECRET;
exports.NODEMAILER_API = process.env.NODEMAILER_API;
exports.STRIPE_SECRET = process.env.STRIPE_SECRET;

