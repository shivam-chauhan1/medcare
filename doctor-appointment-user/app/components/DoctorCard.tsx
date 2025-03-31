"use client";
import React from "react";
import styles from "@/app/styles/DoctorCard.module.css";
import Image from "next/image";
import { useRouter } from "next/navigation";
import oneStar from "@/public/images/one_star.svg";
import zeroStar from "@/public/images/zero_star.svg";
import hourGlass from "@/public/images/hourGlass.svg";
import stethoscope from "@/public/images/Stethoscope.svg";
import defaultProfile from "@/public/images/doctor_pic.svg";

interface Doctor {
  doctor_id: string;
  name: string;
  average_rating: number;
  experience_year: number;
  degree: string;
  photo_url: string;
  location: string;
  specialty: string[];
  disease: string[];
  gender: string;
}

interface DoctorCardProps {
  doctor: Doctor;
}

export default function DoctorCard({ doctor }: DoctorCardProps) {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/doctors/${doctor.doctor_id}`);
  };

  const handleBookAppointment = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/doctors/${doctor.doctor_id}/appointment`);
  };

  return (
    <div className={styles.card_container} onClick={handleCardClick}>
      <div className={styles.doctor_profile}>
        <Image
          src={defaultProfile}
          alt={`Dr. ${doctor.name}`}
          height={150}
          width={150}
        />
        <div className={styles.doctor_description}>
          <div className={styles.name_degree_div}>
            <h3>Dr {doctor.name},</h3>
            <h3>{doctor.degree}</h3>
          </div>
          <div className={styles.typeOfDoctor_YOE}>
            <div className={styles.flex_img_para}>
              <Image
                src={stethoscope}
                alt="symbol"
                height={15.01}
                width={17.5}
              />
              <p>{doctor.specialty.join(", ")}</p>
            </div>
            <div className={styles.flex_img_para}>
              <Image src={hourGlass} alt="symbol" height={15.01} width={17.5} />
              <p>{doctor.experience_year} Years</p>
            </div>
          </div>
          <div className={styles.rating_div}>
            <p>Ratings: </p>
            <div className={styles.stars_div}>
              {[...Array(5)].map((_, index) => (
                <Image
                  key={index}
                  src={index < doctor.average_rating ? oneStar : zeroStar}
                  alt={index < doctor.average_rating ? "one star" : "zero star"}
                  height={17.5}
                  width={17.5}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className={styles.appointment_btn_div}>
        <button onClick={handleBookAppointment}>Book Appointment</button>
      </div>
    </div>
  );
}
