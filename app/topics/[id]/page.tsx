import Image from "next/image";
import dayjs from "dayjs";
import Navbar from "@/components/NavBar";
import UserResponses from "@/components/UserResponses";
import { Metadata, ResolvingMetadata } from "next";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
const supabase = createServerComponentClient({ cookies });

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ params, searchParams }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const id = params.id;

  const { data: topic, error: topicCallError } = await supabase.from("topics").select("*").eq("id", id).single();

  const url = `https://${process.env.VERCEL_URL}/api/og?title=${topic.prompt}}`;

  console.log("url", url);

  return {
    title: "My page title",
    openGraph: {
      title: "My page title",
      description: "Todays answers",
      locale: "en_US",
      type: "website",
      images: [{ url, width: 1200, height: 627 }],
    },
  };
}

export default async function Page({ params }: { params: { id: string } }) {
  const topicId = params.id;

  const { data: topic } = await supabase.from("topics").select("*").eq("id", topicId).single();
  const { data: posts } = await supabase.from("posts").select("*").eq("topic_id", topicId);
  const { data: family } = await supabase.from("families").select("*").eq("id", topic.family_id).single();
  const { data: familyMembers } = await supabase.from("users").select("*").eq("family_id", topic.family_id); // needs to be active only

  const participants = familyMembers!.map((member) => member.id);

  const usersResponses = {} as { [key: string]: any };

  familyMembers?.forEach((user) => {
    usersResponses[user.id] = {
      name: user.first_name,
      image: user.image,
      responses: posts?.filter((post) => post.user_id === user.id),
    };
  });

  return (
    <div className="flex flex-col items-center justify-center w-screen overflow-hidden bg-background">
      <Navbar />
      <Banner family={family} date={topic.createdAt} />
      <PromptCard prompt={topic.prompt} />
      {participants.map((user: string) => (
        <UserResponses key={user} userResponses={usersResponses[user]} />
      ))}
    </div>
  );
}

const Banner = ({ family, date }: any) => {
  return (
    <>
      <div className="flex flex-col items-center justify-center relative">
        <FamilyBannerImage src={family.image} alt="Family Photo" />
        <Image
          className="bg-primary rounded-full absolute bottom-4 p-1"
          src="/images/plantlogo.svg"
          alt="Kinship Logo"
          width={45}
          height={45}
        />
      </div>
      <div className="flex flex-col items-center justify-center bg-background w-screen">
        <h1 className="text-2xl font-bold">The {family.name}s</h1>
        <h5 className="text-lg text-gray-500 mt-2">{dayjs(date).format("dddd, MMMM D YYYY")}</h5>
      </div>
    </>
  );
};

const PromptCard = ({ prompt }: any) => {
  return (
    <div className="mx-8 mt-16 mb-24 bg-white rounded-md py-12 px-6 flex flex-col items-center justify-center text-center font-sans text-2xl text-gray-500 font-light relative">
      <h2>{prompt}</h2>
      <Image
        className="bg-primary rounded-full absolute -top-5 p-2"
        src="/images/questionlogo.svg"
        alt="Kinship Logo"
        width={45}
        height={45}
      />
    </div>
  );
};

const FamilyBannerImage = (props: any) => {
  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <img src={props.src} style={{ width: "100%", height: "100%" }} alt="Your Image" />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "radial-gradient(95.12% 90.12% at 50% 175%, #F4F4F4, #F4F4F4 99.99%, rgba(244, 244, 244, 0) 100%)",
          backgroundSize: "cover",
          backgroundClip: "padding-box",
        }}
      ></div>
    </div>
  );
};
