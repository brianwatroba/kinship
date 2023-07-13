import { Twilio } from "twilio";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

type SendSmsParams = { to: string; body?: string; mediaUrls?: string[]; delay?: number };

const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;
const from = process.env.TWILIO_PHONE_NUMBER;

export const sendSms = async (params: SendSmsParams) => {
  const twilioClient = new Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  const { to, body, mediaUrls, delay } = params;
  const res = await twilioClient.messages.create({ to, from, body, mediaUrl: mediaUrls });
  const { status } = res;
  const sentSuccess = ["queued", "sending", "sent"].includes(status);
  if (!sentSuccess) throw new Error(`Failed to send twilio text. Status: ${status}, params: ${JSON.stringify(params)}`);
  return sentSuccess;
};

export const sendManySms = async (params: SendSmsParams[]) => {
  const promises = params.map((param) => sendSms(param));
  return Promise.all(promises);
};

const calculateSendTimeInUtc = (params: { delay?: number }) => {
  const { delay } = params;
  if (!delay) return;
  const now = dayjs();
  const sendTime = now.add(delay, "second");
  const sendTimeUtc = sendTime.utc().format();
  return { scheduledType: "fixed", sendAt: sendTimeUtc };
};
