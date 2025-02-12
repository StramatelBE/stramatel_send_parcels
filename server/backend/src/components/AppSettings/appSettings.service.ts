import { AppSettings, PrismaClient } from "@prisma/client";
import { Service } from "typedi";
import { SettingsDto } from "./appSettings.validation";
import { exec } from "child_process";

@Service()
export class SettingService {
  private prisma = new PrismaClient();

  async getSettings(): Promise<AppSettings[]> {
    const settings = await this.prisma.appSettings.findMany();
    return settings;
  }

  async createSetting(settingData: SettingsDto): Promise<AppSettings> {
    const newSetting = await this.prisma.appSettings.create({
      data: settingData,
    });
    return newSetting;
  }

  async getSettingById(settingId: number): Promise<AppSettings | null> {
    const setting = await this.prisma.appSettings.findUnique({
      where: { id: settingId },
    });
    return setting;
  }

  async updateSetting(
    settingId: number,
    settingData: SettingsDto
  ): Promise<AppSettings | null> {
    const updatedSetting = await this.prisma.appSettings.update({
      where: { id: settingId },
      data: settingData,
    });
    return updatedSetting;
  }

  async updateDate(date: string): Promise<string> {
    return new Promise((resolve, reject) => {
      exec(`sudo date -s "${date}"`, (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return reject(error);
        }

        console.error(`stderr: ${stderr}`);
        resolve(stdout);
      });
    });
  }

  async deleteSetting(settingId: number): Promise<AppSettings | null> {
    const deletedSetting = await this.prisma.appSettings.delete({
      where: { id: settingId },
    });
    return deletedSetting;
  }
}
