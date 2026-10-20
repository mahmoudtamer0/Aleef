import React, { useEffect, useState } from 'react'
import type { Doctor } from '../../types/doctor';
import { useParams } from 'react-router-dom';
import "./doctorReqDetails.css"
import ChargeDoctorPopup from './chargeDoctorPopUp'
import RejectDoctorPopup from './RejectDoctorPopUp';
import AcceptDoctorReq from './AcceptDoctorReq';
import BanDoctor from './BanDoctor';
const DoctorReqDetails = () => {
    const { doctorId } = useParams()

    const [doctor, setDoctor] = useState<Doctor>()
    const [isLoading, setIsLoading] = useState(false)
    const [isBtnLoading, setIsBtnLoading] = useState(false)
    const [isChargeOpen, setIsChargeOpen] = useState(false)
    const [isRejectOpen, setIsRejectOpen] = useState(false)
    const [isApproveOpen, setIsApproveOpen] = useState(false)
    const [isBanOpen, setIsBanOpen] = useState(false)


    useEffect(() => {
        setIsLoading(true)
        fetch(`${import.meta.env.VITE_BASE_URL}/doctors/details-for-admin/${doctorId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${import.meta.env.VITE_TOKEN}`
            }
        }
        )
            .then(data => data.json())
            .then(data => {
                setDoctor(data.doctorProfile)
            })
            .finally(() => setIsLoading(false))


    }, [])



    const approveRequest = async () => {
        try {
            setIsBtnLoading(true);

            const res = await fetch(
                `${import.meta.env.VITE_BASE_URL}/doctors/approve-request/${doctorId}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${import.meta.env.VITE_TOKEN}`
                    },
                }
            );

            const data = await res.json();


            if (!res.ok) throw new Error(data.message || "Failed request");

            setDoctor(prev => {
                if (!prev) return prev;
                return { ...prev, status: "active" };
            });

        } catch (err) {
            console.error(err);
        } finally {
            setIsBtnLoading(false);
        }
    };

    return (
        <>
            {
                !isLoading ?
                    <div className="container">

                        <nav className="dr-breadcrumb">
                            <a href="/dashboard"> Dashboard</a>
                            <span className="dr-breadcrumb__sep">›</span>
                            <a href="/doctor-requests">Doctor Requests</a>
                            <span className="dr-breadcrumb__sep">›</span>
                            <span className="dr-breadcrumb__current">{doctor?.name}</span>
                        </nav>

                        <div className="dr-header">
                            <div className="dr-header__left">
                                <button className="btn-back" onClick={() => history.back()} title="Go back">

                                </button>
                                <div className="dr-header__titles">
                                    <h1 className="dr-header__title">Doctor Request Details</h1>
                                    <p className="dr-header__subtitle">Review doctor registration request</p>
                                </div>
                            </div>

                            <span className={`status-badge status-badge--${doctor?.status}`}>
                                {doctor?.status}
                            </span>
                        </div>

                        <div className="dr-card">
                            <h2 className="dr-card__title">Personal Information</h2>

                            <div className="dr-profile-top">
                                {doctor?.profilePic ? (
                                    <img src={doctor?.profilePic} alt={doctor?.name} className="dr-avatar" />
                                ) : (
                                    <div className="dr-avatar--placeholder">
                                        {doctor?.name.includes(" ") ? doctor?.name.split(" ").map(w => w[0]).join("").slice(0, 2) : doctor?.name.slice(0, 2)}
                                    </div>
                                )}
                                <p className="dr-name">{doctor?.name}</p>
                                {doctor?.status === "active" && <button className="dr-btn-charge" onClick={() => setIsChargeOpen(true)}>Charge Balance</button>}
                            </div>

                            <div className="dr-info-grid">
                                <div>
                                    <p className="dr-field__label">Email Address</p>
                                    <p className="dr-field__value">{doctor?.email}</p>
                                </div>
                                <div>
                                    <p className="dr-field__label">Phone Number</p>
                                    <p className="dr-field__value">{doctor?.phone}</p>
                                </div>
                                <div>
                                    <p className="dr-field__label">City</p>
                                    <p className="dr-field__value">{doctor?.city}</p>
                                </div>
                                <div>
                                    <p className="dr-field__label">Experience</p>
                                    <p className="dr-field__value">4</p>
                                </div>
                            </div>
                        </div>

                        <div className="dr-card">
                            <h2 className="dr-card__title">Professional Information</h2>
                            <div className="dr-info-col">
                                <div>
                                    <p className="dr-field__label">Specialization</p>
                                    <p className="dr-field__value">{doctor?.specialization}</p>
                                </div>
                                <div>
                                    <p className="dr-field__label">Years of Experience</p>
                                    <p className="dr-field__value">4</p>
                                </div>
                            </div>
                        </div>
                        <div className="dr-card">
                            <h2 className="dr-card__title">Identity Verification</h2>
                            <p className="dr-card__subtitle">Selfie photo submitted by the doctor for identity verification</p>

                            <div className="dr-verification-selfie">
                                {doctor?.documents?.identity_verification ? (
                                    <div className="dr-selfie-wrapper">
                                        <div className="dr-selfie-badge">
                                            <span className="dr-selfie-badge__icon">📷</span>
                                            <span>Selfie Photo</span>
                                        </div>
                                        <img
                                            src={doctor?.documents?.identity_verification}
                                            alt="Doctor selfie"
                                            className="dr-selfie-img"
                                            onClick={() => window.open(doctor?.documents?.identity_verification, "_blank")}
                                        />
                                        <a
                                            href={doctor?.documents?.identity_verification}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="dr-img-view-btn"
                                        >
                                            View Full Image ↗
                                        </a>
                                    </div>
                                ) : (
                                    <div className="dr-img-placeholder">
                                        <span className="dr-img-placeholder__icon">🤳</span>
                                        <p>No selfie image provided</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="dr-card">
                            <h2 className="dr-card__title">National ID</h2>
                            <p className="dr-card__subtitle">Front and back photos of the doctor's national ID card</p>

                            <div className="dr-nationalid-grid">
                                <div className="dr-nationalid-item">
                                    <div className="dr-nationalid-item__label">
                                        <span className="dr-nationalid-item__label-dot dr-nationalid-item__label-dot--front"></span>
                                        Front Side
                                    </div>
                                    {doctor?.documents?.national_id_front ? (
                                        <div className="dr-nationalid-img-wrapper">
                                            <img
                                                src={doctor?.documents?.national_id_front}
                                                alt="National ID Front"
                                                className="dr-nationalid-img"
                                                onClick={() => window.open(doctor?.documents?.national_id_front, "_blank")}
                                            />
                                            <a
                                                href={doctor?.documents?.national_id_front}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="dr-img-view-btn"
                                            >
                                                View Full Image ↗
                                            </a>
                                        </div>
                                    ) : (
                                        <div className="dr-img-placeholder">
                                            <span className="dr-img-placeholder__icon">🪪</span>
                                            <p>No front image provided</p>
                                        </div>
                                    )}
                                </div>

                                <div className="dr-nationalid-item">
                                    <div className="dr-nationalid-item__label">
                                        <span className="dr-nationalid-item__label-dot dr-nationalid-item__label-dot--back"></span>
                                        Back Side
                                    </div>
                                    {doctor?.documents?.national_id_back ? (
                                        <div className="dr-nationalid-img-wrapper">
                                            <img
                                                src={doctor?.documents?.national_id_back}
                                                alt="National ID Back"
                                                className="dr-nationalid-img"
                                                onClick={() => window.open(doctor?.documents?.national_id_back, "_blank")}
                                            />
                                            <a
                                                href={doctor?.documents?.national_id_back}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="dr-img-view-btn"
                                            >
                                                View Full Image ↗
                                            </a>
                                        </div>
                                    ) : (
                                        <div className="dr-img-placeholder">
                                            <span className="dr-img-placeholder__icon">🪪</span>
                                            <p>No back image provided</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="dr-card">
                            <h2 className="dr-card__title">Review Actions</h2>
                            <div className="dr-actions-row">
                                {doctor?.status === "pending" && (
                                    <>
                                        <button
                                            disabled={isBtnLoading}
                                            onClick={() => setIsApproveOpen(true)}
                                            className="btn-approve"
                                        >
                                            Approve Request
                                        </button>

                                        <button
                                            disabled={isBtnLoading}
                                            className="btn-reject"
                                            onClick={() => setIsRejectOpen(true)}
                                        >
                                            Reject Request
                                        </button>
                                    </>
                                )}

                                {doctor?.status === "active" && (
                                    <div className="success-msg">✔ Doctor Approved</div>
                                )}
                            </div>
                        </div>
                        {(doctor?.status === "active" || doctor?.status === "banned") && (
                            <div className="dr-card">
                                <h2 className="dr-card__title">Ban Doctor</h2>
                                <button className="dr-btn-charge" onClick={() => setIsBanOpen(true)}>
                                    {doctor?.status === "active" ? "Ban Doctor" : "Unban Doctor"}
                                </button>
                            </div>
                        )}


                        <ChargeDoctorPopup isOpen={isChargeOpen} onClose={() => setIsChargeOpen(false)} doctorId={doctor?.id} />
                        <RejectDoctorPopup isOpen={isRejectOpen} onClose={() => setIsRejectOpen(false)} doctorId={doctor?.id} />
                        <AcceptDoctorReq isOpen={isApproveOpen} onClose={() => setIsApproveOpen(false)} doctorId={doctor?.id} />
                        <BanDoctor isOpen={isBanOpen} onClose={() => setIsBanOpen(false)} doctorId={doctor?.id} status={doctor?.status || ""} />
                    </div >
                    :
                    <div className="container">

                        <div className="sk-breadcrumb">
                            <div className="sk" style={{ width: 90, height: 14 }} />
                            <div className="sk" style={{ width: 8, height: 14, borderRadius: 2 }} />
                            <div className="sk" style={{ width: 50, height: 14 }} />
                            <div className="sk" style={{ width: 8, height: 14, borderRadius: 2 }} />
                            <div className="sk" style={{ width: 110, height: 14 }} />
                        </div>

                        <div className="sk-header">
                            <div className="sk-header__left">
                                <div className="sk sk--btn" style={{ width: 36, height: 36 }} />
                                <div className="sk-header__titles">
                                    <div className="sk" style={{ width: 160, height: 22 }} />
                                    <div className="sk" style={{ width: 210, height: 14 }} />
                                </div>
                            </div>
                            <div className="sk sk--btn" style={{ width: 110, height: 38 }} />
                        </div>

                        <div className="sk-card">
                            <div className="sk-section-title">
                                <div className="sk" style={{ width: 140, height: 14 }} />
                            </div>

                            <div className="sk-profile-top">
                                <div className="sk sk--circle" style={{ width: 80, height: 80 }} />
                                <div className="sk-profile-meta">
                                    <div className="sk-name-row">
                                        <div className="sk" style={{ width: 160, height: 22 }} />
                                        <div className="sk sk--rounded" style={{ width: 58, height: 22 }} />
                                    </div>
                                </div>
                            </div>

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

                        <div className="sk-card">
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

export default DoctorReqDetails