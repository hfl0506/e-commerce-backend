import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { ProductsEntity } from './products.entity';

Injectable();
export class ProductsService {
  constructor(
    @InjectModel(ProductsEntity.name)
    private productModel: Model<ProductsEntity>,
  ) {}

  public async getProducts(dto: any): Promise<any> {
    try {
      let query: FilterQuery<ProductsEntity> = {};
      const conditions: typeof query.$and = [];

      for (let [key, val] of Object.entries(dto)) {
        if (key !== undefined && val !== undefined) {
          conditions.push({ [key]: val });
        }
      }
      query.$and = conditions;
      const limit = dto?.limit ?? 30;

      const result = await this.productModel
        .aggregate()
        .match(conditions)
        .limit(limit)
        .sort({ updatedAt: -1 });
      return result;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  public async uploadProduct(dto: any): Promise<any> {
    try {
      const product = new this.productModel(dto);
      return await product.save().then((res) => res.toObject());
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  public async updateProductById(id: string, dto: any): Promise<any> {
    try {
      return await this.productModel
        .findByIdAndUpdate(new Types.ObjectId(id), dto, { new: true })
        .lean()
        .exec();
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  public async deleteProductById(id: string): Promise<any> {
    try {
      return await this.productModel.findByIdAndDelete(new Types.ObjectId(id));
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
