import {Body, Controller, Post} from '@nestjs/common';
import {PaymentService} from "../../services/payment/payment.service";

@Controller('api/makePayment')
export class MakePaymentController {

    constructor(private paymentService: PaymentService) {}

    @Post()
    pay(@Body('userID') userID: string,
        @Body('cardID') cardID: string,
        @Body('stripeID') stripeID: string,
        @Body('userEmail') userEmail: string,
        @Body('dateLastPayed') dateLastPayed: string,
        @Body('freeTrial') freeTrial: string) {
       console.log(userID,cardID,stripeID,userEmail,dateLastPayed, freeTrial)
        let connection = this.paymentService.getDbConnection();

        return new Promise((success, failure) => {
                connection.query('INSERT INTO payment.userPayments (userID, cardID, stripeID, userEmail, dateLastPayed, freeTrial) VALUES (?, ?, ?, ?, ?, ?);', [userID, cardID, stripeID, userEmail, dateLastPayed, freeTrial], (error, results, fields) => {
                    if (error) {
                        ///response.send(results);
                        success({status: 'failed', data: ""})
                    } else {
                        //response.send(error);

                        success({status: 'success ok', data: results})
                    }
                })
            }
        )
        // return new Promise((success, failure) => {
        //     success({status: 'success', data: ""})
        // })

        }
}
