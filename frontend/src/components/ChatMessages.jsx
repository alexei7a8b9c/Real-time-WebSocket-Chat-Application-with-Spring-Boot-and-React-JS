import React, { useEffect, useRef } from 'react'
import './ChatMessages.css'

function ChatMessages({ messages, currentUser }) {
    const containerRef = useRef(null)

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight
        }
    }, [messages])

    const formatTime = (timestamp) => {
        if (!timestamp) return ''
        const date = new Date(timestamp)
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    return (
        <div className="messages-container" ref={containerRef}>
            {messages.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 0 1-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                        </svg>
                    </div>
                    <p>No messages yet</p>
                    <span>Start the conversation!</span>
                </div>
            ) : (
                messages.map((message, index) => (
                    <div
                        key={index}
                        className={`message-wrapper ${message.from === currentUser ? 'own' : ''}`}
                    >
                        <div className="message-bubble">
                            <div className="message-header">
                                <span className="message-author">{message.from}</span>
                                <span className="message-time">{formatTime(message.timestamp)}</span>
                            </div>
                            <p className="message-text">{message.text}</p>
                        </div>
                    </div>
                ))
            )}
        </div>
    )
}

export default ChatMessages