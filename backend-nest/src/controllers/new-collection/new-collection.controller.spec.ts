import { Test, TestingModule } from '@nestjs/testing';
import { NewCollectionController } from './new-collection.controller';

describe('NewCollectionController', () => {
  let controller: NewCollectionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NewCollectionController],
    }).compile();

    controller = module.get<NewCollectionController>(NewCollectionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
