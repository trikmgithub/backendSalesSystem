import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Brand as BrandModel } from './shemas/brand.schema';
import mongoose, { Model, mongo } from 'mongoose';
import { PaginationDto } from './dto/pagination-brand.dto';
import Fuse from 'fuse.js';

@Injectable()
export class BrandsService {
  constructor(
    @InjectModel(BrandModel.name) private brandModel: Model<BrandModel>,
  ) {}

  //---------------POST /brands

  //create new brand
  async createBrand(createBrandDto: CreateBrandDto) {
    const { name, description } = createBrandDto;

    const isExist = await this.brandModel.findOne({
      name: name.toUpperCase(),
    });

    if (isExist) {
      throw new BadRequestException('Brand is existed');
    }

    const newBrand = await this.brandModel.create({
      name: name.toUpperCase(),
      description: description.charAt(0).toUpperCase() + description.slice(1),
    });

    return newBrand;
  }

  //---------------GET /brands

  //get all brands
  async getAllBrands() {
    const brands = await this.brandModel.find();

    return brands;
  }

  //get brands with pagination
  async getBrandsPagination(paginationDto: PaginationDto) {
    const page = paginationDto.page ?? 1;
    const limit = paginationDto.limit ?? 10;
    const skip = (page - 1) * limit;
    const brands = await this.brandModel.find().skip(skip).limit(limit).exec();
    const total = await this.brandModel.countDocuments();

    return {
      meta: {
        currentPage: page,
        sizePage: limit,
        numberBrands: total,
        totalPages: Math.ceil(total / limit),
      },
      brands,
    };
  }

  //get one brand by id
  async getBrandById(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Id brand is not valid');
    }

    const brand = await this.brandModel.findById(id);

    return brand;
  }

  //get one brand by name
  async getBrandByName(name: string) {
    // 'i' means no diffrent between uppercase and lowercase
    const brand = await this.brandModel.findOne({
      name: { $regex: name, $options: 'i' },
    });

    if (!brand) {
      throw new BadRequestException('Not found brand by name');
    }

    return brand;
  }

  //get one brand by approximate name matching
  async getFuzzyBrandsByName(name: string) {
    const brands = await this.brandModel.find();
    // Cấu hình Fuse.js
    const fuse = new Fuse(brands, {
      keys: ['name'], // Tìm kiếm theo trường "name"
      threshold: 0.3, // Độ chính xác (thấp hơn = chính xác hơn, cao hơn = chấp nhận sai nhiều hơn)
      distance: 100, // Khoảng cách tối đa để tìm kết quả gần đúng
      ignoreLocation: true, // Bỏ qua vị trí của từ khóa trong chuỗi
    });
    // Thực hiện tìm kiếm
    const results = fuse.search(name);

    // Trả về danh sách thương hiệu phù hợp
    const brandsFilter = results.map((result) => result.item);

    return brandsFilter;
  }

  //---------------PATCH /brands

  //update one brand
  async updateBrand(id: string, updateBrandDto: UpdateBrandDto) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Id brand is not valid');
    }

    const { name, description } = updateBrandDto;

    const brand = await this.brandModel.updateOne(
      { _id: id },
      {
        name: name.toUpperCase(),
        description: description.charAt(0).toUpperCase() + description.slice(1),
      },
    );

    return brand;
  }

  //soft delete one brand
  async hideBrand(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Id brand is not valid');
    }

    const brand = await this.brandModel.findOne({ _id: id });

    let isHidden = brand.isDeleted;

    const brandUpdate = await this.brandModel.updateOne(
      { _id: id },
      { isDeleted: !isHidden },
    );

    return brandUpdate;
  }

  //---------------DELETE /brands

  //delete brand
  async remove(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Id brand is not valid');
    }

    const brand = await this.brandModel.deleteOne({ _id: id });

    return brand;
  }
}
