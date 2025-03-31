"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Login from '@/app/components/Login';
import { useAuth } from '@/app/contextApi/authContext';
import styles from '@/app/styles/page.module.css';

export default function Home() {
  const { isLogin, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isLogin) {
      router.push('/dashboard');
    }
  }, [isLogin, isLoading, router]);

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading...</div>
      </div>
    );
  }

  return <Login />;
}
