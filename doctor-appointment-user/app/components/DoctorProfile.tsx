"use client";
import React, { useState, useEffect } from "react";
import styles from "@/app/styles/DoctorProfile.module.css";
import Image from "next/image";
import doctorPic from "@/public/images/doctor_pic.svg";
import star from "@/public/images/one_star.svg";
import location from "@/public/images/location.svg";
import experience from "@/public/images/hourGlass.svg";
import gender from "@/public/images/gender.svg";
import sun from "@/public/images/sun.svg";
import sunset from "@/public/images/sunset.svg";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

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
  biography: string;
  email: string;
}

interface Slot {
  shift: string;
  slots: [string, string, number][];
}

export default function DoctorProfile() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [availableSlots, setAvailableSlots] = useState<Slot[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const today = new Date();

  useEffect(() => {
    const fetchDoctorData = async () => {
      if (!id) {
        setError("No doctor ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // First fetch doctor data
        const response = await fetch(`http://localhost:5000/doctor/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || "Failed to fetch doctor data");
        }

        const data = await response.json();

        if (!data.doctor) {
          throw new Error("Doctor data not found in response");
        }

        setDoctor(data.doctor);

        // Then fetch available slots
        const formattedDate = selectedDate.toISOString().split("T")[0];
        const slotsResponse = await fetch(
          `http://localhost:5000/availability?doctor_id=${id}&date=${formattedDate}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        // Don't throw error for slots, just set empty array if not ok
        if (slotsResponse.ok) {
          const slotsData = await slotsResponse.json();
          setAvailableSlots(slotsData.data);
        } else {
          setAvailableSlots([]);
        }
      } catch (err) {
        console.error("Error fetching doctor data:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorData();
  }, [id]); // Only depend on id

  useEffect(() => {
    const fetchAvailableSlots = async () => {
      if (!id || !selectedDate || !doctor) return;

      try {
        const formattedDate = selectedDate.toISOString().split("T")[0];
        const response = await fetch(
          `http://localhost:5000/availability?doctor_id=${id}&date=${formattedDate}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        // Don't throw error for slots, just set empty array if not ok
        if (response.ok) {
          const data = await response.json();
          setAvailableSlots(data.data);
        } else {
          setAvailableSlots([]);
        }
      } catch (err) {
        console.error("Error fetching available slots:", err);
        setAvailableSlots([]); // Set empty array on error
      }
    };

    fetchAvailableSlots();
  }, [id, selectedDate, doctor]);

  function handleNavigate() {
    router.push(`/doctors/${id}/appointment`);
  }

  const formattedDate = selectedDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value);
    setSelectedDate(newDate);
  };

  const formatTimeForDisplay = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const isSlotAvailable = (shift: string, index: number) => {
    const shiftData = availableSlots.find((s) => s.shift === shift);
    if (!shiftData || shiftData.slots.length === 0) return false;

    // For evening shift, add 8 to the index since evening slots start from index 8
    const slotIndex = shift === "evening" ? index + 8 : index;

    // Check if this index exists in any of the available slot

    return shiftData.slots.some((slot) => {
      // slot[2] is the index from the API

      return slot[2] === slotIndex;
    });
  };

  const isShiftAvailable = (shift: string) => {
    const shiftData = availableSlots.find((s) => s.shift === shift);
    return shiftData && shiftData.slots.length > 0;
  };

  const getAvailableSlotsCount = (shift: string) => {
    const shiftData = availableSlots.find((s) => s.shift === shift);
    return shiftData ? shiftData.slots.length : 0;
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (!doctor) {
    return <div className={styles.error}>Doctor not found</div>;
  }

  return (
    <div className={styles.profile_container}>
      <div className={styles.profile_header}>
        <div className={styles.doctor_image}>
          <Image
            src={doctorPic}
            alt="doctor profile"
            height={200}
            width={200}
          />
        </div>
        <div className={styles.doctor_info}>
          <div className={styles.name_rating}>
            <h2>Dr. {doctor.name}</h2>
            <div className={styles.rating}>
              <Image src={star} alt="rating" height={20} width={20} />
              <span>{doctor.average_rating}</span>
            </div>
          </div>
          <div className={styles.speciality}>
            <h3>{doctor.specialty.join(", ")}</h3>
          </div>
          <div className={styles.experience}>
            <Image src={experience} alt="experience" height={20} width={20} />
            <span>{doctor.experience_year} Years Experience</span>
          </div>
          <button
            className={styles.book_appointment_btn}
            onClick={handleNavigate}
          >
            Book Appointment
          </button>
        </div>
      </div>

      <div className={styles.profile_details}>
        <div className={styles.detail_section}>
          <h3>About</h3>
          <p>{doctor.biography}</p>
        </div>

        <div className={styles.detail_section}>
          <h3>Education</h3>
          <div className={styles.education}>
            <p>{doctor.degree}</p>
          </div>
        </div>

        <div className={styles.detail_section}>
          <h3>Specialization</h3>
          <div className={styles.specialization}>
            {doctor.specialty.map((spec, index) => (
              <span key={index}>{spec}</span>
            ))}
          </div>
        </div>

        <div className={styles.detail_section}>
          <h3>Diseases Treated</h3>
          <div className={styles.diseases}>
            {doctor.disease.map((dis, index) => (
              <span key={index}>{dis}</span>
            ))}
          </div>
        </div>

        <div className={styles.detail_section}>
          <h3>Location</h3>
          <div className={styles.location}>
            <Image src={location} alt="location" height={20} width={20} />
            <span>{doctor.location}</span>
          </div>
        </div>

        <div className={styles.detail_section}>
          <h3>Gender</h3>
          <div className={styles.gender}>
            <Image src={gender} alt="gender" height={20} width={20} />
            <span>{doctor.gender}</span>
          </div>
        </div>

        <div className={styles.detail_section}>
          <div className={styles.slots_header}>
            <h3>Available Slots</h3>
            <div className={styles.date_selector}>
              <input
                type="date"
                value={selectedDate.toISOString().split("T")[0]}
                onChange={handleDateChange}
                min={today.toISOString().split("T")[0]}
                className={styles.date_input}
              />
            </div>
          </div>
          <p className={styles.selected_date}>{formattedDate}</p>
          <div className={styles.slots_container}>
            {/* Morning Shift */}
            <div
              className={`${styles.slot_shift} ${
                isShiftAvailable("morning") ? styles.available_shift : ""
              }`}
            >
              <div className={styles.shift_header}>
                <div className={styles.logo_para}>
                  <Image src={sun} alt="morning" height={24} width={24} />
                  <p>Morning</p>
                </div>
                <div className={styles.available_slots}>
                  <p>{getAvailableSlotsCount("morning")} slots available</p>
                </div>
              </div>
              <div className={styles.slot_time}>
                {(() => {
                  const times = [
                    "09:00",
                    "09:30",
                    "10:00",
                    "10:30",
                    "11:00",
                    "11:30",
                    "12:00",
                    "12:30",
                  ];
                  const slots = [];
                  for (let i = 0; i < times.length; i++) {
                    const time = times[i];
                    const displayTime = formatTimeForDisplay(time);
                    const isAvailable = isSlotAvailable("morning", i);
                    {
                      console.log(isAvailable);
                    }
                    slots.push(
                      <div
                        key={time}
                        className={`${styles.slot} ${
                          isAvailable ? styles.available : styles.unavailable
                        }`}
                      >
                        {displayTime}
                      </div>
                    );
                  }
                  return slots;
                })()}
              </div>
            </div>

            {/* Evening Shift */}
            <div
              className={`${styles.slot_shift} ${
                isShiftAvailable("evening") ? styles.available_shift : ""
              }`}
            >
              <div className={styles.shift_header}>
                <div className={styles.logo_para}>
                  <Image src={sunset} alt="afternoon" height={24} width={24} />
                  <p>Afternoon</p>
                </div>
                <div className={styles.available_slots}>
                  <p>{getAvailableSlotsCount("evening")} slots available</p>
                </div>
              </div>
              <div className={styles.slot_time}>
                {(() => {
                  const times = [
                    "14:00",
                    "14:30",
                    "15:00",
                    "15:30",
                    "16:00",
                    "16:30",
                    "17:00",
                    "17:30",
                  ];
                  const slots = [];
                  for (let i = 0; i < times.length; i++) {
                    const time = times[i];
                    const displayTime = formatTimeForDisplay(time);
                    const isAvailable = isSlotAvailable("evening", i);
                    slots.push(
                      <div
                        key={time}
                        className={`${styles.slot} ${
                          isAvailable ? styles.available : styles.unavailable
                        }`}
                      >
                        {displayTime}
                      </div>
                    );
                  }
                  return slots;
                })()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
