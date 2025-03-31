import db from "../config/db.js";

export const insertNotification = async ({
  user_id,
  appointment_id,
  message,
  type,
}) => {
  try {
    await db.query(
      `INSERT INTO notifications (user_id, appointment_id, message, type) VALUES ($1, $2, $3, $4)`,
      [user_id, appointment_id, message, type]
    );
    console.log("Notification added successfully.");
  } catch (error) {
    console.error("Error inserting notification:", error);
  }
};
