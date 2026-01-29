import { google } from "googleapis";
import config from "../config";

function getGooglePrivateKey(): string {
  const raw = config.googleSubscription.GOOGLE_Private_Key;

  if (!raw) throw new Error("Missing GOOGLE_Private_Key in config");

  return raw.replace(/\\n/g, "\n").replace(/^"|"$/g, "").trim();
}

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: config.googleSubscription.GOOGLE_Client_Email!,
    private_key: getGooglePrivateKey(),
  },
  scopes: ["https://www.googleapis.com/auth/androidpublisher"],
});

const androidPublisher = google.androidpublisher({ version: "v3", auth });

export type AndroidVerifyResult = {
  valid: boolean;
  expiryDate?: Date;
  willRenew?: boolean;
  raw?: any;
};

export const verifyAndroidSubscription = async (
  productId: string,
  token: string,
): Promise<AndroidVerifyResult> => {
  // NOTE:
  // subscriptionId = your productId
  // token = purchase token from Android client
  const response = await androidPublisher.purchases.subscriptions.get({
    packageName: "com.projectfinderllc.projectfinder",
    subscriptionId: productId,
    token,
  });

  const data = response.data;

  // Useful fields you may want:
  // data.paymentState (0 pending, 1 received, etc)
  // data.expiryTimeMillis (string)
  // data.cancelReason, data.userCancellationTimeMillis, etc

  const expiryMs = data.expiryTimeMillis ? Number(data.expiryTimeMillis) : NaN;
  const expiryDate = Number.isFinite(expiryMs) ? new Date(expiryMs) : undefined;

  // Many people treat "not expired" as valid (better than only paymentState===1)
  const notExpired = expiryDate ? expiryDate.getTime() > Date.now() : false;
  const willRenew = data.autoRenewing === true;
  // If you want strict check:
  // const paid = data.paymentState === 1;
  // const valid = paid && notExpired;

  const valid = notExpired;

  return { valid, expiryDate, raw: data, willRenew };
};
export default verifyAndroidSubscription;
