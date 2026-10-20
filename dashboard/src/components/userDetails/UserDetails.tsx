import React, { useEffect, useState } from 'react'
import "./userDetails.css"
import { useParams } from 'react-router-dom'
import type { User } from '../../types/user'
import type { Pet } from '../../types/pet'
import type { Appointment } from '../appoinments/Appointments'
const UserDetails = () => {
    const { userId } = useParams()

    const [user, setUser] = useState<User>()
    const [pets, setPets] = useState<Pet[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [appoinments, setAppoinments] = useState<Appointment[]>([])

    console.log(user)

    useEffect(() => {
        setIsLoading(true)
        fetch(`${import.meta.env.VITE_BASE_URL}/users/${userId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${import.meta.env.VITE_TOKEN}`
            }
        }
        )
            .then(data => data.json())
            .then(data => {
                setUser(data.user)
                setPets(data.user.pets)
                setAppoinments(data.appointments)
            })
            .finally(() => setIsLoading(false))

        // fetch(`${import.meta.env.VITE_BASE_URL}/pets/get-user-pets/${userId}`, {
        //     method: "GET",
        //     headers: {
        //         "Content-Type": "application/json",
        //         "Authorization": `Bearer ${import.meta.env.VITE_TOKEN}`
        //     }
        // }
        // )
        //     .then(data => data.json())
        //     .then(data => setPets(data.pets))
        //     .finally(() => setIsLoading(false))

    }, [])




    return (
        <>
            {
                !isLoading ?

                    <>
                        <div className="container">

                            <nav className="breadcrumb">
                                <a href="#">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                        <polyline points="9 22 9 12 15 12 15 22" />
                                    </svg>
                                    Dashboard
                                </a>
                                <span className="breadcrumb__sep">›</span>
                                <a href="#">Users</a>
                                <span className="breadcrumb__sep">›</span>
                                <span className="breadcrumb__current">{user?.name}</span>
                            </nav>

                            <div className="page-header">
                                <div className="page-header__left">
                                    <button className="btn-back" title="Go back">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                                            <polyline points="15 18 9 12 15 6" />
                                        </svg>
                                    </button>
                                    <div className="page-header__titles">
                                        <h1 className="page-header__title">User Details</h1>
                                        <p className="page-header__subtitle">View and manage user information</p>
                                    </div>
                                </div>

                            </div>

                            <div className="card">
                                <p className="card__section-title">Profile Information</p>

                                <div className="profile-top">
                                    <img src={user?.profilePic} className="profile-avatar--placeholder" alt='...' />
                                    <div>
                                        <div className="profile-name-row">
                                            <span className="profile-name">{user?.name}</span>
                                            <span className="badge badge--active">{user?.status}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="info-grid">
                                    <div className="info-field">
                                        <p className="info-field__label">Email Address</p>
                                        <p className="info-field__value">{user?.email}</p>
                                    </div>
                                    <div className="info-field">
                                        <p className="info-field__label">Phone Number</p>
                                        <p className="info-field__value">{user?.phone}</p>
                                    </div>
                                    <div className="info-field">
                                        <p className="info-field__label">Registration Date</p>
                                        <p className="info-field__value">{user?.createdAt?.toLocaleString().split("T")[0]}</p>
                                    </div>
                                    <div className="info-field">
                                        <p className="info-field__label">Number of Pets</p>
                                        <p className="info-field__value">2</p>
                                    </div>
                                </div>
                            </div>

                            <div className="card">
                                <div className="pets-header">
                                    <p className="card__section-title pets-title">
                                        Pets ({pets?.length || 0})
                                    </p>
                                </div>

                                {
                                    pets && pets.length > 0 ? (
                                        <div className="pets-grid">
                                            {pets.map((pet: Pet) => (
                                                <div className="pet-card" key={pet.id}>
                                                    <img
                                                        src={pet.profilePic || "https://placehold.co/80x80"}
                                                        alt={pet.name}
                                                        className="pet-card__image"
                                                    />

                                                    <div className="pet-card__content">
                                                        <div className="pet-card__top">
                                                            <h3 className="pet-card__name">{pet.name}</h3>

                                                            {/* <span className={`pet-badge ${pet.healthStatus === "Healthy"
                                                                ? "pet-badge--healthy"
                                                                : "pet-badge--warning"
                                                                }`}>
                                                                {pet.healthStatus || "Healthy"}
                                                            </span> */}
                                                        </div>

                                                        <p className="pet-card__type">
                                                            {pet.type}
                                                        </p>

                                                        <p className="pet-card__age">
                                                            {pet.age ? `${pet.age} years old` : "—"}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="pets-empty">
                                            No pets found for this user.
                                        </div>
                                    )
                                }


                            </div>

                            <div className="card">
                                {
                                    appoinments && appoinments.length > 0 ? (
                                        <div className="pets-grid">
                                            {appoinments.map((appointment: Appointment) => (
                                                <div className="pet-card" key={appointment.id}>
                                                    <img
                                                        src={appointment.pet?.image}
                                                        alt={appointment.pet?.name}
                                                        className="pet-card__image"
                                                    />

                                                    <div className="pet-card__content">
                                                        <div className="pet-card__top">
                                                            <h3 className="pet-card__name">{appointment.pet?.name}</h3>

                                                            {/* <span className={`pet-badge ${pet.healthStatus === "Healthy"
                                                                ? "pet-badge--healthy"
                                                                : "pet-badge--warning"
                                                                }`}>
                                                                {pet.healthStatus || "Healthy"}
                                                            </span> */}
                                                        </div>

                                                        <p className="pet-card__type">
                                                            {appointment.pet?.type}
                                                        </p>

                                                        <p className="pet-card__age">
                                                            {appointment.pet?.age ? `${appointment.pet?.age} years old` : "—"}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="pets-empty">
                                            <div className="pets-empty-title">
                                                Appointments
                                            </div>
                                            <div className="pets-empty-subtitle">
                                                0 appointment(s)
                                            </div>
                                        </div>
                                    )
                                }
                            </div>

                            <div className="card">
                                <p className="card__section-title">Actions</p>

                                <div className="actions-row">

                                    <div className="input-group">
                                        <label>Ban Days</label>
                                        <input
                                            className="input-ban"
                                            id="banDays"
                                            type="number"
                                            min="1"
                                            max="365"
                                            placeholder="e.g. 7"
                                        />
                                    </div>

                                    <button className="btn-ban" >
                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <circle cx="12" cy="12" r="10" />
                                            <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                                        </svg>
                                        Ban User
                                    </button>

                                </div>
                            </div>

                        </div>


                        <div className="modal-overlay" id="banModal" >
                            <div className="modal">
                                <div className="modal__icon">
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <circle cx="12" cy="12" r="10" />
                                        <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                                    </svg>
                                </div>
                                <h2 className="modal__title">Ban User</h2>
                                <p className="modal__desc">
                                    Are you sure you want to ban <span>Sarah Johnson</span> for
                                    <span id="modalDays">—</span> day(s)?<br />
                                    They won't be able to access the platform during this period.
                                </p>
                                <div className="modal__actions">
                                    <button className="btn-cancel">Cancel</button>
                                    <button className="btn-confirm-ban">Yes, Ban User</button>
                                </div>
                            </div>
                        </div>
                    </>
                    :

                    <div className="container">

                        {/* ── Breadcrumb ── */}
                        <div className="sk-breadcrumb">
                            <div className="sk" style={{ width: 90, height: 14 }} />
                            <div className="sk" style={{ width: 8, height: 14, borderRadius: 2 }} />
                            <div className="sk" style={{ width: 50, height: 14 }} />
                            <div className="sk" style={{ width: 8, height: 14, borderRadius: 2 }} />
                            <div className="sk" style={{ width: 110, height: 14 }} />
                        </div>

                        {/* ── Page Header ── */}
                        <div className="sk-header">
                            <div className="sk-header__left">
                                {/* back button */}
                                <div className="sk sk--btn" style={{ width: 36, height: 36 }} />
                                <div className="sk-header__titles">
                                    <div className="sk" style={{ width: 160, height: 22 }} />
                                    <div className="sk" style={{ width: 210, height: 14 }} />
                                </div>
                            </div>
                            {/* edit button */}
                            <div className="sk sk--btn" style={{ width: 110, height: 38 }} />
                        </div>

                        {/* ── Profile Card ── */}
                        <div className="sk-card">
                            {/* section title */}
                            <div className="sk-section-title">
                                <div className="sk" style={{ width: 140, height: 14 }} />
                            </div>

                            {/* avatar + name */}
                            <div className="sk-profile-top">
                                <div className="sk sk--circle" style={{ width: 80, height: 80 }} />
                                <div className="sk-profile-meta">
                                    <div className="sk-name-row">
                                        <div className="sk" style={{ width: 160, height: 22 }} />
                                        <div className="sk sk--rounded" style={{ width: 58, height: 22 }} />
                                    </div>
                                </div>
                            </div>

                            {/* info fields */}
                            <div className="sk-info-grid">
                                <div className="sk-field">
                                    <div className="sk" style={{ width: 90, height: 12 }} />
                                    <div className="sk" style={{ width: 200, height: 16 }} />
                                </div>
                                <div className="sk-field">
                                    <div className="sk" style={{ width: 90, height: 12 }} />
                                    <div className="sk" style={{ width: 150, height: 16 }} />
                                </div>
                                <div className="sk-field">
                                    <div className="sk" style={{ width: 110, height: 12 }} />
                                    <div className="sk" style={{ width: 120, height: 16 }} />
                                </div>
                                <div className="sk-field">
                                    <div className="sk" style={{ width: 100, height: 12 }} />
                                    <div className="sk" style={{ width: 40, height: 16 }} />
                                </div>
                            </div>
                        </div>

                        {/* ── Actions Card ── */}
                        <div className="sk-card">
                            {/* section title */}
                            <div className="sk-section-title">
                                <div className="sk" style={{ width: 70, height: 14 }} />
                            </div>

                            <div className="sk-actions-row">
                                <div className="sk-input-group">
                                    <div className="sk" style={{ width: 65, height: 12 }} />
                                    <div className="sk sk--btn" style={{ width: 130, height: 38 }} />
                                </div>
                                <div className="sk sk--btn" style={{ width: 110, height: 38 }} />
                            </div>
                        </div>

                    </div>
            }

        </>
    )
}

export default UserDetails