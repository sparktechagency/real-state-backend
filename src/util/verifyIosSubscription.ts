import axios from "axios";
import config from "../config";

interface IOSVerifyResult {
  valid: boolean;
  expiryDate?: Date;
  willRenew?: boolean;
}

const verifyIosSubscription = async (
  receipt: string,
  password: string,
): Promise<IOSVerifyResult> => {
  if (!receipt) return { valid: false };

  const payload = {
    "receipt-data": receipt,
    password: config.appleSubscription.appleSharedSecret,
    "exclude-old-transactions": true,
  };

  let response = await axios.post(config.APPLE_LINK.APPLE_PROD_URL, payload, {
    timeout: 10000,
  });

  // Sandbox receipt sent to prod
  if (response.data.status === 21007) {
    response = await axios.post(config.APPLE_LINK.APPLE_SANDBOX_URL, payload, {
      timeout: 10000,
    });
  }

  // Edge case: Prod receipt sent to sandbox
  if (response.data.status === 21008) {
    response = await axios.post(config.APPLE_LINK.APPLE_PROD_URL, payload, {
      timeout: 10000,
    });
  }

  const data = response.data;

  if (data.status !== 0) return { valid: false };

  const receipts = data.latest_receipt_info ?? data.receipt?.in_app ?? [];
  const productReceipts = receipts.filter(
    (r: any) => r.product_id === password,
  );

  if (!productReceipts.length) return { valid: false };

  // Pick the latest receipt
  const latestReceipt = productReceipts.reduce((prev: any, curr: any) =>
    Number(prev.expires_date_ms) > Number(curr.expires_date_ms) ? prev : curr,
  );

  const expiryMs = Number(latestReceipt.expires_date_ms);

  if (!expiryMs || expiryMs <= Date.now()) return { valid: false };

  return {
    valid: true,
    expiryDate: new Date(expiryMs),
  };
};

export default verifyIosSubscription;
