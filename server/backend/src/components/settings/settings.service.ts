import { Settings, PrismaClient } from "@prisma/client";
import { Service } from "typedi";
import { SettingsDto } from "./settings.validation";

@Service()
export class SettingService {
  private prisma = new PrismaClient();

  async getSettings(): Promise<Settings[]> {
    const settings = await this.prisma.settings.findMany();
    return settings;
  }

  async createSetting(settingData: SettingsDto): Promise<Settings> {
    const newSetting = await this.prisma.settings.create({
      data: settingData,
    });
    return newSetting;
  }

  async getSettingById(settingId: number): Promise<Settings | null> {
    const setting = await this.prisma.settings.findUnique({
      where: { id: settingId },
    });
    return setting;
  }

  async updateSetting(
    settingId: number,
    settingData: SettingsDto
  ): Promise<Settings | null> {
    const updatedSetting = await this.prisma.settings.update({
      where: { id: settingId },
      data: settingData,
    });
    return updatedSetting;
  }

  async deleteSetting(settingId: number): Promise<Settings | null> {
    const deletedSetting = await this.prisma.settings.delete({
      where: { id: settingId },
    });
    return deletedSetting;
  }
}
