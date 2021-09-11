import {Body, Controller, Post, Req, Session} from '@nestjs/common';
import {GoogleApiService} from "../../services/google-api/google-api.service";
import {ITokenInterface} from "../../../BackendInterfaces/token.interface";


@Controller('api/createAccessToken')
export class CreateAccessTokenController {

    constructor(private googleApiService: GoogleApiService) {}

    //creates and stores access token in the user session
    @Post()
    createAccessToken(@Body() clientResponse: any, @Session() session: Record<string, any>)
    {
        session.accessToken = {
            access_token: clientResponse.userLoginResponse.Zb.access_token,
            scope: "https://www.googleapis.com/auth/drive",
            token_type: clientResponse.userLoginResponse.Zb.token_type,
            expiry_date: clientResponse.userLoginResponse.Zb.expires_at
        } as ITokenInterface
        return; //sends 201 - OK automatically
    }

}
