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

  const message = `*Bu bot orqali siz quyidagilarni bajara olasiz 👇*

🎬 *Instagram* va *TikTok* havolasini yuboring — video faylni yuklab oling  
📂 Istalgan turdagi faylni yuboring va fayl ustida amallar bajaring
🔍 Shunchaki matn yuboring — bot sizga musiqa, film yoki boshqa ma’lumotlarni topib beradi

🚀 *Boshlash uchun biror havola, fayl yuboring yoki qo'shimcha imkoniyatlarda foydalaning\!*`.trim();

  await ctx.reply(message, {
    parse_mode: "Markdown",
    reply_markup: menuKeyboard,
  });
};
