import { NextResponse } from "next/server";
import { supabase } from "@/supabase/client";
import { sendManySms } from "@/app/api/sms/_utils";
import { RESPONSES } from "@/config/constants";

export async function POST(request: Request) {
  const allFamilies = await getAllFamilies();

  for (const family of allFamilies) {
    const activeTopic = await getActiveTopic({ familyId: family.id });
    if (!activeTopic || activeTopic.completed) continue;

    const { data: activeFamilyMembers, error: familyMembersError } = await supabase
      .from("users")
      .select("*")
      .eq("family_id", family.id)
      .eq("active", true);

    if (!activeFamilyMembers) throw new Error("No active family members found");

    const topicPosts = await getPostsByTopic({ topicId: activeTopic.id });
    const usersAnswered = new Set(topicPosts.map((post) => post.user_id));
    const usersNotAnswered = activeFamilyMembers.filter((user) => !usersAnswered.has(user.id));

    const reminderMsg = RESPONSES.REMINDER({
      responded: usersAnswered.size,
      total: activeFamilyMembers.length,
      prompt: activeTopic.prompt,
    });
    const smsToSend = usersNotAnswered.map((user) => ({ to: user.phone as string, body: reminderMsg }));
    await sendManySms(smsToSend);
  }
  return NextResponse.json({
    status: 200,
  });
}

const getAllFamilies = async () => {
  const { data: families, error } = await supabase.from("families").select("*").eq("active", true);
  if (error) throw new Error(error.message);
  return families;
};

const getAllUsersByFamily = async (params: { familyId: string }) => {
  const { familyId } = params;
  const { data: familyMembers, error: familyError } = await supabase.from("users").select("*").eq("family_id", familyId).eq("active", true);
  if (familyError) throw new Error(familyError.message);
  familyMembers === null ? [] : familyMembers;
  return familyMembers;
};

const getActiveTopic = async (params: { familyId: string }) => {
  const { data: topics, error } = await supabase
    .from("topics")
    .select("*")
    .eq("family_id", params.familyId)
    .order("created_at", { ascending: false })
    .limit(1);
  if (error) throw new Error("Error getting latest topic: " + error.message);

  const [topic] = topics;
  return topic.completed ? undefined : topic;
};

const getPostsByTopic = async (params: { topicId: string }) => {
  const { data: posts, error } = await supabase.from("posts").select("*").eq("topic_id", params.topicId);
  if (error) throw new Error("Error getting topic posts: " + error.message);
  return posts;
};
