import Image from "next/image";

type ResponseCardProps = {
  text: string;
  media: string;
};

const ResponseCard = ({ text, media }: ResponseCardProps) => {
  const isTextResponse = text !== "";
  const isMediaResponse = media !== "";
  return (
    <>
      {isTextResponse && <TextResponse text={text} />}
      {isMediaResponse && <MediaResponse media={media} />}
    </>
  );
};

const TextResponse = ({ text }: any) => (
  <div className="w-full my-6 bg-white rounded-md py-8 px-6 flex flex-col items-center justify-center text-center text-2xl text-gray-500 font-light relative">
    <div className="ml-4 w-full">
      <Image src="/images/leftquote.svg" alt="quote" width={22} height={22} />
    </div>
    <div className="py-2 font-sans">{text}</div>
    <div className="mr-4 flex flex-row items-end justify-end w-full">
      <Image src="/images/rightquote.svg" alt="quote" width={22} height={22} />
    </div>
  </div>
);

const MediaResponse = ({ media }: any) => (
  <Image src={media} alt="Photo response" width={300} height={500} className="rounded-md border-white border-4 my-6" />
);

export default ResponseCard;
