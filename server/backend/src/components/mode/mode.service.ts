import { PrismaClient, Mode } from "@prisma/client";
import { Service } from "typedi";
import { HttpException } from "../../exceptions/HttpException";
import { handleModeUpdate } from "../../sockets/webSocketServer";

const prisma = new PrismaClient();

@Service()
export class ModeService {
  public async createMode(modeData: Mode): Promise<Mode> {
    const createdMode = await prisma.mode.create({
      data: modeData,
    });
    
    // Notifier le serveur WebSocket du nouveau mode
    await handleModeUpdate(createdMode);
    
    return createdMode;
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
    const updatedMode = await prisma.mode.update({
      where: { id: modeId },
      data: modeData,
    });
    
    // Notifier le serveur WebSocket de la mise à jour du mode
    await handleModeUpdate(updatedMode);
    
    return updatedMode;
  }

  public async deleteMode(modeId: number): Promise<Mode> {
    const deletedMode = await prisma.mode.delete({
      where: { id: modeId },
    });
    
    // Si le mode supprimé avait l'ID 1, créer un nouveau mode par défaut
    if (modeId === 1) {
      const defaultMode = await prisma.mode.create({
        data: {
          id: 1,
          name: "default",
          playlist_id: null
        }
      });
      
      // Notifier le serveur WebSocket du nouveau mode par défaut
      await handleModeUpdate(defaultMode);
    }
    
    return deletedMode;
  }
}
