import { Bot } from "grammy";
import * as cheerio from "cheerio";

import { logger } from "../middlewares/logger.js";
import { startCommand } from "./commands/start.js";
import { helpCommand } from "./commands/help.js";
import { contactHandler } from "./handlers/contact.js";
import { registerUser } from "../middlewares/registerUser.ts.js";
import { ensurePhone } from "../middlewares/ensurePhone.js";
import { checkSubscription } from "../middlewares/checkSubscription .js";
import { confirmSubscription } from "./handlers/confirm_subscription.js";
import { mediaHandler } from "./handlers/mediaDownload.js";
import { messageHandler } from "./handlers/message.js";
import { fileHandler } from "./handlers/file.js";
import { lexicaHandler } from "./handlers/lexicaHandler.js";
import axios from "axios";

const bot = new Bot(process.env.BOT_TOKEN!);

// 🧩 Middlewares
bot.use(logger);
bot.use(registerUser);

bot.use(async (ctx, next) => {
  // Faqat guruh yoki superguruhda bo‘lsa
  if (ctx.chat?.type === "group" || ctx.chat?.type === "supergroup") {
    try {
      const me = await ctx.api.getChatMember(ctx.chat.id, ctx.me.id);

      console.log(`👀 Guruh: ${ctx.chat.title}\n` + `Status: ${me.status}`);

      // // Agar bot admin bo‘lsa, avtomatik chiqib ketadi:
      // if (me.status === "administrator") {
      //   await ctx.api.leaveChat(ctx.chat.id);
      //   console.log(`🚪 Bot ${ctx.chat.title} guruhidan chiqdi.`);
      // }

      return;
    } catch (err) {
      console.error("⚠️ Guruhdagi huquqlarni olishda xatolik:", err);
      return;
    }
  }

  // Aks holda (private chat) davom etsin
  await next();
});

bot.on("message:contact", contactHandler);
bot.callbackQuery("confirm_subscription", confirmSubscription);

bot.command("start", startCommand);

bot.command("getmusic", async (ctx) => {
  try {
    const msg = await ctx.reply(
      "⏳ Kuting... so‘nggi 3 ta musiqa olinmoqda..."
    );

    await ctx.replyWithVideo(`https://t.me/SoundMediaDB/167`);
    await msg.message_id.toExponential();
  } catch (err) {
    console.error("❌ Xatolik:", err);
    await ctx.reply(
      "❌ Xatolik yuz berdi. Balki kanal yopiq yoki post o‘chirilgan bo‘lishi mumkin."
    );
  }
});

bot.use(ensurePhone);
bot.use(checkSubscription);

// Handlers
bot.on("message:file", fileHandler);
bot.on("message:text", async (ctx, next) => {
  await mediaHandler(ctx, next); // agar media link bo‘lsa
  await messageHandler(ctx, next); // yoki tugma bosilgan bo‘lsa

  const text = ctx.message?.text || "";

  if (text.toLowerCase().startsWith("pic ")) {
    const query = text.replace(/^pic\s*/i, "");
    ctx.message.text = query;
    return lexicaHandler(ctx);
  }
});

// ⚙️ Commandlar
bot.command("help", helpCommand);

bot.command("profile", async (ctx) => {
  await ctx.reply("👤 Sizning profilingiz:");
});

export { bot };
