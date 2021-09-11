import { Test, TestingModule } from '@nestjs/testing';
import { GetCollectionsController } from './get-collections.controller';

describe('GetCollectionsController', () => {
  let controller: GetCollectionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GetCollectionsController],
    }).compile();

    controller = module.get<GetCollectionsController>(GetCollectionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
