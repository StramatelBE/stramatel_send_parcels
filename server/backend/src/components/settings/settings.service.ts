import { Settings, PrismaClient } from "@prisma/client";
import { Service } from "typedi";

@Service()
export class SettingService {
  private prisma = new PrismaClient();

  async initializeSettings(): Promise<Settings | null> {
    const setting = await this.prisma.settings.findUnique({
      where: { id: 1 },
    });

    if (!setting) {
      const newSetting = await this.prisma.settings.create({
        data: {
          id: 1,
          standby: true,
          standby_start_time: 8,
          standby_end_time: 20,
          restart_at: 2,
          language: "en",
          theme: "light"
        },
      });

      return newSetting;
    }

    return setting;
  }

  async getSettings(): Promise<Settings[]> {
    const settings = await this.prisma.settings.findMany();
    return settings;
  }

  async createSetting(
    settingData: Settings
  ): Promise<Settings> {
    const newSetting = await this.prisma.settings.create({
      data: settingData,
    });
    return newSetting;
  }

  async getSettingById(
    settingId: number
  ): Promise<Settings | null> {
    const setting = await this.prisma.settings.findUnique({
      where: { id: settingId },
    });
    return setting;
  }

  async updateSetting(
    settingId: number,
    settingData: Settings
  ): Promise<Settings | null> {
    const updatedSetting = await this.prisma.settings.update({
      where: { id: settingId },
      data: settingData,
    });
    return updatedSetting;
  }

  async deleteSetting(
    settingId: number
  ): Promise<Settings | null> {
    const deletedSetting = await this.prisma.settings.delete({
      where: { id: settingId },
    });
    return deletedSetting;
  }
}
