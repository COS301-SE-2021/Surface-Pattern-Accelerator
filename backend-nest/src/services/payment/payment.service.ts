import { Injectable } from '@nestjs/common';
import * as mysql from 'mysql'

@Injectable()
export class PaymentService {

    getDbConnection(){
        return mysql.createConnection({

        });
    }
}
