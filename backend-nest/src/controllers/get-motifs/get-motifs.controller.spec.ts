import { Test, TestingModule } from '@nestjs/testing';
import { GetMotifsController } from './get-motifs.controller';

describe('GetMotifsController', () => {
  let controller: GetMotifsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GetMotifsController],
    }).compile();

    controller = module.get<GetMotifsController>(GetMotifsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
