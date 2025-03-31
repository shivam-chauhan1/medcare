"use client";

import React, { MouseEvent } from "react";
import { useRouter } from "next/navigation";
import styles from "@/app/styles/NavButtons.module.css";
import { useAuth } from "../contextApi/authContext";

const Component = () => {
  const router = useRouter();
  const { isLogin, logout } = useAuth();
  const handleRoute = (e: MouseEvent<HTMLButtonElement>) => {
    const target = e.target as HTMLButtonElement;
    router.push(`/${target.innerText.toLowerCase()}`);
  };

  return (
    <div className={styles.navButton_container}>
      {!isLogin ? (
        <>
          <button className={styles.btn_login} onClick={handleRoute}>
            Login
          </button>
          <button className={styles.btn_register} onClick={handleRoute}>
            Register
          </button>
        </>
      ) : (
        <button className={styles.btn_register} onClick={logout}>
          Logout
        </button>
      )}
    </div>
  );
};

export default Component;
