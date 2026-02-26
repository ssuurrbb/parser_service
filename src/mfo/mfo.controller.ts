import { Controller, Get, Param, Post } from '@nestjs/common';
import { MfoService } from './mfo.service';

@Controller('mfo')
export class MfoController {
  constructor(private readonly mfoService: MfoService) {}

  @Post('parse/:slug')
  async parseAndSave(@Param('slug') slug: string) {
    try {
      const result = await this.mfoService.parseAndSave(slug);
      return result;
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  @Get(':slug')
  async getOne(@Param('slug') slug: string) {
    return this.mfoService.findOne(slug);
  }

  @Get()
  async getAll() {
    return this.mfoService.findAll(10, 0); // первые 10
  }
}