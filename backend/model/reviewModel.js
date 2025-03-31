import db from "../config/db.js";

export const getTotalReviewRecords = async (doctorId) => {
  const query = `
    SELECT COUNT(*) AS total_count
    FROM reviews r
    JOIN patients p ON r.patient_id = p.patient_id
    WHERE r.doctor_id = $1
  `;

  try {
    const result = await db.query(query, [doctorId]);
    return parseInt(result.rows[0].total_count, 10);
  } catch (error) {
    console.error("Error getting total review records:", error);
    throw error;
  }
};

export const getPaginatedReviews = async (doctorId, pageNo, pageSize = 6) => {
  const offset = (pageNo - 1) * pageSize;

  const query = `
    SELECT r.review_id, r.rating, r.comments, r.created_at, p.name AS patient_name
    FROM reviews r
    JOIN patients p ON r.patient_id = p.patient_id
    WHERE r.doctor_id = $1
    ORDER BY r.created_at DESC
    LIMIT $2 OFFSET $3
  `;

  try {
    const result = await db.query(query, [doctorId, pageSize, offset]);
    return result.rows;
  } catch (error) {
    console.error("Error getting paginated reviews:", error);
    throw error;
  }
};

// get total unreviewed completed appointments count for a specific doctor
export const getTotalUnreviewedAppointments = async (userId, doctorId) => {
  const query = `
      SELECT COUNT(*) AS total_count
      FROM (
          SELECT a.appointment_id
          FROM patients p
          JOIN appointments a ON p.appointment_id = a.appointment_id
          LEFT JOIN reviews r ON r.appointment_id = a.appointment_id
          WHERE p.user_id = $1
          AND a.doctor_id = $2
          AND a.status = 'completed'
          AND r.appointment_id IS NULL
      ) AS filtered_appointments;
  `;
  try {
    const result = await db.query(query, [userId, doctorId]);
    return parseInt(result.rows[0].total_count);
  } catch (error) {
    console.error("Error fetching total unreviewed appointments:", error);
    throw error;
  }
};

// fetch paginated unreviewed completed appointments for a doctor
export const getUnreviewedAppointments = async (
  userId,
  doctorId,
  pageNo,
  pageSize
) => {
  const offset = (pageNo - 1) * pageSize;

  const query = `
      SELECT a.appointment_id, p.name AS patient_name
      FROM patients p
      JOIN appointments a ON p.appointment_id = a.appointment_id
      LEFT JOIN reviews r ON r.appointment_id = a.appointment_id
      WHERE p.user_id = $1
      AND a.doctor_id = $2
      AND a.status = 'completed'
      AND r.appointment_id IS NULL
      ORDER BY a.created_at DESC
      LIMIT $3 OFFSET $4;
  `;
  try {
    const result = await db.query(query, [userId, doctorId, pageSize, offset]);

    return result.rows;
  } catch (error) {
    console.error("Error fetching paginated unreviewed appointments:", error);
    throw error;
  }
};

export const createReview = async (
  doctorId,
  appointmentId,
  rating,
  comment
) => {
  try {
    // get patient_id from appointment
    const patientQuery = `
          SELECT p.patient_id
          FROM patients p
          JOIN appointments a ON p.appointment_id = a.appointment_id
          WHERE a.appointment_id = $1 AND a.doctor_id = $2;
      `;
    const patientResult = await db.query(patientQuery, [
      appointmentId,
      doctorId,
    ]);

    if (patientResult.rows.length === 0) {
      throw new Error("Invalid appointment or doctor ID.");
    }

    const patientId = patientResult.rows[0].patient_id;
    const insertQuery = `
          INSERT INTO reviews (appointment_id, patient_id,  doctor_id, rating, comments, created_at)
          VALUES ($1, $2, $3, $4, $5,  NOW())
          RETURNING *;
      `;
    const result = await db.query(insertQuery, [
      appointmentId,
      patientId,
      doctorId,
      rating,
      comment,
    ]);

    const updateAverageRatingQuery = `
UPDATE doctor_details d
SET average_rating = 
    ROUND(
        (COALESCE(d.average_rating::NUMERIC, 0) + 
        COALESCE((SELECT AVG(r.rating)::NUMERIC FROM reviews r WHERE r.doctor_id = d.doctor_id), 0)) / 2, 
        1
    )::FLOAT
WHERE d.doctor_id = $1
RETURNING average_rating;
`;

    const updateAverage = await db.query(updateAverageRatingQuery, [doctorId]);
    return result.rows[0];
  } catch (error) {
    console.error("Error inserting review:", error);
    throw error;
  }
};
