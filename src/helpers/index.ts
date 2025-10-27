import { Context, NextFunction } from "grammy";
import fs from "fs";
import path from "path";
import axios from "axios";
import { UPLOAD_DIR } from "../constants/index.js";

export const escapeMarkdown = (text: string | number) =>
  String(text).replace(/[_*[\]()~`>#+\-=|{}.!]/g, "\\$&");

export const formattedNumber = (num: number | string): string => {
  if (num === null || num === undefined) return "0";
  const n = Number(num);
  return n.toLocaleString("uz-UZ"); // natija: 1 234 567
};

export function extractFileInfo(ctx: Context) {
  const msg = ctx.message;

  if (!msg) return null;

  const file =
    msg.photo?.at(-1) ||
    msg.video ||
    msg.audio ||
    msg.voice ||
    msg.document ||
    msg.animation ||
    msg.sticker;

  if (!file) return null;

  const file_id = file.file_id;

  // Fikr: documentlarda filename bo‘ladi, boshqalarida yo‘q
  const filename =
    (file as any).file_name ||
    `${Date.now()}_${file_id}` +
      (msg.photo ? ".jpg" : msg.video ? ".mp4" : msg.audio ? ".mp3" : ".bin");

  return { ...file, filename };
}

export async function downloadTelegramFile(
  ctx: Context,
  file_id: string,
  filename: string
): Promise<string> {
  const file = await ctx.api.getFile(file_id);
  if (!file.file_path) throw new Error("Telegram file path not found");

  const fileUrl = `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${file.file_path}`;

  // 📁 uploads papkasini tayyorlab olish
  const uploadDir = path.resolve("./uploads");
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  const filePath = path.join(uploadDir, filename);

  // Faylni yuklab olish
  const res = await fetch(fileUrl);
  if (!res.ok) throw new Error("Failed to download file from Telegram");

  const buffer = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(filePath, buffer);

  return filePath;
}

export function generateKeyboardByMime(mimeType?: string, fileName?: string) {
  const ext = fileName?.split(".").pop()?.toLowerCase();

  // Default opsiyalar
  let keyboard = [
    [{ text: "📤 Yuklab olish", callback_data: "file_download" }],
  ];

  if (!mimeType && !ext) return keyboard;

  if (mimeType?.includes("zip") || ext === "zip" || ext === "rar") {
    keyboard = [
      [{ text: "📂 Zipdan chiqarish", callback_data: "file_unzip" }],
      [
        { text: "🗜️ Ziplash", callback_data: "file_zip" },
        { text: "📉 Compress qilish", callback_data: "file_compress" },
      ],
    ];
  } else if (
    mimeType?.includes("image") ||
    ["png", "jpg", "jpeg", "webp"].includes(ext!)
  ) {
    keyboard = [
      [
        { text: "🖼️ O‘lchamini o‘zgartirish", callback_data: "file_resize" },
        { text: "📉 Compress qilish", callback_data: "file_compress" },
      ],
      [
        { text: "🗜️ Ziplash", callback_data: "file_zip" },
        { text: "📉 Compress qilish", callback_data: "file_compress" },
      ],
    ];
  } else if (
    mimeType?.includes("audio") ||
    mimeType?.includes("voice") ||
    ["mp3", "ogg", "wav"].includes(ext!)
  ) {
    keyboard = [
      [{ text: "✂️ Qirqish", callback_data: "file_trim" }],
      [
        { text: "🗜️ Ziplash", callback_data: "file_zip" },
        { text: "📉 Compress qilish", callback_data: "file_compress" },
      ],
    ];
  } else if (
    mimeType?.includes("video") ||
    ["mp4", "mov", "avi", "mkv"].includes(ext!)
  ) {
    keyboard = [
      [
        { text: "✂️ Qirqish", callback_data: "file_cut" },
        { text: "🗜️ Ziplash", callback_data: "file_zip" },
      ],
      [{ text: "📉 Compress qilish", callback_data: "file_compress" }],
    ];
  } else if (mimeType?.includes("pdf") || ["pdf"].includes(ext!)) {
    keyboard = [
      [{ text: "📄 DOC ga o‘girish", callback_data: "file_to_doc" }],
      [
        { text: "🗜️ Ziplash", callback_data: "file_zip" },
        { text: "📉 Compress qilish", callback_data: "file_compress" },
      ],
    ];
  } else if (["doc", "docx", "txt", "md"].includes(ext!)) {
    keyboard = [
      [{ text: "📄 PDF ga o‘girish", callback_data: "file_to_pdf" }],
      [
        { text: "🗜️ Ziplash", callback_data: "file_zip" },
        { text: "📉 Compress qilish", callback_data: "file_compress" },
      ],
    ];
  }

  return keyboard;
}
