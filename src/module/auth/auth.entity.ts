import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserEntity } from '../user/user.entity';

@Schema({ collection: 'auth', versionKey: false, timestamps: true })
export class AuthEntity extends Document {
  @Prop({ ref: () => UserEntity })
  user: UserEntity;

  @Prop({ default: true })
  valid: boolean;
}

export const AuthSchema = SchemaFactory.createForClass(AuthEntity);
