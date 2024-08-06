const dotenv = require("dotenv");
dotenv.config();

exports.PORT = process.env.PORT;
exports.MONGOOSE_USER = process.env.MONGOOSE_USER;
exports.MONGOOSE_PASSWORD = process.env.MONGOOSE_PASSWORD;
exports.MONGOOSE_DATABASE = process.env.MONGOOSE_DATABASE;
exports.SESSION_SECRET = process.env.SESSION_SECRET;
exports.NODEMAILER_API = process.env.NODEMAILER_API;
exports.STRIPE_SECRET = process.env.STRIPE_SECRET;

