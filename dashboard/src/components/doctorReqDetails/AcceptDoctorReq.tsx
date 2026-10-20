import React, { useState } from 'react'

const AcceptDoctorReq = ({ isOpen, onClose, doctorId }: { isOpen: boolean, onClose: () => void, doctorId: any }) => {

    const [loading, setLoading] = useState(false)
    const [isError, setIsError] = useState(false)
    const [errMsg, setErrMsg] = useState('')
    const [isSuccess, setIsSuccess] = useState(false)

    const approveRequest = async () => {
        try {
            setLoading(true);

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


            if (!res.ok) {
                setIsError(true);
                setErrMsg(data.message || "Failed request");
                return;
            }

            setIsSuccess(true);
            onClose();

            window.location.reload();

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
                    <p>Are you sure you want to approve this request?</p>
                </div>
                {isSuccess && <div className="success-msg">✔ Doctor charged</div>}
                {isError && <div className="error-msg">✖ Error: {errMsg}</div>}

                <div className="charge-btns">
                    <button disabled={loading} className="charge-confirm" onClick={approveRequest}>Approve</button>
                    <button disabled={loading} className="charge-cancel" onClick={() => onClose()}>Cancel</button>
                </div>
            </div>
        </div>
    )
}

export default AcceptDoctorReq