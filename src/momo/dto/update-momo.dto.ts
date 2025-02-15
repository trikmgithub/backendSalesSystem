import { PartialType } from '@nestjs/swagger';
import { CreateMomoDto } from './create-momo.dto';

export class UpdateMomoDto extends PartialType(CreateMomoDto) {}
