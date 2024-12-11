import { prisma } from '@/lib/prisma';
import { Setting } from '@prisma/client';

export async function getSettings() {
  return prisma.setting.findMany();
}

export async function upsertSetting(key: string, value: string) {
  return prisma.setting.upsert({
    where: {
      settingKey: key,
    },
    update: {
      settingValue: value,
    },
    create: {
      settingKey: key,
      settingValue: value,
    },
  });
}

export async function deleteSetting(key: string) {
  return prisma.setting.delete({
    where: {
      settingKey: key,
    },
  });
}