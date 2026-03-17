import React from 'react'
import styles from "./BurgerMenu.module.scss"
import Link from "next/link";
import { navLinks } from "@/app/data/Link";
import { FaVk, FaTelegram, FaWhatsapp } from 'react-icons/fa';
import { Phone } from "lucide-react";
import { createPortal } from 'react-dom';

type Props = {
    isOpen: boolean
}


export const BurgerMenu = ({isOpen}: Props) => {
  return (
    createPortal(
        <div className={`${styles['burger-menu']} ${isOpen ? styles["burger-menu--active"] : ""}`} >
        <nav className={styles['burger-menu__nav']}>
            <ul className={styles['burger-menu__list']}>
                <li className={styles['burger-menu__list-item']} >
                    <Link className={styles['burger-menu__list-item-link']} href="/">Главная</Link>
                    </li>
                {navLinks.map(({label, href}) => (
                <li className={styles['burger-menu__list-item']} key={label}>
                    <Link className={styles['burger-menu__list-item-link']} href={href}>{label}</Link>
                    </li>
                ))}
            </ul>
        </nav>
        <div className={styles['burger-menu__footer']}>
            <div className={styles['burger-menu__footer-socials']}>
            <div className={styles['burger-menu__footer-socials-links']}>
                    <Link href="https://vk.com" target="_blank">
            <FaVk size={24} fill="#FAF7EF"/>

          </Link>
          <Link href="https://t.me/shengenplus" target="_blank">
            <FaTelegram size={24} fill="#FAF7EF"/>
          </Link>
          <Link
            href="https://api.whatsapp.com/send/?phone=79181869600&text=%D0%97%D0%B4%D1%80%D0%B0%D0%B2%D1%81%D1%82%D0%B2%D1%83%D0%B9%D1%82%D0%B5%21%0A%0A%D0%9F%D0%B8%D1%88%D1%83+%D0%B8%D0%B7+%D0%BF%D1%80%D0%B8%D0%BB%D0%BE%D0%B6%D0%B5%D0%BD%D0%B8%D1%8F+2%D0%93%D0%98%D0%A1.%0A%0A&type=phone_number&app_absent=0"
            target="_blank"
          >
            <FaWhatsapp size={24} fill="#FAF7EF"/>
          </Link>
            </div>

          <div className={styles['burger-menu__footer-phone']}>
<Phone size={24} strokeWidth={2} />
                <p>+7 (918) 186-96-00</p>
            </div>
            </div>
            
        </div>
    </div>, document.body
    )
  )
}
