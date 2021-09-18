import {Controller, Get, Req, Res} from '@nestjs/common';
import { join } from 'path';
import {Request, Response} from "express";

@Controller('threeDViewer')
export class ThreeDViewerController {

    @Get()
    displayThreeD(@Res() response: Response, @Req() request: Request)
    {
        console.log(join(process.cwd(), '../backend-nest/MODEL/index.html'))
        response.sendFile(join(process.cwd(), '../backend-nest/MODEL/index.html'))
    }
}
