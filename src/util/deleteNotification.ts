// after 7 day delete notification
import cron from "node-cron";
import { logger } from "../shared/logger";
import { NotificationModel } from "../app/modules/notification/notification.model";

const deleteNotification = () => {
    cron.schedule("0 0 * * *", async () => {
        // runs nightly at 12:00 AM
        try {
            const now = new Date();
            const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            await NotificationModel.deleteMany({ createdAt: { $lt: sevenDaysAgo } });
            logger.info("Deleted notifications older than 7 days");
        } catch (error) {
            logger.error("Error during notification cleanup:", error);
        }
    });
    logger.info("Notification cleanup job scheduled to run nightly at 12:00 AM.");
};


export default deleteNotification;