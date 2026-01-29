import { Subscription } from "../modules/subscription/subscription.model";
import { User } from "../modules/user/user.model";
import cron from "node-cron";
export const syncExpiredSubscriptions = async () => {
  const now = new Date();
  const nowISO = now.toISOString();

  // 1) Find expired active subscriptions
  const expiredActiveSubs = await Subscription.find({
    status: "active",
    expiry_date: { $ne: null, $lt: nowISO },
  }).select("user");

  if (!expiredActiveSubs.length) return;

  // 2) Mark subscriptions as expired
  await Subscription.updateMany(
    {
      status: "active",
      expiry_date: { $ne: null, $lt: nowISO },
    },
    {
      $set: { status: "expired", will_renew: false },
    },
  );

  // 3) Update users isSubscribe=false if no other active subscription remains
  const userIds = [...new Set(expiredActiveSubs.map((s) => String(s.user)))];

  for (const userId of userIds) {
    const stillActive = await Subscription.exists({
      user: userId,
      status: "active",
      expiry_date: { $ne: null, $gt: nowISO },
    });

    if (!stillActive) {
      await User.findByIdAndUpdate(userId, { isSubscribe: false });
    }
  }

  console.log(
    `[CRON] Expired ${expiredActiveSubs.length} subscriptions and updated users.`,
  );
};

export const startSubscriptionCron = () => {
  // Runs every 30 minutes (you can change)
  cron.schedule("*/30 * * * *", async () => {
    try {
      await syncExpiredSubscriptions();
    } catch (err) {
      console.error("[CRON] syncExpiredSubscriptions failed:", err);
    }
  });

  console.log("[CRON] Subscription sync cron started (every 30 minutes).");
};
