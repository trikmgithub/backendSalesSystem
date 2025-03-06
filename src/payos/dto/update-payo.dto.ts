import { PartialType } from '@nestjs/swagger';
import { CreatePayoDto } from './create-payo.dto';

export class UpdatePayoDto extends PartialType(CreatePayoDto) {}
