import { Test, TestingModule } from '@nestjs/testing';
import { GetPaymentDetailsController } from './getPaymentDetails.controller';

describe('PaymentController', () => {
  let controller: GetPaymentDetailsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GetPaymentDetailsController],
    }).compile();

    controller = module.get<GetPaymentDetailsController>(GetPaymentDetailsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
