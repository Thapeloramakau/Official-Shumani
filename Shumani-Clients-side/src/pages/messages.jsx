import React from "react";
import "./messages.css";

const Notifications = () => {
  return (
    <div className="notification-page">
      <div className="notification-container">
        {/* Header */}
        <div className="notification-header">
          <h2>Notifications</h2>
          <select className="filter-select">
            <option>All</option>
            <option>Unread</option>
            <option>Favorites</option>
          </select>
        </div>

        {/* Today */}
        <div className="notification-section">
          <div className="section-title">Today</div>

          <div className="notification-card">
            <div className="notification-details">
              <div className="notification-topic">Assignment Deadline</div>
              <div className="notification-date">25 July 2025</div>
            </div>
            <div className="notification-actions">
              <button>Mark as Read</button>
              <button>Favourite</button>
            </div>
          </div>

          <div className="notification-card">
            <div className="notification-details">
              <div className="notification-topic">Class Cancelled</div>
              <div className="notification-date">25 July 2025</div>
            </div>
            <div className="notification-actions">
              <button>Mark as Read</button>
              <button>Favourite</button>
            </div>
          </div>
        </div>

        {/* Yesterday */}
        <div className="notification-section">
          <div className="section-title">Yesterday</div>

          <div className="notification-card">
            <div className="notification-details">
              <div className="notification-topic">Exam Venue Change</div>
              <div className="notification-date">24 July 2025</div>
            </div>
            <div className="notification-actions">
              <button>Mark as Read</button>
              <button>Favourite</button>
            </div>
          </div>
        </div>

        {/* Last Week */}
        <div className="notification-section">
          <div className="section-title">Last Week</div>

          <div className="notification-card">
            <div className="notification-details">
              <div className="notification-topic">
                New Course Materials Uploaded
              </div>
              <div className="notification-date">18 July 2025</div>
            </div>
            <div className="notification-actions">
              <button>Mark as Read</button>
              <button>Favourite</button>
            </div>
          </div>

          <div className="notification-card">
            <div className="notification-details">
              <div className="notification-topic">
                Group Project Deadline Extended
              </div>
              <div className="notification-date">17 July 2025</div>
            </div>
            <div className="notification-actions">
              <button>Mark as Read</button>
              <button>Favourite</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
