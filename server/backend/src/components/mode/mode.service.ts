import { PrismaClient, Mode } from "@prisma/client";
import { Service } from "typedi";
import { HttpException } from "../../exceptions/HttpException";
const prisma = new PrismaClient();

@Service()
export class ModeService {
  public async createMode(modeData: Mode): Promise<Mode> {
    return prisma.mode.create({
      data: modeData,
    });
  }

  public async findModeById(modeId: number): Promise<Mode | null> {
    return prisma.mode.findUnique({
      where: { id: modeId },
    });
  }

  public async findModes(): Promise<Mode[]> {
    return prisma.mode.findMany({});
  }

  public async updateMode(
    modeId: number,
    modeData: Partial<Mode>
  ): Promise<Mode> {
    return prisma.mode.update({
      where: { id: modeId },
      data: modeData,
    });
  }

  public async deleteMode(modeId: number): Promise<Mode> {
    return prisma.mode.delete({
      where: { id: modeId },
    });
  }
}
