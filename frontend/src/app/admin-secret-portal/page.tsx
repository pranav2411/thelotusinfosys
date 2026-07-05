"use client";

import React, { useState, useEffect } from "react";
import styles from "./Admin.module.css";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const PASSCODE = "LotusAdmin2026";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number | null;
  description: string;
  image_url: string | null;
  created_at: string;
}

interface Enquiry {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  message: string;
  status: string;
  created_at: string;
}

interface ServiceToken {
  id: number;
  token_number: string;
  customer_name: string;
  phone: string;
  email: string | null;
  device_model: string;
  issue_description: string;
  status: string;
  created_at: string;
}

const STEPS = ["Pending", "Under Diagnostics", "Repairing", "Ready for Pickup", "Delivered"];

export default function AdminPortal() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcodeInput, setPasscodeInput] = useState("");
  const [passcodeError, setPasscodeError] = useState("");

  // Tabs: "dashboard", "products", "enquiries", "tokens"
  const [activeTab, setActiveTab] = useState("dashboard");

  // Data states
  const [products, setProducts] = useState<Product[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [tokens, setTokens] = useState<ServiceToken[]>([]);

  // Loading states
  const [productsLoading, setProductsLoading] = useState(false);
  const [enquiriesLoading, setEnquiriesLoading] = useState(false);
  const [tokensLoading, setTokensLoading] = useState(false);

  // New Product Form State
  const [newProd, setNewProd] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
    image_url: "",
  });
  const [prodImage, setProdImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [prodSubmitting, setProdSubmitting] = useState(false);
  const [prodMessage, setProdMessage] = useState("");

  // Verify auth on mount
  useEffect(() => {
    const cachedAuth = localStorage.getItem("lotus_admin_auth");
    if (cachedAuth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  // Fetch data depending on active tab or auth
  useEffect(() => {
    if (isAuthenticated) {
      fetchProducts();
      fetchEnquiries();
      fetchTokens();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcodeInput === PASSCODE) {
      setIsAuthenticated(true);
      setPasscodeError("");
      localStorage.setItem("lotus_admin_auth", "true");
    } else {
      setPasscodeError("Invalid passcode. Please try again.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("lotus_admin_auth");
  };

  // --- API CALLS ---
  const fetchProducts = async () => {
    setProductsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/products`);
      if (res.ok) setProducts(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setProductsLoading(false);
    }
  };

  const fetchEnquiries = async () => {
    setEnquiriesLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/enquiries`);
      if (res.ok) setEnquiries(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setEnquiriesLoading(false);
    }
  };

  const fetchTokens = async () => {
    setTokensLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/tokens`);
      if (res.ok) setTokens(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setTokensLoading(false);
    }
  };

  // Add Product Submit
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProdSubmitting(true);
    setProdMessage("");

    try {
      const formData = new FormData();
      formData.append("name", newProd.name);
      formData.append("category", newProd.category);
      if (newProd.price) formData.append("price", newProd.price);
      formData.append("description", newProd.description);
      if (newProd.image_url) formData.append("image_url", newProd.image_url);
      if (prodImage) {
        formData.append("image", prodImage);
      }

      const res = await fetch(`${API_BASE}/api/products`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to add product.");

      setProdMessage("Product added successfully!");
      setNewProd({ name: "", category: "", price: "", description: "", image_url: "" });
      setProdImage(null);
      setImagePreview(null);
      fetchProducts();
    } catch (err: any) {
      setProdMessage(`Error: ${err.message}`);
    } finally {
      setProdSubmitting(false);
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`${API_BASE}/api/products/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchProducts();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Update Enquiry Status
  const handleToggleEnquiryStatus = async (id: number, currentStatus: string) => {
    const nextStatus = currentStatus === "New" ? "Responded" : "New";
    try {
      const res = await fetch(`${API_BASE}/api/enquiries/${id}?status=${nextStatus}`, {
        method: "PATCH",
      });
      if (res.ok) {
        fetchEnquiries();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Update Token Status
  const handleUpdateTokenStatus = async (id: number, status: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/tokens/${id}?status=${status}`, {
        method: "PATCH",
      });
      if (res.ok) {
        fetchTokens();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProdImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Render Login Lock Page
  if (!isAuthenticated) {
    return (
      <div className={styles.loginContainer}>
        <div className={styles.loginTitle}>Admin Portal</div>
        <p className={styles.loginDesc}>
          Access restricted. Enter passcode to authorize session.
        </p>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <input
              type="password"
              className="form-input"
              style={{ textAlign: "center" }}
              placeholder="Passcode (LotusAdmin2026)"
              required
              value={passcodeInput}
              onChange={(e) => setPasscodeInput(e.target.value)}
            />
          </div>
          {passcodeError && (
            <p style={{ color: "var(--danger)", fontSize: "0.9rem", marginBottom: 12 }}>
              {passcodeError}
            </p>
          )}
          <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>
            Verify passcode
          </button>
        </form>
      </div>
    );
  }

  // Active repair tickets (filtered)
  const activeTokensCount = tokens.filter((t) => t.status !== "Delivered").length;

  return (
    <div className="section">
      <div className="container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 30 }}>
          <h1 style={{ fontSize: "2rem", fontWeight: "800", color: "var(--primary)" }}>
            Management Portal
          </h1>
          <button onClick={handleLogout} className="btn btn-secondary">
            Sign Out
          </button>
        </div>

        <div className={styles.layout}>
          {/* Left Sidebar Navigation */}
          <aside className={styles.sidebar}>
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`${styles.tabBtn} ${activeTab === "dashboard" ? styles.activeTabBtn : ""}`}
            >
              Dashboard Summary
            </button>
            <button
              onClick={() => setActiveTab("products")}
              className={`${styles.tabBtn} ${activeTab === "products" ? styles.activeTabBtn : ""}`}
            >
              Manage Products
            </button>
            <button
              onClick={() => setActiveTab("enquiries")}
              className={`${styles.tabBtn} ${activeTab === "enquiries" ? styles.activeTabBtn : ""}`}
            >
              Enquiries ({enquiries.filter((e) => e.status === "New").length})
            </button>
            <button
              onClick={() => setActiveTab("tokens")}
              className={`${styles.tabBtn} ${activeTab === "tokens" ? styles.activeTabBtn : ""}`}
            >
              Active Repairs ({activeTokensCount})
            </button>
          </aside>

          {/* Right Panel Workspace */}
          <main>
            {/* Dashboard Workspace */}
            {activeTab === "dashboard" && (
              <div>
                <div className={styles.statsGrid}>
                  <div className={styles.statCard}>
                    <div>
                      <div className={styles.statVal}>{products.length}</div>
                      <div className={styles.statLabel}>Total Products</div>
                    </div>
                  </div>

                  <div className={styles.statCard}>
                    <div>
                      <div className={styles.statVal}>{enquiries.length}</div>
                      <div className={styles.statLabel}>Total Enquiries</div>
                    </div>
                  </div>

                  <div className={styles.statCard}>
                    <div>
                      <div className={styles.statVal}>{activeTokensCount}</div>
                      <div className={styles.statLabel}>Active Repairs</div>
                    </div>
                  </div>
                </div>

                <div className={styles.panel}>
                  <h2 className={styles.panelTitle}>Recent Enquiries</h2>
                  {enquiries.length === 0 ? (
                    <p style={{ color: "var(--text-secondary)" }}>No enquiries received yet.</p>
                  ) : (
                    <div className={styles.tableContainer}>
                      <table className={styles.table}>
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Contact</th>
                            <th>Message</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {enquiries.slice(0, 3).map((e) => (
                            <tr key={e.id}>
                              <td><strong>{e.name}</strong></td>
                              <td>
                                <div>{e.phone}</div>
                                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{e.email || "-"}</div>
                              </td>
                              <td style={{ maxWidth: 300 }}>{e.message}</td>
                              <td>
                                <span className={`badge ${e.status === "New" ? "badge-pending" : "badge-ready"}`}>
                                  {e.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Manage Products Workspace */}
            {activeTab === "products" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                {/* Add Product Form */}
                <div className={styles.panel}>
                  <h2 className={styles.panelTitle}>Add New Product</h2>
                  {prodMessage && (
                    <p
                      style={{
                        padding: 12,
                        borderRadius: "var(--radius-sm)",
                        background: prodMessage.includes("Error") ? "var(--danger-light)" : "var(--success-light)",
                        color: prodMessage.includes("Error") ? "var(--danger)" : "var(--success)",
                        marginBottom: 16,
                      }}
                    >
                      {prodMessage}
                    </p>
                  )}

                  <form onSubmit={handleProductSubmit} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                      <div className="form-group">
                        <label className="form-label">Product Name *</label>
                        <input
                          type="text"
                          className="form-input"
                          required
                          placeholder="e.g. Prodot USB Mouse"
                          value={newProd.name}
                          onChange={(e) => setNewProd({ ...newProd, name: e.target.value })}
                        />
                      </div>

                      <div className="form-group-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                        <div className="form-group">
                          <label className="form-label">Category *</label>
                          <select
                            className="form-select"
                            required
                            value={newProd.category}
                            onChange={(e) => setNewProd({ ...newProd, category: e.target.value })}
                          >
                            <option value="">Select Category</option>
                            <option value="Hardware">Hardware</option>
                            <option value="Software">Software</option>
                            <option value="Cables">Cables</option>
                            <option value="Peripherals">Peripherals</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label className="form-label">Price (INR)</label>
                          <input
                            type="number"
                            className="form-input"
                            placeholder="Optional"
                            value={newProd.price}
                            onChange={(e) => setNewProd({ ...newProd, price: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Description *</label>
                        <textarea
                          className="form-textarea"
                          required
                          placeholder="Describe the product technical details..."
                          value={newProd.description}
                          onChange={(e) => setNewProd({ ...newProd, description: e.target.value })}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Product Image URL (Alternative to file upload)</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g. https://i.postimg.cc/image.png"
                          value={newProd.image_url}
                          onChange={(e) => setNewProd({ ...newProd, image_url: e.target.value })}
                        />
                      </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                      <label className="form-label">Product Image *</label>
                      <div className={styles.fileZone} onClick={() => document.getElementById("img-upload")?.click()}>
                        <div className={styles.fileZoneText}>
                          <strong>Click to upload</strong> or drag image file here
                        </div>
                        <input
                          type="file"
                          id="img-upload"
                          accept="image/*"
                          style={{ display: "none" }}
                          onChange={handleImageChange}
                        />
                      </div>
                      
                      {imagePreview && (
                        <div>
                          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", textAlign: "center", marginBottom: 4 }}>
                            Image Preview:
                          </p>
                          <img src={imagePreview} alt="Preview" className={styles.imgPreview} />
                        </div>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={prodSubmitting}
                      className="btn btn-primary"
                      style={{ gridColumn: "span 2", marginTop: 12 }}
                    >
                      {prodSubmitting ? "Saving Product..." : "Upload & Create Product"}
                    </button>
                  </form>
                </div>

                {/* Products List */}
                <div className={styles.panel}>
                  <h2 className={styles.panelTitle}>Product Inventory</h2>
                  {productsLoading ? (
                    <p>Loading inventory...</p>
                  ) : products.length === 0 ? (
                    <p style={{ color: "var(--text-secondary)" }}>No products in catalog.</p>
                  ) : (
                    <div className={styles.tableContainer}>
                      <table className={styles.table}>
                        <thead>
                          <tr>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Description</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {products.map((p) => (
                            <tr key={p.id}>
                              <td>
                                {p.image_url ? (
                                  <img src={p.image_url.startsWith("http") ? p.image_url : `${API_BASE}${p.image_url}`} alt={p.name} className={styles.thumb} />
                                ) : (
                                  <div className={styles.thumb} style={{ display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: "500", textAlign: "center" }}>
                                    No Image
                                  </div>
                                )}
                              </td>
                              <td><strong>{p.name}</strong></td>
                              <td>{p.category}</td>
                              <td>{p.price ? `₹${p.price.toLocaleString("en-IN")}` : "Request"}</td>
                              <td style={{ maxWidth: 200, fontSize: "0.85rem" }}>{p.description}</td>
                              <td>
                                <button
                                  onClick={() => handleDeleteProduct(p.id)}
                                  className="btn btn-secondary"
                                  style={{ color: "var(--danger)", padding: "6px 12px", border: "1px solid var(--danger)", fontSize: "0.8rem" }}
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Enquiries Workspace */}
            {activeTab === "enquiries" && (
              <div className={styles.panel}>
                <h2 className={styles.panelTitle}>Customer Enquiries</h2>
                {enquiriesLoading ? (
                  <p>Loading enquiries...</p>
                ) : enquiries.length === 0 ? (
                  <p style={{ color: "var(--text-secondary)" }}>No enquiries received yet.</p>
                ) : (
                  <div className={styles.tableContainer}>
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Name</th>
                          <th>Contact Details</th>
                          <th>Enquiry Message</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {enquiries.map((e) => (
                          <tr key={e.id}>
                            <td style={{ whiteSpace: "nowrap", fontSize: "0.85rem" }}>
                              {new Date(e.created_at).toLocaleDateString("en-IN")}
                            </td>
                            <td><strong>{e.name}</strong></td>
                            <td>
                              <div>{e.phone}</div>
                              {e.email && <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{e.email}</div>}
                            </td>
                            <td style={{ maxWidth: 300, whiteSpace: "pre-wrap" }}>{e.message}</td>
                            <td>
                              <span className={`badge ${e.status === "New" ? "badge-pending" : "badge-ready"}`}>
                                {e.status}
                              </span>
                            </td>
                            <td>
                              <button
                                onClick={() => handleToggleEnquiryStatus(e.id, e.status)}
                                className="btn btn-secondary"
                                style={{ padding: "6px 12px", fontSize: "0.8rem" }}
                              >
                                {e.status === "New" ? "Responded" : "New"}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Service Tokens Workspace */}
            {activeTab === "tokens" && (
              <div className={styles.panel}>
                <h2 className={styles.panelTitle}>Active Repair Tokens</h2>
                {tokensLoading ? (
                  <p>Loading repair tokens...</p>
                ) : tokens.length === 0 ? (
                  <p style={{ color: "var(--text-secondary)" }}>No repair service tickets generated yet.</p>
                ) : (
                  <div className={styles.tableContainer}>
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th>Token #</th>
                          <th>Customer</th>
                          <th>Device Model</th>
                          <th>Description of Issue</th>
                          <th>Stage Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tokens.map((t) => (
                          <tr key={t.id}>
                            <td>
                              <strong style={{ color: "var(--primary)" }}>{t.token_number}</strong>
                              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                                {new Date(t.created_at).toLocaleDateString("en-IN")}
                              </div>
                            </td>
                            <td>
                              <strong>{t.customer_name}</strong>
                              <div style={{ fontSize: "0.85rem" }}>{t.phone}</div>
                            </td>
                            <td><strong>{t.device_model}</strong></td>
                            <td style={{ maxWidth: 250 }}>{t.issue_description}</td>
                            <td>
                              <select
                                className="form-select"
                                style={{ padding: "6px 12px", fontSize: "0.85rem", width: 160 }}
                                value={t.status}
                                onChange={(e) => handleUpdateTokenStatus(t.id, e.target.value)}
                              >
                                {STEPS.map((step) => (
                                  <option key={step} value={step}>
                                    {step}
                                  </option>
                                ))}
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
