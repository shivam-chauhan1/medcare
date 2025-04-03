"use client";
import React from "react";
import styles from "@/app/styles/LandingPage.module.css";
import Image from "next/image";
import landingPageImg from "@/public/images/landingPageImg.svg";
import LandingPageContent from "./LandingPageContent";
import ScheduleAppointment from "./ScheduleAppointment";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Patient from "./Patient";

interface PatientInfo {
  name: string;
  age: number;
  gender: "male" | "female";
  healthDescription: string;
}

export default function LandingPage() {
  const { id } = useParams();
  const pathname = usePathname();
  const isAppointment = /^\/doctors\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\/appointment$/i.test(pathname);
  const [isLargeScreen, setIsLargeScreen] = useState<boolean>(false);
  const [isPatientFormFill, setPatientFormFill] = useState<boolean>(false);
  const [patientInfo, setPatientInfo] = useState<PatientInfo>({
    name: "hello",
    age: 0,
    gender: "male",
    healthDescription: "",
  });

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth > 1000);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <div className={styles.landingPage_container}>
      {!isAppointment && (
        <>
          <section className={styles.landingPage_content_warpper}>
            <LandingPageContent
              isAppointment={false}
              heading="Health in Your Hands."
              paragraph=" Take control of your healthcare with CareMate. Book appointments with
          ease, explore health blogs, and stay on top of your well-being, all in
          one place."
            />
          </section>
          <section className={styles.landingPage_img_section}>
            <Image src={landingPageImg} alt="landing page img" />
          </section>
        </>
      )}
      {isAppointment && (
        <>
          {isAppointment && isLargeScreen && (
            <>
              <section className={styles.landingPage_content_warpper}>
                <LandingPageContent
                  isAppointment={true}
                  heading="Book Your Next Doctor Visit in Seconds."
                  paragraph="CareMate helps you find the best healthcare provider by specialty, location, and more, ensuring you get the care you need."
                />
              </section>
            </>
          )}
          <div className={styles.appointment_component}>
            {isPatientFormFill ? (
              <ScheduleAppointment
                setPatientFormFill={setPatientFormFill}
                patientInfo={patientInfo}
              />
            ) : (
              <Patient
                patientInfo={patientInfo}
                setPatientFormFill={setPatientFormFill}
                setPatientInfo={setPatientInfo}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}
