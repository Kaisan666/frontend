import { StringRule } from 'sanity'

const beerStyle = {
  name: 'beerStyle',
  title: 'Стиль пива',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Название',
      type: 'string',
      validation: (rule: StringRule) => rule.required().error('Название стиля обязательно'),
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

export default beerStyle
