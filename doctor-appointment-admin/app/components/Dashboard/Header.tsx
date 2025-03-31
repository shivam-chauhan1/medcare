"use client";

import { useState } from 'react';
import { useAuth } from '@/app/contextApi/authContext';
import styles from '@/app/styles/DashboardHeader.module.css';

export default function DashboardHeader() {
  const { logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <h1>Admin Dashboard</h1>
        </div>

        <nav className={styles.nav}>
          <div className={styles.navLinks}>
            <a href="/dashboard" className={styles.navLink}>Dashboard</a>
           
          </div>

          <div className={styles.userMenu}>
            <button 
              className={styles.menuButton}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className={styles.menuIcon}>☰</span>
            </button>

            {isMenuOpen && (
              <div className={styles.dropdown}>
                <button 
                  className={styles.logoutButton}
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
} 