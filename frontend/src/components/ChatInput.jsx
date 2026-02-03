import React, { useState, useRef } from 'react'
import './ChatInput.css'

function ChatInput({ connected, onSendMessage }) {
    const [messageText, setMessageText] = useState('')
    const inputRef = useRef(null)

    const canSend = connected && messageText.trim().length > 0

    const send = () => {
        if (!canSend) return
        const text = messageText.trim()
        onSendMessage({ text })
        setMessageText('')
        inputRef.current.focus()
    }

    const handleKeyUp = (e) => {
        if (e.key === 'Enter') {
            send()
        }
    }

    return (
        <div className="input-container">
            <div className="input-wrapper">
                <input
                    ref={inputRef}
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyUp={handleKeyUp}
                    type="text"
                    placeholder="Type your message..."
                    className="message-input"
                    disabled={!connected}
                />
                <button
                    onClick={send}
                    className={`send-btn ${canSend ? 'active' : ''}`}
                    disabled={!canSend}
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22,2 15,22 11,13 2,9 22,2"></polygon>
                    </svg>
                </button>
            </div>
        </div>
    )
}

export default ChatInput