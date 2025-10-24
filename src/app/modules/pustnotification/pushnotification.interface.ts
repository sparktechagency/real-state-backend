import { Types } from "mongoose";

export interface IPushNotification {
  sender: Types.ObjectId;
  receiver: Types.ObjectId[];
  image?: string;
  title: string;
  description: string;
}
