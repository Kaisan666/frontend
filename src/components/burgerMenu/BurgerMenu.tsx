"use client"
import React, { useSyncExternalStore } from "react"
import styles from "./BurgerMenu.module.scss"
import Link from "next/link"
import { navLinks } from "@/app/data/Link"
import { FaVk, FaTelegram, FaWhatsapp } from "react-icons/fa"
import { Phone } from "lucide-react"
import { createPortal } from "react-dom"
import type { SiteSettings } from "@/sanity/lib/getSiteSettings"

type Props = {
  isOpen: boolean
  toggleBurger: () => void
  settings: SiteSettings
}

const subscribeNoop = () => () => {}
const getClient = () => true
const getServer = () => false

export const BurgerMenu = ({ isOpen, toggleBurger, settings }: Props) => {
  const isClient = useSyncExternalStore(subscribeNoop, getClient, getServer)
  if (!isClient) {
    return null
  }

  const { phone, socials } = settings

  return createPortal(
    <div className={`${styles["burger-menu"]} ${isOpen ? styles["burger-menu--active"] : ""}`}>
      <nav className={styles["burger-menu__nav"]}>
        <ul className={styles["burger-menu__list"]}>
          <li className={styles["burger-menu__list-item"]}>
            <Link onClick={toggleBurger} className={styles["burger-menu__list-item-link"]} href="/">
              Главная
            </Link>
          </li>
          {navLinks.map(({ label, href }) => (
            <li className={styles["burger-menu__list-item"]} key={label}>
              <Link onClick={toggleBurger} className={styles["burger-menu__list-item-link"]} href={href}>
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className={styles["burger-menu__footer"]}>
        <div className={styles["burger-menu__footer-socials"]}>
          <div className={styles["burger-menu__footer-socials-links"]}>
            {socials?.vk && (
              <Link href={socials.vk} target="_blank" rel="noopener noreferrer" aria-label="ВКонтакте">
                <FaVk size={24} fill="#FAF7EF" />
              </Link>
            )}
            {socials?.telegram && (
              <Link href={socials.telegram} target="_blank" rel="noopener noreferrer" aria-label="Telegram">
                <FaTelegram size={24} fill="#FAF7EF" />
              </Link>
            )}
            {socials?.whatsapp && (
              <Link href={socials.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                <FaWhatsapp size={24} fill="#FAF7EF" />
              </Link>
            )}
          </div>

          {phone && (
            <div className={styles["burger-menu__footer-phone"]}>
              <Phone size={24} strokeWidth={2} />
              <p>{phone}</p>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  )
}
