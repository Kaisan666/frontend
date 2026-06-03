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

    // Блокируем скролл страницы, пока попап открыт. Иначе фон скроллится под
    // модалкой, а hide-on-scroll в хедере дёргает шапку. documentElement — как
    // у бургер-меню в Header.tsx, чтобы лок был консистентным.
    useEffect(() => {
        if (!isOpen) return
        document.documentElement.style.overflow = "hidden"
        return () => {
            document.documentElement.style.overflow = ""
        }
    }, [isOpen])

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