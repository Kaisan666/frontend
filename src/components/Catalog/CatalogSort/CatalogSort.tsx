"use client"
import * as Select from "@radix-ui/react-select"
import { Check, ChevronDown } from "lucide-react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import styles from "./CatalogSort.module.scss"

// Сортировка живёт в URL (?sort=...), как и фильтры — шарится ссылкой,
// переживает перезагрузку, читается на сервере в catalog/page.tsx.
//
// Radix Select не допускает value="" у Item, поэтому дефолт держим под
// служебным значением DEFAULT, а в URL для него просто убираем параметр.
const DEFAULT = "default"

const OPTIONS = [
  { value: DEFAULT, label: "По умолчанию" },
  { value: "popular", label: "Сначала популярные" },
  { value: "price_asc", label: "Сначала дешёвые" },
  { value: "price_desc", label: "Сначала дорогие" },
  { value: "name_asc", label: "Название: А–Я" },
  { value: "name_desc", label: "Название: Я–А" },
]

export const CatalogSort = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const current = searchParams.get("sort") ?? DEFAULT

  const onValueChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== DEFAULT) {
      params.set("sort", value)
    } else {
      params.delete("sort")
    }
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className={styles["sort"]}>
      <span className={styles["sort__label"]}>Сортировка</span>

      <Select.Root value={current} onValueChange={onValueChange}>
        <Select.Trigger className={styles["trigger"]} aria-label="Сортировка">
          <Select.Value />
          <Select.Icon className={styles["trigger__icon"]}>
            <ChevronDown size={16} strokeWidth={2} />
          </Select.Icon>
        </Select.Trigger>

        <Select.Portal>
          <Select.Content
            className={styles["content"]}
            position="popper"
            sideOffset={6}
          >
            <Select.Viewport className={styles["viewport"]}>
              {OPTIONS.map(o => (
                <Select.Item
                  key={o.value}
                  value={o.value}
                  className={styles["item"]}
                >
                  <Select.ItemText>{o.label}</Select.ItemText>
                  <Select.ItemIndicator className={styles["item__indicator"]}>
                    <Check size={15} strokeWidth={2.5} />
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  )
}
