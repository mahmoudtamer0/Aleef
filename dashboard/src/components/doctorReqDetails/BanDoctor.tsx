import React, { useState } from 'react'

const BanDoctor = ({ isOpen, onClose, doctorId, status }: { isOpen: boolean, onClose: () => void, doctorId: any, status: string }) => {

    const [loading, setLoading] = useState(false)
    const [isError, setIsError] = useState(false)
    const [errMsg, setErrMsg] = useState('')
    const [isSuccess, setIsSuccess] = useState(false)

    const sendBanDoctor = async () => {
        try {
            setLoading(true);

            const res = await fetch(
                `${import.meta.env.VITE_BASE_URL}/doctors/baan-doctor/${doctorId}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${import.meta.env.VITE_TOKEN}`
                    },
                    body: JSON.stringify({
                        banAction: status === "active" ? "ban" : "remove"
                    })
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
                    <p>  {status === "active" ? "Are you sure you want to ban this doctor?" : "Are you sure you want to unban this doctor?"}</p>
                </div>
                {isSuccess && <div className="success-msg">✔ Doctor charged</div>}
                {isError && <div className="error-msg">✖ Error: {errMsg}</div>}

                <div className="charge-btns">
                    <button disabled={loading} className="charge-confirm" onClick={sendBanDoctor}>Approve</button>
                    <button disabled={loading} className="charge-cancel" onClick={() => onClose()}>Cancel</button>
                </div>
            </div>
        </div>
    )
}

export default BanDoctor