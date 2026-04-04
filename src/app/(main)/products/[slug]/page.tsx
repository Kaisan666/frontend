import React from "react";
import { client } from "@/sanity/lib/client";
import { Product } from "@/types/product";
type PageProps = {
  params: Promise<{ slug: string }>;
};
import styles from "./page.module.scss";
import Link from "next/link";
export default async function ProductPage({ params }: PageProps) {
  console.log(await params);
  const { slug } = await params;
  console.log(slug);
  const product: Product = await client.fetch(
    `*[_type == "product" && slug.current == $slug][0]{
        ...,
        "imageUrl": image.asset->url,
  }`,
    { slug },
  );
  console.log(product);

  return (
    <div className={styles["product-detail"]}>
      <div className={styles["product-detail__content"]}>
        <div className={styles["product-detail__media"]}>
          <img src={product.imageUrl} alt={product.slug} />
        </div>
        <div className={styles["product-detail__info"]}>
            <div className={styles['product-detail__info-header']}>
                <h2 className={styles['product-detail__info-name']}>
                    {product.name}
                </h2>
                {product.country && (
                    <Link href={`/catalog?country=${product.country}`}  className={styles['product-detail__info-country']}>
                    {product.country}
                </Link>
                )}
                {product.price && (
                    <p className={styles['product-detail__info-price']}>
                    {product.price}
                </p>
                )}
            </div>

        </div>
      </div>
    </div>
  );
}
