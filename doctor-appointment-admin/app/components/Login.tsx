"use client";
import React, { useState } from "react";
import styles from "@/app/styles/Login.module.css";
import { MdEmail, MdLock, MdVisibility, MdVisibilityOff } from "react-icons/md";
import { useAuth } from "../contextApi/authContext";
import { useRouter } from "next/navigation";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    login(email, password);
  };

  return (
    <div className={styles.login_container}>
      <div className={styles.login_layout}>
        <div className={styles.login_title}>
          <h3>Login</h3>
        </div>
        <div className={styles.signup_option}>
          <p>Are you a new member? </p>
          <input
            type="button"
            value="Sign up here."
            onClick={() => router.push("/register")}
          />
        </div>

        <form className={styles.form_div} onSubmit={handleSubmit}>
          <div className={styles.label_input_flex_div}>
            <label htmlFor="email">Email</label>
            <div className={styles.input_div}>
              <div className={styles.wrapper_input}>
                <MdEmail className={styles.icon} />
                <input
                  type="email"
                  name="email"
                  placeholder="emmawatson@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div className={styles.label_input_flex_div}>
            <label htmlFor="password">Password</label>
            <div className={styles.input_div}>
              <div className={styles.wrapper_input}>
                <MdLock className={styles.icon} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {showPassword ? (
                <MdVisibilityOff
                  className={styles.icon}
                  onClick={() => setShowPassword(!showPassword)}
                />
              ) : (
                <MdVisibility
                  className={styles.icon}
                  onClick={() => setShowPassword(!showPassword)}
                />
              )}
            </div>
          </div>

          <div className={styles.login_btn_div}>
            <button type="submit">Login</button>
          </div>

          <div className={styles.reset_btn_div}>
            <button
              type="button"
              onClick={() => {
                setEmail("");
                setPassword("");
              }}
            >
              Reset
            </button>
          </div>

          <div className={styles.forget_password_div}>
            <p>Forget Password?</p>
          </div>
        </form>
      </div>
    </div>
  );
}
