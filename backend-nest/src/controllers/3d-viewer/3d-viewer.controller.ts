import {Controller, Get, Param, Post, Req, Res, Session, UploadedFiles, UseInterceptors} from '@nestjs/common';
import { join } from 'path';
import {Request, response, Response} from "express";
import {FilesInterceptor} from "@nestjs/platform-express";
import {diskStorage} from "multer";
import {editFileName} from "../../Middleware/editFileName.middleware";
import {imageFileFilter} from "../../Middleware/imageFileFilter.middlware";
import * as fs from "fs";

@Controller('threeDViewer')
export class ThreeDViewerController {

    @Get(":id")
    uploadImage(@Param('id') id, @Res() response: Response, @Req() request: Request)
    {
        let imageAsBase64 = fs.readFileSync(join(process.cwd(), '../backend-nest/3dFrames/' + id), 'base64');
        console.log(imageAsBase64)
        response.send('data:image/png;base64,' + imageAsBase64)
    }

    @Get()
    displayThreeD(@Res() response: Response, @Req() request: Request)
    {
        console.log(join(process.cwd(), '../backend-nest/MODEL/index.html'))
        response.sendFile(join(process.cwd(), '../backend-nest/MODEL/index.html'))


    }

    @UseInterceptors(
        FilesInterceptor('files', 20, {
            storage: diskStorage({
                destination: './3dFrames',
                filename: editFileName,
            }),
            fileFilter: imageFileFilter,
        }),
    )
    @Post()
    saveImage(@Req() request: Request, @Res() response: Response, @Session() session: Record<string, any>, @UploadedFiles() files)
    {
        console.log("the id")
        console.log("save fired")
        console.log(files)
        response.send({fileName: files[0].filename})
    }
}
