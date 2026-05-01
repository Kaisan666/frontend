"use client"
import { usePopup } from '@/app/context/PopupContext'
import React, { useEffect } from 'react'
import { Background } from '@/components/Background/Background'
import styles from "./Popup.module.scss"

const Popup = ({ children }: { children: React.ReactNode }) => {
    const { isOpen, setIsOpen } = usePopup()!

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsOpen(false)
        }
        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [setIsOpen])

    if (!isOpen) return null

    return (
        <>
            <Background isActive={isOpen} onClose={() => setIsOpen(false)} />
            <div className={styles['popup']}>
                <button
                    className={styles['popup__close']}
                    onClick={() => setIsOpen(false)}
                    aria-label="Закрыть"
                >
                    ×
                </button>
                {children}
            </div>
        </>
    )
}

export default Popup