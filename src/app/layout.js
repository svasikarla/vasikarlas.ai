import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import SiteNav from "@/components/SiteNav";
import VectorConstellation from "@/components/VectorConstellation";
import ScrollProgress from "@/components/ScrollProgress";

const inter = Inter({
  variable: "--f-sans-font",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--f-mono-font",
  subsets: ["latin"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://vasikarlas-ai.vercel.app";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Vasikarla · AI | AI Product Engineer",
    template: "%s | Vasikarla · AI",
  },
  description:
    "Design and ship AI-native products across knowledge systems (RAG), NL-to-SQL data interfaces, and multi-agent domain workflows.",
  keywords: [
    "AI Product Engineer",
    "Satish Vasikarla",
    "Vasikarla AI",
    "RAG Pipelines",
    "NL-to-SQL",
    "Next.js AI",
    "TypeScript",
    "LLM Engineering",
    "Multi-Agent Workflows",
    "InsureTech AI",
    "EdTech AI",
  ],
  authors: [{ name: "Satish Vasikarla", url: SITE_URL }],
  creator: "Satish Vasikarla",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    title: "Vasikarla · AI | AI Product Engineer",
    description:
      "Designing and shipping AI-native products, RAG architecture, and production LLM applications.",
    siteName: "Vasikarla · AI",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Vasikarla · AI — AI Product Engineer Banner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vasikarla · AI | AI Product Engineer",
    description:
      "Designing and shipping AI-native products, RAG architecture, and production LLM applications.",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${SITE_URL}/#person`,
        name: "Satish Vasikarla",
        alternateName: ["Vasikarla AI", "svasikarla"],
        url: SITE_URL,
        jobTitle: "AI Product Engineer",
        email: "vasikarla.satish@outlook.com",
        sameAs: ["https://github.com/svasikarla"],
        knowsAbout: [
          "Artificial Intelligence",
          "Retrieval-Augmented Generation (RAG)",
          "Natural Language to SQL (NL-to-SQL)",
          "Next.js",
          "TypeScript",
          "Full Stack Web Development",
          "Multi-Agent Workflows",
          "InsureTech AI",
          "EdTech AI",
        ],
        worksFor: {
          "@type": "Organization",
          name: "Vasikarla AI",
        },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: "Vasikarla · AI",
        description:
          "Design and ship AI-native products across knowledge systems (RAG), NL-to-SQL data interfaces, and multi-agent domain workflows.",
        publisher: {
          "@id": `${SITE_URL}/#person`,
        },
      },
    ],
  };

  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        {/* Schema.org Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
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
          <VectorConstellation />
          <ScrollProgress />
          <div className="grid-bg" />
          <SiteNav />
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
