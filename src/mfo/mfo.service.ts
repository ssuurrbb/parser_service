import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { MfoParserService } from './parser/mfo.parser.service';

@Injectable()
export class MfoService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly parser: MfoParserService,
  ) {}

  async parseAndSave(slug: string) {
    try {
      const parsedData = await this.parser.parseCompanyPage(slug);

      // Сохраняем или обновляем запись
      const mfo = await this.prisma.mfo.upsert({
        where: { slug },
        update: {
          name: parsedData.main?.title || null,
          data: parsedData,
          parsedAt: new Date(),
        },
        create: {
          slug,
          name: parsedData.main?.title || null,
          data: parsedData,
          parsedAt: new Date(),
        },
      });

      return {
        success: true,
        slug,
        mfoId: mfo.id,
        parsedAt: mfo.parsedAt,
      };
    } catch (error) {
      console.error(`Ошибка при парсинге и сохранении ${slug}:`, error);
      throw error; // или верни { success: false, error }
    }
  }

  async findOne(slug: string) {
    return this.prisma.mfo.findUnique({ where: { slug } });
  }

  async findAll(take = 20, skip = 0) {
    return this.prisma.mfo.findMany({
      take,
      skip,
      orderBy: { parsedAt: 'desc' },
    });
  }
}