"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bot = void 0;
const grammy_1 = require("grammy");
const configs_1 = require("./shared/configs");
const voice_model_1 = require("./models/voice.model");
const database_1 = require("./shared/database");
const errors_1 = require("./shared/errors");
const botToken = configs_1.BOT_TOKEN;
if (!botToken) {
    throw new Error("BOT_TOKEN is not defined");
}
exports.bot = new grammy_1.Bot(botToken);
exports.bot.use((0, grammy_1.session)({ initial: () => ({}) }));
exports.bot.catch(errors_1.globalErrorCatcher);
exports.bot.command("start", (ctx) => (0, errors_1.handleErrors)(ctx, async () => {
    await ctx.reply("Assalomu alaykum. Botimizga xush kelibsiz. Ovozlarim tugmasini bosing.");
}));
// Handle voice messages
exports.bot.on("message:voice", (ctx) => (0, errors_1.handleErrors)(ctx, async () => {
    const voice = ctx.message.voice;
    // Save voice details in session
    ctx.session.awaitingTitle = {
        fileId: voice.file_id,
        duration: voice.duration,
    };
    await ctx.reply("Ajoyib, ovoz nomini yozing");
}));
exports.bot.on("message:audio", (ctx) => (0, errors_1.handleErrors)(ctx, async () => {
    const audio = ctx.message.audio;
    // Save audio details in session
    ctx.session.awaitingTitle = {
        fileId: audio.file_id,
        duration: audio.duration,
    };
    await ctx.reply("Ajoyib, audio nomini yozing");
}));
exports.bot.command("ovozlarim", (ctx) => (0, errors_1.handleErrors)(ctx, async () => {
    const voices = await voice_model_1.Voice.find({ userId: ctx.from?.id });
    if (voices.length === 0) {
        await ctx.reply("Hozircha ovozlarim yo'q");
        return;
    }
    const voiceList = voices.map((voice) => `• ${voice.title} (${voice.duration}s)`).join("\n");
    await ctx.reply(`Sizning ovozlaringiz:\n${voiceList}`);
}));
// Handle text messages (for title input)
exports.bot.on("message:text", (ctx) => (0, errors_1.handleErrors)(ctx, async () => {
    if (ctx.session.awaitingTitle) {
        const title = ctx.message.text;
        const { fileId, duration } = ctx.session.awaitingTitle;
        const newVoice = new voice_model_1.Voice({
            userId: ctx.from.id,
            title: title,
            fileId: fileId,
            duration: duration,
        });
        await newVoice.save();
        delete ctx.session.awaitingTitle;
        await ctx.reply(`Ovoz qabul qilindi!`);
    }
    else {
        await ctx.reply("Hozircha ovoz nomini yozing");
    }
}));
// Handle inline queries
exports.bot.on("inline_query", (ctx) => (0, errors_1.handleErrors)(ctx, async () => {
    const query = ctx.inlineQuery.query.toLowerCase();
    const voices = await voice_model_1.Voice.find({
        userId: ctx.from.id,
        title: { $regex: query, $options: "i" },
    });
    const results = voices.map((voice) => grammy_1.InlineQueryResultBuilder.voice(voice._id.toString(), voice.title, voice.fileId, {
        voice_duration: voice.duration,
        caption: `Uzunligi: ${voice.duration}s`,
    }));
    await ctx.answerInlineQuery(results);
}));
(async () => {
    await (0, database_1.connectDB)();
    await exports.bot.api.setMyCommands([
        { command: "start", description: "Start the bot" },
        { command: "ovozlarim", description: "Ovozlarim" },
    ]);
    await exports.bot.start();
})();
