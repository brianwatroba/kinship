import { NextResponse } from "next/server";
import { supabase } from "@/supabase/client";
import { sendManySms } from "@/app/api/sms/_utils";
import { PROMPTS } from "@/config/constants";
import dayjs from "dayjs";

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

  const topic = {
    family_id: familyId,
    prompt: generatePrompt(),
  };

  await supabase.from("topics").insert(topic);

  const smsToSend = familyMembers.map((user) => ({ to: user.phone as string, body: topic.prompt }));

  await sendManySms(smsToSend);
};

export const getRandomValueInRange = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const generatePrompt = () => {
  const days: { name: string; shouldSend: boolean; promptWeight: string }[] = [
    { name: "SUNDAY", shouldSend: true, promptWeight: "heavy" },
    { name: "MONDAY", shouldSend: false, promptWeight: "light" },
    { name: "TUESDAY", shouldSend: true, promptWeight: "medium" },
    { name: "WEDNESDAY", shouldSend: false, promptWeight: "light" },
    { name: "THURSDAY", shouldSend: false, promptWeight: "light" },
    { name: "FRIDAY", shouldSend: true, promptWeight: "light" },
    { name: "SATURDAY", shouldSend: false, promptWeight: "light" },
  ];

  const today = days.at(dayjs().day());
  if (!today) throw new Error("Incorrect day");

  const possiblePrompts = PROMPTS[today.promptWeight];

  const randIndex = getRandomValueInRange(0, possiblePrompts.length - 1);
  if (!possiblePrompts) throw new Error("No prompts for today");
  return possiblePrompts[randIndex];
};
