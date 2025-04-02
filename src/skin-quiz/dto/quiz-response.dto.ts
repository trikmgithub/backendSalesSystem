import { IsNotEmpty, IsObject, IsString } from 'class-validator';

export class QuizResponseDto {
  @IsString()
  @IsNotEmpty({ message: 'UserId is required' })
  userId: string;

  @IsObject()
  @IsNotEmpty({ message: 'Answers object is required' })
  answers: Record<string, number>;
}
