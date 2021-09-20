import { Test, TestingModule } from '@nestjs/testing';
import { MakePaymentController } from './make-payment.controller';

describe('MakePaymentController', () => {
  let controller: MakePaymentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MakePaymentController],
    }).compile();

    controller = module.get<MakePaymentController>(MakePaymentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
