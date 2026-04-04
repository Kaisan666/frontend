"use client"

import { createContext, useContext, useState } from "react"

type PopupContextType = {
  isOpen: boolean
  setIsOpen: (value: boolean) => void
}

const PopupContext = createContext<PopupContextType | null>(null)

export const PopupProvider = ({ children } : {children: React.ReactNode}) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <PopupContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </PopupContext.Provider>
  )
}

export const usePopup = () => useContext(PopupContext)
