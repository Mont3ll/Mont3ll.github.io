import { siteConfig } from "@/data/site";

export type SeoProps = {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
};

export function buildSeo(props: SeoProps = {}) {
  const title = props.title
    ? `${props.title} — mont3ll`
    : siteConfig.title;
  const description = props.description ?? siteConfig.description;
  const image = props.image ?? `${siteConfig.url}/og/default.png`;
  const url = props.url ?? siteConfig.url;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      images: [{ url: image }],
      siteName: siteConfig.name,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}
