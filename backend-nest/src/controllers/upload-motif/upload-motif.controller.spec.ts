import { Test, TestingModule } from '@nestjs/testing';
import { UploadMotifController } from './upload-motif.controller';

describe('UploadMotifController', () => {
  let controller: UploadMotifController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UploadMotifController],
    }).compile();

    controller = module.get<UploadMotifController>(UploadMotifController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
