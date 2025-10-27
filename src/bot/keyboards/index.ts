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

  const message = `🔥 <b>Assalomu alaykum!</b> @ibroximai botiga xush kelibsiz.
    
    Bu bot orqali siz quyidagilarni bajara olasiz 👇
    
    🎬 <b>Instagram</b> va <b>TikTok</b> havolasini yuboring — video faylni yuklab oling.  
    📂 Istalgan turdagi faylni yuboring — uni ziplash, siqish yoki boshqa formatga (PDF ⇄ DOC ...) o‘tkazish mumkin.  
    🔍 Shunchaki matn yuboring — bot sizga musiqa, film yoki boshqa ma’lumotlarni topib beradi.
    
    🚀 <b>Boshlash uchun biror havola yoki fayl yuboring!</b>      `.trim();

  await ctx.reply(message, {
    parse_mode: "HTML",
    reply_markup: menuKeyboard,
  });
};
