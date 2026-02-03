import React, { useState, useEffect } from 'react'
import ChatHeader from './components/ChatHeader'
import ChatMessages from './components/ChatMessages'
import ChatInput from './components/ChatInput'
import UserList from './components/UserList'
import websocketService from './services/websocket'

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [usernameInput, setUsernameInput] = useState('')
    const [username, setUsername] = useState('')
    const [connected, setConnected] = useState(false)
    const [messages, setMessages] = useState([])
    const [onlineUsers, setOnlineUsers] = useState([])
    const [notification, setNotification] = useState(null)

    const showNotification = (message, type = 'info') => {
        setNotification({ message, type })
        setTimeout(() => setNotification(null), 3000)
    }

    const login = () => {
        if (usernameInput.trim().length < 2) return
        const newUsername = usernameInput.trim()
        setUsername(newUsername)
        setIsLoggedIn(true)
        connectWebSocket(newUsername)
    }

    const logout = () => {
        websocketService.disconnect()
        setIsLoggedIn(false)
        setUsername('')
        setUsernameInput('')
        setConnected(false)
        setMessages([])
        setOnlineUsers([])
    }

    const connectWebSocket = (user) => {
        websocketService.connect(() => {
            setConnected(true)
            showNotification('Connected to chat!', 'success')
            websocketService.subscribe('/topic/public', (message) => {
                setMessages(prev => [...prev, message])
            })
            websocketService.subscribe('/topic/users', (update) => {
                if (update.username && !onlineUsers.find(u => u.username === update.username)) {
                    setOnlineUsers(prev => [...prev, update])
                }
            })
            sendJoinMessage(user)
        }, (error) => {
            console.error('Connection error:', error)
            showNotification('Connection failed', 'error')
        })
    }

    const sendJoinMessage = (user) => {
        const joinMessage = {
            from: user,
            text: `${user} joined the chat!`,
            type: 'JOIN',
            timestamp: new Date().toISOString()
        }
        websocketService.send('/app/chat.sendMessage', joinMessage)
        setOnlineUsers(prev => [...prev, { username: user }])
    }

    const sendMessage = (messageData) => {
        if (!websocketService.isConnected()) {
            showNotification('Not connected to server', 'error')
            return
        }
        const message = {
            from: username,
            text: messageData.text,
            type: 'CHAT',
            timestamp: new Date().toISOString()
        }
        const sent = websocketService.send('/app/chat.sendMessage', message)
        if (!sent) {
            showNotification('Failed to send message', 'error')
        }
    }

    return (
        <div className="app">
            {!isLoggedIn ? (
                <div className="login-screen">
                    <div className="login-card">
                        <div className="login-header">
                            <div className="login-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                                </svg>
                            </div>
                            <h2>Welcome to Chat</h2>
                            <p>Enter your username to join the conversation</p>
                        </div>
                        <div className="login-form">
                            <input
                                value={usernameInput}
                                onChange={(e) => setUsernameInput(e.target.value)}
                                onKeyUp={(e) => e.key === 'Enter' && login()}
                                type="text"
                                placeholder="Your username"
                                className="username-input"
                                maxLength="20"
                            />
                            <button
                                onClick={login}
                                className={`login-btn ${usernameInput.trim().length >= 2 ? 'active' : ''}`}
                                disabled={usernameInput.trim().length < 2}
                            >
                                Join Chat
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="chat-screen">
                    <ChatHeader connected={connected} currentUser={username} onLogout={logout} />
                    <div className="chat-body">
                        <div className="chat-main">
                            <ChatMessages messages={messages} currentUser={username} />
                            <ChatInput connected={connected} onSendMessage={sendMessage} />
                        </div>
                        <UserList users={onlineUsers} currentUser={username} />
                    </div>
                </div>
            )}
            {notification && (
                <div className={`toast ${notification.type}`}>
                    {notification.message}
                </div>
            )}
        </div>
    )
}

export default App