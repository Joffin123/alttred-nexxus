import { Chakra_Petch } from "next/font/google";
import "./globals.css";

const chakraPetch = Chakra_Petch({
  subsets: ["latin"],
  variable: "--font-chakra",
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata = {
  title: "ALTTRED NEXXUS | We Make Experience For The New Mainstream",
  description:
    "ALTTRED NEXXUS is a digital agency specializing in immersive web design, brand development, video production, and performance creatives.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${chakraPetch.variable} h-full scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-[#030303] text-white antialiased">
        {children}
      </body>
    </html>
  );
}
