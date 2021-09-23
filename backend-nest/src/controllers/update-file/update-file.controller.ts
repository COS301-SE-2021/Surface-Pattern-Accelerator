import {Body, Controller, Post, Req, Session} from '@nestjs/common';
import {GoogleApiService} from "../../services/google-api/google-api.service";

@Controller('api/updateFile')
export class UpdateFileController {

    constructor(private googleApiService: GoogleApiService) {}

    @Post()
    updateFile(@Session() session: Record<string, any>,
               @Body('fileID') fileID: string,
               @Body('content') content: any,
               @Body('newName') newName: string)
    {
        return new Promise((success, failure) => {

            if (newName) {
                this.googleApiService.updateJSONFile(session.accessToken, fileID, content, newName).then((result) =>
                {
                    success({Message: "Rename and Write to File Successful"})
                });
            } else {
                this.googleApiService.updateJSONFile(session.accessToken, fileID, content).then((result) =>
                {
                    success({Message: "Write to File Successful"})
                });
            }
        })
    }
}
