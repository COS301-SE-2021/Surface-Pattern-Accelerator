import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {NestExpressApplication} from "@nestjs/platform-express";
import { join } from 'path';

import {ITokenInterface} from "../BackendInterfaces/token.interface";

import * as session from 'express-session';
declare module "express-session" {
    export interface SessionData {
        accessToken: ITokenInterface;
    }
}

declare const module: any;

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    app.enableCors({origin:
            ["ec2-3-128-186-246.us-east-2.compute.amazonaws.com:3000"],
        credentials: true})

    app.use(
        session({
            secret: 'my-secret',
            resave: false,
            saveUninitialized: false,
        }),
    );

    app.useStaticAssets((join(__dirname, '../../MODEL')))

    await app.listen(3000);

    if (module.hot) {
        module.hot.accept();
        module.hot.dispose(() => app.close());
    }
}
bootstrap();
