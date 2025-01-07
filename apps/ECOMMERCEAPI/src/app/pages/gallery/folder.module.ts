import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FolderController } from './folder.controller';
import { FolderService } from './folder.service';
import { FolderSchema } from '../../modules/gallery/folder.schema';
import { CounterModule } from '../../shared/modules/counter/counter.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Folder', schema: FolderSchema }]),
    CounterModule
  ],
  controllers: [FolderController],
  providers: [FolderService],
})
export class FolderModule {}
