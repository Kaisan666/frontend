"use client";
import React, { useEffect, useState } from "react";
import styles from "./Header.module.scss";
import { navLinks } from "@/app/data/Link";
import "@/styles/components/accentButton.scss";
import Link from "next/link";
import { BurgerMenu } from "../burgerMenu";

// Должно совпадать с $tablet в src/styles/variables.scss
const TABLET_BREAKPOINT = 1024;

export const Header = () => {
  const [isBurgerOpen, setIsBurgerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    setIsMobile(window.innerWidth < TABLET_BREAKPOINT);
    window.addEventListener(
      "resize",
      () => {
        setIsMobile(window.innerWidth < TABLET_BREAKPOINT);
      },
      { signal: signal },
    );
    document.documentElement.style.overflow = isBurgerOpen ? 'hidden' : '';
    return () => {
      controller.abort();
    };
  }, [isBurgerOpen]);
  


  const toggleBurgerMenu = () => {
    setIsBurgerOpen(!isBurgerOpen)
  }

  return (
    <header className={`${styles["header"]} container`}>
      <div className={styles["header__inner"]}>
        <Link href="/" className="accent-button">
          Лого
        </Link>

        {isMobile ? null : (
          <nav className={styles["header__pages"]}>
            <ul className={styles["header__pages-list"]}>
              {navLinks.map(({label, href}) => (
              <li className={styles["header__pages-list-item"]} key={label}>
                <Link className={styles['header__pages-link']} href={href}>{label}</Link> </li>

              ))}
            </ul>
          </nav>
        )}

        {isMobile ? (
          <div className={styles['header__mobile-actions']}>
            <a
              href="https://taplink.cc/shengenplus"
              target="_blank"
              rel="noopener noreferrer"
              className="accent-button accent-button--compact"
            >
              Забронировать
            </a>
            <button
              className={`${styles['header__burger-btn']} ${isBurgerOpen ? styles['header__burger-btn--active'] : ""}`}
              onClick={() => {
                toggleBurgerMenu();
              }}
            >
              <div></div>
              <div></div>
              <div></div>
            </button>
          </div>
        ) : (
          <a href="https://taplink.cc/shengenplus" target="_blank" rel="noopener noreferrer" className="accent-button">Забронировать</a>
        )}
      </div>
      <BurgerMenu isOpen={isBurgerOpen} toggleBurger={toggleBurgerMenu}></BurgerMenu>
    </header>
  );
};
