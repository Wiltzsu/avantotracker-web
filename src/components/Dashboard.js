import React from 'react';
import {Link} from "react-router-dom";

import Header from './Header.js';
import Footer from './Footer.js';
import './Dashboard.css';


const Dashboard = () => {
  return (
    <>
      <div className="dashboard-header">
        <Header />
      </div>

      <div className="dashboard-container">
        <div className="dashboard-content">

          {/* Quick Actions */}
          <h2>Pikatoiminnot</h2>

          <div className="quick-actions">
            <div className="action-buttons">
              <button className="action-button primary">
                <Link to="/new" className="action-link">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="plus-icon"
                  >
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Uusi avanto
                </Link>
              </button>
            </div>
          </div>
        </div>

        <div className="dashboard-stats">
          <h2>Keskeiset tilastot</h2>
          
        </div>
      </div>

      <Footer />
    </>
  );
};


export default Dashboard;
