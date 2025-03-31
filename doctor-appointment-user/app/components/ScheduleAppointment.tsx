"use client";
import React, { useState, useEffect } from "react";
import styles from "@/app/styles/ScheduleAppointment.module.css";
import Image from "next/image";
import sun from "@/public/images/sun.svg";
import sunset from "@/public/images/sunset.svg";
import leftArrowIcon from "@/public/images/leftArrowIcon.png";
import rightArrowIcon from "@/public/images/rightArrowIcon.png";
import { useParams } from "next/navigation";

interface PatientInfo {
  name: string;
  age: number;
  gender: "male" | "female";
  healthDescription: string;
}

interface Slot {
  shift: string;
  slots: [string, string, number][];
}

interface PatientProps {
  setPatientFormFill: React.Dispatch<React.SetStateAction<boolean>>;
  patientInfo: PatientInfo;
}

export default function ScheduleAppointment({
  setPatientFormFill,
  patientInfo,
}: PatientProps) {
  const { id } = useParams();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [startDate, setStartDate] = useState(new Date());
  const [isVirtualConsult, setIsVirtualConsult] = useState(true);
  const [availableSlots, setAvailableSlots] = useState<Slot[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState<{
    shift: string;
    time: string;
    index: number;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchAvailableSlots = async () => {
      if (!id) return;

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

        if (response.ok) {
          const data = await response.json();
          setAvailableSlots(data.data);
        } else {
          setAvailableSlots([]);
        }
      } catch (err) {
        console.error("Error fetching available slots:", err);
        setAvailableSlots([]);
      }
    };

    fetchAvailableSlots();
  }, [id, selectedDate]);

  const isSlotAvailable = (shift: string, index: number) => {
    const shiftData = availableSlots.find((s) => s.shift === shift);
    if (!shiftData || shiftData.slots.length === 0) return false;

    const slotIndex = shift === "evening" ? index + 8 : index;
    return shiftData.slots.some((slot) => slot[2] === slotIndex);
  };

  const formatTimeForDisplay = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const nextMonth = () => {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    );
    setStartDate(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  const prevMonth = () => {
    const newDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() - 1,
      1
    );
    const today = new Date();

    // If going to current month, start from current date
    if (
      newDate.getMonth() === today.getMonth() &&
      newDate.getFullYear() === today.getFullYear()
    ) {
      setStartDate(today);
    } else {
      setStartDate(newDate);
    }

    setCurrentMonth(newDate);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    // Fetch available slots for selected date
    const formattedDate = date.toISOString().split("T")[0];
    fetchAvailableSlots(formattedDate);
  };

  const fetchAvailableSlots = async (date: string) => {
    if (!id) return;

    try {
      const response = await fetch(
        `http://localhost:5000/availability?doctor_id=${id}&date=${date}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        setAvailableSlots(data.data);
      } else {
        setAvailableSlots([]);
      }
    } catch (err) {
      console.error("Error fetching available slots:", err);
      setAvailableSlots([]);
    }
  };

  const formattedDate = currentMonth.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const getNext7Days = (date: Date) => {
    return Array.from({ length: 7 }, (_, i) => {
      const newDate = new Date(date);
      newDate.setDate(date.getDate() + i);
      return newDate;
    });
  };

  const nextWeek = () => {
    setStartDate((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() + 7);
      return newDate;
    });
  };

  const dates = getNext7Days(startDate);
  const today = new Date().toDateString();

  const handleSlotSelect = (shift: string, time: string, index: number) => {
    if (isSlotAvailable(shift, index)) {
      setSelectedSlot({ shift, time, index });
    }
  };

  const handleSubmit = async () => {
    if (!selectedSlot) {
      alert("Please select a time slot");
      return;
    }

    setIsSubmitting(true);
    try {
      const formattedDate = selectedDate.toISOString().split("T")[0];
      // Format time to "9:30" format
      const [hours, minutes] = selectedSlot.time.split(":");
      const formattedTime = `${parseInt(hours)}:${minutes}`;

      // Capitalize first letter of gender
      const formattedGender =
        patientInfo.gender.charAt(0).toUpperCase() +
        patientInfo.gender.slice(1);

      // Set booking_type based on consultation type
      const bookingType = isVirtualConsult ? "virtual" : "physical";

      const requestData = {
        name: patientInfo.name,
        age: patientInfo.age,
        gender: formattedGender, // Will be "Male" or "Female"
        health_description: patientInfo.healthDescription,
        date: formattedDate,
        booking_type: bookingType,
        shift: selectedSlot.shift,
        slot: formattedTime, // Will be in format "9:30"
      };

      console.log("Submitting appointment data:", requestData); // For debugging

      const response = await fetch(
        `http://localhost:5000/doctor/${id}/booking`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(requestData),
        }
      );

      if (response.ok) {
        alert("Appointment booked successfully!");
        setPatientFormFill(false); // Set to false after successful booking
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to book appointment");
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
      alert("Failed to book appointment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.appointment_container}>
      <div className={styles.appointment_div}>
        <div>
          <h3>Schedule Appointment</h3>
          <button>Book Appointment</button>
        </div>
        <div>
          <button
            onClick={() => setIsVirtualConsult(true)}
            className={
              isVirtualConsult
                ? styles.selected_consult
                : styles.unselected_consult
            }
          >
            Book Video Consult
          </button>
          <button
            onClick={() => setIsVirtualConsult(false)}
            className={
              !isVirtualConsult
                ? styles.selected_consult
                : styles.unselected_consult
            }
          >
            Book Hospital Visit
          </button>
        </div>
        {!isVirtualConsult && (
          <div>
            <select name="" id="">
              <option value="">MedicareHeart Institute, Okhla Road</option>
            </select>
          </div>
        )}
      </div>
      <div className={styles.month_div}>
        <div className={` ${styles.leftArrowDiv} ${styles.arrowImageDiv} `}>
          <Image
            src={leftArrowIcon}
            alt="left arrow"
            height={8.21}
            width={12.72}
            onClick={prevMonth}
            className={styles.arrow}
          />
        </div>
        <p>{formattedDate}</p>
        <div className={styles.arrowImageDiv}>
          <Image
            src={rightArrowIcon}
            alt="right arrow"
            height={8.21}
            width={12.72}
            onClick={nextMonth}
            className={styles.arrow}
          />
        </div>
      </div>
      <div className={styles.calendar_div_wrapper}>
        <div className={styles.calendar_div}>
          <div className={styles.calendar_list}>
            {dates.map((date, index) => {
              const isToday = date.toDateString() === today;
              const isSelected =
                date.toDateString() === selectedDate.toDateString();
              return (
                <div
                  key={index}
                  className={`${styles.date_div} ${
                    isToday ? styles.today : ""
                  } ${isSelected ? styles.selected_date : ""}`}
                  onClick={() => handleDateSelect(date)}
                >
                  <p>
                    {date.toLocaleDateString("en-US", { weekday: "short" })}
                  </p>
                  <p>
                    {date.toLocaleDateString("en-US", {
                      day: "2-digit",
                      month: "short",
                    })}
                  </p>
                </div>
              );
            })}
          </div>

          <div className={styles.arrowImageDiv}>
            <Image
              src={rightArrowIcon}
              alt="right arrow"
              height={8.21}
              width={12.72}
              onClick={nextWeek}
              className={styles.arrow}
            />
          </div>
        </div>
      </div>

      <div className={styles.noon_div}>
        <div>
          <div className={styles.logo_para}>
            <Image src={sun} alt="sun" height={23.43} width={21.65} />
            <p>Morning</p>
          </div>
          <div className={styles.available_slots}>
            <p>
              {availableSlots.find((s) => s.shift === "morning")?.slots
                .length || 0}{" "}
              slots
            </p>
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
            return times.map((time, index) => {
              const displayTime = formatTimeForDisplay(time);
              const isAvailable = isSlotAvailable("morning", index);
              const isSelected =
                selectedSlot?.shift === "morning" &&
                selectedSlot.index === index;
              return (
                <div
                  key={time}
                  className={`${
                    isAvailable ? styles.available : styles.unavailable
                  } ${isSelected ? styles.selected_slot : ""}`}
                  onClick={() => handleSlotSelect("morning", time, index)}
                >
                  {displayTime}
                </div>
              );
            });
          })()}
        </div>
      </div>
      <div className={styles.noon_div}>
        <div>
          <div className={styles.logo_para}>
            <Image src={sunset} alt="sunset" height={23.43} width={21.65} />
            <p>Afternoon</p>
          </div>
          <div className={styles.available_slots}>
            <p>
              {availableSlots.find((s) => s.shift === "evening")?.slots
                .length || 0}{" "}
              slots
            </p>
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
            return times.map((time, index) => {
              const displayTime = formatTimeForDisplay(time);
              const isAvailable = isSlotAvailable("evening", index);
              const isSelected =
                selectedSlot?.shift === "evening" &&
                selectedSlot.index === index;
              return (
                <div
                  key={time}
                  className={`${
                    isAvailable ? styles.available : styles.unavailable
                  } ${isSelected ? styles.selected_slot : ""}`}
                  onClick={() => handleSlotSelect("evening", time, index)}
                >
                  {displayTime}
                </div>
              );
            });
          })()}
        </div>
      </div>
      <div className={styles.next_btn_div}>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || !selectedSlot}
          className={
            isSubmitting || !selectedSlot ? styles.disabled_button : ""
          }
        >
          {isSubmitting ? "Booking..." : "Next"}
        </button>
      </div>
    </div>
  );
}
