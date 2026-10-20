import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./OrderDetails.css";
import type { Order } from "../../types/order";


const STATUS_OPTIONS = ["pending", "shipped", "delivered", "cancelled"];

const STATUS_COLORS: Record<string, string> = {
    pending: "od-badge--pending",
    shipped: "od-badge--shipped",
    delivered: "od-badge--delivered",
    cancelled: "od-badge--cancelled",
};

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

export default function OrderDetails() {
    const { orderId } = useParams<{ orderId: string }>();
    const navigate = useNavigate();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedStatus, setSelectedStatus] = useState("");
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        const fetch_ = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${import.meta.env.VITE_BASE_URL}/orders/${orderId}`, {
                    headers: { Authorization: `Bearer ${import.meta.env.VITE_TOKEN}` },
                });
                const data = await res.json();
                const o = data.order ?? data.data?.order ?? data;
                setOrder(o);
                setSelectedStatus(o.status);
            } catch {
                setOrder(null);
            } finally {
                setLoading(false);
            }
        };
        fetch_();
    }, [orderId]);

    const handleUpdateStatus = async () => {
        if (!order || selectedStatus === order.status) return;
        setUpdating(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_BASE_URL}/orders/${orderId}`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${import.meta.env.VITE_TOKEN}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ status: selectedStatus }),
            });
            if (!res.ok) {
                console.error(res);
                throw new Error();
            }
            setOrder((prev) => prev ? { ...prev, status: selectedStatus as Order["status"] } : prev);
        } catch {
            alert("Failed to update status.");
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return <div className="od-loading"><div className="od-spinner" /> Loading order...</div>;
    if (!order) return <div className="od-loading">Order not found.</div>;

    const totalItems = order.items?.reduce((s, i) => s + i.quantity, 0) ?? 0;

    return (
        <div className="container">
            <div className="od-breadcrumb">
                <span className="od-crumb" onClick={() => navigate("/dashboard")}>Dashboard</span>
                <span className="od-sep">›</span>
                <span className="od-crumb" onClick={() => navigate("/orders")}>Orders</span>
                <span className="od-sep">›</span>
                <span className="od-crumb od-crumb--active">Order #{order.id.slice(-6).toUpperCase()}</span>
            </div>

            <div className="od-page-header">
                <div className="od-page-header-left">
                    <button className="od-back-btn" onClick={() => navigate("/orders")}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M15 18l-6-6 6-6" />
                        </svg>
                    </button>
                    <div>
                        <h1 className="od-page-title">Order Details</h1>
                        <p className="od-page-subtitle">Order #{order.id.slice(-6).toUpperCase()}</p>
                    </div>
                </div>
                <span className={`od-badge ${STATUS_COLORS[order.status]}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
            </div>

            <div className="od-cards-row">
                <div className="od-card">
                    <div className="od-card-title">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                        </svg>
                        Customer Information
                    </div>
                    <div className="od-card-body">
                        <div className="od-field">
                            <span className="od-label">Name</span>
                            <span className="od-value">{order.user?.name ?? "—"}</span>
                        </div>
                        <div className="od-field">
                            <span className="od-label">Email</span>
                            <span className="od-value">{order.user?.email ?? "—"}</span>
                        </div>
                        <div className="od-field">
                            <span className="od-label">Phone</span>
                            <span className="od-value">{order.shippingAddress.phone}</span>
                        </div>
                        <div className="od-field">
                            <span className="od-label">Delivery Address</span>
                            <span className="od-value">{order.shippingAddress.address}, {order.shippingAddress.city}</span>
                        </div>
                    </div>
                </div>

                <div className="od-card">
                    <div className="od-card-title">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" />
                        </svg>
                        Payment Information
                    </div>
                    <div className="od-card-body">
                        <div className="od-field">
                            <span className="od-label">Payment Method</span>
                            <span className="od-value">{order.paymentMethod === "card" ? "Credit Card" : "Cash"}</span>
                        </div>
                        <div className="od-field">
                            <span className="od-label">Order Date</span>
                            <span className="od-value">{formatDate(order.createdAt)}</span>
                        </div>
                        <div className="od-field">
                            <span className="od-label">Total Amount</span>
                            <span className="od-value od-value--price">${order.totalOrder?.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                <div className="od-card">
                    <div className="od-card-title">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 10V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2" />
                            <path d="M12 12v9" /><path d="M3 10l9 2 9-2" />
                        </svg>
                        Order Status
                    </div>
                    <div className="od-card-body">
                        <div className="od-field">
                            <span className="od-label">Current Status</span>
                            <span className={`od-badge ${STATUS_COLORS[order.status]}`}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                        </div>
                        <div className="od-field od-field--col">
                            <span className="od-label">Update Status</span>
                            <div className="od-status-row">
                                <select
                                    className="od-status-select"
                                    value={selectedStatus}
                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                >
                                    {STATUS_OPTIONS.map((s) => (
                                        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                                    ))}
                                </select>
                                <button
                                    className="od-btn-update"
                                    onClick={handleUpdateStatus}
                                    disabled={updating || selectedStatus === order.status}
                                >
                                    {updating ? "Saving..." : "Save"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="od-section">
                <div className="od-section-title">Order Items ({totalItems})</div>

                <div className="od-items">
                    {order.items?.map((item) => (
                        <div key={item.id} className="od-item">
                            <div className="od-item-left">
                                <img
                                    className="od-item-img"
                                    src={item.image}
                                    alt={item.title}
                                    onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/56x56/f0f4f8/aab4c0?text=?"; }}
                                />
                                <div className="od-item-info">
                                    <span className="od-item-name">{item.title}</span>
                                    <span className="od-item-qty">Quantity: {item.quantity}</span>
                                </div>
                            </div>
                            <div className="od-item-right">
                                <span className="od-item-unit-label">Unit Price</span>
                                <span className="od-item-unit-price">${item.price?.toFixed(2)}</span>
                                <span className="od-item-subtotal">Subtotal: ${(item.price * item.quantity)?.toFixed(2)}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="od-summary">
                    {order.subTotal !== undefined && (
                        <div className="od-summary-row">
                            <span>Subtotal</span>
                            <span>${order.subTotal?.toFixed(2)}</span>
                        </div>
                    )}
                    {order.delivery !== undefined && (
                        <div className="od-summary-row">
                            <span>Delivery</span>
                            <span>${order.delivery?.toFixed(2)}</span>
                        </div>
                    )}
                    {order.taxPayed !== undefined && (
                        <div className="od-summary-row">
                            <span>Tax</span>
                            <span>${order.taxPayed?.toFixed(2)}</span>
                        </div>
                    )}
                    <div className="od-summary-row od-summary-total">
                        <span>Total Amount</span>
                        <span>${order.totalOrder?.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}