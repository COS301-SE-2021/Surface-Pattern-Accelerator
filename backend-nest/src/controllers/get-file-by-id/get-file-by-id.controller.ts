import {Body, Controller, Post, Req, Session} from '@nestjs/common';
import {GoogleApiService} from "../../services/google-api/google-api.service";

@Controller('api/getFileByID')
export class GetFileByIdController {

    constructor(private googleApiService: GoogleApiService) {}

    //TODO catch
    @Post()
    getFileContentByID(@Req() request: Request, @Session() session: Record<string, any>, @Body('fileID') fileID: string)
    {
        return new Promise((success, failure) => {
            this.googleApiService.getFileByID(session.accessToken, fileID)
                .then((fileContents) => {
                    success(fileContents);
            })

        })

    }
}
