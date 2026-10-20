import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./ProductsManagement.css";
import type { Product } from "../../types/product";
import SearchInput from "../searchBar/Search";
import Pagination from "../pagination/Pagination";

interface AddProductModalProps {
    onClose: () => void;
    onSave: () => void;
}

const CATEGORY_OPTIONS = ["Food", "Accessories", "Dogs", "Toys", "Cats", "healthcare"];
const SORT_OPTIONS = [
    { value: "", label: "Latest" },
    { value: "best-selling", label: "Best Selling" },
    { value: "on-sale", label: "On Sale" },
    { value: "min-price", label: "Price: Low to High" },
    { value: "max-price", label: "Price: High to Low" },
];

function AddProductModal({ onClose, onSave }: AddProductModalProps) {
    const [form, setForm] = useState({
        title: "",
        originalPrice: "",
        discount: "0",
        stock: "",
        description: "",
    });
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const toggleCategory = (cat: string) => {
        setSelectedCategories((prev) =>
            prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
        );
    };

    const handleSubmit = async () => {
        setError("");
        if (!form.title || !form.originalPrice || !form.stock || selectedCategories.length === 0) {
            setError("Please fill all required fields and select at least one category.");
            return;
        }
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("title", form.title);
            formData.append("originalPrice", form.originalPrice);
            formData.append("discount", form.discount);
            formData.append("stock", form.stock);
            formData.append("description", form.description);
            // multiple categories
            formData.append("categories", JSON.stringify(selectedCategories));


            if (thumbnailFile) formData.append("thumbnail", thumbnailFile);
            imageFiles.forEach((f) => formData.append("productImages", f));

            const res = await fetch(`${import.meta.env.VITE_BASE_URL}/products`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${import.meta.env.VITE_TOKEN}`,
                },
                body: formData,
            });

            if (!res.ok) throw new Error("Failed to add product");
            onSave();
            onClose();
        } catch {
            setError("Failed to add product. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pm-modal-overlay" onClick={onClose}>
            <div className="pm-modal" onClick={(e) => e.stopPropagation()}>
                <div className="pm-modal-header">
                    <div>
                        <h2 className="pm-modal-title">Add Product</h2>
                        <p className="pm-modal-subtitle">Fill in the new product details</p>
                    </div>
                    <button className="pm-modal-close" onClick={onClose}>×</button>
                </div>

                {error && <div className="pm-modal-error">{error}</div>}

                <div className="pm-modal-field">
                    <label>Product Name</label>
                    <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. Premium Dog Food" />
                </div>

                <div className="pm-modal-row">
                    <div className="pm-modal-field">
                        <label>Price ($)</label>
                        <input name="originalPrice" type="number" value={form.originalPrice} onChange={handleChange} placeholder="0.00" />
                    </div>
                    <div className="pm-modal-field">
                        <label>Discount (%)</label>
                        <input name="discount" type="number" value={form.discount} onChange={handleChange} placeholder="0" />
                    </div>
                    <div className="pm-modal-field">
                        <label>Stock Quantity</label>
                        <input name="stock" type="number" value={form.stock} onChange={handleChange} placeholder="0" />
                    </div>
                </div>

                <div className="pm-modal-field">
                    <label>Categories</label>
                    <div className="pm-categories">
                        {CATEGORY_OPTIONS.map((cat) => (
                            <button
                                key={cat}
                                type="button"
                                className={`pm-cat-btn ${selectedCategories.includes(cat) ? "pm-cat-btn--active" : ""}`}
                                onClick={() => toggleCategory(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                    {selectedCategories.length === 0 && (
                        <p className="pm-cat-hint">Select at least one category</p>
                    )}
                </div>

                <div className="pm-modal-field">
                    <label>Description</label>
                    <textarea name="description" value={form.description} onChange={handleChange} rows={3} placeholder="Product description..." />
                </div>

                <div className="pm-modal-field">
                    <label>Thumbnail</label>
                    <input type="file" accept="image/*" onChange={(e) => setThumbnailFile(e.target.files?.[0] ?? null)} />
                </div>

                <div className="pm-modal-field">
                    <label>Product Images (up to 5)</label>
                    <input type="file" accept="image/*" multiple onChange={(e) => setImageFiles(Array.from(e.target.files ?? []).slice(0, 5))} />
                </div>

                <div className="pm-modal-actions">
                    <button className="pm-btn-primary" onClick={handleSubmit} disabled={loading}>
                        {loading ? "Saving..." : "Add Product"}
                    </button>
                    <button className="pm-btn-ghost" onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
}

function getCategoryName(category: any): string {
    if (Array.isArray(category) && category.length > 0) {
        return category.map((c: any) => c.name).join(", ");
    }
    if (typeof category === "string") return category;
    return "—";
}

export default function ProductsManagement() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const navigate = useNavigate();
    // Search & filter state
    const [search, setSearch] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [category, setCategory] = useState("");
    const [sort, setSort] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");

    // Pagination
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);
    const LIMIT = 10;

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.set("page", String(page));
            params.set("limit", String(LIMIT));
            if (search) params.set("search", search);
            if (category) params.set("category", category);
            if (sort) params.set("sort", sort);
            if (minPrice) params.set("minPrice", minPrice);
            if (maxPrice) params.set("maxPrice", maxPrice);

            const res = await fetch(`${import.meta.env.VITE_BASE_URL}/products?${params.toString()}`, {
                headers: { Authorization: `Bearer ${import.meta.env.VITE_TOKEN}` },
            });
            const data = await res.json();
            setProducts(data.products ?? []);
            setTotalPages(data.totalPages ?? 1);
            setTotalProducts(data.totalProducts ?? 0);
        } catch {
            setProducts([]);
        } finally {
            setLoading(false);
        }
    }, [page, search, category, sort, minPrice, maxPrice]);

    useEffect(() => { fetchProducts(); }, [fetchProducts]);

    useEffect(() => { setPage(1); }, [search, category, sort, minPrice, maxPrice]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setSearch(searchInput.trim());
    };

    const handleClearFilters = () => {
        setSearch("");
        setSearchInput("");
        setCategory("");
        setSort("");
        setMinPrice("");
        setMaxPrice("");
        setPage(1);
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        try {
            const res = await fetch(`${import.meta.env.VITE_BASE_URL}/products/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${import.meta.env.VITE_TOKEN}` },
            });

            if (!res.ok) throw new Error("Failed to delete product")
            fetchProducts();
        } catch {
            alert("you are not allowed to delete this product")
        }
    };

    const hasActiveFilters = !!(search || category || sort || minPrice || maxPrice);

    useEffect(() => {
        const handler = setTimeout(() => {
            setSearch(searchInput);
            setPage(1);
        }, 500);
        return () => clearTimeout(handler);
    }, [searchInput]);

    return (
        <div className="pm-page">
            <div className="pm-page-header">
                <div>
                    <h1 className="pm-page-title">Products Management</h1>
                    <p className="pm-page-subtitle">Manage shop products</p>
                </div>
                <button className="pm-btn-add" onClick={() => setShowAddModal(true)}>
                    <span>+</span> Add Product
                </button>
            </div>

            <div className="pm-toolbar">
                <form className="pm-search-form" onSubmit={handleSearch}>
                    <SearchInput
                        value={searchInput}
                        onChange={setSearchInput}
                        placeholder="Search by name, category..."
                    />
                    <button type="submit" className="pm-btn-search">Search</button>
                </form>

                <div className="pm-toolbar-right">
                    <button
                        className={`pm-btn-filter ${showFilters ? "pm-btn-filter--active" : ""}`}
                        onClick={() => setShowFilters((v) => !v)}
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="4" y1="6" x2="20" y2="6" /><line x1="8" y1="12" x2="16" y2="12" /><line x1="11" y1="18" x2="13" y2="18" />
                        </svg>
                        Filters
                        {hasActiveFilters && <span className="pm-filter-dot" />}
                    </button>

                    <select className="pm-sort-select" value={sort} onChange={(e) => setSort(e.target.value)}>
                        {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                </div>
            </div>

            {showFilters && (
                <div className="pm-filters-panel">
                    <div className="pm-filters-grid">
                        <div className="pm-filter-field">
                            <label>Category</label>
                            <select value={category} onChange={(e) => setCategory(e.target.value)}>
                                <option value="">All Categories</option>
                                {CATEGORY_OPTIONS.map((c) => <option key={c}>{c}</option>)}
                            </select>
                        </div>
                        <div className="pm-filter-field">
                            <label>Min Price ($)</label>
                            <input type="number" placeholder="0" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} min={0} />
                        </div>
                        <div className="pm-filter-field">
                            <label>Max Price ($)</label>
                            <input type="number" placeholder="Any" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} min={0} />
                        </div>
                    </div>
                    {hasActiveFilters && (
                        <button className="pm-btn-clear" onClick={handleClearFilters}>
                            ✕ Clear all filters
                        </button>
                    )}
                </div>
            )}

            <div className="pm-table-card">
                <div className="pm-table-label">
                    All Products ({totalProducts})
                    {hasActiveFilters && <span className="pm-filtered-tag">Filtered</span>}
                </div>

                {loading ? (
                    <div className="pm-loading">
                        <div className="pm-spinner" />
                        Loading products...
                    </div>
                ) : (
                    <table className="pm-table">
                        <thead>
                            <tr>
                                <th>Product Name</th>
                                <th>Price</th>
                                <th>Category</th>
                                <th>Stock</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="pm-empty">
                                        <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#c4cdd8" strokeWidth="1.5">
                                            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                                        </svg>
                                        <p>No products found.</p>
                                        {hasActiveFilters && (
                                            <button className="pm-btn-clear" onClick={handleClearFilters}>Clear filters</button>
                                        )}
                                    </td>
                                </tr>
                            ) : (
                                products.map((p) => (
                                    <tr key={p.id} className="pm-table-row" onClick={() => navigate(`/products/${p.id}`)}>
                                        <td>
                                            <div className="pm-product-cell">
                                                {p.thumbnail?.url && (
                                                    <img className="pm-product-thumb" src={p.thumbnail.url} alt={p.title} />
                                                )}
                                                <span>{p.title}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="pm-price-cell">
                                                <span className="pm-price">${(p.finalPrice ?? p.originalPrice)?.toFixed(2)}</span>
                                                {p.discount > 0 && (
                                                    <span className="pm-discount-badge">-{p.discount}%</span>
                                                )}
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                                                {Array.isArray(p.categories)
                                                    ? p.categories.map((c: any) => (
                                                        <span key={c.id} className="pm-category-pill">{c.name}</span>
                                                    ))
                                                    : <span className="pm-category-pill">{p.categories}</span>
                                                }
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`pm-stock ${p.stock <= 10 ? "pm-stock--low" : ""}`}>
                                                {p.stock}
                                                {p.stock <= 10 && <span className="pm-stock-warn"> · Low</span>}
                                            </span>
                                        </td>
                                        <td onClick={(e) => e.stopPropagation()}>
                                            <div className="pm-actions">
                                                <button className="pm-btn-edit" onClick={() => navigate(`/products/${p.id}`)}>
                                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                                    </svg>
                                                    Edit
                                                </button>
                                                <button className="pm-btn-delete" onClick={(e) => handleDelete(p.id, e)}>
                                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <polyline points="3 6 5 6 21 6" />
                                                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                                                        <path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4h6v2" />
                                                    </svg>
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            <Pagination
                page={page}
                totalPages={totalPages}
                onChange={(p) => setPage(p)}
            />

            {showAddModal && (
                <AddProductModal onClose={() => setShowAddModal(false)} onSave={fetchProducts} />
            )}
        </div>
    );
}