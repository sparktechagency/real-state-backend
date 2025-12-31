import axios from "axios";
import config from "../config";

interface IOSVerifyResult {
  valid: boolean;
  expiryDate?: Date;
}

const verifyIosSubscription = async (
  receipt: string,
  productId: string
): Promise<IOSVerifyResult> => {
  if (!receipt || receipt.length < 500) {
    return { valid: false };
  }

  const payload = {
    "receipt-data": receipt,
    password: config.appleSubscription.appleSharedSecret,
    "exclude-old-transactions": true,
  };

  //  SANDBOX FIRST (LOCAL TESTING)
  let response = await axios.post(
    "https://sandbox.itunes.apple.com/verifyReceipt",
    payload,
    { timeout: 10000 }
  );

  //  PRODUCTION FALLBACK
  if (response.data.status === 21007) {
    response = await axios.post(
      "https://buy.itunes.apple.com/verifyReceipt",
      payload,
      { timeout: 10000 }
    );
  }

  return parseAppleResponse(response.data, productId);
};

const parseAppleResponse = (data: any, productId: string): IOSVerifyResult => {
  if (data.status !== 0) {
    return { valid: false };
  }

  const receipts = data.latest_receipt_info || data.receipt?.in_app;

  if (!Array.isArray(receipts) || receipts.length === 0) {
    return { valid: false };
  }

  //  FILTER BY PRODUCT
  const productReceipts = receipts.filter(
    (r: any) => r.product_id === productId
  );

  if (!productReceipts.length) {
    return { valid: false };
  }

  //  GET LATEST EXPIRY
  const latest = productReceipts.reduce((a: any, b: any) =>
    Number(a.expires_date_ms) > Number(b.expires_date_ms) ? a : b
  );

  const expiryMs = Number(latest.expires_date_ms);

  if (!expiryMs || expiryMs <= Date.now()) {
    return { valid: false };
  }

  return {
    valid: true,
    expiryDate: new Date(expiryMs),
  };
};

export default verifyIosSubscription;
