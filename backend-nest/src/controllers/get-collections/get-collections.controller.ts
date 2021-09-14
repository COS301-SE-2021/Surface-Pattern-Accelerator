import {Controller, Get, Req, Session} from '@nestjs/common';
import {GoogleApiService} from "../../services/google-api/google-api.service";

@Controller('api/getCollections')
export class GetCollectionsController {

    constructor(private googleApiService: GoogleApiService) {}

    @Get()
    getCollectionsList(@Req() request: Request, @Session() session: Record<string, any>)
    {
        return new Promise((success, failure) => {
            console.log(session.accessToken);

            this.googleApiService.getCollections(session.accessToken)
                .then((retValue) => {
                    success(retValue)
                }).catch((error) => {
                // TODO: send error response for if no collections were found
                console.log("Could not find collections");
                console.log(error);
                this.googleApiService.createFolder(session.accessToken, "SPA")
                    .then((SPAFolderResult) => {
                        const SPAFolderDetails = SPAFolderResult.data as unknown as {id: string};
                        console.log(SPAFolderDetails.id);

                        const collectionsPromise = this.googleApiService.createFolder(session.accessToken, "Collections", SPAFolderDetails.id);
                        const patternsPromise = this.googleApiService.createFolder(session.accessToken, "Patterns", SPAFolderDetails.id);
                        const motifsPromise = this.googleApiService.createFolder(session.accessToken, "Motifs", SPAFolderDetails.id);

                        Promise.all([collectionsPromise, patternsPromise, motifsPromise])
                            .then((promiseResultArray) => {
                                success([])
                            });

                    });
            });

        })


    }

}
