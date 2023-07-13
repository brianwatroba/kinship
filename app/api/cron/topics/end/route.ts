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

    const { data: updatedTopic, error: updateTopicError } = await supabase
      .from("topics")
      .update({ completed: true })
      .eq("id", activeTopic.id);

    const promises = activeFamilyMembers.map((familyMember) => {
      return {
        to: familyMember.phone as string,
        body: RESPONSES.SUMMARY({
          summaryLink: ` https://${request.headers.get("x-forwarded-host")}/topics/${activeTopic.id}`,
        }),
      };
    });
    await sendManySms(promises);
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
