import {Body, Controller, Post, Req, Session} from '@nestjs/common';
import {GoogleApiService} from "../../services/google-api/google-api.service";

@Controller('api/createNewJSONFile')
export class CreateJsonfileController {

    constructor(private googleApiService: GoogleApiService) {}

    @Post()
    createNewJSONFile(@Req() request: Request, @Session() session: Record<string, any>, @Body('patternFolderID') patternFolderID: string)
    {
        return new Promise((success, failure) => {
            this.googleApiService.createNewJSONFile(session.accessToken, "reservation", "", patternFolderID)
                .then((result) => {
                    console.log(result);
                    success(result);
                });
        })

    }

}
