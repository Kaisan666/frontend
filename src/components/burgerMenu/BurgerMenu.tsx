import React from 'react'
import styles from "./BurgerMenu.module.scss"
import Link from "next/link";
import { navLinks } from "@/app/data/Link";

type Props = {
    isOpen: boolean
}

export const BurgerMenu = ({isOpen}: Props) => {
  return (
    <div className={`${styles['burger-menu']} ${isOpen ? styles["burger-menu--active"] : ""}`} >
        <nav className={styles['burger-menu__nav']}>
            <ul className={styles['burger-menu__list']}>
                {navLinks.map(({label, href}) => (
                <li className={styles['burger-menu__list-item']} key={label}>
                    <Link className={styles['burger-menu__list-item-link']} href={href}>{label}</Link>
                    </li>
                ))}
            </ul>
        </nav>
    </div>
  )
}
