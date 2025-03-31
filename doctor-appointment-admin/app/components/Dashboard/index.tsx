"use client";

import { useState, useEffect } from 'react';
import CreateDoctor from './CreateDoctor';
import EditDoctor from './EditDoctor';
import RemoveDoctor from './RemoveDoctor';
import AddSchedule from './AddSchedule';
import ApprovalList from './ApprovalList';
import styles from '@/app/styles/Dashboard.module.css';

type Section = 'create-doctor' | 'edit-doctor' | 'remove-doctor' | 'add-schedule' | 'approval-list';

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState<Section>('create-doctor');
  const [isEditDoctorMounted, setIsEditDoctorMounted] = useState(false);

  const menuItems = [
    { id: 'create-doctor', label: 'Create Doctor' },
    { id: 'edit-doctor', label: 'Edit Doctor' },
    { id: 'remove-doctor', label: 'Remove Doctor' },
    { id: 'add-schedule', label: 'Add Schedule' },
    { id: 'approval-list', label: 'Approval List' },
  ];

  const handleDoctorUpdated = () => {
    console.log('Doctor updated successfully');
  };

  const handleSectionChange = (section: Section) => {
    console.log('Changing section to:', section);
    setActiveSection(section);
    if (section === 'edit-doctor') {
      setIsEditDoctorMounted(true);
    }
  };

  const renderContent = () => {
    console.log('Rendering content for section:', activeSection);
    switch (activeSection) {
      case 'create-doctor':
        return <CreateDoctor />;
      case 'edit-doctor':
        return isEditDoctorMounted ? <EditDoctor onDoctorUpdated={handleDoctorUpdated} /> : null;
      case 'remove-doctor':
        return <RemoveDoctor />;
      case 'add-schedule':
        return <AddSchedule />;
      case 'approval-list':
        return <ApprovalList />;
      default:
        return <CreateDoctor />;
    }
  };

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <nav>
          <ul className={styles.menuList}>
            {menuItems.map((item) => (
              <li key={item.id} className={styles.menuItem}>
                <button
                  onClick={() => handleSectionChange(item.id as Section)}
                  className={`${styles.menuButton} ${activeSection === item.id ? styles.active : ''}`}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {renderContent()}
      </div>
    </div>
  );
} 