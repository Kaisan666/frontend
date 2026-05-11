import styles from "./page.module.scss";
import { Hero } from "@/components/IndexPageSections/Hero";
import { BeersMenu } from "@/components/IndexPageSections/BeersMenu";
import { FoodMenu } from "@/components/IndexPageSections/FoodMenu";
import { AboutUs } from "@/components/IndexPageSections/AboutUs";
import { client } from "@/sanity/lib/client";
import { Product } from "@/types/product";

type HomepageData = {
  featuredBeers?: Product[];
  featuredFoods?: Product[];
};

export default async function Home() {
  const data = await client.fetch<HomepageData | null>(`
    *[_type == "homepage"][0]{
      featuredBeers[]->{
        ...,
        "id": _id,
        "imageUrl": image.asset->url,
        "slug": slug.current
      },
      featuredFoods[]->{
        ...,
        "id": _id,
        "imageUrl": image.asset->url,
        "slug": slug.current
      }
    }
  `);

  return (
    <div className={`${styles["main-page"]}`}>
      <Hero />
      <BeersMenu products={data?.featuredBeers ?? []} />
      <FoodMenu products={data?.featuredFoods ?? []} />
      <AboutUs />
    </div>
  );
}
