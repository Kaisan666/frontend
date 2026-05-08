import { notFound } from "next/navigation"

// Catch-all для несуществующих URL внутри (main).
// Конкретные маршруты (например /catalog, /products/[slug]) перехватываются
// раньше, потому что они более специфичные. Сюда попадает только то,
// что не сматчилось ни одним другим путём — и мы явно показываем 404.
export default function CatchAll() {
  notFound()
}
