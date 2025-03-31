import db from "../config/db.js";
import { timeSlotMap } from "../utils/timeSlot.js";
export const checkAvailability = async (doctor_id, date, shift) => {
  try {
    const query = `
      SELECT availability_id, slots 
      FROM availability 
      WHERE doctor_id = $1 AND date = $2 AND shift = $3
      FOR UPDATE;
    `;
    const result = await db.query(query, [doctor_id, date, shift]);
    return result.rows[0];
  } catch (error) {
    console.error("Error checking availability:", error);
    throw new Error("Database error");
  }
};

export const getAvailabilityByDate = async (doctorId, date) => {
  try {
    const query = `
      SELECT shift, slots 
      FROM availability 
      WHERE doctor_id = $1 AND date = $2
    `;
    const values = [doctorId, date];

    const { rows } = await db.query(query, values);

    return rows;
  } catch (error) {
    console.error("Error fetching availability:", error);
    throw new Error("Database query failed");
  }
};

export const getAvailabilityData = async (availability_id) => {
  try {
    const query = `
      SELECT * 
      FROM availability 
      WHERE availability_id = $1;
    `;
    const result = await db.query(query, [availability_id]);
    return result.rows[0];
  } catch (error) {
    console.error("Error get availability data:", error);
    throw new Error("Database error");
  }
};

export const createAppointment = async (
  doctor_id,
  availability_id,
  start_time,
  end_time,
  booking_type
) => {
  try {
    const query = `
      INSERT INTO appointments (doctor_id, availability_id, start_time, end_time, status, booking_type)
      VALUES ($1, $2, $3, $4, 'pending', $5) RETURNING *;
    `;
    const result = await db.query(query, [
      doctor_id,
      availability_id,
      start_time,
      end_time,
      booking_type,
    ]);
    return result.rows[0];
  } catch (error) {
    console.error("Error inserting appointment:", error);
    throw new Error("Database error");
  }
};

export const getTotalAppointmentRecords = async (filters) => {
  const {
    date = new Date().toISOString().split("T")[0],
    doctor_name = "",
    shift = "",
    status = "pending",
  } = filters;

  const query = `
          SELECT COUNT(*) AS total_count
          FROM appointments a
          JOIN patients p ON p.appointment_id = a.appointment_id
          JOIN doctor_details d ON d.doctor_id = a.doctor_id
          JOIN availability av ON av.availability_id = a.availability_id
          WHERE 
              av.date = $1
              AND ($2 = '' OR d.name ILIKE $2)
              AND ($3 = '' OR av.shift = $3)
              AND a.status = $4
      `;

  const values = [
    date,
    `%${doctor_name}%`,
    shift.toLowerCase(),
    status.toLowerCase(),
  ];

  try {
    const result = await db.query(query, values);
    return parseInt(result.rows[0].total_count);
  } catch (error) {
    console.error("Error getting total appointment records:", error);
    throw error;
  }
};

export const getFilteredAppointments = async (
  filters,
  pageNo,
  pageSize = 6
) => {
  const {
    date = new Date().toISOString().split("T")[0],
    doctor_name = "",
    shift = "",
    status = "pending",
  } = filters;

  const offset = (pageNo - 1) * pageSize;

  const query = `
          SELECT 
              a.appointment_id, a.start_time, a.end_time, a.status, a.booking_type,p.name AS patient_name,p.age AS patient_age,p.health_description,d.name AS doctor_name
          FROM appointments a
          JOIN patients p ON p.appointment_id = a.appointment_id
          JOIN doctor_details d ON d.doctor_id = a.doctor_id
          JOIN availability av ON av.availability_id = a.availability_id
          WHERE 
              av.date = $1
              AND ($2 = '' OR d.name ILIKE $2)
              AND ($3 = '' OR av.shift = $3)
              AND a.status = $4
          ORDER BY av.date, a.start_time
          LIMIT $5 OFFSET $6
      `;

  const values = [
    date,
    `%${doctor_name}%`,
    shift.toLowerCase(),
    status.toLowerCase(),
    pageSize,
    offset,
  ];

  try {
    const result = await db.query(query, values);
    return result.rows;
  } catch (error) {
    console.error("Error getting filtered appointments:", error);
    throw error;
  }
};

