import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {
  ProductCategoryEnum,
  ProductSizeEnum,
  ProductSubCategoryEnum,
} from './products.enum';

@Schema({ collection: 'products', versionKey: false, timestamps: true })
export class ProductsEntity extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  category: ProductCategoryEnum[];

  @Prop({ required: true })
  subCategory: ProductSubCategoryEnum[];

  @Prop()
  imgUrl: string;

  @Prop()
  price: number;

  @Prop()
  description: string;

  @Prop()
  size: ProductSizeEnum[];

  @Prop()
  color: string[];
}

export const ProductsSchema = SchemaFactory.createForClass(ProductsEntity);
