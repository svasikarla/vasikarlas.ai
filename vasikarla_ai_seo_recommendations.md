# SEO, Skill Positioning & OpenGraph Audit Recommendations
**Target URL:** [https://vasikarlas-ai.vercel.app/](https://vasikarlas-ai.vercel.app/)  
**Target Identity:** Satish Vasikarla | Vasikarla · AI  

---

## 1. SEO & Technical Audit Summary

### Strengths
- **Next.js SSR/SSG Framework:** Renders semantic HTML on the server, allowing Googlebot to index content efficiently.
- **Semantic Layout:** Proper structural elements (`<header>`, `<main>`, `<section>`, `<footer>`, `<nav>`) and heading hierarchy.
- **Clean Architecture:** Well-structured routes (`/work`, `/projects`, `/about`, `/work/nlsql-pro`) with strong internal linking.
- **Performance Preloading:** Utilizes resource preloading (`rel=preload`) for static chunks and font assets.

### Critical Gaps & Action Items

| SEO Element | Current State | Target Fix & Impact |
| :--- | :--- | :--- |
| **Meta Description & Open Graph** | Default/sparse Next.js metadata | **High Impact:** Add custom social tags (`og:title`, `og:description`, `og:image`) for proper social preview cards. |
| **Hero Animated `<h1>` Tag** | Dynamic loading spans (`<h1><span></span></h1>`) | **High Impact:** Provide a static server fallback (`<h1>AI Product Engineer \| Satish Vasikarla</h1>`) so crawlers index primary keywords. |
| **Live Metric Counters** | Counter stats display `0` in initial HTML | **Medium Impact:** Hydrate initial server state with true metric defaults rather than zeroed-out client-side hooks. |
| **Structured Data (JSON-LD)** | Missing Schema.org declarations | **Medium Impact:** Add `Person` and `WebSite` JSON-LD schema for Google Knowledge Graph integration. |

---

## 2. Root Layout Metadata Configuration (`src/app/layout.js`)

Full metadata, Open Graph settings, Googlebot directives, and JSON-LD schema injected in `src/app/layout.js`:

```javascript
import type { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://vasikarlas-ai.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Vasikarla · AI | AI Product Engineer',
    template: '%s | Vasikarla · AI',
  },
  description:
    'Design and ship AI-native products across knowledge systems (RAG), NL-to-SQL data interfaces, and multi-agent domain workflows.',
  keywords: [
    'AI Product Engineer',
    'Satish Vasikarla',
    'Vasikarla AI',
    'RAG Pipelines',
    'NL-to-SQL',
    'Next.js AI',
    'TypeScript',
    'LLM Engineering',
    'Multi-Agent Workflows',
    'InsureTech AI',
    'EdTech AI',
  ],
  authors: [{ name: 'Satish Vasikarla', url: SITE_URL }],
  creator: 'Satish Vasikarla',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    title: 'Vasikarla · AI | AI Product Engineer',
    description:
      'Designing and shipping AI-native products, RAG architecture, and production LLM applications.',
    siteName: 'Vasikarla · AI',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Vasikarla · AI — AI Product Engineer Banner',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vasikarla · AI | AI Product Engineer',
    description:
      'Designing and shipping AI-native products, RAG architecture, and production LLM applications.',
    images: ['/opengraph-image'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};
```

---

## 3. Schema.org JSON-LD Component (`src/app/layout.js`)

Inject structured knowledge schema to help search engines connect your portfolio identity with your personal brand:

```javascript
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': `${SITE_URL}/#person`,
      name: 'Satish Vasikarla',
      alternateName: ['Vasikarla AI', 'svasikarla'],
      url: SITE_URL,
      jobTitle: 'AI Product Engineer',
      email: 'vasikarla.satish@outlook.com',
      sameAs: ['https://github.com/svasikarla'],
      knowsAbout: [
        'Artificial Intelligence',
        'Retrieval-Augmented Generation (RAG)',
        'Natural Language to SQL (NL-to-SQL)',
        'Next.js',
        'TypeScript',
        'Full Stack Web Development',
        'Multi-Agent Workflows',
        'InsureTech AI',
        'EdTech AI',
      ],
      worksFor: {
        '@type': 'Organization',
        name: 'Vasikarla AI',
      },
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: 'Vasikarla · AI',
      description:
        'Design and ship AI-native products across knowledge systems (RAG), NL-to-SQL data interfaces, and multi-agent domain workflows.',
      publisher: {
        '@id': `${SITE_URL}/#person`,
      },
    },
  ],
};
```

---

## 4. Dynamic Social Image Generation (`src/app/opengraph-image.js`)

Leverage Next.js `@vercel/og` engine (`next/og`) in `src/app/opengraph-image.js`:

```javascript
import { ImageResponse } from 'next/og';
import { PROFILE } from '@/data/projects';

export const alt = 'Vasikarla · AI — AI Product Engineer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px',
          backgroundColor: '#0c0c11',
          backgroundImage:
            'radial-gradient(1100px 520px at 75% -10%, rgba(139,124,255,0.20), transparent 60%)',
          fontFamily: 'sans-serif',
          color: '#f5f5f7',
        }}
      >
        {/* Banner layout content */}
      </div>
    ),
    { ...size }
  );
}
```

---

## 5. Summary of Skill Positioning Recommendations

1. **Architecture Case Studies:** For projects like `NLSQLPro` and `CorePragyaAdvanced`, add architecture flow diagrams, data pipeline schemas, and benchmark metrics (retrieval accuracy, latency).
2. **Interactive UI Embeds:** Provide interactive sandboxes or embedded live components on detailed case study pages so users can evaluate product performance firsthand.
3. **Avoid Client-Only Counters:** Ensure fallback statistics are present in static builds to maintain search engine trust.
