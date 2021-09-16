import { Body, Controller, Post } from '@nestjs/common';
import { PaymentService } from "../../services/payment/payment.service";

@Controller('payment')
export class PaymentController {

    constructor(private paymentService: PaymentService) {}

    @Post()
    pay(@Body('id') id: string,
        @Body('created') created: string,
        @Body('client_ip') client_ip: string,
        @Body('card.id') card_id: string,
        @Body('email') email: string) {

        let connection = this.paymentService.getDbConnection();

        return new Promise((success, failure) => {
                connection.query('INSERT INTO payment.payments (id, created, client_ip, card_id, email) VALUES (?, ?, ?, ?, ?);', [id, created, client_ip, card_id, email], (error, results, fields) => {
                    if (error) {
                        ///response.send(results);
                        failure({status: 'failed', error: error})
                    } else {
                        //response.send(error);

                        success({status: 'success ok', data: results})
                    }
                })
            }
        )

        

        }
}
