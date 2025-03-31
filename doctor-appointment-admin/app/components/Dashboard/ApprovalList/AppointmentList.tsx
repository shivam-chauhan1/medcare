"use client";

import { useState, useEffect } from 'react';
import styles from '@/app/styles/AppointmentList.module.css';

type AppointmentStatus = 'pending' | 'cancelled' | 'confirmed' | 'completed';

interface Appointment {
  appointment_id: string;
  start_time: string;
  end_time: string;
  status: AppointmentStatus;
  booking_type: 'virtual' | 'in-person';
  patient_name: string;
  patient_age: number;
  health_description: string;
  doctor_name: string;
}

interface AppointmentListProps {
  appointments: Appointment[];
  onStatusUpdate: (appointmentId: string, newStatus: string) => Promise<void>;
}

export default function AppointmentList({ appointments = [], onStatusUpdate }: AppointmentListProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (loading) {
    return <div className={styles.loading}>Loading appointments...</div>;
  }

  if (error) {
    return <div className={styles.error}>{String(error)}</div>;
  }

  if (!appointments || appointments.length === 0) {
    return <div className={styles.noAppointments}>No appointments found</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.list}>
        {appointments.map((appointment) => (
          <div key={String(appointment.appointment_id)} className={styles.appointmentCard}>
            <div className={styles.appointmentInfo}>
              <h3 className={styles.patientName}>{String(appointment.patient_name)}</h3>
              <p className={styles.doctorName}>Dr. {String(appointment.doctor_name)}</p>
              <p className={styles.dateTime}>
                {String(appointment.start_time)} - {String(appointment.end_time)}
              </p>
              <p className={styles.bookingType}>{String(appointment.booking_type)}</p>
              <p className={styles.healthDescription}>{String(appointment.health_description)}</p>
            </div>
            <div className={styles.statusActions}>
              <span className={`${styles.status} ${styles[String(appointment.status)]}`}>
                {String(appointment.status).charAt(0).toUpperCase() + String(appointment.status).slice(1)}
              </span>
              {String(appointment.status) === 'pending' && (
                <div className={styles.actionButtons}>
                  <button
                    onClick={() => onStatusUpdate(String(appointment.appointment_id), 'confirmed')}
                    className={`${styles.button} ${styles.approveButton}`}
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => onStatusUpdate(String(appointment.appointment_id), 'cancelled')}
                    className={`${styles.button} ${styles.rejectButton}`}
                  >
                    Reject
                  </button>
                </div>
              )}
              {String(appointment.status) === 'confirmed' && (
                <div className={styles.actionButtons}>
                  <button
                    onClick={() => onStatusUpdate(String(appointment.appointment_id), 'completed')}
                    className={`${styles.button} ${styles.completeButton}`}
                  >
                    Mark as Completed
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 