export const updateAvailability = async (slots, availability_id) => {
  try {
    const query = `UPDATE availability SET slots = $1 WHERE availability_id = $2;`;
    await db.query(query, [JSON.stringify(slots), availability_id]);
  } catch (error) {
    console.error("Error updating availability:", error);
    throw new Error("Database error");
  }
};

export const updateAppointmentPatient = async (patient_id, appointment_id) => {
  try {
    const query = `
        UPDATE appointments
        SET patient_id = $1
        WHERE appointment_id = $2;
      `;
    await db.query(query, [patient_id, appointment_id]);
  } catch (error) {
    console.error("Error updating appointment with patient_id:", error);
    throw new Error("Database error");
  }
};

export const insertPatient = async (
  name,
  age,
  gender,
  health_description,
  appointment_id,
  user_id
) => {
  try {
    const query = `
      INSERT INTO patients (name, age, gender, health_description, appointment_id,user_id)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING patient_id;
    `;

    const result = await db.query(query, [
      name,
      age,
      gender,
      health_description,
      appointment_id,
      user_id,
    ]);
    return result.rows[0].patient_id;
  } catch (error) {
    console.error("Error inserting patient:", error);
    throw new Error("Database error");
  }
};

export const getAppointmentDetails = async (appointment_id) => {
  const query = `
        SELECT 
            a.doctor_id, 
            a.availability_id, 
            a.start_time, 
            a.status,
            av.date,
            av.shift,
            av.slots
        FROM appointments a
        JOIN availability av ON a.availability_id = av.availability_id
        WHERE a.appointment_id = $1
    `;

  try {
    const result = await db.query(query, [appointment_id]);
    return result.rows[0];
  } catch (error) {
    console.error("Error fetching appointment details:", error);
    throw error;
  }
};

export const updateAppointmentStatus = async (appointment_id, status) => {
  const query = `
        UPDATE appointments 
        SET status = $1 
        WHERE appointment_id = $2
        RETURNING *
    `;

  try {
    const result = await db.query(query, [status, appointment_id]);
    return result.rows[0];
  } catch (error) {
    console.error("Error updating appointment status:", error);
    throw error;
  }
};

export const addSlotBackToAvailability = async (
  availability_id,
  start_time,
  currentSlots
) => {
  // calculate slot details
  console.log("slots ", availability_id, start_time, currentSlots);
  const [startHour, startMinute] = start_time.split(":").map(Number);
  let endHour = startHour;
  let endMinute = startMinute + 30;
  if (endMinute === 60) {
    endHour += 1;
    endMinute = 0;
  }

  const TIME_SLOT_MAP = timeSlotMap;
  // time slot mapping for consistency
  // const TIME_SLOT_MAP = {
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
  const endTime = `${endHour}:${endMinute === 0 ? "00" : "30"}`;
  const startIndex = TIME_SLOT_MAP[start_time];

  // check for duplicate slot
  const existingIndexes = new Set(currentSlots.map((slot) => slot[2]));
  if (existingIndexes.has(startIndex)) {
    throw new Error(`Slot ${start_time} is already booked`);
  }

  // add new slot
  const newSlot = [start_time, endTime, startIndex];
  const updatedSlots = [...currentSlots, newSlot];

  // update availability slots
  const query = `
        UPDATE availability 
        SET slots = $1 
        WHERE availability_id = $2
        RETURNING *
    `;

  try {
    const result = await db.query(query, [
      JSON.stringify(updatedSlots),
      availability_id,
    ]);
    return result.rows[0];
  } catch (error) {
    console.error("Error updating availability slots:", error);
    throw error;
  }
};

export const validateStatusUpdate = (appointmentDetails, newStatus) => {
  // prevent changing to pending
  if (newStatus === "pending") {
    throw new Error("Status cannot be changed to pending");
  }

  // prevent changing from completed or cancelled
  if (["completed", "cancelled"].includes(appointmentDetails.status)) {
    throw new Error(`Cannot change status from ${appointmentDetails.status}`);
  }

  // prevent changing to same status
  if (appointmentDetails.status === newStatus) {
    throw new Error(`Appointment is already ${newStatus}`);
  }
};
