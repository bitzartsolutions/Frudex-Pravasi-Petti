import type { Metadata, Viewport } from "next";
import { Epilogue, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const epilogue = Epilogue({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-epilogue",
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plus-jakarta-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Frudex Pravasi Petti | Build Your Perfect Petti",
  description:
    "Build your Frudex Pravasi Petti with dates, nuts, dry fruits, chocolates and more. Choose your favourites and order easily through WhatsApp.",
  openGraph: {
    title: "Frudex Pravasi Petti | Build Your Perfect Petti",
    description:
      "Build your Frudex Pravasi Petti with dates, nuts, dry fruits, chocolates and more. Choose your favourites and order easily through WhatsApp.",
    type: "website",
    siteName: "Frudex Pravasi Petti",
  },
};

export const viewport: Viewport = {
  themeColor: "#073b32",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`h-full ${epilogue.variable} ${plusJakartaSans.variable}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body className="bg-background font-body-md text-on-surface antialiased min-h-screen flex flex-col selection:bg-secondary-fixed selection:text-on-secondary-fixed">
        {children}
      </body>
    </html>
  );
}
