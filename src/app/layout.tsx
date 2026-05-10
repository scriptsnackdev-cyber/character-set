import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PurrPaw Prophecy — Fortune Character Generator",
  description: "Upload your character and manifest them into a mystical tarot card.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" style={{ scrollBehavior: 'smooth' }}>
      <head>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Quicksand:wght@400;500;600;700&family=Kanit:wght@400;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full m-0 p-0">
        {children}
      </body>
    </html>
  );
}