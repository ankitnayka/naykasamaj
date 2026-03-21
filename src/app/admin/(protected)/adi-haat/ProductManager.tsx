"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Artisan {
  _id: string;
  name: string;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  artisanId: any; 
  images: string[];
  inStock: boolean;
}

export default function ProductManager({ initialProducts, artisans }: { initialProducts: Product[], artisans: Artisan[] }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    artisanId: "",
    inStock: true
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const router = useRouter();

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name,
        description: editingProduct.description,
        price: editingProduct.price.toString(),
        category: editingProduct.category,
        artisanId: typeof editingProduct.artisanId === 'object' ? editingProduct.artisanId._id : editingProduct.artisanId,
        inStock: editingProduct.inStock
      });
      setImageFiles([]);
      setIsFormOpen(true);
    } else {
      setFormData({
        name: "", description: "", price: "", category: "", artisanId: artisans[0]?._id || "", inStock: true
      });
      setImageFiles([]);
    }
  }, [editingProduct, artisans]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const url = editingProduct ? `/api/admin/adi-haat/products/${editingProduct._id}` : "/api/admin/adi-haat/products";
    const method = editingProduct ? "PUT" : "POST";

    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      payload.append(key, value.toString());
    });
    
    imageFiles.forEach(file => {
      payload.append("images", file);
    });

    if (editingProduct?.images) {
      payload.append("existingImages", JSON.stringify(editingProduct.images));
    }

    try {
      const res = await fetch(url, {
        method,
        body: payload
      });

      if (res.ok) {
        const data = await res.json();
        if (editingProduct) {
          setProducts(products.map(p => p._id === editingProduct._id ? data.product : p));
        } else {
          setProducts([data.product, ...products]);
        }
        setIsFormOpen(false);
        setEditingProduct(null);
        alert(editingProduct ? "Product updated!" : "Product created!");
        router.refresh();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to save product");
      }
    } catch (error) {
      alert("Error saving product");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    
    try {
      const res = await fetch(`/api/admin/adi-haat/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProducts(products.filter(p => p._id !== id));
        alert("Product deleted!");
      } else {
        alert("Failed to delete product");
      }
    } catch (error) {
      alert("Error deleting product");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <h2 style={{ margin: 0 }}>Manage Products</h2>
        <button 
          onClick={() => { setEditingProduct(null); setIsFormOpen(true); }}
          className="btn"
        >
          Add New Product
        </button>
      </div>

      {isFormOpen && (
        <div style={{ background: "var(--surface)", padding: "30px", borderRadius: "12px", border: "1px solid var(--border)", marginBottom: "40px", boxShadow: "var(--shadow-md)" }}>
          <h3 style={{ marginTop: 0 }}>{editingProduct ? "Edit Product" : "List New Product"}</h3>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
              <input type="text" placeholder="Product Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required style={{ padding: "12px", borderRadius: "8px", border: "1px solid var(--border)" }} />
              <select value={formData.artisanId} onChange={e => setFormData({...formData, artisanId: e.target.value})} required style={{ padding: "12px", borderRadius: "8px", border: "1px solid var(--border)" }}>
                <option value="">Select Artisan</option>
                {artisans.map(a => <option key={a._id} value={a._id}>{a.name}</option>)}
              </select>
            </div>
            <textarea placeholder="Product Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required rows={3} style={{ padding: "12px", borderRadius: "8px", border: "1px solid var(--border)", fontFamily: "inherit" }} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "15px" }}>
              <input type="number" placeholder="Price" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required style={{ padding: "12px", borderRadius: "8px", border: "1px solid var(--border)" }} />
              <input type="text" placeholder="Category" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} required style={{ padding: "12px", borderRadius: "8px", border: "1px solid var(--border)" }} />
              <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                <label style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Product Images (Multiple)</label>
                <input type="file" multiple onChange={e => setImageFiles(Array.from(e.target.files || []))} accept="image/*" style={{ padding: "5px", borderRadius: "8px", border: "1px solid var(--border)", fontSize: "0.85rem" }} />
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <input type="checkbox" checked={formData.inStock} onChange={e => setFormData({...formData, inStock: e.target.checked})} id="inStock" />
              <label htmlFor="inStock">In Stock (Available for Purchase)</label>
            </div>
            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              <button type="submit" className="btn" disabled={loading}>{loading ? "Saving..." : (editingProduct ? "Update Product" : "Add Product")}</button>
              <button type="button" onClick={() => { setIsFormOpen(false); setEditingProduct(null); }} className="btn" style={{ background: "transparent", color: "var(--text)", border: "1px solid var(--border)" }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div style={{ background: "var(--surface)", borderRadius: "12px", border: "1px solid var(--border)", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead style={{ background: "#f8fafc", borderBottom: "1px solid var(--border)" }}>
            <tr>
              <th style={{ padding: "15px" }}>Product</th>
              <th style={{ padding: "15px" }}>Artisan</th>
              <th style={{ padding: "15px" }}>Category</th>
              <th style={{ padding: "15px" }}>Price</th>
              <th style={{ padding: "15px" }}>Status</th>
              <th style={{ padding: "15px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product._id} style={{ borderBottom: "1px solid var(--border)" }}>
                <td style={{ padding: "15px" }}>
                  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    {product.images?.[0] && (
                        <div style={{ width: "40px", height: "40px", borderRadius: "4px", overflow: "hidden" }}>
                            <img src={product.images[0]} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt={product.name} />
                        </div>
                    )}
                    <div>
                        <div style={{ fontWeight: "bold" }}>{product.name}</div>
                        <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{product._id.substring(0,8)}...</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: "15px" }}>
                  {typeof product.artisanId === 'object' ? product.artisanId.name : product.artisanId}
                </td>
                <td style={{ padding: "15px" }}>{product.category}</td>
                <td style={{ padding: "15px" }}>₹{product.price}</td>
                <td style={{ padding: "15px" }}>
                  <span style={{ fontSize: "0.75rem", padding: "4px 8px", borderRadius: "12px", background: product.inStock ? "#e8f5e9" : "#fff1f0", color: product.inStock ? "#2e7d32" : "#cf1322" }}>
                    {product.inStock ? "IN STOCK" : "OUT OF STOCK"}
                  </span>
                </td>
                <td style={{ padding: "15px" }}>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button onClick={() => setEditingProduct(product)} style={{ padding: "4px 8px", borderRadius: "4px", border: "1px solid var(--primary)", background: "transparent", color: "var(--primary)", cursor: "pointer", fontSize: "0.8rem" }}>Edit</button>
                    <button onClick={() => handleDelete(product._id)} style={{ padding: "4px 8px", borderRadius: "4px", border: "1px solid #e74c3c", background: "transparent", color: "#e74c3c", cursor: "pointer", fontSize: "0.8rem" }}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
