"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const configs_1 = require("../configs");
const connectDB = async () => {
    try {
        await mongoose_1.default.connect(configs_1.MONGODB_URI);
        console.log("Connected to MongoDB");
    }
    catch (error) {
        console.log(error);
    }
};
exports.connectDB = connectDB;
