import {Body, Controller, Post, Session} from '@nestjs/common';
import {HttpService} from "@nestjs/axios";

@Controller('api/convertSVG')
export class ConvertSvgController {

    constructor(private httpService: HttpService) {}

    @Post()
    convertSVGTo(@Session() session: Record<string, any>, @Body('canvasAsSVG') canvasAsSVG: string)
    {
        console.log(canvasAsSVG)
        // this.httpService.get("https://vector.express/api/v2/public/convert/svg/auto/pdf/").subscribe( res => {
        //     console.log(res.data)
        // })
        this.httpService.post("https://vector.express/api/v2/public/convert/svg/librsvg/pdf",
            canvasAsSVG,
            {
                headers: {
                    'Content-Type': 'image/svg+xml'
                }
            }

        ).subscribe( res => {
            console.log(res.data)
        })

    }

}
