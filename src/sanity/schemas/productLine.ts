import { StringRule } from 'sanity'

// Линейка/марка: объединяет товары-вариации (один бренд, разные вкусы/типы).
// На странице товара соседи по линейке показываются как «Другие варианты».
const productLine = {
  name: 'productLine',
  title: 'Линейка / марка',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Название',
      type: 'string',
      validation: (rule: StringRule) => rule.required().error('Название линейки обязательно'),
    },
    {
      name: 'description',
      title: 'Описание',
      type: 'text',
    },
  ],
  preview: {
    select: { title: 'title' },
  },
}

export default productLine
