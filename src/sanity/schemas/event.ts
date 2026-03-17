export default {
    name : "event",
    title: "Событие",
    type: "document",
    fields : [
        {
            name : "title",
            title: "Название события",
            type: "string"
        },
        {
      name: "image",
      title: "Обложка",
      type: "image",
      options: { hotspot: true },
    },
    {
      name: "startDate",
      title: "Дата начала",
      type: "datetime",
    },
    {
      name: "endDate",
      title: "Дата окончания",
      type: "datetime",
    },
    {
      name: "isActive",
      title: "Активно (показывать на сайте)",
      type: "boolean",
      initialValue: true,
    },
    {
      name: "body",
      title: "Описание",
      type: "array",
      of: [
        {
          type: "block", // Portable Text — редактор
          styles: [
            { title: "Обычный", value: "normal" },
            { title: "Заголовок", value: "h3" },
          ],
        },
        { type: "image" }, // картинки прямо в тексте
      ],
    },
    ]
}