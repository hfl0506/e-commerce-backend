import { BadRequestException, Injectable, Type } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { LeanDocument, Model, Types } from 'mongoose';
import { GetBlogListResponseDto } from './blog.dto';
import { BlogEntity } from './blog.entity';

@Injectable()
export class BlogService {
  constructor(
    @InjectModel(BlogEntity.name) private blogModel: Model<BlogEntity>,
  ) {}

  public async getBlogList(): Promise<LeanDocument<BlogEntity[]>> {
    try {
      return await this.blogModel.find().lean().exec();
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  public async createBlogPost(dto: any): Promise<LeanDocument<BlogEntity>> {
    try {
      const result = new this.blogModel(dto);
      await result.save();
      return result;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  public async updateBlogPostById(
    id: Types.ObjectId,
    dto: any,
  ): Promise<LeanDocument<BlogEntity>> {
    try {
      const blog = await this.blogModel.findById(id);
      let payload = {
        title: dto.title ?? blog.title,
        content: dto.content ?? blog.content,
        createdBy: blog.content,
      } as any;

      return await this.blogModel
        .findByIdAndUpdate(id, payload, { new: true })
        .lean()
        .exec();
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  public async deleteBlogPostById(
    id: Types.ObjectId,
  ): Promise<LeanDocument<BlogEntity>> {
    try {
      return await this.blogModel.findByIdAndDelete(id).lean().exec();
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
