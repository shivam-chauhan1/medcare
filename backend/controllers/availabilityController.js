import DoctorModel from "../model/doctorModel.js";
import { timeSlotMap } from "../utils/timeSlot.js";
import { getAvailabilityByDate } from "../model/appointmentModel.js";
export const addSchedule = async (req, res) => {
  try {
    const { date, shift, slot } = req.body;
    const doctor_id = req.params.doctorId;
    console.log("body: ", req.body);
    if (!doctor_id || !date || !shift || !slot || !Array.isArray(slot.start)) {
      return res
        .status(400)
        .json({ message: "Missing or invalid required fields" });
    }

    // validate shift
    if (!["morning", "evening"].includes(shift)) {
      return res.status(400).json({ message: "Invalid shift provided" });
    }

    // define time slot mapping
    // const timeSlotMap = {
    //   "9:00": 0,
    //   "9:30": 1,
    //   "10:00": 2,
    //   "10:30": 3,
    //   "11:00": 4,
    //   "11:30": 5,
    //   "12:00": 6,
    //   "12:30": 7,
    //   "14:00": 8,
    //   "14:30": 9,
    //   "15:00": 10,
    //   "15:30": 11,
    //   "16:00": 12,
    //   "16:30": 13,
    //   "17:00": 14,
    //   "17:30": 15,
    // };

    let slotsData = [];

    for (let startTime of slot.start) {
      const [startHour, startMinute] = startTime.split(":").map(Number);

      if (
        (shift === "morning" &&
          (startHour < 9 ||
            startHour > 12 ||
            (startHour === 12 && startMinute > 30))) ||
        (shift === "evening" &&
          (startHour < 14 ||
            startHour > 17 ||
            (startHour === 17 && startMinute > 30)))
      ) {
        return res
          .status(400)
          .json({ message: `Invalid start time: ${startTime}` });
      }

      let endHour = startHour;
      let endMinute = startMinute + 30;
      if (endMinute === 60) {
        endHour += 1;
        endMinute = 0;
      }
      const endTime = `${endHour}:${endMinute === 0 ? "00" : "30"}`;

      if (!(startTime in timeSlotMap)) {
        return res
          .status(400)
          .json({ message: `Invalid start time: ${startTime}` });
      }

      const startIndex = timeSlotMap[startTime];
      slotsData.push([startTime, endTime, startIndex]);
    }

    const slotData = JSON.stringify(slotsData);

    // check if doctor_id, date, shift already exists
    const existingSchedule = await DoctorModel.checkExistingSchedule(
      doctor_id,
      date,
      shift
    );
    console.log(existingSchedule);
    if (existingSchedule) {
      let existingSlots = existingSchedule.slots || [];
      // check for duplicate slot indices
      const existingIndexes = new Set(existingSlots.map((slot) => slot[2]));
      for (let newSlot of slotsData) {
        if (existingIndexes.has(newSlot[2])) {
          return res.status(400).json({
            message: `Slot conflict: ${newSlot[0]} is already booked`,
          });
        }
      }

      // append new slots and update the row
      const updatedSlots = [...existingSlots, ...slotsData];
      const updatedSlotData = JSON.stringify(updatedSlots);

      await DoctorModel.updateSlots(updatedSlotData, doctor_id, date, shift);

      return res.status(200).json({
        message: "Schedule updated successfully",
        availability: updatedSlots,
      });
    } else {
      // if not exists, insert a new schedule
      const scheduleData = { doctor_id, date, shift, slotData };
      await DoctorModel.insertSchedule(scheduleData);

      return res.status(201).json({
        message: "Schedule added successfully",
        availability: slotsData,
      });
    }
  } catch (error) {
    console.error("Error adding schedule:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const fetchAvailabilityByDate = async (req, res) => {
  try {
    const { doctor_id, date } = req.query;

    if (!doctor_id || !date) {
      return res.status(400).json({ error: "doctor_id and date are required" });
    }

    const availability = await getAvailabilityByDate(doctor_id, date);

    if (availability.length === 0) {
      return res.status(404).json({ message: "No availability found" });
    }

    res.json({ success: true, data: availability });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
