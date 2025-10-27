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
        await ctx.reply("Siz buyurtmalaringizni tanladingiz!");
        break;
      case "💵 Hisob to'ldirish":
        await ctx.reply("Hisobni to'ldirish bo‘limi ochildi!");
        break;
      case "🚀 Kanalim":
        await ctx.reply("Sizning kanalingiz ma’lumotlari:");
        break;
      case "☎️ Qo'llab-quvvatlash":
        await ctx.reply("Qo‘llab-quvvatlashga xush kelibsiz!");
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
