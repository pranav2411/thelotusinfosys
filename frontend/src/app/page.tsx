"use client";

import React, { useState } from "react";
import Link from "next/link";
import styles from "./Home.module.css";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function Home() {
  // Enquiry form state
  const [enquiryForm, setEnquiryForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [enquiryLoading, setEnquiryLoading] = useState(false);
  const [enquirySuccess, setEnquirySuccess] = useState(false);
  const [enquiryError, setEnquiryError] = useState("");

  // Service ticket form state
  const [ticketForm, setTicketForm] = useState({
    customer_name: "",
    phone: "",
    email: "",
    device_model: "",
    issue_description: "",
  });
  const [ticketLoading, setTicketLoading] = useState(false);
  const [generatedToken, setGeneratedToken] = useState("");
  const [ticketError, setTicketError] = useState("");

  // Enquiry submit handler
  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnquiryLoading(true);
    setEnquiryError("");
    try {
      const response = await fetch(`${API_BASE}/api/enquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(enquiryForm),
      });

      if (!response.ok) {
        throw new Error("Failed to submit enquiry. Please try again.");
      }

      setEnquirySuccess(true);
      setEnquiryForm({ name: "", phone: "", email: "", message: "" });
    } catch (err: any) {
      setEnquiryError(err.message || "An error occurred.");
    } finally {
      setEnquiryLoading(false);
    }
  };

  // Ticket submit handler
  const handleTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTicketLoading(true);
    setTicketError("");
    try {
      const response = await fetch(`${API_BASE}/api/tokens`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ticketForm),
      });

      if (!response.ok) {
        throw new Error("Failed to generate service token.");
      }

      const data = await response.json();
      setGeneratedToken(data.token_number);
      setTicketForm({
        customer_name: "",
        phone: "",
        email: "",
        device_model: "",
        issue_description: "",
      });
    } catch (err: any) {
      setTicketError(err.message || "An error occurred.");
    } finally {
      setTicketLoading(false);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroContent}>
            <span className={styles.badge}>Established 2000</span>
            <h1 className={styles.heroTitle}>
              Professional IT Solutions & <span>Computer Repair</span>
            </h1>
            <p className={styles.heroDesc}>
              Serving Bani Park, Jaipur for over two decades. We supply premium
              hardware accessories, business management software, and provide reliable,
              on-time computer and laptop repair services.
            </p>
            <div className={styles.heroActions}>
              <a href="#quick-action" className="btn btn-primary">
                Book Repair Token
              </a>
              <Link href="/catalog" className="btn btn-secondary">
                View Catalog
              </Link>
              <a href="tel:+919828021205" className="btn btn-accent">
                Call +91 98280 21205
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">What We Do</h2>
          <p className="section-subtitle">
            Providing high-quality hardware products and dependable technical assistance
            for Jaipur businesses and individuals.
          </p>

          <div className={styles.servicesGrid}>
            <div className={styles.serviceCard}>
              <h3 className={styles.serviceName}>Computer Repair</h3>
              <p className={styles.serviceText}>
                Diagnostics, screen replacements, keyboard repairs, motherboard fixing,
                and performance upgrades for all major laptop and desktop brands.
              </p>
            </div>

            <div className={styles.serviceCard}>
              <h3 className={styles.serviceName}>Business Software</h3>
              <p className={styles.serviceText}>
                Tally ERP integration, customized accounting tools, backup strategies, and
                cloud hosting support tailored to local business processes.
              </p>
            </div>

            <div className={styles.serviceCard}>
              <h3 className={styles.serviceName}>IT Hardware Supply</h3>
              <p className={styles.serviceText}>
                High-quality keyboards, mice, cables, UPS systems, cartridges, and spare
                parts sourced from leading authorized dealers.
              </p>
            </div>

            <div className={styles.serviceCard}>
              <h3 className={styles.serviceName}>Network Security</h3>
              <p className={styles.serviceText}>
                Antivirus deployment, local networking setup, firewall configurations, and
                data recovery services to safeguard operations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Forms Section */}
      <section className={`section ${styles.formsSection}`} id="quick-action">
        <div className="container">
          <h2 className="section-title">Get In Touch</h2>
          <p className="section-subtitle">
            Create a hardware repair ticket to track your status live, or send a general enquiry.
          </p>

          <div className={styles.formsGrid}>
            {/* Generate Token Form */}
            <div className={styles.formCard}>
              <h3 className={styles.formTitle}>Generate Service Token</h3>
              <p className={styles.formDesc}>
                Device need repair? Submit the details below to generate a unique service tracking token.
              </p>

              {generatedToken ? (
                <div className={styles.successBox}>
                  <h4>Token Generated Successfully!</h4>
                  <p>Keep this token number to track the status of your repair device.</p>
                  <div className={styles.tokenNum}>{generatedToken}</div>
                  <Link href="/token" className="btn btn-primary" style={{ marginTop: 12 }}>
                    Track Device Status
                  </Link>
                  <button
                    onClick={() => setGeneratedToken("")}
                    className="btn btn-secondary"
                    style={{ marginTop: 8 }}
                  >
                    Generate Another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleTicketSubmit}>
                  {ticketError && <p style={{ color: "var(--danger)", marginBottom: 12 }}>{ticketError}</p>}
                  
                  <div className="form-group">
                    <label className="form-label">Customer Name *</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      placeholder="e.g., Ramesh Sharma"
                      value={ticketForm.customer_name}
                      onChange={(e) => setTicketForm({ ...ticketForm, customer_name: e.target.value })}
                    />
                  </div>

                  <div className="form-group-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div className="form-group">
                      <label className="form-label">Phone Number *</label>
                      <input
                        type="tel"
                        className="form-input"
                        required
                        placeholder="10-digit mobile"
                        value={ticketForm.phone}
                        onChange={(e) => setTicketForm({ ...ticketForm, phone: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email (Optional)</label>
                      <input
                        type="email"
                        className="form-input"
                        placeholder="email@example.com"
                        value={ticketForm.email}
                        onChange={(e) => setTicketForm({ ...ticketForm, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Device Model & Brand *</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      placeholder="e.g., HP Pavilion Laptop 15"
                      value={ticketForm.device_model}
                      onChange={(e) => setTicketForm({ ...ticketForm, device_model: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Issue Description *</label>
                    <textarea
                      className="form-textarea"
                      required
                      placeholder="Describe the issues (e.g., laptop not booting, keyboard key broken)"
                      value={ticketForm.issue_description}
                      onChange={(e) => setTicketForm({ ...ticketForm, issue_description: e.target.value })}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={ticketLoading}
                    style={{ width: "100%", marginTop: 12 }}
                  >
                    {ticketLoading ? "Generating..." : "Generate Token"}
                  </button>
                </form>
              )}
            </div>

            {/* General Enquiry Form */}
            <div className={styles.formCard}>
              <h3 className={styles.formTitle}>General Enquiry</h3>
              <p className={styles.formDesc}>
                Interested in pricing, business software support, or checking product availability?
              </p>

              {enquirySuccess ? (
                <div className={styles.successBox}>
                  <h4>Enquiry Received!</h4>
                  <p>Thank you for reaching out. We will call or email you back within 24 hours.</p>
                  <button
                    onClick={() => setEnquirySuccess(false)}
                    className="btn btn-primary"
                    style={{ marginTop: 16 }}
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleEnquirySubmit}>
                  {enquiryError && <p style={{ color: "var(--danger)", marginBottom: 12 }}>{enquiryError}</p>}
                  
                  <div className="form-group">
                    <label className="form-label">Your Name *</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      placeholder="e.g., Sita Patel"
                      value={enquiryForm.name}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, name: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Phone Number *</label>
                    <input
                      type="tel"
                      className="form-input"
                      required
                      placeholder="10-digit mobile"
                      value={enquiryForm.phone}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, phone: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      className="form-input"
                      placeholder="email@example.com"
                      value={enquiryForm.email}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, email: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">How can we help? *</label>
                    <textarea
                      className="form-textarea"
                      required
                      placeholder="Tell us about the services or items you are interested in..."
                      value={enquiryForm.message}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, message: e.target.value })}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-accent"
                    disabled={enquiryLoading}
                    style={{ width: "100%", marginTop: 12 }}
                  >
                    {enquiryLoading ? "Submitting..." : "Send Enquiry"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
