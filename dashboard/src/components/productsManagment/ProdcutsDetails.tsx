import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ProductDetails.css";
import type { Product } from "../../types/product";
import EditModal from "./EditModal";

const CATEGORY_OPTIONS = ["Food", "Accessories", "Grooming", "Toys", "Medicine", "Other"];

interface EditModalProps {
    product: Product;
    onClose: () => void;
    onSave: (updated: Product) => void;
}

// function EditModal({ product, onClose, onSave }: EditModalProps) {
//     const categoryName =
//         Array.isArray(product.category)
//             ? product.category?.[0]?.name || ""
//             : product.category;
//     const [form, setForm] = useState({
//         title: product.title,
//         originalPrice: String(product.originalPrice),
//         discount: String(product.discount ?? 0),
//         stock: String(product.stock),
//         category: categoryName,
//         description: product.description ?? "",
//     });
//     const [imageFiles, setImageFiles] = useState<File[]>([]);
//     const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
//     const [imageUrls, setImageUrls] = useState<string[]>(
//         product.productImages?.map((i) => i.url) ?? []
//     );
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState("");

//     const handleChange = (
//         e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
//     ) => {
//         setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//     };

//     const removeImageUrl = (idx: number) => {
//         setImageUrls((prev) => prev.filter((_, i) => i !== idx));
//     };

//     const handleSave = async () => {
//         setError("");
//         setLoading(true);
//         try {
//             const token = import.meta.env.VITE_TOKEN;
//             const formData = new FormData();
//             if (form.title !== product.title) formData.append("title", form.title);
//             if (form.originalPrice !== String(product.originalPrice))
//                 formData.append("originalPrice", form.originalPrice);
//             if (form.discount !== String(product.discount ?? 0))
//                 formData.append("discount", form.discount);
//             if (form.stock !== String(product.stock)) formData.append("stock", form.stock);
//             if (form.category !== categoryName) formData.append("category", form.category);
//             if (form.description !== (product.description ?? ""))
//                 formData.append("description", form.description);

//             if (thumbnailFile) formData.append("thumbnail", thumbnailFile);
//             imageFiles.forEach((f) => formData.append("productImages", f));

//             const res = await fetch(`${import.meta.env.VITE_BASE_URL}/products/${product.id}`, {
//                 method: "PATCH",
//                 headers: { Authorization: `Bearer ${import.meta.env.VITE_TOKEN}` },
//                 body: formData,
//             });
//             console.log("Update response:", res);

//             if (!res.ok) throw new Error("Failed to update product");
//             const data = await res.json();

//             onSave(data.data?.product ?? data.product ?? data);
//             onClose();
//         } catch {
//             setError("Failed to save changes. Please try again.");
//         } finally {
//             window.location.reload();
//         }
//     };

//     return (
//         <div className="pd-modal-overlay" onClick={onClose}>
//             <div className="pd-modal" onClick={(e) => e.stopPropagation()}>
//                 <div className="pd-modal-header">
//                     <div>
//                         <h2 className="pd-modal-title">Edit Product</h2>
//                         <p className="pd-modal-subtitle">Update product information and images</p>
//                     </div>
//                     <button className="pd-modal-close" onClick={onClose}>×</button>
//                 </div>

//                 {error && <div className="pd-modal-error">{error}</div>}

//                 <div className="pd-modal-field">
//                     <label>Product Name</label>
//                     <input name="title" value={form.title} onChange={handleChange} />
//                 </div>

//                 <div className="pd-modal-row">
//                     <div className="pd-modal-field">
//                         <label>Price ($)</label>
//                         <input name="originalPrice" type="number" value={form.originalPrice} onChange={handleChange} />
//                     </div>
//                     <div className="pd-modal-field">
//                         <label>Discount (%)</label>
//                         <input name="discount" type="number" value={form.discount} onChange={handleChange} />
//                     </div>
//                     <div className="pd-modal-field">
//                         <label>Stock Quantity</label>
//                         <input name="stock" type="number" value={form.stock} onChange={handleChange} />
//                     </div>
//                 </div>

//                 <div className="pd-modal-field">
//                     <label>Category</label>
//                     <select name="category" value={form.category} onChange={handleChange}>
//                         {CATEGORY_OPTIONS.map((c) => <option key={c}>{c}</option>)}
//                     </select>
//                 </div>

//                 <div className="pd-modal-field">
//                     <label>Description</label>
//                     <textarea name="description" value={form.description} onChange={handleChange} rows={3} />
//                 </div>

//                 <div className="pd-modal-field">
//                     <label>Thumbnail</label>
//                     <input
//                         type="file"
//                         accept="image/*"
//                         onChange={(e) => setThumbnailFile(e.target.files?.[0] ?? null)}
//                     />
//                 </div>

//                 <div className="pd-modal-field">
//                     <label>Product Images</label>
//                     {imageUrls.map((url, idx) => (
//                         <div key={idx} className="pd-modal-img-row">
//                             <input type="text" value={url} readOnly className="pd-modal-img-url" />
//                             <button className="pd-modal-img-remove" onClick={() => removeImageUrl(idx)}>×</button>
//                         </div>
//                     ))}
//                     <input
//                         type="file"
//                         accept="image/*"
//                         multiple
//                         onChange={(e) => setImageFiles(Array.from(e.target.files ?? []).slice(0, 5))}
//                         className="pd-modal-file"
//                     />
//                     {imageFiles.length > 0 && (
//                         <p className="pd-modal-file-count">{imageFiles.length} new image(s) selected</p>
//                     )}
//                 </div>

