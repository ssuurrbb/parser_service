import { Controller, Get, Param, Post } from '@nestjs/common';
import { MfoService } from './mfo.service';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('mfo')
@Controller('mfo')
export class MfoController {
  constructor(private readonly mfoService: MfoService) {}

  @Post('parse/:slug')
  @ApiOperation({ summary: 'Запустить парсинг страницы МФО и сохранить данные' })
  @ApiParam({ name: 'slug', description: 'Slug компании, например: zaymer, ekapusta', example: 'zaymer' })
  @ApiResponse({ status: 201, description: 'Парсинг успешно выполнен и данные сохранены' })
  @ApiResponse({ status: 500, description: 'Ошибка при парсинге или сохранении' })
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
  @ApiOperation({ summary: 'Получить сохранённые данные МФО по slug' })
  @ApiParam({ name: 'slug', example: 'zaymer' })
  @ApiResponse({ status: 200, description: 'Данные найдены' })
  @ApiResponse({ status: 404, description: 'Данные не найдены' })
  async getOne(@Param('slug') slug: string) {
    return this.mfoService.findOne(slug);
  }

  @Get()
  @ApiOperation({ summary: 'Получить список последних спарсенных МФО' })
  @ApiResponse({ status: 200, description: 'Список записей' })
  async getAll() {
    return this.mfoService.findAll(10, 0); // первые 10
  }
}