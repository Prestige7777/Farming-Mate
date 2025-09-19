import React from 'react';
import { useSidebar } from '../../layouts/SidebarLayout';
import './MobileNavToggle.css';

export default function MobileNavToggle() {
  const { toggleSidebar, isSidebarOpen } = useSidebar();

  return (
    <button 
      className="mobile-nav-toggle"
      onClick={toggleSidebar}
      aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
      aria-expanded={isSidebarOpen}
    >
      <div className="hamburger-icon">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </button>
  );
}