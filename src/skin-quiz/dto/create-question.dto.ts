import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

export class QuestionOptionDto {
  @IsString()
  @IsNotEmpty({ message: 'Answer content must not be empty' })
  text: string;

  @IsNumber()
  @IsNotEmpty({ message: 'Answer points must not be empty' })
  points: number;

  @IsString()
  @IsNotEmpty({ message: 'Skin type must not be empty' })
  skinType: string;
}

export class CreateQuestionDto {
  @IsString()
  @IsNotEmpty({ message: 'Question ID must not be empty' })
  questionId: string;

  @IsString()
  @IsNotEmpty({ message: 'Question content must not be empty' })
  questionText: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionOptionDto)
  @IsNotEmpty({ message: 'Answer list must not be empty' })
  options: QuestionOptionDto[];
}
