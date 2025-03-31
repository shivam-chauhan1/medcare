"use client";

import { useState, useEffect } from "react";
import styles from "@/app/styles/ScheduleForm.module.css";

type Shift = "morning" | "evening";

interface TimeSlots {
  [key: string]: string[];
}

interface UnavailableSlot {
  shift: string;
  slots: [string, string, number][];
}

interface ScheduleFormProps {
  doctor: {
    _id: string;
    name: string;
  };
  onClose: () => void;
}

export default function ScheduleForm({ doctor, onClose }: ScheduleFormProps) {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [shift, setShift] = useState<Shift>("morning");
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [unavailableSlots, setUnavailableSlots] = useState<UnavailableSlot[]>(
    []
  );
  const [loading, setLoading] = useState(false);

  const timeSlots: TimeSlots = {
    morning: [
      "9:00",
      "9:30",
      "10:00",
      "10:30",
      "11:00",
      "11:30",
      "12:00",
      "12:30",
    ],
    evening: [
      "14:00",
      "14:30",
      "15:00",
      "15:30",
      "16:00",
      "16:30",
      "17:00",
      "17:30",
    ],
  };

  const fetchAvailability = async (selectedDate: string) => {
    try {
      const response = await fetch(
        `http://localhost:5000/availability?doctor_id=${doctor._id}&date=${selectedDate}`,
        {
          credentials: "include",
        }
      );
      const data = await response.json();
      if (data.success) {
        setUnavailableSlots(data.data);
      }
    } catch (error) {
      console.error("Error fetching availability:", error);
    }
  };

  useEffect(() => {
    fetchAvailability(date);
  }, [date, doctor._id]);

  const isSlotUnavailable = (time: string) => {
    const currentShiftSlots = unavailableSlots.find(
      (slot) => slot.shift === shift
    );
    if (!currentShiftSlots) return false;

    return currentShiftSlots.slots.some(([startTime]) => startTime === time);
  };

  const handleTimeSelect = (time: string) => {
    if (isSlotUnavailable(time)) return;

    setSelectedTimes((prev) =>
      prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || selectedTimes.length === 0) {
      setMessage({
        type: "error",
        text: "Please select a date and at least one time slot",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/doctor/${doctor._id}/addSchedule`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            date: String(date),
            shift: String(shift),
            slot: {
              start: selectedTimes,
            },
          }),
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add schedule");
      }

      setMessage({ type: "success", text: "Schedule added successfully" });
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      console.error("Error adding schedule:", error);
      setMessage({
        type: "error",
        text: "Failed to add schedule. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>Add Schedule for {doctor.name}</h2>
          <button onClick={onClose} className={styles.closeButton}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="date">Date</label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={styles.input}
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="shift">Shift</label>
            <select
              id="shift"
              value={shift}
              onChange={(e) => setShift(e.target.value as Shift)}
              className={styles.select}
            >
              <option value="morning">Morning</option>
              <option value="evening">Evening</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Available Time Slots</label>
            <div className={styles.timeSlots}>
              {timeSlots[shift].map((time) => (
                <div
                  key={time}
                  className={`${styles.timeSlot} ${
                    selectedTimes.includes(time) ? styles.selected : ""
                  } ${isSlotUnavailable(time) ? styles.unavailable : ""}`}
                  onClick={() => handleTimeSelect(time)}
                >
                  {time}
                </div>
              ))}
            </div>
          </div>

          {message && (
            <div className={`${styles.message} ${styles[message.type]}`}>
              {message.text}
            </div>
          )}

          <div className={styles.modalFooter}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={!date || selectedTimes.length === 0 || loading}
            >
              {loading ? "Adding..." : "Add Schedule"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
