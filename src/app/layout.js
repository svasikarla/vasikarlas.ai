import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import SiteNav from "@/components/SiteNav";
import CursorGlow from "@/components/CursorGlow";

const inter = Inter({
  variable: "--f-sans-font",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--f-mono-font",
  subsets: ["latin"],
});

export const metadata = {
  title: "Vasikarla · AI — AI Product Engineer",
  description: "AI Product Engineer. Building production AI and full-stack systems for insurance, education, and knowledge platforms.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        {/* Blocking script: reads localStorage before first paint to prevent theme flash */}
        <script suppressHydrationWarning dangerouslySetInnerHTML={{ __html: `
          try {
            var t = localStorage.getItem('vsk.theme');
            if (t === 'light' || t === 'dark') document.documentElement.setAttribute('data-theme', t);
            var h = localStorage.getItem('vsk.accentHue');
            if (h) {
              document.documentElement.style.setProperty('--accent-h', h);
              document.documentElement.style.setProperty('--accent', 'oklch(0.72 0.17 ' + h + ')');
              document.documentElement.style.setProperty('--accent-dim', 'oklch(0.55 0.13 ' + h + ')');
            }
          } catch(e) {}
        `}} />
      </head>
      <body>
        <ThemeProvider>
          <CursorGlow />
          <div className="grid-bg" />
          <SiteNav />
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
