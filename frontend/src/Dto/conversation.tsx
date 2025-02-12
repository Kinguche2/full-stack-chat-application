import { Types } from "mongoose";

interface ConversationModel {
  _id: Types.ObjectId;
  email: string;
  profileImage?: string;
  gender?: string;
  emailVerified?: boolean;
  token?: string;
  firstName?: string;
  lastName?: string;
}

export default ConversationModel;
