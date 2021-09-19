import { Test, TestingModule } from '@nestjs/testing';
import { UpdateFileController } from './update-file.controller';

describe('UpdateFileController', () => {
  let controller: UpdateFileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UpdateFileController],
    }).compile();

    controller = module.get<UpdateFileController>(UpdateFileController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
