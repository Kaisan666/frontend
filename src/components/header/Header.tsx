"use client";
import React, { useEffect, useState } from "react";
import styles from "./Header.module.scss";
import { navLinks } from "@/app/data/Link";
import "@/styles/components/accentButton.scss";
import Link from "next/link";
import { BurgerMenu } from "../burgerMenu";
import { BookingLink } from "../BookingLink";
import type { SiteSettings } from "@/sanity/lib/getSiteSettings";

// Должно совпадать с $tablet в src/styles/variables.scss
const TABLET_BREAKPOINT = 1024;

type Props = {
  settings: SiteSettings;
};

export const Header = ({ settings }: Props) => {
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
            <BookingLink
              className="accent-button accent-button--compact"
              source="header_mobile"
            >
              Забронировать
            </BookingLink>
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
          <BookingLink className="accent-button" source="header_desktop">
            Забронировать
          </BookingLink>
        )}
      </div>
      <BurgerMenu isOpen={isBurgerOpen} toggleBurger={toggleBurgerMenu} settings={settings} />
    </header>
  );
};
