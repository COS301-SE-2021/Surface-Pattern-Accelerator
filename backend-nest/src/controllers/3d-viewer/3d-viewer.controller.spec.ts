import { Test, TestingModule } from '@nestjs/testing';
import { 3DviewerController } from './3-dviewer.controller';

describe('3DviewerController', () => {
  let controller: 3DviewerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [3DviewerController],
    }).compile();

    controller = module.get<3DviewerController>(3DviewerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
