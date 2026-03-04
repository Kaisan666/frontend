"use client";
import React from 'react'
import styles from "./Background.module.scss"
type Props = {
    isActive: boolean,
    onClose: () => void,
}


export const Background = ({isActive = false, onClose}: Props) => {
    if (!isActive) return null

  return (
        <div className={`${styles["background"]} ${isActive ? styles["background--active"]: "" }`} onClick={onClose}></div>
  )
}
