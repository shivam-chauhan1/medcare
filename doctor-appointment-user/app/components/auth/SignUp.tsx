"use client";
import styles from "@/app/styles/SignUp.module.css";
import emailIcon from "@/public/images/@icon.svg";
import eyeIcon from "@/public/images/eye_icon.svg";
import lockIcon from "@/public/images/lock_icon.svg";
import nameIcon from "@/public/images/name_icon.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "../../contextApi/authContext";

export default function SignUp() {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState<string>("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear email error when the user modifies the email field
    if (name === "email") {
      setEmailError("");
    }
  };

  const validateEmail = (email: string): boolean => {
    const allowedDomains = ["@gmail.com", "@tothenew.com"];
    return allowedDomains.some((domain) => email.endsWith(domain));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate email domain
    if (!validateEmail(formData.email)) {
      setEmailError("Only Gmail and ToTheNew email domains are allowed");
      return;
    }

    register(formData.name, formData.email, formData.password);
  };

  const handleReset = () => {
    setFormData({ name: "", email: "", password: "" });
    setEmailError("");
  };

  return (
    <div className={styles.signUp_container}>
      <div className={styles.signUp_layout}>
        <div className={styles.signUp_title}>
          <h3>Sign Up</h3>
        </div>
        <div className={styles.login_option}>
          <p>Already a member?</p>
          <input
            type="button"
            value="Login here"
            onClick={() => router.push("/login")}
          />
        </div>
        <form className={styles.form_div} onSubmit={handleSubmit}>
          <div className={styles.label_input_flex_div}>
            <label htmlFor="name">Name</label>
            <div className={styles.input_div}>
              <div className={styles.wrapper_input}>
                <Image src={nameIcon} height={15} width={15} alt="name" />
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className={styles.label_input_flex_div}>
            <label htmlFor="email">Email</label>
            <div className={styles.input_div}>
              <div className={styles.wrapper_input}>
                <Image src={emailIcon} height={15} width={15} alt="@icon" />
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
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
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <Image
                src={eyeIcon}
                height={15}
                width={15}
                alt="eye_icon"
                className={styles.eye_icon}
                onClick={() => setShowPassword(!showPassword)}
                style={{ cursor: "pointer" }}
              />
            </div>
          </div>

          <div className={styles.signUp_btn_div}>
            <button type="submit">Sign Up</button>
          </div>

          <div className={styles.reset_btn_div}>
            <button type="button" onClick={handleReset}>
              Reset
            </button>
          </div>

          <div className={styles.forget_password_div}>
            <p>Forgot Password?</p>
          </div>
        </form>
      </div>
    </div>
  );
}
