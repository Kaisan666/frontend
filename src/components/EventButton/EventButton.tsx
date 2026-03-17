"use client";
import React from 'react'
import { usePopup } from '@/app/context/PopupContext'


const EventButton = () => {
const {setIsOpen} = usePopup()

  return (
    <button style={{position: "fixed", bottom: "10px", left: "80%"}} onClick={() => {
        setIsOpen(true)
        console.log("clicked")
    }}>нажми</button>

  )
}

export default EventButton