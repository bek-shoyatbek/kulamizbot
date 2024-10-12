import { Bot, InlineQueryResultBuilder, session } from "grammy";
import { BOT_TOKEN } from "./shared/configs";
import { Voice } from "./models/voice.model";
import { connectDB } from "./shared/database";
import { MyContext, SessionData } from "./types";
import { globalErrorCatcher, handleErrors } from "./shared/errors";

const botToken = BOT_TOKEN;
if (!botToken) {
    throw new Error("BOT_TOKEN is not defined");
}

export const bot = new Bot<MyContext>(botToken);

bot.use(session({ initial: (): SessionData => ({}) }));

bot.catch(globalErrorCatcher);

bot.command("start", (ctx) => handleErrors(ctx, async () => {
    await ctx.reply("Assalomu alaykum. Botimizga xush kelibsiz. Ovozlarim tugmasini bosing.");
}));

// Handle voice messages
bot.on("message:voice", (ctx) => handleErrors(ctx, async () => {
    const voice = ctx.message.voice;

    // Save voice details in session
    ctx.session.awaitingTitle = {
        fileId: voice.file_id,
        duration: voice.duration,
    };

    await ctx.reply("Ajoyib, ovoz nomini yozing");
}));

bot.on("message:audio", (ctx) => handleErrors(ctx, async () => {
    const audio = ctx.message.audio;

    // Save audio details in session
    ctx.session.awaitingTitle = {
        fileId: audio.file_id,
        duration: audio.duration,
    };

    await ctx.reply("Ajoyib, audio nomini yozing");
}));


bot.command("ovozlarim", (ctx) => handleErrors(ctx, async () => {
    const voices = await Voice.find({ userId: ctx.from?.id });

    if (voices.length === 0) {
        await ctx.reply("Hozircha ovozlarim yo'q");
        return;
    }

    const voiceList = voices.map((voice) => `• ${voice.title} (${voice.duration}s)`).join("\n");
    await ctx.reply(`Sizning ovozlaringiz:\n${voiceList}`);
}));

// Handle text messages (for title input)
bot.on("message:text", (ctx) => handleErrors(ctx, async () => {
    if (ctx.session.awaitingTitle) {
        const title = ctx.message.text;
        const { fileId, duration } = ctx.session.awaitingTitle;

        const newVoice = new Voice({
            userId: ctx.from.id,
            title: title,
            fileId: fileId,
            duration: duration,
        });

        await newVoice.save();
        delete ctx.session.awaitingTitle;
        await ctx.reply(`Ovoz qabul qilindi!`);
    } else {
        await ctx.reply("Hozircha ovoz nomini yozing");
    }
}));



// Handle inline queries
bot.on("inline_query", (ctx) => handleErrors(ctx, async () => {
    const query = ctx.inlineQuery.query.toLowerCase();
    const voices = await Voice.find({
        userId: ctx.from!.id,
        title: { $regex: query, $options: "i" },
    });

    const results = voices.map((voice) =>
        InlineQueryResultBuilder.voice(voice._id.toString(), voice.title,
            voice.fileId, {
            voice_duration: voice.duration,
            caption: `Uzunligi: ${voice.duration}s`,
        })
    );

    await ctx.answerInlineQuery(results);
}));


(async () => {
    await connectDB();

    await bot.api.setMyCommands([
        { command: "start", description: "Start the bot" },
        { command: "ovozlarim", description: "Ovozlarim" },
    ])
    await bot.start();
})()
