import { Test, TestingModule } from '@nestjs/testing';
import { ConvertSvgController } from './convert-svg.controller';

describe('ConvertSvgController', () => {
  let controller: ConvertSvgController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConvertSvgController],
    }).compile();

    controller = module.get<ConvertSvgController>(ConvertSvgController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
