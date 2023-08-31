import {
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
      errorFormat: 'pretty',
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  public checkAccess = async (
    venderId: number,
    id: number,
    model: any,
  ): Promise<boolean> => {
    const hasAccess = await model.count({
      where: {
        id,
        venderId,
      },
    });

    if (!hasAccess) {
      throw new UnauthorizedException();
    }

    return true;
  };
}
