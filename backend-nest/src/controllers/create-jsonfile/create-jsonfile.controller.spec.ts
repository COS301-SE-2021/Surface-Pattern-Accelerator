import { Test, TestingModule } from '@nestjs/testing';
import { CreateJsonfileController } from './create-jsonfile.controller';

describe('CreateJsonfileController', () => {
  let controller: CreateJsonfileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CreateJsonfileController],
    }).compile();

    controller = module.get<CreateJsonfileController>(CreateJsonfileController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
