import {Body, Controller, Post, Req, Session, UploadedFiles, UseInterceptors} from '@nestjs/common';
import {GoogleApiService} from "../../services/google-api/google-api.service";
import {FilesInterceptor} from "@nestjs/platform-express";
import {diskStorage} from "multer";
import {editFileName} from "../../Middleware/editFileName.middleware";
import {imageFileFilter} from "../../Middleware/imageFileFilter.middlware";
import {IFolderInterface} from "../../../BackendInterfaces/folder.interface";
import * as fs from "fs";
import {ICollectionsContent} from "../../../BackendInterfaces/collectionContents.interface";

@Controller('api/savePattern')
export class SavePatternController {

    constructor(private googleApiService: GoogleApiService) {}

    @Post()
    @UseInterceptors(
        FilesInterceptor('files', 1, {
            storage: diskStorage({
                destination: './files',
                filename: editFileName,
            }),
            fileFilter: imageFileFilter,
        }),
    )
    savePattern(@Session() session: Record<string, any>,
                @UploadedFiles() files,
                @Body('patternID') patternID: string,
                @Body('patternContent') patternContent: any,
                @Body('collectionID') collectionID: string)
    {
        return new Promise((success, failure) => {
            this.googleApiService.getFolderID(session.accessToken, "SPA-Thumbnails")
                .then((resultThumbnailsFolderID) => {
                    const thumbnailFolderDetails: IFolderInterface = resultThumbnailsFolderID as IFolderInterface;

                    if (files[0]) { // complains if its just "file"
                        const filePath = "./files/" + files[0].filename;
                        console.log(filePath);
                        if (fs.existsSync(filePath)) {
                            this.googleApiService.uploadImage(session.accessToken, files[0].filename, thumbnailFolderDetails.fileID,"image/png")
                                .then((onUploaded: any) => {
                                    console.log("Uploaded motif ID: " + onUploaded.data.id)
                                    //console.log(patternContent)
                                    this.googleApiService.updateJSONFile(session.accessToken, patternID, patternContent).then((result) =>
                                    {
                                        success({Message: "Pattern Saved"})
                                    });

                                    //write to collection to set thumbnail - done after pattern is saved
                                    let collectionContentPromise = this.googleApiService.getFileByID(session.accessToken, collectionID)

                                    this.googleApiService.applyPermission(session.accessToken, onUploaded.data.id)
                                        .then(() => {
                                            this.googleApiService.getPublicLink(session.accessToken, onUploaded.data.id)
                                                .then(getLinkResult => {
                                                    collectionContentPromise
                                                        .then((collectionContent: any) => {
                                                            collectionContent.collectionThumbnail = getLinkResult.data.webContentLink;
                                                            console.log(collectionContent)


                                                            this.googleApiService.updateJSONFile(session.accessToken, collectionID, JSON.stringify(collectionContent))
                                                                .then(res => {
                                                                    console.log("Thumbnail URL added and written back")
                                                                })
                                                        })
                                                })
                                        })


                                })
                        } else {
                            console.log("Does not exist");
                        }
                    }


                });
        })
    }
}
