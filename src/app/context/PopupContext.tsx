"use client"

import { createContext, useContext, useState } from "react"

const PopupContext = createContext(null)

export const PopupProvider = ({ children } : {children: React.ReactNode}) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <PopupContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </PopupContext.Provider>
  )
}

export const usePopup = () => useContext(PopupContext)
