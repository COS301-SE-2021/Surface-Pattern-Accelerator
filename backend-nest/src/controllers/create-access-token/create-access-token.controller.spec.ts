import { Test, TestingModule } from '@nestjs/testing';
import { CreateAccessTokenController } from './create-access-token.controller';

describe('CreateAccessTokenController', () => {
  let controller: CreateAccessTokenController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CreateAccessTokenController],
    }).compile();

    controller = module.get<CreateAccessTokenController>(CreateAccessTokenController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
