import { Types } from "mongoose";

export interface INotification {
  sender: Types.ObjectId;
  receiver: Types.ObjectId;
  title: string;
  image?: string;
  description?: string;
  message: string;
  isRead: boolean;
  createdAt?: Date;
}


