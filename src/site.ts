import { defineSiteConfig } from "albasimia-ssg-core/site-meta";

export const site = defineSiteConfig({
  name: "AMANO PROJECT",
  siteUrl: import.meta.env.SITE_URL ?? "http://localhost:4321",
  description: "課題を発見し、構造化し、実装するまでの過程を記録する天野浩平のポートフォリオ。",
  locale: "ja",
  title: {
    default: "AMANO PROJECT",
    separator: " — ",
    position: "suffix",
  },
  openGraph: {
    siteName: "AMANO PROJECT",
    locale: "ja_JP",
    image: "/og.png",
    imageAlt: "AMANO PROJECT — OBSERVE / STRUCTURE / IMPLEMENT & VERIFY",
  },
  twitter: {
    card: "summary_large_image",
    image: "/og.png",
    imageAlt: "AMANO PROJECT — OBSERVE / STRUCTURE / IMPLEMENT & VERIFY",
  },
  favicons: [
    { rel: "icon", href: "/og.png", type: "image/png" },
  ],
  themeColors: [
    { color: "#f4f2ec", media: "(prefers-color-scheme: light)" },
    { color: "#171717", media: "(prefers-color-scheme: dark)" },
  ],
});
