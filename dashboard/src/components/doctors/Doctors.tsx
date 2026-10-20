import React, { useEffect, useState } from 'react'
import type { Doctor } from '../../types/doctor'
import "./doctors.css"
import Pagination from '../pagination/Pagination'
import SearchInput from '../searchBar/Search'
import { useNavigate } from 'react-router-dom'

const Doctors = () => {

    const [doctors, setDoctors] = useState<Doctor[]>([])
    const [isLoading, setIsLoading] = useState(false)

    const [searchInput, setSearchInput] = useState("")
    const [search, setSearch] = useState("")

    const [statusFilter, setStatusFilter] = useState("")
    const [sortBy, setSortBy] = useState("latest")

    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalDoctors, setTotalDoctors] = useState(0)

    const LIMIT = 10

    useEffect(() => {

        const fetchDoctors = async () => {

            setIsLoading(true)

            try {

                const params = new URLSearchParams()

                params.set("page", String(page))
                params.set("limit", String(LIMIT))

                if (search) params.set("search", search)
                if (statusFilter) params.set("status", statusFilter)
                if (sortBy) params.set("sort", sortBy)

                const res = await fetch(
                    `${import.meta.env.VITE_BASE_URL}/doctors/get-all-doctors?${params.toString()}`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${import.meta.env.VITE_TOKEN}`
                        }
                    }
                )

                const data = await res.json()

                setDoctors(data.doctors || [])
                setTotalPages(data.totalPages || 1)
                setTotalDoctors(data.totalDoctors || 0)

            } catch (err) {

                console.error(err)
                setDoctors([])

            } finally {

                setIsLoading(false)

            }
        }

        fetchDoctors()

    }, [page, search, statusFilter, sortBy])

    useEffect(() => {
        setPage(1)
    }, [search, statusFilter, sortBy])

    useEffect(() => {

        const handler = setTimeout(() => {

            setSearch(searchInput.trim())
            setPage(1)

        }, 500)

        return () => clearTimeout(handler)

    }, [searchInput])

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setSearch(searchInput.trim())
        setPage(1)
    }

    const handleClear = () => {

        setSearch("")
        setSearchInput("")
        setStatusFilter("")
        setSortBy("latest")
        setPage(1)

    }

    const hasFilters = !!(
        search ||
        statusFilter ||
        sortBy !== "latest"
    )
    const navigate = useNavigate();

    const goToProfile = (id: string) => {
        navigate(`/doctors/${id}`);
    };

    return (

        <div className="om-page">

            <div className="container">

                <div className="om-page-header">
                    <div>
                        <h1 className="om-page-title">
                            Doctors Management
                        </h1>

                        <p className="om-page-subtitle">
                            Manage all doctors
                        </p>
                    </div>
                </div>

                <div className="om-toolbar">

                    <form
                        className="om-search-form"
                        onSubmit={handleSearchSubmit}
                    >

                        <SearchInput
                            value={searchInput}
                            onChange={setSearchInput}
                            placeholder="Search by name, email, or specialization..."
                        />

                        <button
                            type="submit"
                            className="om-btn-search"
                        >
                            Search
                        </button>

                    </form>

                    <div className="om-toolbar-right">

                        <select
                            className="om-select"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="">All Statuses</option>
                            <option value="active">Active</option>
                            <option value="banned">Banned</option>
                        </select>

                        <select
                            className="om-select"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="latest">Latest</option>
                            <option value="appointments">Appointments</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="rejected">Rejected</option>
                        </select>

                        {hasFilters && (
                            <button
                                className="om-btn-clear"
                                onClick={handleClear}
                            >
                                ✕ Clear
                            </button>
                        )}

                    </div>

                </div>

                <div className="om-table-card">

                    <div className="om-table-label">
                        All Doctors ({totalDoctors})

                        {hasFilters && (
                            <span className="om-filtered-tag">
                                Filtered
                            </span>
                        )}
                    </div>

                    {isLoading ? (

                        <div className="om-loading">
                            <div className="om-spinner" />
                            Loading doctors...
                        </div>

                    ) : (

                        <table className="om-table">

                            <thead>

                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Specialization</th>
                                    <th>Appointments</th>
                                    <th>Completed</th>
                                    <th>Cancelled</th>
                                    <th>Rejected</th>
                                    <th>Status</th>
                                </tr>

                            </thead>

                            <tbody>

                                {doctors.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan={10}
                                            className="om-empty"
                                        >

                                            <svg
                                                width="38"
                                                height="38"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="#c4cdd8"
                                                strokeWidth="1.5"
                                            >
                                                <path d="M9 17H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5" />
                                                <path d="M14 21l2 2 4-4" />
                                            </svg>

                                            <p>No doctors found.</p>

                                            {hasFilters && (
                                                <button
                                                    className="om-btn-clear"
                                                    onClick={handleClear}
                                                >
                                                    Clear filters
                                                </button>
                                            )}

                                        </td>

                                    </tr>

                                ) : (

                                    doctors.map((doctor: any) => (

                                        <tr
                                            key={doctor.id}
                                            className="om-table-row"
                                            onClick={() => goToProfile(doctor.id)}
                                        >

                                            <td>

                                                <div className="om-customer-cell">

                                                    <span className="om-customer-name">
                                                        {doctor.name}
                                                    </span>

                                                </div>

                                            </td>

                                            <td>{doctor.email}</td>

                                            <td>{doctor.phone}</td>

                                            <td>
                                                {doctor.specialization}
                                            </td>

                                            <td>
                                                {doctor.totalAppointments || 0}
                                            </td>

                                            <td>
                                                {doctor.completedAppointments || 0}
                                            </td>

                                            <td>
                                                {doctor.cancelledAppointments || 0}
                                            </td>

                                            <td>
                                                {doctor.rejectedAppointments || 0}
                                            </td>

                                            <td>

                                                <span
                                                    className={`om-badge ${doctor.status === "active"
                                                        ? "om-badge--active"
                                                        : doctor.status === "pending"
                                                            ? "om-badge--pending"
                                                            : "om-badge--banned"
                                                        }`}
                                                >
                                                    {doctor.status}
                                                </span>

                                            </td>

                                        </tr>

                                    ))

                                )}

                            </tbody>

                        </table>

                    )}

                    <Pagination
                        page={page}
                        totalPages={totalPages}
                        onChange={setPage}
                    />

                </div>

            </div>

        </div>

    )
}

export default Doctors