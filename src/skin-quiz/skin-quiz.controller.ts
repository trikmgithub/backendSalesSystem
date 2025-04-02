import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { SkinQuizService } from './skin-quiz.service';
import { QuizResponseDto } from './dto/quiz-response.dto';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/interface/users.interface';
import { CreateQuestionDto } from './dto/create-question.dto';

@Controller('skin-quiz')
export class SkinQuizController {
  constructor(private readonly skinQuizService: SkinQuizService) {}

  //------------------------GET------------------------

  // Get all quiz questions
  @Public()
  @Get('questions')
  @ResponseMessage('Get all quiz questions')
  async getAllQuestions() {
    return await this.skinQuizService.getAllQuestions();
  }

  // Get all skin types info
  @Get('skin-types')
  @ResponseMessage('Get all skin types info')
  async getAllSkinTypes() {
    return await this.skinQuizService.getAllSkinTypes();
  }

  // Get skin type info by type
  @Get('skin-types/:type')
  @ResponseMessage('Get skin type info')
  async getSkinTypeInfo(@Param('type') skinType: string) {
    return await this.skinQuizService.getSkinTypeInfo(skinType);
  }

  // Get user quiz history
  @Get('history/:userId')
  @ResponseMessage('Get user quiz history')
  async getUserQuizHistory(@Param('userId') userId: string) {
    return await this.skinQuizService.getUserQuizHistory(userId);
  }

  //------------------------POST------------------------

  // Add a new quiz question
  @Post('questions')
  @ResponseMessage('Add new quiz question')
  async addQuestion(@Body() createQuestionDto: CreateQuestionDto) {
    return await this.skinQuizService.addQuestion(createQuestionDto);
  }

  // Process a user's quiz responses
  @Post('submit')
  @ResponseMessage('Quiz response submitted successfully')
  async submitQuiz(
    @Body() quizResponseDto: QuizResponseDto,
    @User() user: IUser,
  ) {
    return await this.skinQuizService.processQuizResponse(
      quizResponseDto,
      user,
    );
  }

  // Upsert skin type info
  @Post('skin-types')
  @ResponseMessage('Skin type info added/updated successfully')
  async upsertSkinTypeInfo(@Body() skinTypeData: any) {
    return await this.skinQuizService.upsertSkinTypeInfo(skinTypeData);
  }

  //------------------------PUT------------------------

  // Update an existing quiz question
  @Put('questions/:questionId')
  @ResponseMessage('Update quiz question')
  async updateQuestion(
    @Param('questionId') questionId: string,
    @Body() updateQuestionDto: CreateQuestionDto,
  ) {
    return await this.skinQuizService.updateQuestion(
      questionId,
      updateQuestionDto,
    );
  }

  //------------------------DELETE------------------------

  // Delete a quiz question
  @Delete('questions/:questionId')
  @ResponseMessage('Delete quiz question')
  async deleteQuestion(@Param('questionId') questionId: string) {
    return await this.skinQuizService.deleteQuestion(questionId);
  }
}
