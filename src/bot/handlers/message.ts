import dayjs from "dayjs";
import lodash from "lodash";
import { Context, NextFunction } from "grammy";
import { prisma } from "../../config/prisma.js";
import { escapeMarkdown } from "../../helpers/index.js";

export const messageHandler = async (ctx: Context, next: NextFunction) => {
  const text = ctx.message?.text;
  const telegramId = ctx.from?.id;

  if (!telegramId || !text) return;

  try {
    // 1️⃣ DB-dan foydalanuvchi ma'lumotlarini olish
    const user = await prisma.user.findUnique({
      where: { telegram_id: String(telegramId) },
    });

    if (!user) {
      await ctx.reply("❌ Sizning hisobingiz topilmadi!");
      return;
    }

    switch (text) {
      case "🗂 Xizmatlarga buyurtma berish":
        await ctx.reply("Xizmatlardan birini tanlang 🗂", {
          parse_mode: "Markdown",
          reply_markup: {
            inline_keyboard: [
              [
                { text: "⭐ SMM & Reklama", callback_data: "service_smm" },
                {
                  text: "👥 Trafik & Nakrutka",
                  callback_data: "service_nakrutka",
                },
              ],
              [
                { text: "💻 Dasturlash", callback_data: "service_programming" },
                {
                  text: "🎨 Dizayn",
                  callback_data: "service_design",
                },
              ],
              [
                {
                  text: "🧠 AI & Avtomatlashtirish",
                  callback_data: "service_ai",
                },
              ],
            ],
          },
        });
        break;

      case "💳 Mening hisobim":
        await ctx.reply(
          `
*🏛 Sizning hisobingiz*

*Status:* ${lodash.capitalize(user.role)}
*ID:* \`-${escapeMarkdown(user.telegram_id.toString())}\`
*FIO:* ${escapeMarkdown(user.first_name || "NoName")} ${escapeMarkdown(
            user.last_name || ""
          )}
*Hisob:* Jarayonda ⚠️
*Sarflangan:* Jarayonda ⚠️

⏰ _${dayjs().format("YYYY-MM-DD HH:mm:ss")}_`,
          {
            parse_mode: "Markdown",
            reply_markup: {
              inline_keyboard: [
                [
                  { text: "💰 Pul ishlash", callback_data: "earn_money" },
                  {
                    text: "💳 Hisobni to‘ldirish",
                    callback_data: "top_up_balance",
                  },
                ],
              ],
            },
          }
        );
        break;

      case "🔎 Buyurtmalarim":
        await ctx.reply(
          "📦 *Sizning buyurtmalaringiz*\n\n❌ Buyurtmalar mavjud emas",
          {
            parse_mode: "Markdown",
            reply_markup: {
              inline_keyboard: [
                [{ text: "🆕 Yangi buyurtma", callback_data: "new_order" }],
              ],
            },
          }
        );
        break;

      // 🎁 Bonuslar
      case "🎁 Bonuslar":
        await ctx.reply(
          "🎁 *Bonuslar bo‘limi* — hozircha mavjud bonuslar yo‘q.",
          {
            parse_mode: "Markdown",
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: "💰 Do‘stni taklif qilish",
                    callback_data: "invite_friend",
                  },
                  { text: "📜 Shartlar", callback_data: "bonus_terms" },
                ],
              ],
            },
          }
        );
        break;

      // 💬 Fikr bildirish
      case "💬 Fikr bildirish":
        await ctx.reply(
          "💬 *Fikringiz biz uchun muhim!*\n\nBot haqida fikringizni yozing yoki taklif bildiring 👇",
          { parse_mode: "Markdown" }
        );
        break;

      // ⚙️ Sozlamalar
      case "⚙️ Sozlamalar":
        await ctx.reply("⚙️ *Sozlamalar menyusi*", {
          parse_mode: "Markdown",
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "🌐 Tilni o‘zgartirish",
                  callback_data: "change_language",
                },
                { text: "🔔 Bildirishnomalar", callback_data: "notifications" },
              ],
            ],
          },
        });
        break;

      // ☎️ Qo‘llab-quvvatlash
      case "☎️ Qo'llab-quvvatlash":
        await ctx.reply("☎️ *Qo‘llab-quvvatlash markazi*", {
          parse_mode: "Markdown",
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "👨‍💻 Admin bilan bog‘lanish",
                  url: "https://t.me/AiDasturchi",
                },
              ],
            ],
          },
        });
        break;

      default:
        break;
    }
  } catch (err) {
    console.error("❌ Contact handler error:", err);
    await ctx.reply("⚠️ Xatolik yuz berdi. Keyinroq qayta urinib ko‘ring.");
  }

  await next();
};
