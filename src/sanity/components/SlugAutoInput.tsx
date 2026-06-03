import { useEffect, useRef } from "react"
import { set, useFormValue, type SlugInputProps } from "sanity"
import { slugify } from "../lib/slugify"

// Авто-генерация slug из названия с дебаунсом 5 секунд.
// - на монтировании не трогаем сохранённый slug;
// - синхроним, пока пользователь не отредактировал slug руками
//   (тогда auto замолкает — кастомное значение сохраняется);
// - стандартный slug-инпут остаётся (renderDefault) — кнопка Generate и ручной ввод доступны.
export function SlugAutoInput(props: SlugInputProps) {
  const { value, onChange } = props
  const name = useFormValue(["name"]) as string | undefined

  const valueRef = useRef(value)
  const lastAuto = useRef<string | undefined>(value?.current)
  const mounted = useRef(false)

  // Держим ref с актуальным value (не пишем в ref во время рендера).
  useEffect(() => {
    valueRef.current = value
  })

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true
      return
    }
    if (typeof name !== "string" || !name.trim()) return

    const id = setTimeout(() => {
      const next = slugify(name)
      const current = valueRef.current?.current
      // только если slug пустой или не расходится с прошлым авто-значением
      if (!current || current === lastAuto.current) {
        if (current !== next) {
          onChange(set({ _type: "slug", current: next }))
        }
        lastAuto.current = next
      }
    }, 5000)

    return () => clearTimeout(id)
  }, [name, onChange])

  return props.renderDefault(props)
}
