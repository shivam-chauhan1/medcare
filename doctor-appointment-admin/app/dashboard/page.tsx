"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Dashboard from '@/app/components/Dashboard';
import DashboardHeader from '@/app/components/Dashboard/Header';
import Footer from '@/app/components/Footer';
import { useAuth } from '@/app/contextApi/authContext';
import styles from '@/app/styles/page.module.css';

const DashboardPage = () => {
  const { isLogin, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isLogin) {
      router.push('/login');
    }
  }, [isLogin, isLoading, router]);

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading...</div>
      </div>
    );
  }

  if (!isLogin) {
    return null;
  }

  return (
    <div className={styles.container}>
      <DashboardHeader />
      <main className={styles.main}>
        <Dashboard />
      </main>
      <Footer />
    </div>
  );
};

export default DashboardPage; 