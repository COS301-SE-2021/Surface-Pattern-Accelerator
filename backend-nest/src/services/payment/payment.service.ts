import { Injectable } from '@nestjs/common';
import * as mysql from 'mysql'

@Injectable()
export class PaymentService {

    getDbConnection(){
        return mysql.createConnection({
            host     : 'aws-cos221.c5zbzrr9w4bb.us-east-2.rds.amazonaws.com',
            user     : 'admin',
            password : 'cos221_prac3_pw',
            database : 'elections'
        });
    }
}
