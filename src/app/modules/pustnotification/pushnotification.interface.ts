import { Types } from "mongoose";

export interface IPushNotification {
  sender: Types.ObjectId;
  receiver: Types.ObjectId[];
  title: string;
  document: string;
}
