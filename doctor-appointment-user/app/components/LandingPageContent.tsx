"use client";
import React from "react";
import styles from "@/app/styles/LandingPageContent.module.css";
import { useRouter } from "next/navigation";
interface LandingPageContentType {
  isAppointment: boolean;
  heading: string;
  paragraph: string;
}
export default function LandingPageContent({
  isAppointment,
  heading,
  paragraph,
}: LandingPageContentType) {
  const router = useRouter();
  function handleNavigate() {
    router.push(`/doctors`);
  }

  return (
    <section className={styles.landingPage_text_section}>
      <div className={styles.text_section_content}>
        <h3>{heading}</h3>
        <p>{paragraph}</p>
      </div>

      {!isAppointment && (
        <>
          <div className={styles.text_section_btn_div}>
            <button onClick={handleNavigate}>Get Started</button>
          </div>
        </>
      )}
    </section>
  );
}
