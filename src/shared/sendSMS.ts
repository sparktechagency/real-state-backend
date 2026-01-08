import twilio from 'twilio';
import config from '../config';
import ApiError from '../errors/ApiErrors';
import { StatusCodes } from 'http-status-codes';
// @ts-ignore
const client = twilio(config.twilio.accountSid, config.twilio.authToken);
const sendSMS = async (to: string, message: string) => {
    try {
        await client.messages.create({
            body: message,
            // @ts-ignore
            from: config.twilio.twilioNumber,
            to: to,
        });
        return {
            invalid: false,
            message: `Message sent successfully to ${to}`,
        };
    } catch (error) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to send sms');
    }
};

export default sendSMS;