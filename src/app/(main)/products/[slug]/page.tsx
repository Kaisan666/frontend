import React, { cache } from "react";
import type { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { Product } from "@/types/product";
import { ProductCard } from "@/components/ProductCard";
import { notFound } from "next/navigation";
import styles from "./page.module.scss";
import Link from "next/link";
import ProductMetric from "@/app/modules/ProductMetric";

type PageProps = {
  params: Promise<{ slug: string }>;
};

// Один fetch на товар, замемоизирован через React `cache()` — и `generateMetadata`,
// и сам компонент дёргают его, но реальный запрос к Sanity уходит один раз.
const getProduct = cache(async (slug: string): Promise<Product | null> => {
  return client.fetch<Product | null>(
    `*[_type == "product" && slug.current == $slug][0]{
      ...,
      "imageUrl": image.asset->url,
      "style": style[]->title
    }`,
    { slug },
  );
});

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return { title: "Товар не найден" };
  }

  const isBeer = product.category === "beer";
  const subtitle = isBeer
    ? [product.style?.join(", "), product.country].filter(Boolean).join(" · ")
    : null;

  const descParts = [
    product.description,
    subtitle,
    `${product.price}₽`,
  ].filter(Boolean);

  return {
    title: product.name,
    description: descParts.join(" — "),
    openGraph: {
      title: product.name,
      description: descParts.join(" — "),
      images: product.imageUrl ? [{ url: product.imageUrl }] : undefined,
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const isBeer = product.category === "beer";

  const similarProducts: Product[] = await client.fetch(
    `*[_type == "product" && slug.current != $slug && (count(style[@->title in $styles]) > 0 || category == $category)][0...4]{
      ...,
      "id": _id,
      "imageUrl": image.asset->url,
      "slug": slug.current,
      "style": style[]->title
    }`,
    {
      slug,
      styles: product.style ?? [],
      category: product.category,
    },
  );

  return (
    <>
    <div className={`${styles["product-detail"]} container`}>
      <Link href="/catalog" className={styles["product-detail__back"]}>
        &larr; Назад в каталог
      </Link>

      <div className={styles["product-detail__content"]}>
        <div className={styles["product-detail__media"]}>
          {/* next/image с fill ломает flex-центровку, а с явными width/height нужны размеры из Sanity. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.imageUrl}
            alt={product.name}
            className={styles["product-detail__media-img"]}
          />
        </div>

        <div className={styles["product-detail__info"]}>
          <h1 className={styles["product-detail__name"]}>{product.name}</h1>

          {isBeer && (!!product.style?.length || product.country) && (
            <p className={styles["product-detail__subtitle"]}>
              {product.style?.join(", ")}
              {!!product.style?.length && product.country && " · "}
              {product.country && (
                <Link href={`/catalog?country=${product.country}`}>
                  {product.country}
                </Link>
              )}
            </p>
          )}

          {isBeer && (
            <div className={styles["product-detail__specs"]}>
              {product.abv != null && (
                <div className={styles["product-detail__spec"]}>
                  <span className={styles["product-detail__spec-label"]}>
                    Крепость (ABV)
                  </span>
                  <span className={styles["product-detail__spec-value"]}>
                    {product.abv}%
                  </span>
                </div>
              )}
              {product.ibu != null && (
                <div className={styles["product-detail__spec"]}>
                  <span className={styles["product-detail__spec-label"]}>
                    Горечь (IBU)
                  </span>
                  <span className={styles["product-detail__spec-value"]}>
                    {product.ibu}
                  </span>
                </div>
              )}
              {product.pl != null && (
                <div className={styles["product-detail__spec"]}>
                  <span className={styles["product-detail__spec-label"]}>
                    Плотность (PL)
                  </span>
                  <span className={styles["product-detail__spec-value"]}>
                    {product.pl}
                  </span>
                </div>
              )}
              {product.quantity != null && product.unit && (
                <div className={styles["product-detail__spec"]}>
                  <span className={styles["product-detail__spec-label"]}>
                    Объём
                  </span>
                  <span className={styles["product-detail__spec-value"]}>
                    {product.quantity} {product.unit}
                  </span>
                </div>
              )}
            </div>
          )}

          {!isBeer && product.quantity != null && product.unit && (
            <p className={styles["product-detail__volume"]}>
              {product.quantity} {product.unit}
            </p>
          )}

          <p className={styles["product-detail__price"]}>
            {product.price} ₽
          </p>

          {product.description && (
            <div className={styles["product-detail__block"]}>
              <h2 className={styles["product-detail__block-title"]}>Описание</h2>
              <p className={styles["product-detail__block-text"]}>{product.description}</p>
            </div>
          )}

          {product.ingredients && (
            <div className={styles["product-detail__block"]}>
              <h2 className={styles["product-detail__block-title"]}>Состав</h2>
              <p className={styles["product-detail__block-text"]}>{product.ingredients}</p>
            </div>
          )}

          {/* БЖУ скрыто намеренно: доставки нет, по закону указывать не обязательно.
              Чтобы вернуть — раскомментировать блок ниже.
          {(product.calories != null || product.protein != null || product.fat != null || product.carbs != null) && (
            <div className={styles["product-detail__specs"]}>
              {product.calories != null && (
                <div className={styles["product-detail__spec"]}>
                  <span className={styles["product-detail__spec-label"]}>Калорийность</span>
                  <span className={styles["product-detail__spec-value"]}>{product.calories} ккал</span>
                </div>
              )}
              {product.protein != null && (
                <div className={styles["product-detail__spec"]}>
                  <span className={styles["product-detail__spec-label"]}>Белки</span>
                  <span className={styles["product-detail__spec-value"]}>{product.protein} г</span>
                </div>
              )}
              {product.fat != null && (
                <div className={styles["product-detail__spec"]}>
                  <span className={styles["product-detail__spec-label"]}>Жиры</span>
                  <span className={styles["product-detail__spec-value"]}>{product.fat} г</span>
                </div>
              )}
              {product.carbs != null && (
                <div className={styles["product-detail__spec"]}>
                  <span className={styles["product-detail__spec-label"]}>Углеводы</span>
                  <span className={styles["product-detail__spec-value"]}>{product.carbs} г</span>
                </div>
              )}
            </div>
          )}
          */}
        </div>
      </div>

      {similarProducts.length > 0 && (
        <section className={styles["product-detail__similar"]}>
          <div className="section-header">
            <h2 className="section-header__title">Похожие товары</h2>
          </div>
          <div className="catalog-layout">
            {similarProducts.map((p) => (
              <ProductCard
                key={p.id}
                id={p.id}
                name={p.name}
                price={p.price}
                category={p.category}
                imageUrl={p.imageUrl}
                country={p.country}
                unit={p.unit}
                quantity={p.quantity}
                slug={p.slug}
              />
            ))}
          </div>
        </section>
      )}
    </div>
    <ProductMetric name={product.name} category={product.category} price={product.price}/>
    </>
  );
}
