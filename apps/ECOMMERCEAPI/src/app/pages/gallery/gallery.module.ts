import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GalleryController } from './gallery.controller';
import { GalleryService } from './gallery.service';
import { GallerySchema } from '../../modules/gallery/gallery.schema';
import { CounterModule } from '../../shared/modules/counter/counter.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Gallery', schema: GallerySchema }]),
    CounterModule
  ],
  controllers: [GalleryController],
  providers: [GalleryService],
})
export class GalleryModule {}
