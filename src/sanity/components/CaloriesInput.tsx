import { useEffect, useMemo } from "react"
import { Stack, Button, Text } from "@sanity/ui"
import { set, useFormValue, type NumberInputProps } from "sanity"

// Калорийность: 1 г углеводов = 4 ккал, жира = 9 ккал, белка = 4 ккал.
const computeKcal = (carbs = 0, fat = 0, protein = 0) =>
  Math.round(carbs * 4 + fat * 9 + protein * 4)

// Авто-расчёт калорий по БЖУ с сохранением возможности вписать своё:
//  - пустое поле автозаполняется, когда заданы все три макронутриента;
//  - вручную введённое значение НЕ перетирается;
//  - кнопка «пересчитать» применяет расчёт по требованию (если БЖУ изменились).
export function CaloriesInput(props: NumberInputProps) {
  const { value, onChange } = props
  const protein = useFormValue(["protein"]) as number | undefined
  const fat = useFormValue(["fat"]) as number | undefined
  const carbs = useFormValue(["carbs"]) as number | undefined

  const someMacros = [protein, fat, carbs].some((v) => typeof v === "number")
  const allMacros = [protein, fat, carbs].every((v) => typeof v === "number")
  const computed = useMemo(
    () => computeKcal(carbs ?? 0, fat ?? 0, protein ?? 0),
    [carbs, fat, protein]
  )

  // Автозаполнение пустого поля, когда БЖУ полностью заданы.
  useEffect(() => {
    if (allMacros && value == null) {
      onChange(set(computed))
    }
  }, [allMacros, computed, value, onChange])

  return (
    <Stack space={3}>
      {props.renderDefault(props)}
      {someMacros && computed !== value && (
        <Button
          mode="ghost"
          tone="primary"
          fontSize={1}
          padding={2}
          text={`Пересчитать по БЖУ: ${computed} ккал`}
          onClick={() => onChange(set(computed))}
        />
      )}
      <Text size={1} muted>
        Считается как Б×4 + Ж×9 + У×4. Можно вписать своё значение.
      </Text>
    </Stack>
  )
}
