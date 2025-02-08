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
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Public, ResponseMessage } from 'src/decorator/customize';
import { PaginationItemDto } from './dto/pagination-item.dto';

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  //-----------------POST /items

  //create item
  @Post('/create')
  @ResponseMessage('Create new item successfully')
  async createItem(@Body() createItemDto: CreateItemDto) {
    const item = await this.itemsService.createItem(createItemDto);

    return item
  }

  //----------------GET /items

  //get all items
  @Get('/all')
  @ResponseMessage("Get all items successfully")
  async getAllItems() {

  }


  //get items with pagination
  @Public()
  @ResponseMessage('Get all items with pagination successfully')
  @Get('/paginate')
  async getItemsPagination(@Query() paginationItemDto: PaginationItemDto) {
    const paginateItem = await this.itemsService.getAllItems(paginationItemDto);
    return {
      paginateItem,
    };
  }

  //get one item
  @ResponseMessage('Get item successfully')
  @Get('/:id')
  async getItemById(@Param('id') id: string) {
    const item = await this.itemsService.getItemById(id);

    return {
      item,
    };
  }

  //-------------------PATCH /items

  //update one item
  @Patch(':id')
  @ResponseMessage("Update a item successfully")
  async updateOneItem(@Param('id') id: string, @Body() updateItemDto: UpdateItemDto) {

  }

  //soft delete one item
  @Patch('/hide/:id')
  @ResponseMessage("Soft delete a item successfully")
  async hideOneItem(@Param('id') id: string) {

  }

  //-------------------DELETE /items

  //delete one item
  @Delete(':id')
  @ResponseMessage("Delete a item successfully")
  async remove(@Param('id') id: string) {

  }
}
