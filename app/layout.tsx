import "./globals.css";

export const metadata = {
  title: "Kinship",
  description: "SMS-based daily question game that helps families feel more connected.",
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
