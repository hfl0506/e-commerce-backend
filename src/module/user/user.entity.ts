import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { nanoid } from 'nanoid';

@Schema({ collection: 'user', versionKey: false, timestamps: true })
export class UserEntity extends Document {
  @Prop({ required: true, lowercase: true, unique: true, index: 1 })
  email: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, default: () => nanoid() })
  verificationCode: string;

  @Prop({ default: null })
  passwordResetCode: string | null;

  @Prop({ default: false })
  verified: boolean;
}

export const UserSchema = SchemaFactory.createForClass(UserEntity);
