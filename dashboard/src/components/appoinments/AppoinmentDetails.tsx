import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./AppointmentDetails.css";

interface Appointment {
    id: string;
    owner: { id: string; name: string; email: string; profilePic: string };
    doctor: { id: string; name: string; specialization: string; profilePic: string };
    pet: { id: string; name: string; type: string; gender: string; profilePic: string };
    date: string;
    time: string;
    reason?: string;
    notes?: string;
    price?: number;
    status: "pending" | "accepted" | "rejected" | "completed" | "cancelled";
    rejectionReason?: string | null;
    expiresAt?: string | null;
    createdAt: string;
}

const STATUS_OPTIONS = ["pending", "accepted", "rejected", "completed", "cancelled-by-owner", "cancelled-by-doctor"];

const STATUS_COLORS: Record<string, string> = {
    pending: "ad-badge--pending",
    accepted: "ad-badge--accepted",
    rejected: "ad-badge--rejected",
    completed: "ad-badge--completed",
    "cancelled-by-owner": "ad-badge--cancelled",
    "cancelled-by-doctor": "ad-badge--cancelled",
};

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

function getInitials(name: string) {
    return name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) ?? "?";
}

export default function AppointmentDetails() {
    const { appointmentId } = useParams<{ appointmentId: string }>();
    const navigate = useNavigate();
    const [appointment, setAppointment] = useState<Appointment | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedStatus, setSelectedStatus] = useState("");
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        const fetchAppointment = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${import.meta.env.VITE_BASE_URL}/appointments/details-for-admin/${appointmentId}`, {
                    headers: { Authorization: `Bearer ${import.meta.env.VITE_TOKEN}` },
                });
                const data = await res.json();
                const appt = data.appointment ?? data.data?.appointment ?? data;
                setAppointment(appt);
                setSelectedStatus(appt.status);
            } catch {
                setAppointment(null);
            } finally {
                setLoading(false);
            }
        };
        fetchAppointment();
    }, [appointmentId]);

    const handleUpdateStatus = async () => {
        if (!appointment || selectedStatus === appointment.status) return;
        setUpdating(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_BASE_URL}/appointments/change-status/${appointmentId}`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${import.meta.env.VITE_TOKEN}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ status: selectedStatus }),
            });
            if (!res.ok) throw new Error();
            setAppointment((prev) => prev ? { ...prev, status: selectedStatus as Appointment["status"] } : prev);
        } catch {
            alert("Failed to update status.");
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="ad-loading">
                <div className="ad-spinner" />
                Loading appointment...
            </div>
        );
    }

    if (!appointment) {
        return <div className="ad-loading">Appointment not found.</div>;
    }

    return (
        <div className="container">
            <div className="ad-breadcrumb">
                <span className="ad-crumb" onClick={() => navigate("/dashboard")}>Dashboard</span>
                <span className="ad-sep">›</span>
                <span className="ad-crumb" onClick={() => navigate("/appointments")}>Appointments</span>
                <span className="ad-sep">›</span>
                <span className="ad-crumb ad-crumb--active">#{appointment.id.slice(-6).toUpperCase()}</span>
            </div>

            <div className="ad-page-header">
                <div className="ad-page-header-left">
                    <button className="ad-back-btn" onClick={() => navigate("/appointments")}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M15 18l-6-6 6-6" />
                        </svg>
                    </button>
                    <div>
                        <h1 className="ad-page-title">Appointment Details</h1>
                        <p className="ad-page-subtitle">#{appointment.id.slice(-6).toUpperCase()}</p>
                    </div>
                </div>
                <span className={`ad-badge ${STATUS_COLORS[appointment.status]}`}>
                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                </span>
            </div>

            <div className="ad-cards-row">
                <div className="ad-card">
                    <div className="ad-card-title">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                        </svg>
                        Owner Information
                    </div>
                    <div className="ad-card-body">
                        <div className="ad-profile-row">
                            {appointment.owner?.profilePic ? (
                                <img className="ad-profile-pic" src={appointment.owner.profilePic} alt={appointment.owner.name} />
                            ) : (
                                <div className="ad-profile-fallback">{getInitials(appointment.owner?.name ?? "")}</div>
                            )}
                            <div>
                                <div className="ad-profile-name">{appointment.owner?.name ?? "—"}</div>
                                <div className="ad-profile-sub">{appointment.owner?.email ?? "—"}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="ad-card">
                    <div className="ad-card-title">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                        </svg>
                        Doctor Information
                    </div>
                    <div className="ad-card-body">
                        <div className="ad-profile-row">
                            {appointment.doctor?.profilePic ? (
                                <img className="ad-profile-pic" src={appointment.doctor.profilePic} alt={appointment.doctor.name} />
                            ) : (
                                <div className="ad-profile-fallback ad-profile-fallback--doctor">{getInitials(appointment.doctor?.name ?? "")}</div>
                            )}
                            <div>
                                <div className="ad-profile-name">{appointment.doctor?.name ?? "—"}</div>
                                <div className="ad-profile-sub">{appointment.doctor?.specialization ?? "—"}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="ad-card">
                    <div className="ad-card-title">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 8v4l3 3" />
                        </svg>
                        Update Status
                    </div>
                    <div className="ad-card-body">
                        <div className="ad-field">
                            <span className="ad-label">Current Status</span>
                            <span className={`ad-badge ${STATUS_COLORS[appointment.status]}`}>
                                {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                            </span>
                        </div>
                        <div className="ad-field ad-field--col">
                            <span className="ad-label">Change To</span>
                            <div className="ad-status-row">
                                <select
                                    className="ad-status-select"
                                    value={selectedStatus}
                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                >
                                    {STATUS_OPTIONS.map((s) => (
                                        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                                    ))}
                                </select>
                                <button
                                    className="ad-btn-update"
                                    onClick={handleUpdateStatus}
                                    disabled={updating || selectedStatus === appointment.status}
                                >
                                    {updating ? "Saving..." : "Save"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="ad-cards-row">
                <div className="ad-card">
                    <div className="ad-card-title">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                            <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        Appointment Info
                    </div>
                    <div className="ad-card-body">
                        <div className="ad-info-grid">
                            <div className="ad-field">
                                <span className="ad-label">Date</span>
                                <span className="ad-value">{formatDate(appointment.date)}</span>
                            </div>
                            <div className="ad-field">
                                <span className="ad-label">Time</span>
                                <span className="ad-value">{appointment.time}</span>
                            </div>
                            {appointment.price !== undefined && appointment.price !== null && (
                                <div className="ad-field">
                                    <span className="ad-label">Price</span>
                                    <span className="ad-value ad-value--price">${appointment.price?.toFixed(2)}</span>
                                </div>
                            )}
                            <div className="ad-field">
                                <span className="ad-label">Created At</span>
                                <span className="ad-value">{formatDate(appointment.createdAt)}</span>
                            </div>
                        </div>
                        {appointment.reason && (
                            <div className="ad-field ad-field--full">
                                <span className="ad-label">Reason</span>
                                <p className="ad-text-block">{appointment.reason}</p>
                            </div>
                        )}
                        {appointment.notes && (
                            <div className="ad-field ad-field--full">
                                <span className="ad-label">Notes</span>
                                <p className="ad-text-block">{appointment.notes}</p>
                            </div>
                        )}
                        {appointment.rejectionReason && (
                            <div className="ad-field ad-field--full">
                                <span className="ad-label">Rejection Reason</span>
                                <p className="ad-text-block ad-text-block--danger">{appointment.rejectionReason}</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="ad-card">
                    <div className="ad-card-title">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                        Pet Information
                    </div>
                    <div className="ad-card-body">
                        <div className="ad-profile-row">
                            {appointment.pet?.profilePic ? (
                                <img className="ad-profile-pic ad-profile-pic--pet" src={appointment.pet.profilePic} alt={appointment.pet.name} />
                            ) : (
                                <div className="ad-profile-fallback ad-profile-fallback--pet">{getInitials(appointment.pet?.name ?? "")}</div>
                            )}
                            <div>
                                <div className="ad-profile-name">{appointment.pet?.name ?? "—"}</div>
                                <div className="ad-profile-sub">
                                    {appointment.pet?.type && <span className="ad-pet-tag">{appointment.pet.type}</span>}
                                    {appointment.pet?.gender && <span className="ad-pet-tag">{appointment.pet.gender}</span>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}