import { BotError, GrammyError, HttpError } from "grammy";
import { MyContext } from "src/types";

export async function handleErrors(ctx: MyContext, action: () => Promise<void>): Promise<void> {
    try {
        await action();
    } catch (error) {
        console.error(`Error in ${ctx.update.update_id}:`, error);
        await ctx.reply("Hato sodir bo'ldi. Qayta urinib ko'ring.");
    }
}

export const globalErrorCatcher = (err: BotError) => {
    const ctx = err.ctx;
    console.error(`Error while handling update ${ctx.update.update_id}:`);
    const e = err.error;
    if (e instanceof GrammyError) {
        console.error("Error in request:", e.description);
    } else if (e instanceof HttpError) {
        console.error("Could not contact Telegram:", e);
    } else {
        console.error("Unknown error:", e);
    }
}