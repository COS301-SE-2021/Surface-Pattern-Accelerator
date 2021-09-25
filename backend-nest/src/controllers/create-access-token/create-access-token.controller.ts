import {Body, Controller, Post, Req, Session} from '@nestjs/common';
import {GoogleApiService} from "../../services/google-api/google-api.service";
import {ITokenInterface} from "../../../BackendInterfaces/token.interface";


@Controller('api/createAccessToken')
export class CreateAccessTokenController {

    constructor(private googleApiService: GoogleApiService) {}

    //creates and stores access token in the user session
    @Post()
    createAccessToken(@Body() access_token: any,
                      @Body() expiry_date: any,
                      @Session() session: Record<string, any>)
    {
        console.log(access_token.access_token)
        //console.log(expiry_date)
        session.accessToken = {
            access_token: access_token.access_token,
            scope: "https://www.googleapis.com/auth/drive",
            token_type: 'Bearer',
            expiry_date: access_token.expiry_date
        } as ITokenInterface
        return; //sends 201 - OK automatically
    }

}
