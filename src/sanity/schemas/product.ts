import { NumberRule } from 'sanity'
import { SlugAutoInput } from '../components/SlugAutoInput'
import { CaloriesInput } from '../components/CaloriesInput'

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
    {
      name: 'line',
      title: 'Линейка / марка',
      type: 'reference',
      to: [{ type: 'productLine' }],
      description: 'Объединяет вкусы/вариации одной марки. Соседи по линейке показываются как «Другие варианты» на странице товара.',
    },
    {
      name: 'variantLabel',
      title: 'Вариация (вкус / тип)',
      type: 'string',
      description: 'Короткая подпись вариации, напр. «Вишнёвое», «Апельсиновое», «Обычное».',
    },
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
    {
      name: 'calories',
      title: 'Калорийность (ккал)',
      type: 'number',
      components: { input: CaloriesInput },
    },
    { name: 'protein', title: 'Белки (г)', type: 'number' },
    { name: 'fat', title: 'Жиры (г)', type: 'number' },
    { name: 'carbs', title: 'Углеводы (г)', type: 'number' },
    // только пиво
    {
      name: 'style',
      title: 'Стиль',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'beerStyle' }] }],
      hidden: onlyFor('beer'),
    },
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
    source: 'name',  // ← источник для кнопки Generate
    maxLength: 96,
  },
  components: { input: SlugAutoInput },
}

  ]
}

export default product
