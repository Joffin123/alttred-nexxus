import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-chakra",
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata = {
  title: "ALTTRED NEXXUS | We Make Experience For The New Mainstream",
  description:
    "ALTTRED NEXXUS is a digital agency specializing in immersive web design, brand development, video production, and performance creatives.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} h-full scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-[#030303] text-white antialiased">
        {children}
      </body>
    </html>
  );
}
