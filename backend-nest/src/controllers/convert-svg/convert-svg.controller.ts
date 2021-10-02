import {Body, Controller, Post, Session} from '@nestjs/common';

@Controller('api/convertSVG')
export class ConvertSvgController {

    @Post()
    convertSVGTo(@Session() session: Record<string, any>, @Body('canvasAsSVG') canvasAsSVG: string)
    {
        console.log(canvasAsSVG)

    }

}
