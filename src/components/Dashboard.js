import React from 'react';
import {Link} from "react-router-dom";

import Header from './Header.js';
import './Dashboard.css';


const Dashboard = () => {
  return (
    <div className="dashboard-container">
      
      <Header></Header>

      <main className="dashboard-main">
        <div className="dashboard-content">
          {/* Quick Actions */}
          <div className="quick-actions">
            <h2>Quick Actions</h2>
            <div className="action-buttons">
              <button className="action-button primary">
                <span>➕</span>
                <Link to="/new"> Uusi avanto </Link>
              </button>
              <button className="action-button secondary">
                <span>📈</span>
                View Statistics
              </button>
              <button className="action-button secondary">
                <span>📋</span>
                Session History
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
