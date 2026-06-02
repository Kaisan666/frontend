import styles from "./page.module.scss";
import { Hero } from "@/components/IndexPageSections/Hero";
import { WhyUs } from "@/components/IndexPageSections/WhyUs";
import { BeersMenu } from "@/components/IndexPageSections/BeersMenu";
import { FoodMenu } from "@/components/IndexPageSections/FoodMenu";
import { Atmosphere } from "@/components/IndexPageSections/Atmosphere";
import { AboutUs } from "@/components/IndexPageSections/AboutUs";
import { client } from "@/sanity/lib/client";
import { Product } from "@/types/product";
import type { Review } from "@/components/Swipers/reviewsSwiper";

type HomepageData = {
  featuredBeers?: Product[];
  featuredFoods?: Product[];
  gallery?: { url: string; width: number; height: number }[];
};

export default async function Home() {
  const [data, reviews] = await Promise.all([
    client.fetch<HomepageData | null>(`
      *[_type == "homepage"][0]{
        featuredBeers[]->{
          ...,
          "id": _id,
          "imageUrl": image.asset->url,
          "slug": slug.current,
          "style": style[]->title
        },
        featuredFoods[]->{
          ...,
          "id": _id,
          "imageUrl": image.asset->url,
          "slug": slug.current
        },
        "gallery": gallery[]{
          "url": asset->url,
          "width": asset->metadata.dimensions.width,
          "height": asset->metadata.dimensions.height
        }
      }
    `),
    client.fetch<Review[]>(`
      *[_type == "review"] | order(submittedAt desc) [0...20] {
        "id": _id,
        authorName,
        text,
        submittedAt
      }
    `),
  ]);

  return (
    <div className={`${styles["main-page"]}`}>
      <Hero />
      <WhyUs />
      <BeersMenu products={data?.featuredBeers ?? []} />
      <FoodMenu products={data?.featuredFoods ?? []} />
      <Atmosphere images={data?.gallery ?? []} />
      <AboutUs reviews={reviews} />
    </div>
  );
}
