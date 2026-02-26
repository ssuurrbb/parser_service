import { Test, TestingModule } from '@nestjs/testing';
import { MfoController } from './mfo.controller';

describe('MfoController', () => {
  let controller: MfoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MfoController],
    }).compile();

    controller = module.get<MfoController>(MfoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
