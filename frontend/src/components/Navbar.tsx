"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/catalog" },
    { name: "Track Repair", path: "/token" },
    { name: "About Us", path: "/about" },
  ];

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <span>The Lotus Infosys</span>
        </Link>

        <nav className={styles.nav}>
          <ul className={styles.menuList}>
            {navLinks.map((link) => {
              const isActive = pathname === link.path;
              return (
                <li key={link.path}>
                  <Link
                    href={link.path}
                    className={`${styles.menuLink} ${
                      isActive ? styles.activeLink : ""
                    }`}
                  >
                    {link.name}
                  </Link>
                </li>
              );
            })}
          </ul>

          <Link href="/#quick-action" className={styles.ctaBtn}>
            File Ticket
          </Link>
        </nav>
      </div>
    </header>
  );
}
