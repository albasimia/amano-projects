import { defineSiteConfig } from "albasimia-ssg-core/site-meta";

export const site = defineSiteConfig({
  name: "アマノPROJECTS",
  siteUrl: import.meta.env.SITE_URL ?? "http://localhost:4321",
  description: "課題を発見し、構造化し、実装するまでの過程を記録する天野浩平のポートフォリオ。",
  locale: "ja",
  title: {
    default: "アマノPROJECTS",
    separator: " | ",
    position: "suffix",
  },
  openGraph: {
    siteName: "アマノPROJECTS",
    locale: "ja_JP",
    image: "/og.png",
    imageAlt: "アマノ PROJECTS",
  },
  twitter: {
    card: "summary_large_image",
    image: "/og.png",
    imageAlt: "アマノ PROJECTS",
  },
  favicons: [
    { rel: "icon", href: "/favicon.png", type: "image/png" },
  ],
  themeColors: [
    { color: "#f4f2ec" },
  ],
});
