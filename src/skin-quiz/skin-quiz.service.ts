// src/skin-quiz/skin-quiz.service.ts
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { QuizQuestion } from './schemas/skin-quiz.schema';
import { SkinTypeResult } from './schemas/skin-quiz.schema';
import { UserQuizResponse } from './schemas/skin-quiz.schema';
import { QuizResponseDto } from './dto/quiz-response.dto';
import { UsersService } from 'src/users/users.service';
import { IUser } from 'src/users/interface/users.interface';
import { CreateQuestionDto } from './dto/create-question.dto';

@Injectable()
export class SkinQuizService {
  constructor(
    @InjectModel(QuizQuestion.name)
    private questionModel: Model<QuizQuestion>,
    @InjectModel(SkinTypeResult.name)
    private skinTypeResultModel: Model<SkinTypeResult>,
    @InjectModel(UserQuizResponse.name)
    private userQuizResponseModel: Model<UserQuizResponse>,
    private readonly usersService: UsersService,
  ) {}

  // Get all quiz questions
  async getAllQuestions() {
    return await this.questionModel.find().exec();
  }

  // Add a new quiz question
  async addQuestion(createQuestionDto: CreateQuestionDto) {
    try {
      const existingQuestion = await this.questionModel.findOne({
        questionId: createQuestionDto.questionId
      });
      
      if (existingQuestion) {
        throw new BadRequestException(`Câu hỏi với ID ${createQuestionDto.questionId} đã tồn tại`);
      }
      
      const newQuestion = await this.questionModel.create(createQuestionDto);
      return newQuestion;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Không thể tạo câu hỏi mới: ' + error.message);
    }
  }

  // Process a user's quiz responses
  async processQuizResponse(quizResponseDto: QuizResponseDto, user: IUser) {
    const { userId, answers } = quizResponseDto;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid user ID');
    }

    let totalScore = 0;
    for (const questionId in answers) {
      totalScore += answers[questionId];
    }

    const skinType = this.determineSkinType(totalScore);

    const userResponse = await this.userQuizResponseModel.create({
      userId,
      answers,
      totalScore,
      determinedSkinType: skinType,
    });

    await this.usersService.skin(skinType, user);

    const skinTypeInfo = await this.getSkinTypeInfo(skinType);

    return {
      quizResult: userResponse,
      skinTypeInfo,
    };
  }

  // Get all skin type infos
  async getAllSkinTypes() {
    return await this.skinTypeResultModel.find().exec();
  }

  // Add or update a skin type info
  async upsertSkinTypeInfo(skinTypeData: any) {
    const { skinType } = skinTypeData;

    const existingSkinType = await this.skinTypeResultModel.findOne({
      skinType: skinType,
    });

    if (existingSkinType) {
      return await this.skinTypeResultModel.findOneAndUpdate(
        { skinType: skinType },
        skinTypeData,
        { new: true },
      );
    } else {
      return await this.skinTypeResultModel.create(skinTypeData);
    }
  }

  // Get skin type info by type
  async getSkinTypeInfo(skinType: string) {
    return await this.skinTypeResultModel
      .findOne({
        skinType: skinType,
      })
      .populate('recommendedProducts')
      .exec();
  }

  // Get quiz history for a user
  async getUserQuizHistory(userId: string) {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid user ID');
    }

    return await this.userQuizResponseModel
      .find({
        userId: new mongoose.Types.ObjectId(userId),
      })
      .sort({ createdAt: -1 })
      .exec();
  }

  // Helper function to determine skin type based on total score
  private determineSkinType(score: number): string {
    if (score <= 15) {
      return 'da_kho';
    } else if (score <= 25) {
      return 'da_thuong';
    } else if (score <= 35) {
      return 'da_hon_hop';
    } else {
      return 'da_dau';
    }
  }

  // Update a quiz question
  async updateQuestion(questionId: string, updateQuestionDto: CreateQuestionDto) {
    return await this.questionModel.findByIdAndUpdate(questionId, updateQuestionDto, { new: true });
  }

  // Delete a quiz question
  async deleteQuestion(questionId: string) {
    return await this.questionModel.findByIdAndDelete(questionId);
  }
}
