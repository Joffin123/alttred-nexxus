import { Manrope, Shantell_Sans } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-chakra",
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  display: "swap",
});

// Handwritten accent ("we do"). Stand-in for Figma Hand until its font file is
// added — swap this for next/font/local pointing at that file.
const hand = Shantell_Sans({
  subsets: ["latin"],
  variable: "--font-hand",
  weight: ["800"],
  style: ["italic"],
  display: "swap",
});

export const metadata = {
  title: "Alttred Nexxus | Web Design, Development & Digital Experiences",
  description:
    "ALTTRED NEXXUS is a digital agency specializing in immersive web design, brand development, video production, and performance creatives.",
  alternates: {
  canonical: "https://www.alttrednexxus.com",
},
openGraph: {
  title: "Alttred Nexxus | Web Design, Development & Digital Experiences",
  description:
    "ALTTRED NEXXUS is a digital agency specializing in immersive web design, brand development, video production, and performance creatives.",
  url: "https://www.alttrednexxus.com",
  siteName: "Alttred Nexxus",
  type: "website",
  images: ["/social-preview.png"],
},
verification: {
  google: "-lt8wmrBAeH4hig8vZFMV0nieZqEGvX-gkFyE9Js-iA",
},
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${hand.variable} h-full scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-[#030303] text-white antialiased">
        {children}
      </body>
    </html>
  );
}
