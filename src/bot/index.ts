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

bot.on("callback_query:data", async (ctx) => {
  const data = ctx.callbackQuery.data;

  const pendingCallbacks = [
    "service_smm",
    "service_nakrutka",
    "service_programming",
    "service_design",
    "service_ai",
    "earn_money",
    "top_up_balance",
    "new_order",
    "invite_friend",
    "bonus_terms",
    "back_main_menu",
    "change_language",
    "notifications",
  ];

  if (pendingCallbacks.includes(data)) {
    await ctx.answerCallbackQuery(); // loadingni to‘xtatadi
    await ctx.reply("⚠️ Yakuniga yetmagan");
  }
});

// ⚙️ Commandlar
bot.command("help", helpCommand);

bot.command("profile", async (ctx) => {
  await ctx.reply("👤 Sizning profilingiz:");
});

export { bot };
