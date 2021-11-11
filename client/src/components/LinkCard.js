import React from 'react'
export const LinkCard = ({link})=>{
    return(
        <>
        <h2>Link</h2>
        <p>Your Link: <a href={link.to} target="_blank" rel="noopener noreferrer">{link.to}</a></p>
        <p>Link from: <a href={link.from} target="_blank" rel="noopener noreferrer">{link.from}</a></p>
        <p>Count Clicks: <strong>{link.clicks}</strong></p>
        <p>Date of Create: <strong>{new Date(link.date).toLocaleDateString()}</strong></p>
        </>
    )
}