import React, { useState } from 'react'

const RejectDoctorPopup = ({ isOpen, onClose, doctorId }: { isOpen: boolean, onClose: () => void, doctorId: any }) => {

    const [loading, setLoading] = useState(false)
    const [isError, setIsError] = useState(false)
    const [errMsg, setErrMsg] = useState('')
    const [reason, setReason] = useState('')


    const rejectRequest = async () => {
        try {
            setLoading(true);

            if (!reason) {
                setIsError(true);
                setErrMsg("Reason is required");
                return;
            }

            const res = await fetch(
                `${import.meta.env.VITE_BASE_URL}/doctors/reject-request/${doctorId}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${import.meta.env.VITE_TOKEN}`
                    },
                    body: JSON.stringify({ reason })
                }
            );

            const data = await res.json();


            if (!res.ok) {
                setIsError(true);
                setErrMsg(data.message || "Failed request");
                return;
            }

            onClose();

            window.location.href = "/doctor-requests";

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className={`dr-charge-overlay ${isOpen ? 'open' : ''}`}>
            <div className="dr-charge-modal">

                <div className="charge-inp">
                    <input onChange={(e) => setReason(e.target.value)} type="text" placeholder="Reason for rejection" />
                </div>
                {isError && <div className="error-msg">✖ Error: {errMsg}</div>}

                <div className="charge-btns">
                    <button disabled={loading} className="charge-confirm" onClick={rejectRequest}>reject</button>
                    <button disabled={loading} className="charge-cancel" onClick={() => onClose()}>Cancel</button>
                </div>
            </div>
        </div>
    )
}

export default RejectDoctorPopup