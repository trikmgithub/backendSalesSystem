import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Public, ResponseMessage } from 'src/decorator/customize';
import { PaginationItemDto } from './dto/pagination-item.dto';

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  //-----------------POST /items

  //create new item
  @ResponseMessage('Create new item successfully')
  @Post('/create')
  async createNewItem(@Body() createItemDto: CreateItemDto) {
    let newItem = await this.itemsService.createNewItem(createItemDto);

    return {
      newItem,
    };
  }

  //----------------GET /items

  //get one item
  @ResponseMessage('Get item successfully')
  @Get('/:id')
  async getItemById(@Param('id') id: string) {
    const item = await this.itemsService.getItemById(id);

    return {
      item,
    };
  }

  //get all items with pagination
  @Public()
  @ResponseMessage('Get all items with pagination successfully')
  @Get('/all')
  async getAllItems(@Query() paginationItemDto: PaginationItemDto) {
    const paginateItem = await this.itemsService.getAllItems(paginationItemDto);
    return {
      paginateItem,
    };
  }

  //-------------------PATCH /items

  //-------------------DELETE /items
}
