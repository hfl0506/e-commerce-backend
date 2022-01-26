import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'blog', versionKey: false, timestamps: true })
export class BlogEntity extends Document {
  @Prop({ require: true })
  title!: string;

  @Prop({ required: true })
  content!: string;

  @Prop({ required: true })
  createdBy!: string;
}

export const BlogSchema = SchemaFactory.createForClass(BlogEntity);
