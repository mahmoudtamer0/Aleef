import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./Orders.css";
import type { Order } from "../../types/order";
import SearchInput from "../searchBar/Search";
import Pagination from "../pagination/Pagination";



const STATUS_OPTIONS = ["pending", "shipped", "delivered", "cancelled"];
const SORT_OPTIONS = [
    { value: "newest", label: "Newest" },
    { value: "oldest", label: "Oldest" },
    { value: "priciest", label: "Price: High to Low" },
    { value: "cheapest", label: "Price: Low to High" },
];

const STATUS_COLORS: Record<string, string> = {
    pending: "om-badge--pending",
    shipped: "om-badge--shipped",
    delivered: "om-badge--delivered",
    cancelled: "om-badge--cancelled",
};

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

export default function Orders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [sort, setSort] = useState("newest");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalOrders, setTotalOrders] = useState(0);
    const navigate = useNavigate();
    const LIMIT = 10;

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.set("page", String(page));
            params.set("limit", String(LIMIT));
            if (search) params.set("search", search);
            if (status) params.set("status", status);
            if (sort) params.set("sort", sort);

            const res = await fetch(`${import.meta.env.VITE_BASE_URL}/orders?${params.toString()}`, {
                headers: { Authorization: `Bearer ${import.meta.env.VITE_TOKEN}` },
            });
            const data = await res.json();
            setOrders(data.orders);
            setTotalPages(data.totalPages ?? 1);
            setTotalOrders(data.totalOrders ?? 0);
        } catch {
            setOrders([]);
        } finally {
            setLoading(false);
        }
    }, [page, search, status, sort]);

    useEffect(() => { fetchOrders(); }, [fetchOrders]);
    useEffect(() => { setPage(1); }, [search, status, sort]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setSearch(searchInput.trim());
    };

    const handleClear = () => {
        setSearch("");
        setSearchInput("");
        setStatus("");
        setSort("newest");
        setPage(1);
    };

    const hasFilters = !!(search || status || sort !== "newest");

    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1)
        .filter((n) => n === 1 || n === totalPages || Math.abs(n - page) <= 1)
        .reduce<(number | "...")[]>((acc, n, idx, arr) => {
            if (idx > 0 && n - (arr[idx - 1] as number) > 1) acc.push("...");
            acc.push(n);
            return acc;
        }, []);

    useEffect(() => {

        const handler = setTimeout(() => {
            setSearch(searchInput);
            setPage(1);
        }, 500);

        return () => clearTimeout(handler);

    }, [searchInput]);

    return (
        <div className="container">
            <div className="om-page-header">
                <div>
                    <h1 className="om-page-title">Orders Management</h1>
                    <p className="om-page-subtitle">View and manage all orders</p>
                </div>
            </div>

            <div className="om-toolbar">
                <form className="om-search-form" onSubmit={handleSearch}>
                    <SearchInput
                        value={searchInput}
                        onChange={setSearchInput}
                        placeholder="Search by customer, address, city..."
                    />
                    <button type="submit" className="om-btn-search">Search</button>
                </form>

                <div className="om-toolbar-right">
                    <select className="om-select" value={status} onChange={(e) => setStatus(e.target.value)}>
                        <option value="">All Statuses</option>
                        {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                        ))}
                    </select>
                    <select className="om-select" value={sort} onChange={(e) => setSort(e.target.value)}>
                        {SORT_OPTIONS.map((o) => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                    </select>
                    {hasFilters && (
                        <button className="om-btn-clear" onClick={handleClear}>✕ Clear</button>
                    )}
                </div>
            </div>

            <div className="om-table-card">
                <div className="om-table-label">
                    All Orders ({totalOrders})
                    {hasFilters && <span className="om-filtered-tag">Filtered</span>}
                </div>

                {loading ? (
                    <div className="om-loading">
                        <div className="om-spinner" />
                        Loading orders...
                    </div>
                ) : (
                    <table className="om-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Total Price</th>
                                <th>Payment</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="om-empty">
                                        <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#c4cdd8" strokeWidth="1.5">
                                            <path d="M9 17H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5" />
                                            <path d="M14 21l2 2 4-4" />
                                        </svg>
                                        <p>No orders found.</p>
                                        {hasFilters && (
                                            <button className="om-btn-clear" onClick={handleClear}>Clear filters</button>
                                        )}
                                    </td>
                                </tr>
                            ) : (
                                orders?.map((o) => (
                                    <tr key={o.id} className="om-table-row" onClick={() => navigate(`/orders/${o.id}`)}>
                                        <td className="om-id-cell">#{o.id.slice(-6).toUpperCase()}</td>
                                        <td>
                                            <div className="om-customer-cell">
                                                <span className="om-customer-name">{o.user?.name ?? "—"}</span>
                                                <span className="om-customer-city">{o.shippingAddress.city}</span>
                                            </div>
                                        </td>
                                        <td className="om-price">${o.totalOrder?.toFixed(2)}</td>
                                        <td className="om-payment">
                                            {o.paymentMethod === "card" ? "Credit Card" : "Cash"}
                                        </td>
                                        <td className="om-date">{formatDate(o.createdAt)}</td>
                                        <td>
                                            <span className={`om-badge ${STATUS_COLORS[o.status]}`}>
                                                {o.status.charAt(0).toUpperCase() + o.status.slice(1)}
                                            </span>
                                        </td>
                                        <td onClick={(e) => e.stopPropagation()}>
                                            <button className="om-btn-view" onClick={() => navigate(`/orders/${o.id}`)}>
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                    <circle cx="12" cy="12" r="3" />
                                                </svg>
                                                View
                                            </button>
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
        </div>
    );
}