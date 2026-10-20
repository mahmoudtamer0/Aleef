import React, { useEffect, useState } from 'react'
import "./users.css"
import type { User } from '../../types/user'
import { useNavigate } from "react-router-dom";
import Pagination from '../pagination/Pagination';
import SearchInput from '../searchBar/Search';

const Users = () => {

    const [users, setUsers] = useState<User[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isBtnLoading, setIsBtnLoading] = useState(false)

    const [totalPages, setTotalPages] = useState(1)
    const [totalUsers, setTotalUsers] = useState(0)
    const [results, setResults] = useState(1)

    const [searchInput, setSearchInput] = useState("")
    const [search, setSearch] = useState("")

    const [page, setPage] = useState(1)

    const navigate = useNavigate();

    useEffect(() => {

        const fetchUsers = async () => {

            setIsLoading(true)

            try {

                const params = new URLSearchParams();

                params.set("limit", "5");
                params.set("page", String(page));

                if (search) {
                    params.set("search", search);
                }

                const res = await fetch(
                    `${import.meta.env.VITE_BASE_URL}/users/get-all-users?${params.toString()}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${import.meta.env.VITE_TOKEN}`
                        }
                    }
                )

                const data = await res.json()


                setUsers(data.users || [])
                setTotalPages(data.totalPages || 1)
                setTotalUsers(data.totalUsers || 0)
                setResults(data.results || 0)

            } catch (err) {

                console.error(err)
                setUsers([])

            } finally {

                setIsLoading(false)

            }
        }

        fetchUsers()

    }, [page, search])

    useEffect(() => {

        const handler = setTimeout(() => {

            setSearch(searchInput.trim())
            setPage(1)

        }, 500)

        return () => clearTimeout(handler)

    }, [searchInput])

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setSearch(searchInput.trim());
        setPage(1);
    };

    const handleBan = async (userId: string) => {

        try {

            setIsBtnLoading(true)

            const res = await fetch(`${import.meta.env.VITE_BASE_URL}/users/baan-user/${userId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${import.meta.env.VITE_TOKEN}`
                },
                body: JSON.stringify({ banAction: "ban" })
            })

            if (!res.ok) throw new Error("Failed")

            setUsers(prev =>
                prev.map(user =>
                    user.id === userId
                        ? { ...user, status: "banned" }
                        : user
                )
            )

        } catch (err: any) {
            alert("You ar not allowed to ban this user")
        } finally {

            setIsBtnLoading(false)

        }
    }

    const handleUnBan = async (userId: string) => {

        try {

            setIsBtnLoading(true)

            const res = await fetch(`${import.meta.env.VITE_BASE_URL}/users/baan-user/${userId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${import.meta.env.VITE_TOKEN}`
                },
                body: JSON.stringify({ banAction: "remove" })
            })

            if (!res.ok) throw new Error("Failed")

            setUsers(prev =>
                prev.map(user =>
                    user.id === userId
                        ? { ...user, status: "active" }
                        : user
                )
            )

        } catch (err) {

            console.error(err)

        } finally {

            setIsBtnLoading(false)

        }
    }

    const goToProfile = (userId: string) => {
        navigate(`/users/${userId}`);
    }

    return (
        <div className="om-page">

            <div className="container">

                <div className="om-page-header">
                    <div>
                        <h1 className="om-page-title">
                            Users Management
                        </h1>

                        <p className="om-page-subtitle">
                            Manage all registered users
                        </p>
                    </div>
                </div>

                <div className="om-toolbar">

                    <form
                        className="om-search-form"
                        onSubmit={handleSearch}
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

                </div>

                <div className="om-table-card">

                    <div className="om-table-label">
                        All Users ({totalUsers})
                    </div>

                    {isLoading ? (

                        <div className="om-loading">
                            <div className="om-spinner" />
                            Loading users...
                        </div>

                    ) : (

                        <table className="om-table">

                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Join Date</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>

                                {users.length === 0 ? (

                                    <tr>
                                        <td
                                            colSpan={6}
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
                                                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                                <circle cx="8.5" cy="7" r="4" />
                                                <line x1="20" y1="8" x2="20" y2="14" />
                                                <line x1="23" y1="11" x2="17" y2="11" />
                                            </svg>

                                            <p>No users found.</p>

                                        </td>
                                    </tr>

                                ) : (

                                    users.map((user) => (

                                        <tr
                                            key={user.id}
                                            className="om-table-row"
                                            onClick={() => goToProfile(user.id)}
                                        >

                                            <td>
                                                <div className="om-customer-cell">

                                                    <span className="om-customer-name">
                                                        {user.name}
                                                    </span>

                                                </div>
                                            </td>

                                            <td>
                                                {user.email}
                                            </td>

                                            <td>
                                                {user.phone}
                                            </td>

                                            <td className="om-date">
                                                {new Date(user.createdAt)
                                                    .toLocaleDateString()}
                                            </td>

                                            <td>

                                                <span
                                                    className={`om-badge ${user.status === "active"
                                                        ? "om-badge--active"
                                                        : "om-badge--banned"
                                                        }`}
                                                >
                                                    {user.status}
                                                </span>

                                            </td>

                                            <td
                                                onClick={(e) => e.stopPropagation()}
                                            >

                                                <div className="om-actions">

                                                    <button
                                                        className="om-btn-view"
                                                        disabled={isBtnLoading}
                                                        onClick={() => goToProfile(user.id)}
                                                    >

                                                        <svg
                                                            width="14"
                                                            height="14"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                        >
                                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                            <circle cx="12" cy="12" r="3" />
                                                        </svg>

                                                        View

                                                    </button>

                                                    {user.status === "active" ? (

                                                        <button
                                                            disabled={isBtnLoading}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleBan(user.id);
                                                            }}
                                                            className="om-btn-danger"
                                                        >
                                                            Ban
                                                        </button>

                                                    ) : (

                                                        <button
                                                            disabled={isBtnLoading}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleUnBan(user.id);
                                                            }}
                                                            className="om-btn-success"
                                                        >
                                                            Unban
                                                        </button>

                                                    )}

                                                </div>

                                            </td>

                                        </tr>

                                    ))

                                )}

                            </tbody>

                        </table>

                    )}



                </div>

                {totalPages > 1 && (

                    <Pagination
                        page={page}
                        totalPages={totalPages}
                        onChange={setPage}
                    />

                )}

            </div>

        </div>
    )
}

export default Users