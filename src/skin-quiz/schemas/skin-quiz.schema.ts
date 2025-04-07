import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

// Schema for a quiz question
@Schema()
export class QuizQuestion {
  @Prop({ required: true })
  questionId: string;

  @Prop({ required: true })
  questionText: string;

  @Prop({ required: true })
  isActive: boolean;

  @Prop({ type: [Object], required: true })
  options: {
    text: string;
    points: number;
    skinType: string;
  }[];
}

export const QuizQuestionSchema = SchemaFactory.createForClass(QuizQuestion);

// Schema for quiz result analysis
@Schema()
export class SkinTypeResult {
  @Prop({ required: true })
  skinType: string;

  @Prop({ required: true })
  vietnameseSkinType: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: [String], required: true })
  recommendations: string[];

  @Prop({ required: true })
  scoreThreshold: number;
}

export const SkinTypeResultSchema =
  SchemaFactory.createForClass(SkinTypeResult);

// Schema for storing user quiz responses
@Schema({ timestamps: true })
export class UserQuizResponse {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: mongoose.Schema.Types.ObjectId;

  @Prop({ type: Object, required: true })
  answers: Record<string, number>;

  @Prop({ required: true })
  scorePercentage: number;

  @Prop({ required: true })
  determinedSkinType: string;
}

export const UserQuizResponseSchema =
  SchemaFactory.createForClass(UserQuizResponse);
