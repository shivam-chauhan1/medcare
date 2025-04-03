"use client";
import styles from "@/app/styles/Login.module.css";
import emailIcon from "@/public/images/@icon.svg";
import eyeIcon from "@/public/images/eye_icon.svg";
import lockIcon from "@/public/images/lock_icon.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useAuth } from "../../contextApi/authContext";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string>("");
  const router = useRouter();

  const validateEmail = (email: string): boolean => {
    const allowedDomains = ["@gmail.com", "@tothenew.com"];
    return allowedDomains.some((domain) => email.endsWith(domain));
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setEmailError("");
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Validate email domain
    if (!validateEmail(email)) {
      setEmailError("Only Gmail and ToTheNew email domains are allowed");
      return;
    }

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
                <Image src={emailIcon} height={15} width={15} alt="@icon" />
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={handleEmailChange}
                  required
                />
              </div>
            </div>
            {emailError && (
              <div className={styles.error_message}>{emailError}</div>
            )}
          </div>

          <div className={styles.label_input_flex_div}>
            <label htmlFor="password">Password</label>
            <div className={styles.input_div}>
              <div className={styles.wrapper_input}>
                <Image src={lockIcon} height={15} width={15} alt="lock_icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Image
                src={eyeIcon}
                height={15}
                width={15}
                alt="eye_icon"
                onClick={() => setShowPassword(!showPassword)}
                style={{ cursor: "pointer" }}
              />
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
                setEmailError("");
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
