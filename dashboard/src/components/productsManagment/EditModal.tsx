import { useState } from "react";

import "./EditModal.css";
const CATEGORY_OPTIONS = ["Food", "Accessories", "Grooming", "Toys", "Medicine", "Other"];

interface EditModalProps {
    product: any;
    onClose: () => void;
}

export default function EditModal({ product, onClose }: EditModalProps) {
    const [title, setTitle] = useState(product.title ?? "");
    const [description, setDescription] = useState(product.description ?? "");
    const [originalPrice, setOriginalPrice] = useState(String(product.originalPrice ?? ""));
    const [discount, setDiscount] = useState(String(product.discount ?? "0"));
    const [stock, setStock] = useState(String(product.stock ?? ""));
    const [category, setCategory] = useState(product.category?.[0]?.name ?? product.category ?? "");
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [productImages, setProductImages] = useState<File[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSave = async () => {
        if (loading) return; // ← امنع double click

        setLoading(true);
        setError("");
        try {
            const formData = new FormData();

            formData.append("title", title);
            formData.append("description", description);
            formData.append("originalPrice", originalPrice);
            formData.append("discount", discount);
            formData.append("stock", stock);
            formData.append("category", category);

            if (thumbnail) formData.append("thumbnail", thumbnail);
            productImages.forEach((img) => formData.append("productImages", img));

            const res = await fetch(`${import.meta.env.VITE_BASE_URL}/products/${product.id}`, {
                method: "PATCH",
                headers: { Authorization: `Bearer ${import.meta.env.VITE_TOKEN}` },
                body: formData,
            });

            if (!res.ok) throw new Error("failed");

            window.location.reload();
        } catch {
            setError("Failed to save changes. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="em-overlay" onClick={onClose}>
            <div className="em-modal" onClick={(e) => e.stopPropagation()}>
                <h2 className="em-title">Edit Product</h2>

                {error && <p className="em-error">{error}</p>}

                <label className="em-label">Title
                    <input className="em-input" value={title} onChange={(e) => setTitle(e.target.value)} />
                </label>

                <label className="em-label">Description
                    <textarea className="em-input em-textarea" value={description} onChange={(e) => setDescription(e.target.value)} />
                </label>

                <div className="em-row">
                    <label className="em-label">Price
                        <input className="em-input" type="number" value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} />
                    </label>
                    <label className="em-label">Discount %
                        <input className="em-input" type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} />
                    </label>
                    <label className="em-label">Stock
                        <input className="em-input" type="number" value={stock} onChange={(e) => setStock(e.target.value)} />
                    </label>
                </div>

                <label className="em-label">Category
                    <select className="em-input" value={category} onChange={(e) => setCategory(e.target.value)}>
                        {CATEGORY_OPTIONS.map((c) => <option key={c}>{c}</option>)}
                    </select>
                </label>

                <label className="em-label">Thumbnail
                    <input className="em-input" type="file" accept="image/*" onChange={(e) => setThumbnail(e.target.files?.[0] ?? null)} />
                </label>

                <label className="em-label">Product Images
                    <input className="em-input" type="file" accept="image/*" multiple onChange={(e) => setProductImages(Array.from(e.target.files ?? []))} />
                </label>

                <div className="em-actions">
                    <button className="em-btn-primary" onClick={handleSave} disabled={loading}>
                        {loading ? "Saving..." : "Save"}
                    </button>
                    <button className="em-btn-ghost" onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
}