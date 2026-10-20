import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Appointments.css";
import SearchInput from "../searchBar/Search";
import Pagination from "../pagination/Pagination";

export interface Appointment {
    id: string;
    reason: string;
    status: string;
    date: string;

    owner: {
        id: string;
        name: string;
        profilePic?: string;
    };

    doctor: {
        id: string;
        name: string;
    };

    pet: {
        id: string;
        name: string;
        image?: string;
        type?: string;
        age?: number;
    };
}

const STATUS_OPTIONS = [
    "",
    "pending",
    "confirmed",
    "completed",
    "cancelled"
];

export default function AppointmentsManagement() {

    const navigate = useNavigate();

    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);

    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");

    const [status, setStatus] = useState("");

    // pagination
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalAppointments, setTotalAppointments] = useState(0);

    const LIMIT = 10;

    const fetchAppointments = useCallback(async () => {

        try {

            setLoading(true);

            const params = new URLSearchParams();

            params.set("page", String(page));
            params.set("limit", String(LIMIT));

            if (search) params.set("search", search);
            if (status) params.set("status", status);

            const res = await fetch(
                `${import.meta.env.VITE_BASE_URL}/appointments?${params.toString()}`,
                {
                    headers: {
                        Authorization: `Bearer ${import.meta.env.VITE_TOKEN}`
                    }
                }
            );


            const data = await res.json();


            setAppointments(data.appointments || []);
            setTotalPages(data.totalPages || 1);
            setTotalAppointments(data.totalAppointments || 0);

        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }

    }, [page, search, status]);

    useEffect(() => {
        fetchAppointments();
    }, [fetchAppointments]);

    useEffect(() => {
        setPage(1);
    }, [search, status]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setSearch(searchInput.trim());
    };

    useEffect(() => {

        const handler = setTimeout(() => {
            setSearch(searchInput);
            setPage(1);
        }, 500);

        return () => clearTimeout(handler);

    }, [searchInput]);

    return (
        <div className=" container">

            <div className="appointments-header">

                <div>
                    <h1 className="appointments-title">
                        Appointments
                    </h1>

                    <p className="appointments-subtitle">
                        Manage all appointments
                    </p>
                </div>

            </div>

            <div className="appointments-toolbar">

                <form
                    className="appointments-search-form"
                    onSubmit={handleSearch}
                >

                    <SearchInput
                        value={searchInput}
                        onChange={setSearchInput}
                        placeholder="Search by owner, pet, or doctor"
                    />

                    <button className="appointments-search-btn">
                        Search
                    </button>

                </form>

                <select
                    className="appointments-filter"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                >
                    {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                            {s || "All Status"}
                        </option>
                    ))}
                </select>

            </div>

            {/* TABLE */}
            <div className="appointments-card">

                <div className="appointments-count">
                    Total Appointments ({totalAppointments})
                </div>

                {
                    loading ?

                        <div className="appointments-loading">
                            Loading appointments...
                        </div>

                        :

                        <table className="appointments-table">

                            <thead>
                                <tr>
                                    <th>Owner</th>
                                    <th>Pet</th>
                                    <th>Doctor</th>
                                    <th>Reason</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                </tr>
                            </thead>

                            <tbody>

                                {
                                    appointments.length === 0 ?

                                        <tr>
                                            <td colSpan={6}>
                                                <div className="appointments-empty">
                                                    No appointments found
                                                </div>
                                            </td>
                                        </tr>

                                        :

                                        appointments.map((appointment) => (

                                            <tr
                                                key={appointment.id}
                                                className="appointments-row"
                                                onClick={() =>
                                                    navigate(`/appointments/${appointment.id}`)
                                                }
                                            >

                                                <td>
                                                    <div className="appointments-user">

                                                        {
                                                            appointment.owner?.profilePic ?

                                                                <img
                                                                    src={appointment.owner.profilePic}
                                                                    alt=""
                                                                    className="appointments-avatar"
                                                                />

                                                                :

                                                                <div className="appointments-avatar-placeholder">
                                                                    {appointment.owner?.name}
                                                                </div>
                                                        }

                                                        <span>
                                                            {appointment.owner?.name}
                                                        </span>

                                                    </div>
                                                </td>

                                                <td>
                                                    <div className="appointments-pet">
                                                        {appointment.pet?.name}
                                                    </div>
                                                </td>

                                                <td>
                                                    {appointment.doctor?.name}
                                                </td>

                                                <td className="appointments-reason">
                                                    {appointment.reason}
                                                </td>

                                                <td>
                                                    {
                                                        new Date(
                                                            appointment.date
                                                        ).toLocaleDateString()
                                                    }
                                                </td>

                                                <td>

                                                    <span className={`status-badge status-${appointment.status}`}>
                                                        {appointment.status}
                                                    </span>

                                                </td>

                                            </tr>

                                        ))
                                }

                            </tbody>

                        </table>
                }

                <Pagination
                    page={page}
                    totalPages={totalPages}
                    onChange={(p) => setPage(p)}
                />

            </div>

        </div>
    );
}