import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Res,
} from '@nestjs/common';
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Public, ResponseMessage } from 'src/decorator/customize';
import { PaginationDto } from './dto/pagination-brand.dto';

@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  //------------POST /brands

  //create new brand
  @ResponseMessage('Create new brand successfully')
  @Post('/create')
  async createBrand(@Body() createBrandDto: CreateBrandDto) {
    const brand = await this.brandsService.createBrand(createBrandDto);

    return brand;
  }

  //------------GET /brands

  //get all brands
  @Public()
  @Get('/all')
  @ResponseMessage('Get all brands successfully')
  async getAllBrands() {
    const brands = await this.brandsService.getAllBrands();

    return brands;
  }

  //get brands with pagination
  @Public()
  @Get('/paginate')
  @ResponseMessage('Get brands with pagination successfully')
  async getBrandsPagination(@Query() paginationDto: PaginationDto) {
    const brands = await this.brandsService.getBrandsPagination(paginationDto);

    return brands;
  }

  //get one brand by name
  @Get('/name/:name')
  @ResponseMessage('Get one brand successfully')
  async getBrandByName(@Param('name') name: string) {
    const brand = await this.brandsService.getBrandByName(name);

    return brand;
  }

  //get one brand by approximate name matching
  @Get('/fuzzy/:name')
  @ResponseMessage('Get approximate brand matching')
  async getFuzzyBrandsByName(@Param('name') name: string) {
    const brands = await this.brandsService.getFuzzyBrandsByName(name);

    return brands;
  }

  //get one brand by id
  @Get(':id')
  @ResponseMessage('Get one brand successfully')
  async getBrandById(@Param('id') id: string) {
    const brand = await this.brandsService.getBrandById(id);

    return brand;
  }

  //------------Patch /brands

  //update one brand
  @Patch(':id')
  @ResponseMessage('Update a brand successfully')
  async updateBrand(
    @Param('id') id: string,
    @Body() updateBrandDto: UpdateBrandDto,
  ) {
    const brand = await this.brandsService.updateBrand(id, updateBrandDto);

    return brand;
  }

  //soft delete one brand
  @Patch('/hide/:id')
  @ResponseMessage('Soft delete a brand successfully')
  async hideBrand(@Param('id') id: string) {
    const brand = await this.brandsService.hideBrand(id);

    return brand;
  }

  //------------Delete /brands

  //delete brand
  @Delete(':id')
  @ResponseMessage('Delete a brand successfully')
  async remove(@Param('id') id: string) {
    const brand = await this.brandsService.remove(id);

    return brand;
  }
}
