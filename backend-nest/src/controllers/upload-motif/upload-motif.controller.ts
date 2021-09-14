import {Controller, Post, Req, Session, UploadedFiles, UseInterceptors} from '@nestjs/common';
import {GoogleApiService} from "../../services/google-api/google-api.service";
import * as fs from "fs";
import {IFolderInterface} from "../../../BackendInterfaces/folder.interface";
import {FileInterceptor, FilesInterceptor} from "@nestjs/platform-express";
import {diskStorage} from "multer";
import {editFileName} from "../../Middleware/editFileName.middleware";
import {imageFileFilter} from "../../Middleware/imageFileFilter.middlware";

@Controller('api/uploadMotif')
export class UploadMotifController {

    constructor(private googleApiService: GoogleApiService) {}

    @Post()
    @UseInterceptors(
        FilesInterceptor('files', 20, {
            storage: diskStorage({
                destination: './files',
                filename: editFileName,
            }),
            fileFilter: imageFileFilter,
        }),
    )
    uploadMotif(@Req() request: Request, @Session() session: Record<string, any>, @UploadedFiles() files)
    {
        console.log(files)
        //const files: any = req.files;
        return new Promise((success, failure) => {
            this.googleApiService.getFolderID(session.accessToken, "Motifs")
                .then((resultMotifsID) => {
                    const motifFolderDetails: IFolderInterface = resultMotifsID as IFolderInterface;
                    const uploadPromisesArray: any[] = [];
                    for (const file in files) {
                        if (files.hasOwnProperty(file)) { // complains if its just "file"

                            const filePath = "./files/" + files[file].filename;
                            console.log(filePath);
                            if (fs.existsSync(filePath)) {
                                const uploadPromise = this.googleApiService.uploadImage(session.accessToken, files[file].filename, motifFolderDetails.fileID);
                                uploadPromisesArray.push(uploadPromise);
                            } else {
                                console.log("Does not exist");
                            }
                        }

                    }

                    Promise.all(uploadPromisesArray).then(() => {
                        success({Status: "200 - success"});
                }).catch(() => {
               failure({Status: "404 - no file found in request"});
            });
        });
        })


    }
}
