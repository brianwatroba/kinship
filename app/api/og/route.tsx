import { ImageResponse } from "@vercel/og";
import Image from "next/image";
import { NextRequest } from "next/server";

export const config = {
  runtime: "edge",
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // dynamic params
    const title = searchParams.has("title") ? searchParams.get("title")?.slice(0, 100) : "My default title";

    const familyname = searchParams.has("familyname") ? searchParams.get("familyname")?.slice(0, 100) : "My default familyname";

    return new ImageResponse(
      (
        <div tw="h-full w-full flex items-start justify-start" style={{ backgroundColor: "#79be64" }}>
          <div tw="flex items-start justify-start h-full">
            <div tw="flex flex-col justify-between w-full h-full p-20">
              <img
                alt="Kinship Logo"
                src={"https://res.cloudinary.com/dfuyisjqi/image/upload/v1689265310/kinship/Logos/kinshipnavbar_ygxchv.png"}
                height={50}
                width={192}
              />
              <h1 tw="text-[60px] text-white font-bold text-left">"{title}"</h1>
              <h2>{familyname}</h2>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 627,
      }
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
