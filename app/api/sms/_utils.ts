import { Twilio } from "twilio";

type sendSmsParams = { to: string; from: string; body?: string; mediaUrls?: string[] };

export const sendSms = async (params: sendSmsParams) => {
  const twilioClient = new Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  const { body, to, from, mediaUrls } = params;
  const { status } = await twilioClient.messages.create({ body, to, from, mediaUrl: mediaUrls });
  const sentSuccess = ["queued", "sending", "sent"].includes(status);
  if (!sentSuccess) throw new Error(`Failed to send twilio text. Status: ${status}, params: ${JSON.stringify(params)}`);
};
