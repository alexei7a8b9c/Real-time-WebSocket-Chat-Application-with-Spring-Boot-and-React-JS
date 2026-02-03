import React from 'react'
import './ChatHeader.css'

function ChatHeader({ connected, currentUser, onLogout }) {
    return (
        <header className="chat-header">
            <div className="header-content">
                <div className="logo-section">
                    <div className="logo-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                        </svg>
                    </div>
                    <div className="title-section">
                        <h1>WebSocket Chat</h1>
                        <span className={`status ${connected ? 'online' : ''}`}>
              {connected ? 'Connected' : 'Disconnected'}
            </span>
                    </div>
                </div>
                <div className="user-info">
                    <div className="user-avatar">
                        {currentUser.charAt(0).toUpperCase()}
                    </div>
                    <span className="username">{currentUser}</span>
                    <button onClick={onLogout} className="logout-btn">
                        Leave
                    </button>
                </div>
            </div>
        </header>
    )
}

export default ChatHeader