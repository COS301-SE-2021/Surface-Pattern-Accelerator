import { Test, TestingModule } from '@nestjs/testing';
import { DeleteCollectionController } from './delete-collection.controller';

describe('DeleteCollectionController', () => {
  let controller: DeleteCollectionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeleteCollectionController],
    }).compile();

    controller = module.get<DeleteCollectionController>(DeleteCollectionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
