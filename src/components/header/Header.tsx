"use client";
import React, { useEffect, useState, useRef } from "react";
import styles from "./Header.module.scss";
import { navLinks } from "@/app/data/Link";
import "@/styles/components/accentButton.scss";
import { Background } from "../Background";
import Link from "next/link";
import { BurgerMenu } from "../burgerMenu";




export const Header = () => {
  const [isBurgerOpen, setIsBurgerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    setIsMobile(window.innerWidth < 1024)
    window.addEventListener(
      "resize",
      () => {
        setIsMobile(window.innerWidth < 1024);
      },
      { signal: signal },
    );
    return () => {
      controller.abort();
    };
  }, []);
  


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
        ) : (
          <Link href="/booking" className="accent-button">Забронировать</Link>
        )}
      </div>
      <BurgerMenu isOpen={isBurgerOpen}></BurgerMenu>
      <Background isActive={isBurgerOpen} onClose={()=> setIsBurgerOpen(false)}></Background>
    </header>
  );
};
