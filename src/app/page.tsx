import Image from "next/image";
import styles from "./page.module.scss"
import { ProductCard } from "@/components/ProductCard";
import { Hero } from "@/components/IndexPageSections/Hero";
import { BeersMenu } from "@/components/IndexPageSections/BeersMenu";
import {FoodMenu} from "@/components/IndexPageSections/FoodMenu";
export default function Home() {
  return (
     <div className="main-page">
      <Hero/>
        <section className={styles["galery"]}></section>
        <BeersMenu></BeersMenu>
        <FoodMenu/>
        <section className={styles[""]}></section>
        {/* <ProductCard id={1} name="Пиво" price={1200} country="De" imgUrl="/images/123.jpg" measurementUnit="Мл" volume={300}></ProductCard> */}
     </div>
  );
}
