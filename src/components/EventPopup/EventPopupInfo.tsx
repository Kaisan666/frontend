"use client";
import React, { useState } from 'react'
import { PortableText } from "@portabletext/react"
import Image from "next/image"
import { Background } from '@/components/Background'
import styles from "./EventPopupInfo.module.scss"
const portableTextComponents = {
  types: {
    image: ({ value } : {value: any}) => (
      <Image
        src={value.asset.url}
        alt={value.alt || ""}
        width={800}
        height={500}

      />
    ),
  },
}


export const EventPopupInfo = ({event} : {event: any}) => {
  return (
      <div className={styles['event-info']}>
        <div key={event._id}>
          {event.imageUrl && (
            <Image
              src={event.imageUrl}
              alt={event.title}
              width={800}
              height={400}
              className={styles['event-info__img-preview']}
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
      </div>
        

    
  )
}
