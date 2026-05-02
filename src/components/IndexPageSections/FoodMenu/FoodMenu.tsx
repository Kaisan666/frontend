import React from "react";
import styles from "./FoodMenu.module.scss";
import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { Product } from "@/types/product";

type Props = {
  products: Product[]
}

export const FoodMenu = ({ products }: Props) => {
  if (products.length === 0) return null

  return (
    <section className={`${styles["food-menu"]} container`}>
      <div className="section-header">
        <h2 className={"section-header__title"}>Популярное</h2>
        <Link className="accent-button" href={"/catalog?category=food"}>
          В каталог
        </Link>
      </div>
      <div className="catalog-layout">
        {products.map(product => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            price={product.price}
            category={product.category}
            imageUrl={product.imageUrl}
            quantity={product.quantity}
            unit={product.unit}
            slug={product.slug}
            description={product.description}
          />
        ))}
      </div>
    </section>
  );
};
