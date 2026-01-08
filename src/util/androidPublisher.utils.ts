import { google } from "googleapis";
import config from "../config";

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: config.subscription.FIREBASE_CLIENT_EMAIL,
    private_key: config.subscription.FIREBASE_PRIVATE_KEY,
  },
  scopes: ["https://www.googleapis.com/auth/androidpublisher"],
});

const androidPublisher = google.androidpublisher({ version: "v3", auth });

const verifyAndroidSubscription = async (productId: string, token: string) => {
  const response = await androidPublisher.purchases.subscriptions.get({
    packageName: "com.your.app",
    subscriptionId: productId,
    token,
  });

  const data = response.data;

  if (data.paymentState === 1) {
    return { valid: true, expiryDate: new Date(Number(data.expiryTimeMillis)) };
  }
  return { valid: false };
};
export default verifyAndroidSubscription;
