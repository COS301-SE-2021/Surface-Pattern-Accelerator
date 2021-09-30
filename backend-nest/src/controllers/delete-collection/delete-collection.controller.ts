import {Body, Controller, Post, Session} from '@nestjs/common';
import {GoogleApiService} from "../../services/google-api/google-api.service";
import {ICollectionsContent} from "../../../BackendInterfaces/collectionContents.interface";
import {GaxiosPromise} from "gaxios";

@Controller('api/deleteCollection')
export class DeleteCollectionController {

    constructor(private googleApiService: GoogleApiService) {}

    @Post()
    deleteCollection(@Session() session: Record<string, any>, @Body('collectionContent') collectionContent: ICollectionsContent)
    {
        return new Promise((success, failure) => {
            if (collectionContent.childPatterns != undefined && collectionContent.childPatterns.length > 0)
            {
                let deletePromiseArray: GaxiosPromise<void>[] = [];
                for( let i = 0; i < collectionContent.childPatterns.length; i++)
                {
                    let deletePromise = this.googleApiService.deleteFile(session.accessToken, collectionContent.childPatterns[i].patternID)
                    deletePromiseArray.push(deletePromise)
                }
                Promise.all(deletePromiseArray)
                    .then(() =>
                    {   console.log("All patterns successfully deleted")
                        success(this.googleApiService.deleteFile(session.accessToken, collectionContent.collectionID))
                    })
            }
            else
            {
                console.log("delete main file")
                success(this.googleApiService.deleteFile(session.accessToken, collectionContent.collectionID))
            }
        })




    }
}
