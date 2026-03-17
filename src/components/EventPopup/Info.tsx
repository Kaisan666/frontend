"use client";
import React, { useState } from 'react'
import { PortableText } from "@portabletext/react"
import Image from "next/image"
import { Background } from '@/components/Background'
import { usePopup } from '@/context/PopupContext'
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


export const eventPopupInfo = ({event, isOpened} : {event: any, isOpened: boolean}) => {
  const {isOpen, setIsOpen} = usePopup()
   
  return (
    <div>
      {isOpen && <div className="popup">
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
        
        </div>
        
        }
      
      <Background isActive={isOpen} onClose={() => setIsOpen(false)}/>

    </div>
    
  )
}
