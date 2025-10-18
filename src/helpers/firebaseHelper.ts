import admin from 'firebase-admin';
import { logger } from '../shared/logger';
import config from '../config';
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(process.cwd(), ".env") });

// Your device token
const receiverDeviceToken = "fjHGBY9pSZ2M65xOYVUdt9:APA91bHTPVv9RlOGMwOJ2XLXyxjsCvyhLES7_7yOGJKnNlMVO63FCMIHp48b95iTvBIfqT63VZI2KvtFiZ3WYbBixTmAdlZGUmgouZjDlTSe_jWtmtsvpU4";

// const serviceAccount = {
//     type: config.firebase.type!,
//     project_id: config.firebase.project_id!,
//     private_key_id: config.firebase.private_key_id!,
//     private_key: config.firebase.private_key!,
//     client_email: config.firebase.client_email!,
//     client_id: config.firebase.client_id!,
//     client_x509_cert_url: config.firebase.client_x509_cert_url!,
// }

console.log("serviceAccount",
    config.firebase.type,
    config.firebase.project_id,
    config.firebase.private_key_id,
    config.firebase.private_key,
    config.firebase.client_email,
    config.firebase.client_id,
    config.firebase.client_x509_cert_url
);



const serviceAccount = {
    type: config.firebase.type!,
    project_id: config.firebase.project_id!,
    private_key_id: config.firebase.private_key_id!,
    private_key: config.firebase.private_key!,
    client_email: config.firebase.client_email!,
    client_id: config.firebase.client_id!,
    client_x509_cert_url: config.firebase.client_x509_cert_url!,
};

// Cast serviceAccount to ServiceAccount type
const serviceAccountKey: admin.ServiceAccount = serviceAccount as admin.ServiceAccount;



// Initialize Firebase SDK (do this once)
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccountKey),
    });
}


/**
 * Send Firebase notification to multiple devices
 * @param tokens Array of device tokens
 * @param title Notification title
 * @param body Notification body
 * @param data Optional custom key-value data
 */

// Message payload
const messageSend: admin.messaging.Message = {
    notification: {
        title: "Title",
        body: "This is test notification",
    },
    data: {
        key1: 'value1',
        key2: 'value2',
    },
    android: {
        priority: 'high',
    },
    apns: {
        payload: {
            aps: {
                badge: 42,
            },
        },
    },
    token: receiverDeviceToken,
};

// Send notification
admin.messaging().send(messageSend)
    .then((res: string) => {
        logger.info(`Successfully sent message `);
    })
    .catch((error) => {
        logger.error('Error sending message');
    });
