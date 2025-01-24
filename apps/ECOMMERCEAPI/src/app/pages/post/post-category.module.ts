import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostCategoryController } from './post-category.controller';
import { PostCategoryService } from './post-category.service';
import { PostCategorySchema } from '../../modules/post/post-category.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'PostCategory', schema: PostCategorySchema }]),
  ],
  controllers: [PostCategoryController],
  providers: [PostCategoryService],
})
export class PostCategoryModule {}
