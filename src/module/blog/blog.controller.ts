import { Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { LeanDocument, Types } from 'mongoose';
import {
  CreateBlogDto,
  GetBlogListResponseDto,
  UpdateBlogDto,
} from './blog.dto';
import { BlogEntity } from './blog.entity';
import { BlogService } from './blog.service';

@Controller('blog')
export class BlogController {
  constructor(private blogService: BlogService) {}

  @Get()
  public async GetBlogList(): Promise<LeanDocument<BlogEntity[]>> {
    return this.blogService.getBlogList();
  }

  @Post()
  public async CreateBlogPost(
    dto: CreateBlogDto,
  ): Promise<LeanDocument<BlogEntity>> {
    return this.blogService.createBlogPost(dto);
  }

  @Patch(':id')
  public async UpdateBlogPostById(
    @Param('id') id: string,
    dto: UpdateBlogDto,
  ): Promise<LeanDocument<BlogEntity> | null> {
    return this.blogService.updateBlogPostById(new Types.ObjectId(id), dto);
  }

  @Delete(':id')
  public async DeleteBlogPostById(
    @Param('id') id: string,
  ): Promise<LeanDocument<BlogEntity> | null> {
    return this.blogService.deleteBlogPostById(new Types.ObjectId(id));
  }
}
