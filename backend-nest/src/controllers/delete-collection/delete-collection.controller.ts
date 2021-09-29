import {Body, Controller, Post, Session} from '@nestjs/common';
import {GoogleApiService} from "../../services/google-api/google-api.service";

@Controller('api/deleteCollection')
export class DeleteCollectionController {

    constructor(private googleApiService: GoogleApiService) {}

    @Post()
    deleteCollection(@Session() session: Record<string, any>, @Body('collectionID') collectionID: string)
    {
        return this.googleApiService.deleteFile(session.accessToken, collectionID)
    }
}
