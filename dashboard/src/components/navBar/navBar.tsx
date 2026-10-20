import React from 'react'
import "./navBar.css"
const NavBar = () => {
    return (
        <header className="navbar" id="navbar">

            <div className="navbar__left">
                <div className="navbar__title">Dashboard</div>
                <div className="navbar__subtitle">Welcome back, Admin!</div>
            </div>

            <div className="navbar__search">
                <span className="navbar__search-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                </span>
                <input
                    className="navbar__search-input"
                    id="searchInput"
                    type="text"
                    placeholder="Search..."

                />
                <button className="navbar__search-clear">✕</button>
            </div>

            <div className="navbar__actions">

                <button className="navbar__icon-btn" id="themeBtn" title="Toggle theme">
                    <svg id="themeIcon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                    </svg>
                </button>

                <div className="dropdown-wrap">
                    <button className="navbar__icon-btn" id="notifBtn" title="Notifications">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                        </svg>
                        <span className="badge" id="notifBadge">2</span>
                    </button>

                    <div className="dropdown notif-dropdown" id="notifDropdown">
                        <div className="dropdown__header">
                            <span className="dropdown__header-title">Notifications</span>
                            <button className="dropdown__mark-read" >Mark all read</button>
                        </div>
                        <div className="notif-list" id="notifList">
                            <div className="notif-item unread">
                                <div className="notif-dot" style={{ background: "#2d9d8f" }}></div>
                                <div className="notif-content">
                                    <div className="notif-title">New User</div>
                                    <div className="notif-msg">Sarah Johnson just registered</div>
                                    <div className="notif-time">5 min ago</div>
                                </div>
                            </div>
                            <div className="notif-item unread">
                                <div className="notif-dot" style={{ background: "#5b8dee" }}></div>
                                <div className="notif-content">
                                    <div className="notif-title">Doctor Request</div>
                                    <div className="notif-msg">Dr. Michael Chen pending review</div>
                                    <div className="notif-time">15 min ago</div>
                                </div>
                            </div>
                            <div className="notif-item">
                                <div className="notif-dot" style={{ background: "#f39c12" }}></div>
                                <div className="notif-content">
                                    <div className="notif-title">New Order</div>
                                    <div className="notif-msg">Order #1234 has been placed</div>
                                    <div className="notif-time">1 hour ago</div>
                                </div>
                            </div>
                            <div className="notif-item">
                                <div className="notif-dot" style={{ background: "#e05c5c" }}></div>
                                <div className="notif-content">
                                    <div className="notif-title">New Appointment</div>
                                    <div className="notif-msg">John Doe with Dr. Smith</div>
                                    <div className="notif-time">2 hours ago</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="dropdown-wrap">
                    <button className="navbar__profile-btn" id="profileBtn" >
                        <div className="navbar__avatar">AD</div>
                        <span className="navbar__chevron">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="6 9 12 15 18 9" />
                            </svg>
                        </span>
                    </button>

                    <div className="dropdown profile-dropdown" id="profileDropdown">
                        <div className="profile-header">
                            <div className="profile-avatar-lg">AD</div>
                            <div>
                                <div className="profile-name">Admin</div>
                                <div className="profile-role">Super Admin</div>
                            </div>
                        </div>
                        <div className="profile-menu">
                            <button className="profile-item">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                                </svg>
                                My Profile
                            </button>
                            <button className="profile-item">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="3" />
                                    <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                                </svg>
                                Settings
                            </button>
                            <div className="profile-divider"></div>
                            <button className="profile-item logout">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                    <polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
                                </svg>
                                Logout
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </header>
    )
}

export default NavBar