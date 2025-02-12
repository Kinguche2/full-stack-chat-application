import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, SchemaTypes, HydratedDocument } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Schema({ timestamps: true, collection: 'User' })
export class Users {
  id: Types.ObjectId;

  @Prop({ required: true, type: SchemaTypes.String, unique: true })
  email: string;

  @Prop({ required: true, type: SchemaTypes.String })
  firstName: string;

  @Prop({ required: true, type: SchemaTypes.String })
  lastName: string;

  @Prop({ required: true, type: SchemaTypes.String })
  profileImage: string;

  @Prop({
    required: true,
    type: SchemaTypes.String,
    default: '',
  })
  gender: {
    type: string;
    enum: ['male', 'female'];
  };

  @Prop({ required: true, type: SchemaTypes.String })
  password: string;

  @Prop({ type: SchemaTypes.Boolean, default: false })
  emailVerified: boolean;
}

export const UsersSchema = SchemaFactory.createForClass(Users);
export type UserDocument = HydratedDocument<Users>;

UsersSchema.pre('save', async function (next) {
  const user = this as any;

  // Only hash the password if it has been modified or is new
  if (!user.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10); // Generate a salt
  const hash = await bcrypt.hash(user.password, salt); // Hash the password with the salt

  user.password = hash; // Replace the plain password with the hashed one
  next();
});
