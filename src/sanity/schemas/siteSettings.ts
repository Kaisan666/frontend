import { StringRule } from "sanity"

const siteSettings = {
  name: "siteSettings",
  title: "Настройки сайта",
  type: "document",
  fields: [
    {
      name: "address",
      title: "Адрес",
      type: "string",
      description: "Например: г. Краснодар, ул. Им. Яцкова, 17 к1",
      validation: (rule: StringRule) => rule.required().min(5),
    },
    {
      name: "workingHours",
      title: "Часы работы",
      type: "object",
      fields: [
        {
          name: "weekdays",
          title: "Будни",
          type: "string",
          description: "Например: Пн–Пт: 14:00 – 23:00",
        },
        {
          name: "weekends",
          title: "Выходные",
          type: "string",
          description: "Например: Сб–Вс: 11:00 – 23:00",
        },
      ],
    },
    {
      name: "phone",
      title: "Телефон (как показывать)",
      type: "string",
      description: "Например: +7 (918) 186-96-00",
      validation: (rule: StringRule) => rule.required(),
    },
    {
      name: "socials",
      title: "Социальные сети",
      type: "object",
      fields: [
        { name: "vk", title: "ВКонтакте URL", type: "url" },
        { name: "telegram", title: "Telegram URL", type: "url" },
        { name: "whatsapp", title: "WhatsApp URL", type: "url" },
      ],
    },
    {
      name: "maps",
      title: "Ссылки на карты",
      type: "object",
      fields: [
        { name: "yandex", title: "Яндекс.Карты URL", type: "url" },
        { name: "twoGis", title: "2ГИС URL", type: "url" },
        { name: "google", title: "Google Maps URL (опционально)", type: "url" },
      ],
    },
  ],
  preview: {
    prepare: () => ({ title: "Настройки сайта" }),
  },
}

export default siteSettings
