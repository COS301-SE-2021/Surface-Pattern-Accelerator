import { Test, TestingModule } from '@nestjs/testing';
import { GetFileByIdController } from './get-file-by-id.controller';

describe('GetFileByIdController', () => {
  let controller: GetFileByIdController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GetFileByIdController],
    }).compile();

    controller = module.get<GetFileByIdController>(GetFileByIdController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
