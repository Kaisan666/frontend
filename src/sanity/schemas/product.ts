import { NumberRule } from 'sanity'

type HiddenContext = { document?: { category?: string } }
const onlyFor = (cat: 'beer' | 'food') =>
  ({ document }: HiddenContext) => document?.category !== cat

const product = {
  name: 'product',
  title: 'Товар',
  type: 'document',
  fields: [
    {
      name: 'category',
      title: 'Категория',
      type: 'string',
      options: {
        list: [
          { title: 'Пиво', value: 'beer' },
          { title: 'Еда', value: 'food' },
          { title: 'Остальное', value: 'other' },
        ]
      }
    },
    { name: 'name', title: 'Название', type: 'string' },
    { name: 'price', title: 'Цена', type: 'number' },
    { name: 'image', title: 'Фото', type: 'image', options: {
    accept: 'image/*'   // только картинки
  } },
    { name: 'description', title: 'Описание', type: 'text' },
    { name: 'quantity', title: 'Количество', type: 'number' },
    {
      name: 'unit',
      title: 'Единица измерения',
      type: 'string',
      options: {
        list: [
          { title: 'мл', value: 'мл' },
          { title: 'гр', value: 'гр' },
          { title: 'шт', value: 'шт' },
        ]
      }
    },
    // только еда
    { name: 'ingredients', title: 'Состав', type: 'text', hidden: onlyFor('food') },
    // питательная ценность
    { name: 'calories', title: 'Калорийность (ккал)', type: 'number' },
    { name: 'protein', title: 'Белки (г)', type: 'number' },
    { name: 'fat', title: 'Жиры (г)', type: 'number' },
    { name: 'carbs', title: 'Углеводы (г)', type: 'number' },
    // только пиво
    { name: 'style', title: 'Стиль', type: 'string', hidden: onlyFor('beer') },
    { name: 'country', title: 'Страна', type: 'string', hidden: onlyFor('beer') },
    { name: 'abv', title: 'Крепость (ABV)', type: 'number', hidden: onlyFor('beer') },
    { name: 'ibu', title: 'Горечь (IBU)', type: 'number', hidden: onlyFor('beer') },
    { name: 'pl', title: 'Плотность (°P)', type: 'number', hidden: onlyFor('beer'), validation: (rule: NumberRule) => [
      rule.min(0).error('Плотность не может быть меньше 0°P'),
      rule.max(30).error('Плотность не может быть больше 30°P'),
    ] },
    {
  name: 'slug',
  title: 'Slug',
  type: 'slug',
  options: {
    source: 'name',  // ← автогенерация из названия товара
    maxLength: 96,
  }
}

  ]
}

export default product
