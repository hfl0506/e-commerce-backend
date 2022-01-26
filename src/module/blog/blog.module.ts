import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogController } from './blog.controller';
import { BlogEntity, BlogSchema } from './blog.entity';
import { BlogService } from './blog.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: BlogEntity.name,
        schema: BlogSchema,
      },
    ]),
  ],
  controllers: [BlogController],
  providers: [BlogService],
})
export class BlogModule {}
