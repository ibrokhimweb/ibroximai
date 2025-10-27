import { Context, Keyboard } from "grammy";

export const mainMenuKeyboard = async (ctx: Context) => {
  const menuKeyboard = new Keyboard()
    .text("🗂 Xizmatlarga buyurtma berish")
    .row()
    .text("💳 Mening hisobim")
    .text("🔎 Buyurtmalarim")
    .row()
    .text("🎁 Bonuslar")
    .text("💬 Fikr bildirish")
    .row()
    .text("⚙️ Sozlamalar")
    .text("☎️ Qo'llab-quvvatlash")
    .resized(); // tugmalar o‘lchamini moslashtirish

  await ctx.reply("👇 Tugmalardan foydalaning", {
    reply_markup: menuKeyboard,
  });
};
