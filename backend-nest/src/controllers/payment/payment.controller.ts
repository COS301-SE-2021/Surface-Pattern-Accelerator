import { Body, Controller, Get, Post,Query } from '@nestjs/common';
import { PaymentService } from "../../services/payment/payment.service";

@Controller('api/payment')
export class PaymentController {

    constructor(private paymentService: PaymentService) {}

    @Post('pay')
    pay(@Body('id') id: string,
        @Body('created') created: string,
        @Body('client_ip') client_ip: string,
        @Body('card_id') card_id: string,
        @Body('email') email: string) {
       console.log(id,created,client_ip,card_id,email)
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

        }//////


    @Get('getPaymentDetails')
    getPaymentDetails(@Query('email') email: string){
        let connection = this.paymentService.getDbConnection();
        console.log("here -> ", email)
        return new Promise((success, failure)=>{
            connection.query('SELECT * FROM payment.payments where email = ? ;', [email], function(error, details, fields)
            {
                if (details.length > 0){
                    success({ status:"success ok", paymentDetails: details })
                }
                else{
                    failure({ status:"failed", error: error })
                }
            })
        })
    }

}
