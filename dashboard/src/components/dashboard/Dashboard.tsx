import React from 'react'


interface StatCard {
    label: string;
    value: string;
    change: string;
    positive: boolean;
    icon: React.ReactNode;
    iconBg: string;
    iconColor: string;
}

import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

interface ActivityItem {
    id: number;
    title: string;
    subtitle: string;
    time: string;
}

const revenueData = [
    { month: "Jan", revenue: 4300 },
    { month: "Feb", revenue: 3100 },
    { month: "Mar", revenue: 4600 },
    { month: "Apr", revenue: 4500 },
    { month: "May", revenue: 6000 },
    { month: "Jun", revenue: 5800 },
];

const appointmentsData = [
    { day: "Mon", count: 13 },
    { day: "Tue", count: 20 },
    { day: "Wed", count: 15 },
    { day: "Thu", count: 26 },
    { day: "Fri", count: 23 },
    { day: "Sat", count: 18 },
    { day: "Sun", count: 10 },
];

const recentActivity: ActivityItem[] = [
    { id: 1, title: "New User", subtitle: "Sarah Johnson", time: "5 min ago" },
    { id: 2, title: "Doctor Request", subtitle: "Dr. Michael Chen", time: "15 min ago" },
    { id: 3, title: "New Order", subtitle: "Order #1234", time: "1 hour ago" },
    { id: 4, title: "New Appointment", subtitle: "John Doe with Dr. Smith", time: "2 hours ago" },
    { id: 5, title: "New User", subtitle: "Emily Davis", time: "3 hours ago" },
];

const UsersIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
);

const DoctorIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
);

const RevenueIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
);

const CalendarIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
);

// ─── Stat Cards config ────────────────────────────────
const statCards: StatCard[] = [
    {
        label: "Total Users",
        value: "1,284",
        change: "+12% from last month",
        positive: true,
        icon: <UsersIcon />,
        iconBg: "#e8f5f3",
        iconColor: "#2d9d8f",
    },
    {
        label: "Total Doctors",
        value: "156",
        change: "+5% from last month",
        positive: true,
        icon: <DoctorIcon />,
        iconBg: "#e8f5f3",
        iconColor: "#2d9d8f",
    },
    {
        label: "Total Revenue",
        value: "$24,500",
        change: "+18% from last month",
        positive: true,
        icon: <RevenueIcon />,
        iconBg: "#e8f5f3",
        iconColor: "#2d9d8f",
    },
    {
        label: "Total Appointments",
        value: "892",
        change: "+8% from last month",
        positive: true,
        icon: <CalendarIcon />,
        iconBg: "#fff3ee",
        iconColor: "#f07a3a",
    },
];

const RevenueTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div style={{
                background: "#fff",
                border: "1px solid #eef0f3",
                borderRadius: 8,
                padding: "8px 14px",
                boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
                fontSize: 13,
            }}>
                <p style={{ color: "#8a9fb0", marginBottom: 2 }}>{label}</p>
                <p style={{ color: "#1a2e2e", fontWeight: 600 }}>
                    ${payload[0].value.toLocaleString()}
                </p>
            </div>
        );
    }
    return null;
};

const AppointmentsTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div style={{
                background: "#fff",
                border: "1px solid #eef0f3",
                borderRadius: 8,
                padding: "8px 14px",
                boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
                fontSize: 13,
            }}>
                <p style={{ color: "#8a9fb0", marginBottom: 2 }}>{label}</p>
                <p style={{ color: "#1a2e2e", fontWeight: 600 }}>
                    {payload[0].value} appointments
                </p>
            </div>
        );
    }
    return null;
};

import "./dashboard.css"
const Dashboard = () => {
    return (
        <div className="dashboard-page">

            {/* Page Title */}
            <div className="dashboard-page__header">
                <h1 className="dashboard-page__title">Dashboard</h1>
                <p className="dashboard-page__subtitle">Welcome back, Admin!</p>
            </div>

            {/* Stat Cards */}
            <div className="stats-grid">
                {statCards.map((card) => (
                    <div key={card.label} className="stat-card">
                        <div className="stat-card__info">
                            <p className="stat-card__label">{card.label}</p>
                            <p className="stat-card__value">{card.value}</p>
                            <p className={`stat-card__change ${card.positive ? "stat-card__change--positive" : "stat-card__change--negative"}`}>
                                {card.change}
                            </p>
                        </div>
                        <div
                            className="stat-card__icon"
                            style={{ background: card.iconBg, color: card.iconColor }}
                        >
                            {card.icon}
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts */}
            <div className="charts-row">

                <div className="chart-card">
                    <h2 className="chart-card__title">Revenue Overview</h2>
                    <ResponsiveContainer width="100%" height={220}>
                        <LineChart data={revenueData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f2f5" vertical={false} />
                            <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#8a9fb0" }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 12, fill: "#8a9fb0" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                            <Tooltip content={<RevenueTooltip />} />
                            <Line
                                type="monotone"
                                dataKey="revenue"
                                stroke="#2d9d8f"
                                strokeWidth={2.5}
                                dot={{ fill: "#2d9d8f", r: 4, strokeWidth: 0 }}
                                activeDot={{ r: 6, fill: "#2d9d8f", strokeWidth: 0 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className="chart-card">
                    <h2 className="chart-card__title">Appointments This Week</h2>
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={appointmentsData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f2f5" vertical={false} />
                            <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#8a9fb0" }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 12, fill: "#8a9fb0" }} axisLine={false} tickLine={false} />
                            <Tooltip content={<AppointmentsTooltip />} />
                            <Bar dataKey="count" fill="#2d9d8f" radius={[6, 6, 0, 0]} maxBarSize={48} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

            </div>

            {/* Recent Activity */}
            <div className="activity-card">
                <h2 className="activity-card__title">Recent Activity</h2>
                <div>
                    {recentActivity.map((item) => (
                        <div key={item.id} className="activity-row">
                            <div>
                                <p className="activity-row__title">{item.title}</p>
                                <p className="activity-row__sub">{item.subtitle}</p>
                            </div>
                            <span className="activity-row__time">{item.time}</span>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    )
}

export default Dashboard