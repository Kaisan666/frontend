import { StringRule, DatetimeRule } from 'sanity'

const review = {
  name: 'review',
  title: 'Отзыв',
  type: 'document',
  fields: [
    {
      name: 'authorName',
      title: 'Имя',
      type: 'string',
      validation: (rule: StringRule) =>
        rule.required().min(2).max(60).error('Имя — от 2 до 60 символов'),
    },
    {
      name: 'text',
      title: 'Текст отзыва',
      type: 'text',
      validation: (rule: StringRule) =>
        rule.required().min(10).max(1000).error('Отзыв — от 10 до 1000 символов'),
    },
    {
      name: 'submittedAt',
      title: 'Дата отправки',
      type: 'datetime',
      // Заполняется сервером при создании черновика; в Studio показывается только для справки.
      readOnly: true,
      validation: (rule: DatetimeRule) => rule.required(),
    },
  ],
  orderings: [
    {
      title: 'По дате — новые сверху',
      name: 'submittedAtDesc',
      by: [{ field: 'submittedAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: { title: 'authorName', subtitle: 'text' },
    prepare({ title, subtitle }: { title?: string; subtitle?: string }) {
      return {
        title: title || 'Без имени',
        subtitle: subtitle ? subtitle.slice(0, 80) : '',
      }
    },
  },
}

export default review
