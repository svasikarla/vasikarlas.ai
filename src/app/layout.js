import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--f-sans-font",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--f-mono-font",
  subsets: ["latin"],
});

export const metadata = {
  title: "Vasikarla · AI — Projects",
  description: "Productive apps with AI. Seventeen repositories, fourteen production deployments.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
