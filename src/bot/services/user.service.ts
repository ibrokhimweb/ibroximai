import { prisma } from "../../config/prisma.js";

export const userService = {
  async findByTelegramId(telegram_id: string) {
    return prisma.user.findUnique({ where: { telegram_id } });
  },

  async createOrUpdateUser(data: {
    telegram_id: string;
    username?: string | null;
    first_name?: string | null;
    last_name?: string | null;
    language?: string | null;
    is_premium?: boolean | null;
  }) {
    const existing = await prisma.user.findUnique({
      where: { telegram_id: data.telegram_id },
    });

    if (existing) {
      return prisma.user.update({
        where: { telegram_id: data.telegram_id },
        data: {
          username: data.username ?? existing.username,
          first_name: data.first_name ?? existing.first_name,
          last_name: data.last_name ?? existing.last_name,
          language: data.language ?? existing.language,
          is_premium: data.is_premium ?? existing.is_premium,
          updated_date: new Date(),
        },
      });
    }

    return prisma.user.create({
      data: {
        telegram_id: data.telegram_id,
        username: data.username ?? null,
        first_name: data.first_name ?? null,
        last_name: data.last_name ?? null,
        language: data.language ?? "uz",
        is_premium: data.is_premium ?? false,
        status: 1,
        role: "user",
        created_by: 0,
      },
    });
  },

  async updatePhone(telegram_id: string, phone: string) {
    return prisma.user.update({
      where: { telegram_id },
      data: { phone },
    });
  },
};
