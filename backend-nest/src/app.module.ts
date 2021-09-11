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
import {MulterModule} from "@nestjs/platform-express";

@Module({
  imports: [MulterModule.register({
  dest: './files',
})],
  controllers: [AppController, CreateAccessTokenController, GetCollectionsController, GetFileByIdController, NewCollectionController, CreateJsonfileController, UpdateFileController, UploadMotifController],
  providers: [AppService, GoogleApiService],
})
export class AppModule {}
