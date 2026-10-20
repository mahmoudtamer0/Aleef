import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import "./doctorsRequest.css";

import SearchInput from "../searchBar/Search";
import Pagination from "../pagination/Pagination";

const DoctorsRequests = () => {

    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(false);

    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalDoctors, setTotalDoctors] = useState(0);

    const LIMIT = 10;

    const navigate = useNavigate();

    const fetchDoctors = useCallback(async () => {

        setLoading(true);

        try {

            const params = new URLSearchParams();

            params.set("page", String(page));
            params.set("limit", String(LIMIT));
            params.set("status", "pending");

            if (search) {
                params.set("search", search);
            }

            const res = await fetch(
                `${import.meta.env.VITE_BASE_URL}/doctors/get-all-doctors?${params.toString()}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${import.meta.env.VITE_TOKEN}`
                    }
                }
            );

            const data = await res.json();


            setDoctors(data.doctors || []);
            setTotalPages(data.totalPages || 1);
            setTotalDoctors(data.totalDoctors || 0);

        } catch (err) {

            console.error(err);
            setDoctors([]);

        } finally {

            setLoading(false);

        }

    }, [page, search]);

    useEffect(() => {
        fetchDoctors();
    }, [fetchDoctors]);

    useEffect(() => {
        setPage(1);
    }, [search]);

    useEffect(() => {

        const handler = setTimeout(() => {

            setSearch(searchInput.trim());
            setPage(1);

        }, 500);

        return () => clearTimeout(handler);

    }, [searchInput]);

    const handleSearchSubmit = (e: React.FormEvent) => {

        e.preventDefault();

        setSearch(searchInput.trim());
        setPage(1);

    };

    const handleClear = () => {

        setSearch("");
        setSearchInput("");
        setPage(1);

    };

    const hasFilters = !!search;

    const goToProfile = (id: string) => {
        navigate(`/doctors/${id}`);
    };

    return (

        <div className="om-page">

            <div className="container">

                <div className="om-page-header">

                    <div>

                        <h1 className="om-page-title">
                            Doctors Requests Management
                        </h1>

                        <p className="om-page-subtitle">
                            Manage all doctors requests
                        </p>

                    </div>

                </div>

                <div className="om-toolbar">

                    <form
                        onSubmit={handleSearchSubmit}
                        className="om-search-form"
                    >

                        <SearchInput
                            value={searchInput}
                            onChange={setSearchInput}
                            placeholder="Search by name, email, phone..."
                        />

                        <button
                            type="submit"
                            className="om-btn-search"
                        >
                            Search
                        </button>

                    </form>

                    <div className="om-toolbar-right">

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

                        Doctors Requests ({totalDoctors})

                        {hasFilters && (
                            <span className="om-filtered-tag">
                                Filtered
                            </span>
                        )}

                    </div>

                    {loading ? (

                        <div className="om-loading">
                            <div className="om-spinner" />
                            Loading doctors requests...
                        </div>

                    ) : (

                        <table className="om-table">

                            <thead>

                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>City</th>
                                    <th>Specialization</th>
                                    <th>Status</th>
                                </tr>

                            </thead>

                            <tbody>

                                {doctors.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan={7}
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

                                            <p>No doctors requests found.</p>

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

                                            <td>{doctor.city}</td>

                                            <td>{doctor.specialization}</td>

                                            <td>

                                                <span className="om-badge om-badge--pending">
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

    );
};

export default DoctorsRequests;