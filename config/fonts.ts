import { Fira_Code as FontMono, Inter as FontSans, Ubuntu } from "next/font/google";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const ubuntu = Ubuntu({
  subsets: ["latin"],
  weight: ["700", "400", "300", "500"]
})
