import { PrismaClient, Data, User } from "@prisma/client";
import { Service, Inject } from "typedi";
import { CreateDataDto, UpdateDataDto } from "./data.validation";
import { UploadService } from "../medias/upload.service";

const prisma = new PrismaClient();

@Service()
export class DataService {
  constructor(
    @Inject(() => UploadService) private uploadService: UploadService
  ) {}

  async createData(dataDto: CreateDataDto): Promise<Data> {
    const { user_id, ...rest } = dataDto;
    const data = await prisma.data.create({
      data: {
        ...rest,
        user: { connect: { id: user_id } },
      },
    });
    return data;
  }

  async getDataById(id: number): Promise<Data | null> {
    return prisma.data.findUnique({
      where: { id },
      include: {
        background: true,
      },
    });
  }

  async updateData(
    id: number,
    updateDataDto: UpdateDataDto,
    username: string
  ): Promise<Data> {
    const existingData = await prisma.data.findUnique({
      where: { id },
      include: { background: true },
    });
    if (
      updateDataDto?.background_id !== existingData?.background_id &&
      existingData?.background_id !== null
    ) {
      await this.uploadService.removeMediaFile(
        existingData.background,
        username
      );
      await prisma.media.delete({
        where: { id: existingData.background_id },
      });
    }

    const updatedData = await prisma.data.update({
      where: { id },
      data: {
        value: updateDataDto.value,
        name: updateDataDto.name,
        background_id: updateDataDto.background_id,
        backgroundColor: updateDataDto.backgroundColor,
      },
      include: { background: true },
    });
    return updatedData;
  }

  async deleteData(id: number): Promise<Data | null> {
    return prisma.data.delete({
      where: { id },
    });
  }

  async getAllData(): Promise<Data[]> {
    return prisma.data.findMany({
      include: {
        background: true,
      },
    });
  }
}
