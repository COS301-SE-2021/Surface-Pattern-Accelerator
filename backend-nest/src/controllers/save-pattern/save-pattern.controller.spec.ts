import { Test, TestingModule } from '@nestjs/testing';
import { SavePatternController } from './save-pattern.controller';

describe('SavePatternController', () => {
  let controller: SavePatternController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SavePatternController],
    }).compile();

    controller = module.get<SavePatternController>(SavePatternController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
