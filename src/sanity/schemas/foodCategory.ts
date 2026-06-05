import { StringRule } from 'sanity'

// Категория/тип еды (закуски, горячее, снеки…). Управляется в Studio, как beerStyle.
// Товар-еда ссылается на неё через поле foodType; используется фильтром каталога.
const foodCategory = {
  name: 'foodCategory',
  title: 'Категория еды',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Название',
      type: 'string',
      validation: (rule: StringRule) => rule.required().error('Название категории обязательно'),
    },
  ],
  preview: {
    select: { title: 'title' },
  },
}

export default foodCategory
