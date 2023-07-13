import type { NextRequest } from "next/server";
import * as Twilio from "twilio";
import querystring from "querystring";
import { createClient } from "@supabase/supabase-js";
import { sendSms } from "../_utils";
import { supabase } from "../../../../supabase/client";

type TwilioWebookRequest = NextRequest & {
  body: ReadableStream;
} & { headers: { "X-Twilio-Signature": string } };

export async function POST(request: TwilioWebookRequest) {
  const body = querystring.parse(await request.text());
  console.log(body);

  const { From: from, Body: text, NumMedia: mediaCount } = body;

  const user = await getUserByPhone(body.From as string);
  const media: string[] = [];
  for (let i = 0; i < Number(mediaCount); i++) {
    const mediaUrl = body[`MediaUrl${i}`] as string;
    media.push(mediaUrl);
  }

  const activeTopic = await getActiveTopic({ familyId: user.family_id });
  if (!activeTopic) return sendSmsResponse({ text: "No active topic!" });

  // Saves posts from SMS
  const newPosts = [];
  if (text) newPosts.push({ topic_id: activeTopic.id, user_id: user.id, type: "text", content: text as string });
  if (media)
    media.forEach((imageUrl) => {
      if (!imageUrl) return;
      newPosts.push({ topic_id: activeTopic.id, user_id: user.id, type: "image", content: imageUrl });
    });
  const { data: posts, error } = await supabase.from("posts").insert(newPosts);

  const { data: activeFamilyMembers, error: familyMembersError } = await supabase
    .from("users")
    .select("*")
    .eq("family_id", user.family_id)
    .eq("active", true);

  if (!activeFamilyMembers) throw new Error("No active family members found");

  const topicPosts = await getPostsByTopic({ topicId: activeTopic.id });
  const usersAnswered = new Set(topicPosts.map((post) => post.user_id));

  const allAnswered = activeFamilyMembers.every((member) => usersAnswered.has(member.id));

  if (allAnswered && !activeTopic.completed) {
    // save topic as completed
    const { data: updatedTopic, error: updateTopicError } = await supabase
      .from("topics")
      .update({ completed: true })
      .eq("id", activeTopic.id);

    const promises = activeFamilyMembers.map((familyMember) => {
      const params = {
        to: familyMember.phone as string,
        body: `Answers are in! Today's summary: https://${request.headers.get("x-forwarded-host")}/topics/${activeTopic.id}`,
      };
      return sendSms(params);
    });
    await Promise.all(promises);
  }

  return sendSmsResponse({ text: "Response saved!" });
}

const sendSmsResponse = (params: { text: string }) => {
  const response = new Twilio.twiml.MessagingResponse();
  response.message(params.text);
  const xmlResponse = response.toString();
  return new Response(xmlResponse, {
    headers: {
      "Content-Type": "text/xml",
    },
    status: 200,
  });
};

const getPostsByTopic = async (params: { topicId: string }) => {
  const { data: posts, error } = await supabase.from("posts").select("*").eq("topic_id", params.topicId);
  if (error) throw new Error("Error getting topic posts: " + error.message);
  return posts;
};

const getUserByPhone = async (phone: string) => {
  const { data: user, error } = await supabase.from("users").select("*").eq("phone", phone).single();
  if (error) throw new Error("Error getting user by phone: " + error.message);
  return user;
};

//TODO: add model types
const getActiveTopic = async (params: { familyId: string }) => {
  const { data: topic, error } = await supabase
    .from("topics")
    .select("*")
    .eq("family_id", params.familyId)
    .order("created_at", { ascending: false })
    .single();
  if (error) throw new Error("Error getting latest topic: " + error.message);
  return topic.completed ? undefined : topic;
};
