import { ArrayRule } from 'sanity'

const homepage = {
  name: 'homepage',
  title: 'Главная страница',
  type: 'document',
  fields: [
    {
      name: 'featuredBeers',
      title: 'Популярное пиво (главная)',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'product' }],
          options: {
            filter: 'category == "beer"',
          },
        },
      ],
      validation: (rule: ArrayRule<unknown[]>) => rule.max(12),
    },
    {
      name: 'featuredFoods',
      title: 'Популярная кухня (главная)',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'product' }],
          options: {
            filter: 'category == "food"',
          },
        },
      ],
      validation: (rule: ArrayRule<unknown[]>) => rule.max(6),
    },
  ],
  preview: {
    prepare: () => ({ title: 'Главная страница' }),
  },
}

export default homepage
