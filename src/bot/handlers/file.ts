// file: handlers/fileHandler.ts
import { Context } from "grammy";
import {
  downloadTelegramFile,
  extractFileInfo,
  generateKeyboardByMime,
} from "../../helpers/index.js";

export async function fileHandler(ctx: Context) {
  const info: any = extractFileInfo(ctx);
  if (!info) return;

  await ctx.reply(`\`\`\`${JSON.stringify(info, null, 2)}\`\`\``, {
    parse_mode: "Markdown",
  });

  const msg = await ctx.reply("👁️ Ko'rib chiqilmoqda...");

  try {
    const message = ctx.message;

    if (!message) return null;

    await downloadTelegramFile(ctx, info.file_id, info.filename);

    // Fayl turiga qarab mos tugmalarni generatsiya qilish
    const keyboard = generateKeyboardByMime(info.mime_type, info.filename);

    await ctx.api.editMessageText(
      ctx.chat?.id || "",
      msg.message_id,
      `✅ Fayl serverga saqlandi \n\n📦 Fayl ustida qanday amallar bajarishni istaysiz?`,
      {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: keyboard,
        },
      }
    );
  } catch (err: any) {
    console.error("File save error:", err);
    await ctx.api.editMessageText(
      ctx.chat?.id || "",
      msg.message_id,
      "❌ Faylni saqlashda xatolik yuz berdi \n\nRozbot vaqtincha katta hajimli fayllar bilan ishlay olmaydi ⚠️",
      { parse_mode: "Markdown" }
    );
  }
}
