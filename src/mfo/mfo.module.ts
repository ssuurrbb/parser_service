import { Module } from '@nestjs/common';
import { MfoController } from './mfo.controller';
import { MfoService } from './mfo.service';
import { MfoParserService } from './parser/mfo.parser.service';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  controllers: [MfoController],
  providers: [MfoService, PrismaService, MfoParserService ]
})
export class MfoModule {}
