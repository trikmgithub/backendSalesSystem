import { InjectModel } from '@nestjs/mongoose';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import mongoose, { Model } from 'mongoose';
import { Item as ItemModel } from './schemas/item.schema';
import { Brand as BrandModel } from 'src/brands/shemas/brand.schema';
import { PaginationItemDto } from './dto/pagination-item.dto';
import Fuse from 'fuse.js';
import { IUser } from 'src/users/interface/users.interface';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ItemsService {
  constructor(
    @InjectModel(ItemModel.name) private itemModel: Model<ItemModel>,
    @InjectModel(BrandModel.name) private brandModel: Model<BrandModel>,
    private readonly usersService: UsersService,
  ) {}

  //--------------------POST /items

  //create new item
  async createItem(createItemDto: CreateItemDto, imageUrls: string[]) {
    const { name, price, description, brand, quantity, flashSale } =
      createItemDto;

    const brandExist = await this.brandModel.findOne({ _id: brand });

    if (!brandExist) {
      throw new BadRequestException('Brand is not exist');
    }

    const flashSalePercentage = flashSale !== undefined ? flashSale : 0;

    const item = await this.itemModel.create({
      name,
      price,
      description,
      brand,
      quantity,
      imageUrls,
      flashSale: flashSalePercentage,
    });

    return item;
  }

  //--------------------GET /items

  //get items by skin user
  async getItemsBySkinUser(user: IUser) {
    const userInfo = await this.usersService.getOneUser(user._id);
    const skinType = userInfo.skin.replace(/_/g, ' ');
    const items = await this.getFuzzyItems(skinType);
    return items;
  }

  //get item by id
  async getItemById(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid item ID');
    }

    const item = await this.itemModel
      .findById({ _id: id })
      .populate({
        path: 'brand',
        select: 'name description',
      })
      .exec();

    return this.addDiscountedPriceToItem(item);
  }

  //get all items with pagination
  async getItemsPagination(paginationItem: PaginationItemDto) {
    const page = paginationItem?.page ?? 1;
    const limit = paginationItem?.limit ?? 10;

    const skip = (page - 1) * limit;

    const items = await this.itemModel
      .find()
      .populate({
        path: 'brand',
        select: 'name description',
      })
      .skip(skip)
      .limit(limit)
      .exec();

    const total = await this.itemModel.countDocuments();

    return {
      meta: {
        currentPage: page,
        sizePage: limit,
        numberItems: total,
        totalPages: Math.ceil(total / limit),
      },
      result: this.addDiscountedPriceToItems(items),
    };
  }

  //get fuzzy items by brand name
  async getFuzzyItems(name: string) {
    const items = await this.itemModel.find().populate('brand', 'name');

    const fuse = new Fuse(items, {
      keys: ['name', 'brand.name', 'description'],
      threshold: 0.3,
      distance: 100,
      ignoreLocation: true,
    });
    const results = fuse.search(name);

    const itemsFilter = results.map((result) => result.item);

    return this.addDiscountedPriceToItems(itemsFilter);
  }

  //get all items
  async getAllItems() {
    const items = await this.itemModel
      .find()
      .populate('brand', 'name description');
    return this.addDiscountedPriceToItems(items);
  }

  //-------------Patch /items

  //update one item
  async updateItem(id: string, updateItemDto: UpdateItemDto) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Id item is not valid');
    }

    const { brand, description, name, price, quantity, flashSale } =
      updateItemDto;

    const updateData: any = {
      name,
      description,
      brand,
      price,
      quantity,
    };

    if (flashSale !== undefined) {
      updateData.flashSale = flashSale;
    }

    const item = await this.itemModel.updateOne({ _id: id }, updateData);

    return item;
  }

  //soft delete one item
  async hideItem(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Id item is not valid');
    }

    const item = await this.itemModel.findOne({ _id: id });

    let isHidden = item.isDeleted;

    const itemUpdate = await this.itemModel.updateOne(
      { _id: id },
      { isDeleted: !isHidden },
    );

    return itemUpdate;
  }

  //---------------------DELETE /items

  //delete item
  async remove(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Id item is not valid');
    }

    const item = await this.itemModel.deleteOne({ _id: id });

    if (item.deletedCount === 0) {
      throw new BadRequestException('Cannot delete item');
    }

    return item;
  }

  //------------------Extends

  calculateDiscountedPrice(item: any): number {
    if (
      !item ||
      typeof item.price !== 'number' ||
      typeof item.flashSale !== 'number'
    ) {
      return item?.price || 0;
    }

    const discountAmount = (item.price * item.flashSale) / 100;
    const discountedPrice = item.price - discountAmount;

    return Math.round(discountedPrice * 100) / 100;
  }

  addDiscountedPriceToItems(items: any | any[]): any {
    if (Array.isArray(items)) {
      return items.map((item) => this.addDiscountedPriceToItem(item));
    }
    return this.addDiscountedPriceToItem(items);
  }

  addDiscountedPriceToItem(item: any): any {
    if (!item) return item;

    const processedItem = item.toObject ? item.toObject() : { ...item };

    if (processedItem.flashSale > 0) {
      processedItem.discountedPrice =
        this.calculateDiscountedPrice(processedItem);
      processedItem.isOnSale = true;
    } else {
      processedItem.discountedPrice = processedItem.price;
      processedItem.isOnSale = false;
    }

    return processedItem;
  }
}
