import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CreateAccessTokenController } from './controllers/create-access-token/create-access-token.controller';
import { GoogleApiService } from './services/google-api/google-api.service';
import { GetCollectionsController } from './controllers/get-collections/get-collections.controller';
import { GetFileByIdController } from './controllers/get-file-by-id/get-file-by-id.controller';
import { NewCollectionController } from './controllers/new-collection/new-collection.controller';
import { CreateJsonfileController } from './controllers/create-jsonfile/create-jsonfile.controller';
import { UpdateFileController } from './controllers/update-file/update-file.controller';
import { UploadMotifController } from './controllers/upload-motif/upload-motif.controller';
import { MulterModule} from "@nestjs/platform-express";
import { GetMotifsController } from './controllers/get-motifs/get-motifs.controller';
import { SavePatternController } from './controllers/save-pattern/save-pattern.controller';
import { ThreeDViewerController } from './controllers/3d-viewer/3d-viewer.controller';

import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { SaveImageController } from './controllers/save-image/save-image.controller';
import { GetPaymentDetailsController } from './controllers/getPaymentDetails/getPaymentDetails.controller';
import { PaymentService } from './services/payment/payment.service';

@Module({
  imports: [MulterModule.register({
  dest: './files',
}),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'MODEL'),
    })],
  controllers: [AppController,
    CreateAccessTokenController,
    GetCollectionsController,
    GetFileByIdController,
    NewCollectionController,
    CreateJsonfileController,
    UpdateFileController,
    UploadMotifController,
    GetMotifsController,
    SavePatternController,
    ThreeDViewerController,
    SaveImageController,
    GetPaymentDetailsController],
  providers: [AppService, GoogleApiService, PaymentService],
})
export class AppModule {}