//                 <div className="pd-modal-actions">
//                     <button className="pd-btn-primary" onClick={handleSave} disabled={loading}>
//                         {loading ? "Saving..." : "Save Changes"}
//                     </button>
//                     <button className="pd-btn-ghost" onClick={onClose}>Cancel</button>
//                 </div>
//             </div>
//         </div>
//     );
// }

export default function ProductDetails() {
    const { prodId } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);
    const [showEdit, setShowEdit] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${import.meta.env.VITE_BASE_URL}/products/${prodId}`, {
                    headers: { Authorization: `Bearer ${import.meta.env.VITE_TOKEN}` },
                });
                //   if (!res.ok) throw new Error();
                const data = await res.json();
                setProduct(data.product);

            } catch {
                setProduct(null);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [prodId]);



    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        try {
            const res = await fetch(`${import.meta.env.VITE_BASE_URL}/products/${prodId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${import.meta.env.VITE_TOKEN}` },
            });
            if (!res.ok) throw new Error("Failed to delete product")
            navigate("/products");
        } catch {
            alert("you are not allowed to delete this product")
        }
    };

    if (loading) return <div className="pd-loading">Loading product...</div>;
    if (!product) return <div className="pd-loading">Product not found.</div>;

    const allImages = [
        ...(product.productImages?.map((i) => i.url) ?? []),
    ];

    const displayPrice = product.finalPrice ?? product.originalPrice;

    return (
        <div className="container">
            {/* Breadcrumb */}
            <div className="pd-breadcrumb">
                <span onClick={() => navigate("/dashboard")} className="pd-crumb">Dashboard</span>
                <span className="pd-crumb-sep">›</span>
                <span onClick={() => navigate("/products")} className="pd-crumb">Products</span>
                <span className="pd-crumb-sep">›</span>
                <span className="pd-crumb pd-crumb-active">{product.title}</span>
            </div>

            {/* Page header */}
            <div className="pd-page-header">
                <div className="pd-page-header-left">
                    <button className="pd-back-btn" onClick={() => navigate("/products")}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M15 18l-6-6 6-6" />
                        </svg>
                    </button>
                    <div>
                        <h1 className="pd-page-title">Product Details</h1>
                        <p className="pd-page-subtitle">View and manage product information</p>
                    </div>
                </div>
                <div className="pd-header-actions">
                    <button className="pd-btn-edit-header" onClick={() => setShowEdit(true)}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                        Edit Product
                    </button>
                    <button className="pd-btn-delete-header" onClick={handleDelete}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                            <path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4h6v2" />
                        </svg>
                        Delete
                    </button>
                </div>
            </div>

            {/* Images section */}
            <div className="pd-section">
                <div className="pd-section-title">Product Images</div>
                <div className="pd-gallery">
                    <div className="pd-main-image">
                        {allImages.length > 0 ? (
                            <img src={allImages[activeImage]} alt={product.title} />
                        ) : (
                            <div className="pd-no-image">No image available</div>
                        )}
                    </div>
                    {allImages.length > 1 && (
                        <div className="pd-thumbnails">
                            {allImages.map((url, idx) => (
                                <button
                                    key={idx}
                                    className={`pd-thumb ${idx === activeImage ? "pd-thumb-active" : ""}`}
                                    onClick={() => setActiveImage(idx)}
                                >
                                    <img src={url} alt={`view ${idx + 1}`} />
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Info section */}
            <div className="pd-section">
                <div className="pd-section-title">Product Information</div>
                <div className="pd-info">
                    <h2 className="pd-info-name">{product.title}</h2>
                    <div className="pd-info-price">${displayPrice?.toFixed(2)}</div>

                    {product.discount > 0 && (
                        <div className="pd-info-original">
                            Original: <s>${product.originalPrice?.toFixed(2)}</s>
                            <span className="pd-discount-badge">-{product.discount}%</span>
                        </div>
                    )}

                    <div className="pd-info-grid">
                        <div>
                            <div className="pd-info-label">Category</div>
                            <div className="pd-category-list">
                                {Array.isArray(product.categories) ? (
                                    product.categories.map((cat: any) => (
                                        <span key={cat.id} className="pd-category-badge">
                                            {cat.name}
                                        </span>
                                    ))
                                ) : (
                                    <span className="pd-category-badge">
                                        {product.categories}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div>
                            <div className="pd-info-label">Stock Quantity</div>
                            <div className="pd-info-value">{product.stock} units</div>
                        </div>
                        {product.buys !== undefined && (
                            <div>
                                <div className="pd-info-label">Total Sales</div>
                                <div className="pd-info-value">{product.buys} sold</div>
                            </div>
                        )}
                    </div>

                    {product.description && (
                        <div className="pd-info-desc-block">
                            <div className="pd-info-label">Description</div>
                            <p className="pd-info-desc">{product.description}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Actions section */}
            <div className="pd-section">
                <div className="pd-section-title">Actions</div>
                <div className="pd-bottom-actions">
                    <button className="pd-btn-primary" onClick={() => setShowEdit(true)}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                        Edit Product
                    </button>
                    <button className="pd-btn-delete" onClick={handleDelete}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                            <path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4h6v2" />
                        </svg>
                        Delete Product
                    </button>
                </div>
            </div>

            {showEdit && product && (
                <EditModal
                    product={product}
                    onClose={() => setShowEdit(false)}
                />
            )}
        </div>
    );
}