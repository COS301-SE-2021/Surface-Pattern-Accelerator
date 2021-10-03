import { Body, Controller, Get, Post,Query } from '@nestjs/common';
import { PaymentService } from "../../services/payment/payment.service";

@Controller('api/getPaymentDetails')
export class GetPaymentDetailsController {

    constructor(private paymentService: PaymentService) {}

    // @Post()
    // pay(@Body('id') id: string,
    //     @Body('created') created: string,
    //     @Body('client_ip') client_ip: string,
    //     @Body('card_id') card_id: string,
    //     @Body('email') email: string) {
    //    console.log(id,created,client_ip,card_id,email)
    //     let connection = this.paymentService.getDbConnection();
    //
    //     return new Promise((success, failure) => {
    //             connection.query('INSERT INTO payment.payments (id, created, client_ip, card_id, email) VALUES (?, ?, ?, ?, ?);', [id, created, client_ip, card_id, email], (error, results, fields) => {
    //                 if (error) {
    //                     ///response.send(results);
    //                     failure({status: 'failed', error: error})
    //                 } else {
    //                     //response.send(error);
    //
    //                     success({status: 'success ok', data: results})
    //                 }
    //             })
    //         }
    //     )
    //
    //     }//////


    @Post()
    getPaymentDetails(@Body('userID') userID: string){
        let connection = this.paymentService.getDbConnection();
        console.log("userID is: ", userID)
        return new Promise((success, failure)=>{
            connection.query('SELECT * FROM payment.userPayments where userID = ? ;', [userID], function(error, details, fields)
            {
                if (details.length > 0){
                    sessionStorage.setItem('paid', 'true');
                    success({ status:true, paymentDetails: details })
                }
                else{
                    success({ status:false, paymentDetails: "" })
                    sessionStorage.setItem('paid', 'false');
                }
            })
        })
    }

}
