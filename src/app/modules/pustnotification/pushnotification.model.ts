import { model, Schema } from "mongoose";
import { IPushNotification } from "./pushnotification.interface";

const pushNotificationSchema = new Schema<IPushNotification>({
  sender: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  receiver: {
    type: [Schema.Types.ObjectId],
    ref: "User",
    required: true
  },
  title: {
    type: String,
    required: true
  },
  document: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});
export const pushNotificationModel = model('PushNotification', pushNotificationSchema);