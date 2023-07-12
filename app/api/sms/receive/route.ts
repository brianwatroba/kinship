import type { NextRequest } from "next/server";
import * as Twilio from "twilio";
import querystring from "querystring";

type TwilioWebookRequest = NextRequest & {
  body: ReadableStream;
} & { headers: { "X-Twilio-Signature": string } };

export async function POST(request: TwilioWebookRequest) {
  const body = querystring.parse(await request.text());

  // const signature = request.headers.get("X-Twilio-Signature");
  // if (!signature) throw new Error("No Twilio signature in headers");
  // const isValid = Twilio.validateRequest(process.env.TWILIO_ACCOUNT_SID ?? "", signature, process.env.TWILIO_AUTH_TOKEN ?? "", body);
  // if (!isValid) throw new Error("Invalid Twilio webhook signature");

  console.log(body);

  const response = new Twilio.twiml.MessagingResponse().toString();
  // response.message("Hello, Twilio!");

  const xmlResponse = response.toString();

  // Send the XML response
  return new Response(xmlResponse, {
    headers: {
      "Content-Type": "text/xml",
    },
    status: 200,
  });
}

// export const createPostsFromSms = async ({ from, text, media }: { from: string; text?: string; media?: string[] }) => {
//   const responsesToUser = [];
//   const user = await getUserByPhoneNumber({ phoneNumber: from });

//   // Ensure active topic
//   const activeTopic = await getActiveTopic({ familyId: user.familyId });
//   if (!activeTopic) {
//       responsesToUser.push(RESPONSES.NO_ACTIVE_TOPIC);
//       return responsesToUser;
//   }

//   // Create new posts
//   const newPosts = [];
//   if (text) newPosts.push(new Post({ topicId: activeTopic.id, user: user.id, text }));
//   if (media)
//       media.forEach((item) => newPosts.push(new Post({ topicId: activeTopic.id, user: user.id, media: item })));
//   await Post.batchPut(newPosts);

//   // Update topic status
//   const { participants, whoHasAnswered, isCompleted, isSummarySent } = await syncTopicStatus({
//       topicId: activeTopic.id,
//   });
//   responsesToUser.push(RESPONSES.SAVED({ responded: whoHasAnswered.length, total: participants.length }));

//   // Trigger summary if completed
//   if (isCompleted && isSummarySent) await sendTopicSummary({ topicId: activeTopic.id });

//   return responsesToUser;
// };
