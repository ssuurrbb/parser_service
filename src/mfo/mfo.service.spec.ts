import { Test, TestingModule } from '@nestjs/testing';
import { MfoService } from './mfo.service';

describe('MfoService', () => {
  let service: MfoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MfoService],
    }).compile();

    service = module.get<MfoService>(MfoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
