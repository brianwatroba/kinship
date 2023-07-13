import Image from "next/image";
import ResponseCard from "./ResponseCard";

type UserResponsesProps = {
  userResponses: any;
};

const UserResponses = ({ userResponses }: UserResponsesProps) => {
  const { name, image, responses } = userResponses;
  return (
    <>
      <div className="flex flex-row items-center justify-center p-2 bg-primary w-screen">
        <div className="flex flex-row items-center justify-center ">
          <Image src={image} width={42} height={42} className="border-white border-2 rounded-full" alt="Profile pic" />
          <div className="text-2xl font-bold text-white ml-2">{name.toUpperCase()}</div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center bg-background w-screen px-8 py-16">
        {responses.map((response: any) => (
          <ResponseCard key={response.id} type={response.type} content={response.content} />
        ))}
      </div>
    </>
  );
};

export default UserResponses;
