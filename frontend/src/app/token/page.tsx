"use client";

import React, { useState } from "react";
import styles from "./Token.module.css";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface TokenData {
  id: number;
  token_number: string;
  customer_name: string;
  phone: string;
  email: string | null;
  device_model: string;
  issue_description: string;
  status: string;
  created_at: string;
  updated_at: string;
}

const STEPS = ["Pending", "Under Diagnostics", "Repairing", "Ready for Pickup", "Delivered"];

export default function TokenTracker() {
  const [tokenInput, setTokenInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenInput.trim()) return;

    setLoading(true);
    setError("");
    setTokenData(null);

    try {
      const res = await fetch(`${API_BASE}/api/tokens/${tokenInput.trim().toUpperCase()}`);
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error("Invalid token number. Device ticket not found.");
        }
        throw new Error("Failed to retrieve token details. Please try again.");
      }

      const data = await res.json();
      setTokenData(data);
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const getStepStatusClass = (step: string) => {
    if (!tokenData) return "";
    
    const currentIndex = STEPS.indexOf(tokenData.status);
    const stepIndex = STEPS.indexOf(step);

    if (stepIndex < currentIndex) {
      return styles.completedStep;
    } else if (stepIndex === currentIndex) {
      return styles.activeStep;
    }
    return "";
  };

  const getProgressWidth = () => {
    if (!tokenData) return "0%";
    const currentIndex = STEPS.indexOf(tokenData.status);
    if (currentIndex === -1) return "0%";
    const percent = (currentIndex / (STEPS.length - 1)) * 100;
    return `${percent}%`;
  };

  return (
    <div className="section">
      <div className="container">
        <h1 className="section-title">Track Repair Device</h1>
        <p className="section-subtitle">
          Check the real-time repair status of your laptop, desktop, or accessories.
        </p>

        {/* Search Box */}
        <div className={styles.searchCard}>
          <h3 className={styles.searchTitle}>Enter Token Number</h3>
          <p className={styles.searchDesc}>
            Input the service token you received (e.g., LOTUS-2026-1001) to trace details.
          </p>

          <form onSubmit={handleSearch} className={styles.searchForm}>
            <input
              type="text"
              className={styles.input}
              placeholder="LOTUS-2026-XXXX"
              required
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
            />
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Searching..." : "Track Status"}
            </button>
          </form>

          {error && <p style={{ color: "var(--danger)", marginTop: 16, fontWeight: "500" }}>{error}</p>}
        </div>

        {/* Results Card */}
        {tokenData && (
          <div className={styles.resultCard}>
            <div className={styles.header}>
              <div className={styles.headerInfo}>
                <h2>{tokenData.token_number}</h2>
                <p>Registered: {new Date(tokenData.created_at).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric"
                })}</p>
              </div>
              <div className={styles.statusBadge}>{tokenData.status}</div>
            </div>

            <div className={styles.body}>
              {/* Stepper Tracking Wizard */}
              <div className={styles.tracker}>
                <div 
                  className={styles.progressLine} 
                  style={{ width: getProgressWidth() }}
                />
                {STEPS.map((step, idx) => (
                  <div 
                    key={step} 
                    className={`${styles.step} ${getStepStatusClass(step)}`}
                  >
                    <div className={styles.stepDot}>
                      {idx + 1}
                    </div>
                    <div className={styles.stepLabel}>{step}</div>
                  </div>
                ))}
              </div>

              {/* Details grid */}
              <div className={styles.infoGrid}>
                <div className={styles.infoBlock}>
                  <h4>Customer Name</h4>
                  <p>{tokenData.customer_name}</p>
                </div>
                <div className={styles.infoBlock}>
                  <h4>Device Model</h4>
                  <p>{tokenData.device_model}</p>
                </div>
                
                <div className={`${styles.infoBlock} ${styles.issueBlock}`}>
                  <h4>Reported Issue</h4>
                  <p style={{ fontWeight: "normal", fontSize: "0.95rem", color: "var(--text-secondary)", marginTop: 4 }}>
                    {tokenData.issue_description}
                  </p>
                </div>

                <div className={styles.infoBlock} style={{ gridColumn: "span 2", display: "flex", gap: 10, alignItems: "center", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                  <span>Last status update:</span>
                  <strong style={{ color: "var(--text-secondary)" }}>
                    {new Date(tokenData.updated_at).toLocaleString("en-IN")}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
