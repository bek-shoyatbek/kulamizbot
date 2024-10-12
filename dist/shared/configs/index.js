"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MONGODB_URI = exports.BOT_TOKEN = void 0;
require("dotenv/config");
exports.BOT_TOKEN = process.env.BOT_TOKEN;
exports.MONGODB_URI = process.env.MONGODB_URI;
