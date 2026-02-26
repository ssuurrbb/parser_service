import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MfoModule } from './mfo/mfo.module';
import { PrismaService } from './database/prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal:true}),
    MfoModule
  ],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
