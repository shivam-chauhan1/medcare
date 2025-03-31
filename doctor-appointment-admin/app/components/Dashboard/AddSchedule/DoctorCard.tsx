import { useState } from 'react';
import styles from '@/app/styles/DoctorCard.module.css';

interface Doctor {
  _id?: string;
  doctor_id: string;
  name: string;
  email: string;
  average_rating: number;
  experience_year: number;
  degree: string;
  biography: string;
  photo_url: string;
  location: string;
  specialty: string[];
  disease: string[];
  gender: string;
}

interface DoctorCardProps {
  doctor: Doctor;
  onAddSchedule: (doctor_id: string) => void;
}

export default function DoctorCard({ doctor, onAddSchedule }: DoctorCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={`${styles.card} ${isHovered ? styles.hovered : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={styles.cardHeader}>
        <div className={styles.avatar}>
          {doctor.photo_url ? (
            <img src={doctor.photo_url} alt={doctor.name} />
          ) : (
            <div className={styles.avatarPlaceholder}>
              {doctor.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className={styles.doctorInfo}>
          <h3 className={styles.name}>{doctor.name}</h3>
          <p className={styles.email}>{doctor.email}</p>
        </div>
      </div>

      <div className={styles.cardBody}>
        <div className={styles.infoRow}>
          <span className={styles.label}>Degree:</span>
          <span className={styles.value}>{doctor.degree}</span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.label}>Experience:</span>
          <span className={styles.value}>{doctor.experience_year} years</span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.label}>Gender:</span>
          <span className={styles.value}>{doctor.gender}</span>
        </div>
        <div className={styles.specialties}>
          <span className={styles.label}>Specialties:</span>
          <div className={styles.tagList}>
            {doctor.specialty?.map((spec) => (
              <span key={spec} className={styles.tag}>
                {spec}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.cardFooter}>
        <button 
          onClick={() => onAddSchedule(doctor.doctor_id)}
          className={`${styles.editButton} ${styles.scheduleButton}`}
        >
          Add Schedule
        </button>
        <div className={styles.rating}>
          <span className={styles.star}>★</span>
          <span className={styles.ratingValue}>{doctor.average_rating.toFixed(1)}</span>
        </div>
      </div>
    </div>
  );
} 