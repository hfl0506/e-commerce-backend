import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Public } from 'src/decorator/is-public.decorator';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Public()
  @Get()
  public async GetProducts(@Query() query: any): Promise<any> {
    return this.productsService.getProducts(query);
  }

  @Post('')
  public async UploadProduct(@Body() dto: any): Promise<any> {
    return this.productsService.uploadProduct(dto);
  }

  @Patch(':id')
  public async UpdateProductById(
    @Param('id') id: string,
    @Body() dto: any,
  ): Promise<any> {
    return this.productsService.updateProductById(id, dto);
  }

  @Delete(':id')
  public async DeleteProductById(@Param('id') id: string): Promise<any> {
    return this.productsService.deleteProductById(id);
  }
}
