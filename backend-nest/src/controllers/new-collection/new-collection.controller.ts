import {Body, Controller, Post, Req, Session} from '@nestjs/common';
import {GoogleApiService} from "../../services/google-api/google-api.service";
import {IFolderInterface} from "../../../BackendInterfaces/folder.interface";
import {ICollectionsContent} from "../../../BackendInterfaces/collectionContents.interface";

@Controller('api/newCollection')
export class NewCollectionController {

    constructor(private googleApiService: GoogleApiService) {}


    @Post()
    createNewCollection(@Req() request: Request, @Session() session: Record<string, any>, @Body('collectionName') collectionName: string)
    {
        return new Promise((success, failure) => {

            this.googleApiService.getFolderID(session.accessToken, "SPA").then((resultSPAid) => {

                const motifsPromise = this.googleApiService.getFolderID(session.accessToken, "Motifs");
                const patternsPromise = this.googleApiService.getFolderID(session.accessToken, "Patterns");
                const collectionsPromise = this.googleApiService.getFolderID(session.accessToken, "Collections");

                Promise.all([motifsPromise, patternsPromise, collectionsPromise])
                    .then((folderIDResults) => {
                        console.log(folderIDResults);

                        const motifFolderDetails: IFolderInterface = folderIDResults[0] as IFolderInterface;
                        const patternFolderDetails: IFolderInterface = folderIDResults[1] as IFolderInterface;
                        const collectionsFolderDetails: IFolderInterface = folderIDResults[2] as IFolderInterface;

                        const SPAfolderDetails: IFolderInterface = resultSPAid as IFolderInterface; // TODO: replace getFolderID with session implementation

                        console.log("The collection name is: " + collectionName);
                        this.googleApiService.createNewJSONFile(session.accessToken, collectionName, "", collectionsFolderDetails.fileID)
                            .then((result) => {
                                const emptyCollectionID: any = result;
                                console.log(emptyCollectionID.id);

                                const fileBody: ICollectionsContent = {
                                    collectionName: collectionName,
                                    collectionID: emptyCollectionID.id,
                                    motifsFolderID: motifFolderDetails.fileID,
                                    patternsFolderID: patternFolderDetails.fileID,
                                    collectionThumbnail: "",
                                    childPatterns: [] = [],
                                    childMotifs: [],
                                    story: "a story here",
                                    colorThemes: [] = []
                                } as unknown as ICollectionsContent;

                                this.googleApiService.updateJSONFile(session.accessToken, emptyCollectionID.id, JSON.stringify(fileBody))
                                    .then((updateResult) => {
                                        console.log(updateResult);
                                        success(fileBody);
                                    }).catch((updateError) => {
                                    console.log(updateError);
                                });

                            });
                    })
                    .catch((error) => {
                        console.log(error + "Could not fetch Motifs and/or Pattern Folder IDs");
                    });

            }).catch((error) => {
                console.log(error);
            });
        })
    }
}
