import React from 'react'
import './UserList.css'

function UserList({ users, currentUser }) {
    return (
        <aside className="user-list">
            <div className="list-header">
                <h3>Online Users</h3>
                <span className="user-count">{users.length}</span>
            </div>
            <div className="users-container">
                {users.length === 0 ? (
                    <div className="no-users">No users online</div>
                ) : (
                    users.map((user) => (
                        <div
                            key={user.username}
                            className={`user-item ${user.username === currentUser ? 'current' : ''}`}
                        >
                            <div className="user-avatar-small">
                                {user.username.charAt(0).toUpperCase()}
                            </div>
                            <div className="user-details">
                                <span className="user-name">{user.username}</span>
                                <span className="user-status">
                  <span className="status-dot"></span>
                  Online
                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </aside>
    )
}

export default UserList