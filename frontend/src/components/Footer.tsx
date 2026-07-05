import React from "react";
import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.branding}>
          <div className={styles.logo}>
            <span>The Lotus Infosys</span>
          </div>
          <p className={styles.desc}>
            An established IT and computer services firm based in Bani Park, Jaipur.
            Specializing in business management software, computer repair, and
            enterprise hardware since 2000.
          </p>
        </div>

        <div>
          <h3 className={styles.title}>Quick Links</h3>
          <ul className={styles.linksList}>
            <li className={styles.linkItem}>
              <Link href="/">Home</Link>
            </li>
            <li className={styles.linkItem}>
              <Link href="/catalog">Products Catalog</Link>
            </li>
            <li className={styles.linkItem}>
              <Link href="/token">Track Repair Token</Link>
            </li>
            <li className={styles.linkItem}>
              <Link href="/about">About & Location</Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className={styles.title}>Contact & Hours</h3>
          <ul className={styles.contactList}>
            <li className={styles.contactItem}>
              <span className={styles.icon} style={{ minWidth: "70px", display: "inline-block" }}>Address:</span>
              <span>
                C-4, Krishna Apartment (LB-6), Hathi Babu Marg, Near Pittal Factory,
                Bani Park, Jaipur, Rajasthan 302016
              </span>
            </li>
            <li className={styles.contactItem}>
              <span className={styles.icon} style={{ minWidth: "70px", display: "inline-block" }}>Phone:</span>
              <span>
                <a href="tel:+919828021205" style={{ color: "#3b82f6", fontWeight: "bold" }}>
                  +91 98280 21205
                </a>
              </span>
            </li>
            <li className={styles.contactItem}>
              <span className={styles.icon} style={{ minWidth: "70px", display: "inline-block" }}>Hours:</span>
              <span>Mon - Sat: 10:00 AM - 7:00 PM (Sunday Closed)</span>
            </li>
          </ul>
        </div>
      </div>

      <div className={styles.bottom}>
        <p className={styles.copyright}>
          © {new Date().getFullYear()} The Lotus Infosys. All rights reserved.
        </p>
        <p style={{ fontSize: "0.75rem", color: "#475569" }}>
          Providing IT Excellence for Over 2 Decades.
        </p>
      </div>
    </footer>
  );
}
