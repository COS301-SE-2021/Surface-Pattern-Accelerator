import {Body, Controller, Post, Session} from '@nestjs/common';
import {GoogleApiService} from "../../services/google-api/google-api.service";

@Controller('delete-collection')
export class DeleteCollectionController {

    constructor(private googleApiService: GoogleApiService) {}

    @Post()
    deleteCollection(@Session() session: Record<string, any>, @Body('collectionID') collectionID: string)
    {

    }
}
