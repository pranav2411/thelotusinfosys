"use client";

import React, { useState, useEffect } from "react";
import styles from "./Catalog.module.css";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number | null;
  category: string;
  image_url: string | null;
}

export default function Catalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  // Modal State
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [enquiryForm, setEnquiryForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [submittingEnquiry, setSubmittingEnquiry] = useState(false);
  const [enquirySuccess, setEnquirySuccess] = useState(false);
  const [enquiryError, setEnquiryError] = useState("");

  // Fetch products
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch(`${API_BASE}/api/products`);
        if (!res.ok) throw new Error("Failed to load products");
        const data = await res.json();
        setProducts(data);
      } catch (err: any) {
        setError(err.message || "Something went wrong while fetching products.");
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // Filter Categories
  const categories = ["All", ...Array.from(new Set(products.map((p) => p.category).filter(Boolean)))];

  // Filter Products
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = activeCategory === "All" || product.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Open Enquiry Modal
  const openEnquiry = (product: Product) => {
    setSelectedProduct(product);
    setEnquiryForm({
      name: "",
      phone: "",
      email: "",
      message: `Hi, I'm interested in "${product.name}" (Category: ${product.category}). Please let me know the availability, pricing, and purchase details.`,
    });
    setEnquirySuccess(false);
    setEnquiryError("");
  };

  // Submit Enquiry
  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    setSubmittingEnquiry(true);
    setEnquiryError("");
    try {
      const res = await fetch(`${API_BASE}/api/enquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(enquiryForm),
      });

      if (!res.ok) throw new Error("Failed to send enquiry");

      setEnquirySuccess(true);
      setTimeout(() => {
        setSelectedProduct(null); // Close modal
      }, 2500);
    } catch (err: any) {
      setEnquiryError(err.message || "Error submitting enquiry.");
    } finally {
      setSubmittingEnquiry(false);
    }
  };

  return (
    <div className="section">
      <div className="container">
        <h1 className="section-title">Products & Services Catalog</h1>
        <p className="section-subtitle">
          Browse our extensive inventory of genuine hardware components, accessories, and business software.
        </p>

        {/* Filter & Search Header */}
        <div className={styles.catalogHeader}>
          <ul className={styles.filterList}>
            {categories.map((cat) => (
              <li key={cat}>
                <button
                  className={`${styles.filterBtn} ${activeCategory === cat ? styles.activeFilter : ""}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>

          <input
            type="text"
            className={styles.searchBar}
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Loading / Error States */}
        {loading ? (
          <p style={{ textAlign: "center", color: "var(--text-secondary)" }}>Loading products...</p>
        ) : error ? (
          <p style={{ textAlign: "center", color: "var(--danger)" }}>{error}</p>
        ) : filteredProducts.length === 0 ? (
          <div className={styles.emptyState}>
            <h3>No products found</h3>
            <p>Try adjusting your search query or selecting a different category.</p>
          </div>
        ) : (
          <div className={styles.productGrid}>
            {filteredProducts.map((product) => (
              <div key={product.id} className={styles.productCard}>
                <div className={styles.imgContainer}>
                  {product.image_url ? (
                    <img
                      src={`${API_BASE}${product.image_url}`}
                      alt={product.name}
                      className={styles.productImg}
                    />
                  ) : (
                    <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: "500" }}>Image Pending</span>
                  )}
                </div>

                <div className={styles.info}>
                  <span className={styles.categoryTag}>{product.category || "Hardware"}</span>
                  <h3 className={styles.name}>{product.name}</h3>
                  <p className={styles.description}>{product.description || "No description provided."}</p>
                  
                  <div className={styles.footerRow}>
                    {product.price ? (
                      <span className={styles.price}>₹{product.price.toLocaleString("en-IN")}</span>
                    ) : (
                      <span className={styles.noPrice}>Price on Request</span>
                    )}

                    <button className="btn btn-secondary btn-sm" onClick={() => openEnquiry(product)}>
                      Enquire
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Enquiry Modal */}
        {selectedProduct && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <button className={styles.modalClose} onClick={() => setSelectedProduct(null)}>
                ✕
              </button>

              <h3 className={styles.modalTitle}>Product Enquiry</h3>
              <p className={styles.modalSubtitle}>Inquire about {selectedProduct.name}</p>

              {enquirySuccess ? (
                <div style={{ textAlign: "center", padding: "20px 0" }}>
                  <h4 style={{ color: "var(--success)" }}>Enquiry Sent!</h4>
                  <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginTop: 6 }}>
                    We will get back to you shortly.
                  </p>
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
                      placeholder="e.g. Amit Sharma"
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
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-input"
                      placeholder="email@example.com"
                      value={enquiryForm.email}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, email: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Message *</label>
                    <textarea
                      className="form-textarea"
                      required
                      value={enquiryForm.message}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, message: e.target.value })}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={submittingEnquiry}
                    style={{ width: "100%", marginTop: 12 }}
                  >
                    {submittingEnquiry ? "Sending..." : "Submit Enquiry"}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
