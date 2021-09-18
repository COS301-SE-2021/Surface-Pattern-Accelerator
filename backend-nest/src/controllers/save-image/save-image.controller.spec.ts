import { Test, TestingModule } from '@nestjs/testing';
import { SaveImageController } from './save-image.controller';

describe('SaveImageController', () => {
  let controller: SaveImageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SaveImageController],
    }).compile();

    controller = module.get<SaveImageController>(SaveImageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
