"use client"
import React, {useState} from 'react'
import sendEmail from '@/actions/email'

const VerificationButton = ({data}) => {
    const [disable, setDisable] = useState(false)
    const [status, setStatus] = useState("idle")

    const handleClick = async ()=>{
        if(!data?.email || !data?.token){
            return
        }

        try {
            setDisable(true)
            setStatus("loading")

            await sendEmail(data.email, data.token)

            setStatus("success")
        } catch (err) {
            console.error(err)
            setDisable(false)
            setStatus("error")
        }

    }
  return (
    <button disabled={disable} onClick={handleClick} className="border-transparent text-l font-bold py-2 px-4 rounded-2xl bg-orange-500 hover:bg-orange-400 hover:border-white border-2 hover:font-extrabold">
        {status === "loading"
                ? "Sending..."
                ? "idle"
                : "Send Verification EMail"
                : status === "success"
                ? "Sent!"
                : "Send Verification EMail"}
    </button>
  )
}

export default VerificationButton
