import {Controller, Get, Session} from '@nestjs/common';
import {GoogleApiService} from "../../services/google-api/google-api.service";

@Controller('api/getMotifs')
export class GetMotifsController {

    constructor(private googleApiService: GoogleApiService) {}

    @Get()
    getAllMotifs(@Session() session: Record<string, any>)
    {
        return new Promise((success, failure) => {
            this.googleApiService.listMotifs(session.accessToken)
                .then((motifsJson) => {
                    console.log(motifsJson);
                    this.googleApiService.getPublicMotifsInfo(session.accessToken, motifsJson)
                        .then((permissionsRes) => {
                            this.googleApiService.generatePublicLinksJSON(session.accessToken, permissionsRes)
                                .then((motifsJSON) => {
                                    console.log(motifsJSON);
                                    success(motifsJSON);
                                });
                            // console.log(permissionsRes);
                        });

                })
                .catch(() => {
                    success({motifDetails: [] = []}); // TODO: use motif Array interface motifArray.interface.ts
                });
        })

    }

}
