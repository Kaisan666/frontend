export default {
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
    { name: 'image', title: 'Фото', type: 'image' },
    { name: 'description', title: 'Описание', type: 'text' },
    { name: 'quantity', title: 'Количество', type: 'number' },
    {
      name: 'unit',
      title: 'Единица измерения',
      type: 'string',
      options: {
        list: [
          { title: 'мл', value: 'ml' },
          { title: 'г', value: 'g' },
          { title: 'шт', value: 'pcs' },
        ]
      }
    },
    // только пиво
    { name: 'style', title: 'Стиль', type: 'string', hidden: ({ document }: any) => document?.category !== 'beer' },
    { name: 'country', title: 'Страна', type: 'string', hidden: ({ document }: any) => document?.category !== 'beer' },
    { name: 'abv', title: 'Крепость (ABV)', type: 'number', hidden: ({ document }: any) => document?.category !== 'beer' },
    { name: 'ibu', title: 'Горечь (IBU)', type: 'number', hidden: ({ document }: any) => document?.category !== 'beer' },
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
