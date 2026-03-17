import { client } from "@/sanity/lib/client"
import { PortableText } from "@portabletext/react"
import Image from "next/image"

// просто переменная с настройками — не компонент
const portableTextComponents = {
  types: {
    image: ({ value }) => (
      <Image
        src={value.asset.url}
        alt={value.alt || ""}
        width={800}
        height={500}
      />
    ),
  },
}

const page = async () => {
  const events = await client.fetch(`*[_type == "event"]{
    _id,
    title,
    startDate,
    "imageUrl": image.asset->url,
    body[]{
      ...,
      _type == "image" => {
        ...,
        "asset": asset->
      }
    }
  }`)

  return (
    <div>
      {events.map((event) => (
        <div key={event._id}>
          {event.imageUrl && (
            <Image
              src={event.imageUrl}
              alt={event.title}
              width={800}
              height={400}
            />
          )}
          <h2>{event.title}</h2>
          {event.body && (
            <PortableText
              value={event.body}
              components={portableTextComponents}
            />
          )}
        </div>
      ))}
    </div>
  )
}

export default page
