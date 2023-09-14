import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWpforms } from '@fortawesome/free-brands-svg-icons'
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';



const Sidebar = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const sidebarRef = useRef(null); // 1. Create a reference for the sidebar.
    const toggleButtonRef = useRef(null); // Reference for the toggle button
  
    const toggleSidebar = () => {
      setSidebarOpen(!sidebarOpen);
    };
  
    useEffect(() => {
      const handleClickOutside = (event) => {
        // Add this condition to check if the clicked target is the toggle button
        if (toggleButtonRef.current && toggleButtonRef.current.contains(event.target)) {
          return; // Do nothing and let the onClick handler of the button handle the action
        }
        if (sidebarRef.current && !sidebarRef.current.contains(event.target) && sidebarOpen) {
          setSidebarOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [sidebarOpen]);
  

  return (
    <div>
          <button className="toggle-button" onClick={toggleSidebar} ref={toggleButtonRef}>
            <FontAwesomeIcon icon={faBars} size="xl" />
          </button>
            <div className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`} ref={sidebarRef}> {/* Set the reference */}
                <ul className="sidebar-nav">
                    <div className="sidebar-cards">
                        <li className="card-item">
                            <Link to="/dash/sows/lift-n-shift" className="card-link" onClick={() => setSidebarOpen(false)}>
                                <FontAwesomeIcon icon={faWpforms} size="2x" className="card-icon" />
                                <span>Lift and Shift</span>
                            </Link>
                        </li>
                        <li className="card-item">
                            <Link to="/dash/sows/arc-as-service" className="card-link" onClick={() => setSidebarOpen(false)}>
                                <FontAwesomeIcon icon={faWpforms} size="2x" className="card-icon" />
                                <span>Architect as a Service</span>
                            </Link>
                        </li>
                    </div>
                </ul>
            </div>
    </div>
  );
};

export default Sidebar;
