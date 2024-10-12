"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorCatcher = void 0;
exports.handleErrors = handleErrors;
const grammy_1 = require("grammy");
async function handleErrors(ctx, action) {
    try {
        await action();
    }
    catch (error) {
        console.error(`Error in ${ctx.update.update_id}:`, error);
        await ctx.reply("Hato sodir bo'ldi. Qayta urinib ko'ring.");
    }
}
const globalErrorCatcher = (err) => {
    const ctx = err.ctx;
    console.error(`Error while handling update ${ctx.update.update_id}:`);
    const e = err.error;
    if (e instanceof grammy_1.GrammyError) {
        console.error("Error in request:", e.description);
    }
    else if (e instanceof grammy_1.HttpError) {
        console.error("Could not contact Telegram:", e);
    }
    else {
        console.error("Unknown error:", e);
    }
};
exports.globalErrorCatcher = globalErrorCatcher;
