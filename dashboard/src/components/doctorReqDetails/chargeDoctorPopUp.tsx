import React, { useState } from 'react'
import "./doctorReqDetails.css"


const chargeDoctorPopUp = ({ isOpen, onClose, doctorId }: { isOpen: boolean, onClose: () => void, doctorId: any }) => {

    const [loading, setLoading] = useState(false)
    const [isError, setIsError] = useState(false)
    const [errMsg, setErrMsg] = useState('')
    const [isSuccess, setIsSuccess] = useState(false)
    const [amount, setAmount] = useState(0)
    const [reason, setReason] = useState('')


    const handleSubmit = async () => {
        setLoading(true)
        setIsError(false)
        setIsSuccess(false)

        try {
            if (amount == 0) {
                return;
            }
            const res = await fetch(`${import.meta.env.VITE_BASE_URL}/doctors/charge-doctor/${doctorId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${import.meta.env.VITE_TOKEN}`
                },
                body: JSON.stringify({
                    amount,
                    reason
                })
            }
            )

            const data = await res.json();

            if (!res.ok) {
                setErrMsg(data.message)
                setIsError(true)
                setLoading(false)
                return;
            };

            setIsSuccess(true)
            setLoading(false)

            setTimeout(() => {
                onClose()
            }, 2000)

        } catch (err) {
            setIsError(true)
            setLoading(false)
        } finally {
            setLoading(false)
        }
    }




    return (
        <div className={`dr-charge-overlay ${isOpen ? 'open' : ''}`}>
            <div className="dr-charge-modal">
                <div className="charge-inp">
                    <input onChange={(e) => setReason(e.target.value)} type="text" placeholder="Reason" />
                </div>

                <div className="charge-inp">
                    <input onChange={(e) => setAmount(parseInt(e.target.value))} type="number" placeholder="Amount" />
                </div>
                {isSuccess && <div className="success-msg">✔ Doctor charged</div>}
                {isError && <div className="error-msg">✖ Error: {errMsg}</div>}

                <div className="charge-btns">
                    <button disabled={loading} className="charge-confirm" onClick={handleSubmit}>Charge</button>
                    <button disabled={loading} className="charge-cancel" onClick={() => onClose()}>Cancel</button>
                </div>
            </div>
        </div>
    )
}

export default chargeDoctorPopUp