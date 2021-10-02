import {Body, Controller, Post, Session} from '@nestjs/common';
import {HttpService} from "@nestjs/axios";

@Controller('api/convertSVG')
export class ConvertSvgController {

    constructor(private httpService: HttpService) {}

    @Post()
    convertSVGTo(@Session() session: Record<string, any>, @Body('canvasAsSVG') canvasAsSVG: string, @Body('convertTo') convertTo: string)
    {
        return new Promise((success, failure) => {
            try {
                console.log(canvasAsSVG)
                let converterURL: string;

                switch (convertTo)
                {
                    case "dwg":
                        converterURL = "https://vector.express/api/v2/public/convert/svg/svg2cad/dwg";
                        break;
                    case "dxf":
                        converterURL = "https://vector.express/api/v2/public/convert/svg/svg2cad/dxf";
                        break;
                    default:
                        converterURL = "https://vector.express/api/v2/public/convert/svg/librsvg/pdf";
                }
                this.httpService.post(converterURL, canvasAsSVG,{headers: {'Content-Type': 'image/svg+xml'}})
                    .subscribe(res => {
                        console.log(res.data)
                        success(res.data)
                    })

            }
            catch (Error)
            {
                console.log("Error converting SVG")
            }
        })



    }

}
