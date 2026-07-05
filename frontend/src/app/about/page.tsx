import React from "react";
import styles from "./About.module.css";

export default function About() {
  return (
    <div className="section">
      <div className="container">
        <h1 className="section-title">About Us</h1>
        <p className="section-subtitle">
          Discover our legacy of serving local clients with trusted computer sales, repairs, and support.
        </p>

        <div className={styles.grid}>
          {/* Historical Description Column */}
          <div className={styles.history}>
            <h2 className={styles.title}>Over 25 Years of IT Services</h2>
            <p className={styles.subtitle}>Helping Bani Park Businesses Grow Since 2000</p>
            <p className={styles.paragraph}>
              Established at the turn of the millennium, The Lotus Infosys has grown to become 
              one of Jaipur's most trusted IT support and product catalogs. Under deep local roots, 
              we have consistently delivered professional and high-quality services to retail users, 
              corporate houses, government offices, and small business owners alike.
            </p>
            <p className={styles.paragraph}>
              Our core values are integrity, efficiency, and speed. We understand that a breakdown 
              in your computer systems can stall your entire operations. That is why we offer 
              instant diagnostic services, transparent ticketing, and quick turnarounds to get you 
              up and running in no time.
            </p>

            <div className={styles.featuresList}>
              <div className={styles.featureItem}>
                <span className={styles.featureIcon}>—</span>
                <div className={styles.featureText}>
                  <h4>Certified Repairs</h4>
                  <p>Our technical team is highly experienced in chip-level hardware repair.</p>
                </div>
              </div>

              <div className={styles.featureItem}>
                <span className={styles.featureIcon}>—</span>
                <div className={styles.featureText}>
                  <h4>Genuine Accessories</h4>
                  <p>We source only original and manufacturer-warranted spare parts and systems.</p>
                </div>
              </div>

              <div className={styles.featureItem}>
                <span className={styles.featureIcon}>—</span>
                <div className={styles.featureText}>
                  <h4>Transparent Progress</h4>
                  <p>With our digital service token system, track your repair updates anytime.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Business Details Column */}
          <div className={styles.detailsPanel}>
            <div className={styles.detailSection}>
              <h3>Business Information</h3>
              <ul className={styles.detailList}>
                <li className={styles.detailItem}>
                  <span className={styles.detailLabel}>Company Name</span>
                  <span className={styles.detailValue}>The Lotus Infosys</span>
                </li>
                <li className={styles.detailItem}>
                  <span className={styles.detailLabel}>Founded In</span>
                  <span className={styles.detailValue}>2000</span>
                </li>
                <li className={styles.detailItem}>
                  <span className={styles.detailLabel}>At-</span>
                  <span className={styles.detailValue}>Bani Park, Jaipur</span>
                </li>
                <li className={styles.detailItem}>
                  <span className={styles.detailLabel}>Founder/Owner</span>
                  <span className={styles.detailValue}>Kamal Khandelwal</span>
                </li>
              </ul>
            </div>

            <div className={styles.detailSection}>
              <h3>Contact Details</h3>
              <ul className={styles.detailList}>
                <li className={styles.detailItem}>
                  <span className={styles.detailLabel}>Phone</span>
                  <span className={styles.detailValue}>
                    <a href="tel:+919828021205" style={{ color: "var(--accent)", fontWeight: "600" }}>
                      +91 98280 21205
                    </a>
                  </span>
                </li>
                <li className={styles.detailItem}>
                  <span className={styles.detailLabel}>Location</span>
                  <span className={styles.detailValue}>
                    C-4, Krishna Apartment (LB-6), Hathi Babu Marg, Near Pittal Factory, Bani Park, Jaipur - 302016
                  </span>
                </li>
              </ul>
            </div>

            <div className={styles.detailSection}>
              <h3>Business Hours</h3>
              <ul className={styles.detailList}>
                <li className={styles.detailItem}>
                  <span className={styles.detailLabel}>Mon - Sat</span>
                  <span className={styles.detailValue}>10:00 AM - 7:00 PM</span>
                </li>
                <li className={styles.detailItem}>
                  <span className={styles.detailLabel}>Sunday</span>
                  <span className={styles.detailValue} style={{ color: "var(--danger)" }}>Closed</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Maps Section */}
        <div className={styles.mapContainer}>
          <div className={styles.mapTitle}>Find Us On Map</div>
          <iframe
            title="The Lotus Infosys Location"
            className={styles.mapFrame}
            src="https://maps.google.com/maps?q=The%20Lotus%20Infosys,%20Krishna%20Apartment,%20Jaipur&t=&z=16&ie=UTF8&iwloc=&output=embed"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </div>
  );
}
