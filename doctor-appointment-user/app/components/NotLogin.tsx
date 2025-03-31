"use client";
import styles from "@/app/styles/NotLogin.module.css";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function NotLogin(): React.ReactElement {
  const router = useRouter();
  const [countdown, setCountdown] = useState<number>(3);

  // Separate useEffect for countdown
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Separate useEffect for navigation that runs only when countdown reaches zero
  useEffect(() => {
    if (countdown === 0) {
      // Use setTimeout to ensure this happens after render
      const redirectTimer = setTimeout(() => {
        router.push("/login");
      }, 100);

      return () => clearTimeout(redirectTimer);
    }
  }, [countdown, router]);

  return (
    <div className={styles.notLogin}>
      <div className={styles.messageContainer}>
        <p className={styles.message}>Please Login!</p>
        <p className={styles.redirectMessage}>
          Redirecting to login in {countdown || "0"} seconds...
        </p>
      </div>
    </div>
  );
}
