import { NextResponse } from "next/server";
import { supabase } from "../../../../../supabase/client";
import { sendSms } from "../../../../../app/api/sms/_utils";

export async function POST(request: Request) {
  const families = await getAllFamilies();
  const promises = families.map((family) => {
    return startTopic({ familyId: family.id });
  });

  await Promise.all(promises);
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

const startTopic = async (params: { familyId: string }) => {
  const { familyId } = params;
  const familyMembers = await getAllUsersByFamily({ familyId });
  console.log(familyMembers);

  const topic = {
    family_id: familyId,
    prompt: "What is your favorite movie?", // TODO: generate prompt
  };

  await supabase.from("topics").insert(topic);

  const promises = familyMembers.map((familyMember) => {
    const params = {
      to: familyMember.phone as string,
      body: `${topic.prompt}`,
    };
    return sendSms(params);
  });

  await Promise.all(promises);
};
