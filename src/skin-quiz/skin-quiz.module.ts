import { MongooseModule } from '@nestjs/mongoose';
import { SkinQuizController } from './skin-quiz.controller';
import { SkinQuizService } from './skin-quiz.service';
import { QuizQuestion, QuizQuestionSchema } from './schemas/skin-quiz.schema';
import {
  SkinTypeResult,
  SkinTypeResultSchema,
} from './schemas/skin-quiz.schema';
import {
  UserQuizResponse,
  UserQuizResponseSchema,
} from './schemas/skin-quiz.schema';
import { UsersModule } from 'src/users/users.module';
import { Module } from '@nestjs/common';
import { SkinQuizSeedService } from './seed/seed.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: QuizQuestion.name, schema: QuizQuestionSchema },
      { name: SkinTypeResult.name, schema: SkinTypeResultSchema },
      { name: UserQuizResponse.name, schema: UserQuizResponseSchema },
    ]),
    UsersModule,
  ],
  controllers: [SkinQuizController],
  providers: [SkinQuizService, SkinQuizSeedService],
  exports: [SkinQuizService, SkinQuizSeedService],
})
export class SkinQuizModule {}
