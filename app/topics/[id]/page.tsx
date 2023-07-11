import Image from "next/image";
import dayjs from "dayjs";
import Navbar from "@/components/NavBar";
import UserResponses from "@/components/UserResponses";

const family = {
  id: "1",
  name: "Watroba",
  image: "https://res.cloudinary.com/dfuyisjqi/image/upload/v1682873688/kinship/families/watroba_tet5wi.png",
  paused: false,
};
const topic = {
  id: "1",
  prompt: "What is your favorite color?",
  createdAt: new Date(),
  participants: ["1", "2", "3"],
};

const usersResponses: { [key: string]: {} } = {
  "1": {
    name: "Brian",
    image: "https://res.cloudinary.com/dfuyisjqi/image/upload/v1682873935/kinship/users/brian_ukf3rr.jpg",
    responses: [{ text: "blue", createdAt: new Date(), media: "" }],
  },
  "2": {
    name: "Kevin",
    image: "https://res.cloudinary.com/dfuyisjqi/image/upload/v1682873934/kinship/users/kevin_neaf2q.jpg",
    responses: [{ text: "Green", createdAt: new Date(), media: "" }],
  },
  "3": {
    name: "Kim",
    image: "https://res.cloudinary.com/dfuyisjqi/image/upload/v1682873743/kinship/users/kim_sgkfpy.png",
    responses: [{ text: "Green", createdAt: new Date(), media: "" }],
  },
};

export default async function Page({ params }: { params: { id: string } }) {
  // needs topic, family, userresponses

  return (
    <div className="flex flex-col items-center justify-center w-screen overflow-hidden bg-background">
      <Navbar />
      <Banner family={family} date={topic.createdAt} />
      <PromptCard prompt={topic.prompt} />
      {topic.participants.map((user: string) => (
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
