import {
  checkAvailability,
  createAppointment,
  updateAvailability,
  insertPatient,
  updateAppointmentPatient,
} from "../model/appointmentModel.js";
import db from "../config/db.js";
import { sendNotification } from "../controllers/notificationController.js";

export const bookAppointment = async (req, res) => {
  const { id: doctor_id } = req.params;
  let {
    name,
    age,
    gender,
    health_description,
    date,
    booking_type,
    shift,
    slot,
    location,
  } = req.body;

  // validate Input
  name = name?.trim();
  gender = gender?.trim();
  health_description = health_description?.trim();
  console.log(req.body);
  if (
    !name ||
    !gender ||
    !age ||
    !["Male", "Female"].includes(gender) ||
    isNaN(age) ||
    age <= 0
  ) {
    return res.status(400).json({ message: "Invalid patient details" });
  }

  if (
    !date ||
    !booking_type ||
    !shift ||
    !slot ||
    !["virtual", "physical"].includes(booking_type) ||
    !["morning", "evening"].includes(shift)
  ) {
    return res.status(400).json({ message: "Invalid booking details" });
  }

  try {
    await db.query("BEGIN");

    // check Availability
    console.log(doctor_id);
    const availability = await checkAvailability(doctor_id, date, shift);
    if (!availability) {
      await db.query("ROLLBACK");
      return res.status(400).json({ message: "No availability found" });
    }

    let slots = availability.slots || [];
    const slotIndex = slots.findIndex((s) => s[0] === slot);

    if (slotIndex === -1) {
      await db.query("ROLLBACK");
      return res.status(400).json({ message: "Slot is not available" });
    }

    // create Appointment
    const appointment_data = await createAppointment(
      doctor_id,
      availability.availability_id,
      slots[slotIndex][0],
      slots[slotIndex][1],
      booking_type
    );

    // remove Booked Slot
    slots.splice(slotIndex, 1);
    await updateAvailability(slots, availability.availability_id);

    console.log(appointment_data);
    console.log(appointment_data.appointment_id);
    // insert patient info
    const appointment_id = appointment_data.appointment_id;
    const user_id = req.user.user_id;
    const patient_id = await insertPatient(
      name,
      age,
      gender,
      health_description,
      appointment_id,
      user_id
    );

    await db.query("COMMIT");

    res.status(201).json({ message: "Appointment booked successfully" });
    console.log("checking");
    Promise.resolve().then(() =>
      sendNotification({
        user_id,
        appointment_id,
        doctor_id,
        booking_type,
        date,
        user_email: req.user.email,
        booking_status: "pending",
        startTime: appointment_data.start_time,
        endTime: appointment_data.end_time,
      })
    );
  } catch (error) {
    await db.query("ROLLBACK");
    console.error("Error booking appointment:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
