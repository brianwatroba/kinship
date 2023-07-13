import "./globals.css";

export const metadata = {
  title: "Kinship",
  description: "SMS-based daily question game that helps families feel more connected.",
  openGraph: {
    title: "Kinship",
    description: "SMS-based daily question game that helps families feel more connected.",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://res.cloudinary.com/dfuyisjqi/image/upload/v1689265310/kinship/Logos/kinshipnavbar_ygxchv.png",
        width: 300,
        height: 88,
      },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main className="min-h-screen bg-background flex flex-col items-center">{children}</main>
      </body>
    </html>
  );
}
