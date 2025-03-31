import db from "../config/db.js";

class DoctorModel {
  static async createDoctor(doctorData) {
    const {
      name,
      email,
      average_rating = 0,
      experience_year,
      degree,
      biography,
      photo_url,
      location,
      specialty,
      disease,
      gender,
    } = doctorData;

    const query = `
  INSERT INTO doctor_details (
      name,
      email,
      average_rating, 
      experience_year, 
      degree, 
      biography, 
      photo_url, 
      location,
      specialty,
      disease,
      gender
  ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11
  ) RETURNING doctor_id, created_at
`;

    try {
      const result = await db.query(query, [
        name,
        email,
        average_rating,
        experience_year,
        degree,
        biography,
        photo_url,
        location,
        specialty,
        disease,
        gender,
      ]);

      return result.rows[0];
    } catch (error) {
      // handle unique email constraint violation
      if (error.code === "23505") {
        throw new Error("Email already exists");
      }
      console.error("Error creating doctor:", error);
      throw error;
    }
  }

  static async removeDoctor(doctorId) {
    const query = "DELETE FROM doctor_details WHERE doctor_id = $1 RETURNING *";

    try {
      const result = await db.query(query, [doctorId]);

      if (result.rowCount === 0) {
        throw new Error("Doctor not found");
      }

      return result.rows[0];
    } catch (error) {
      console.error("Error removing doctor:", error);
      throw error;
    }
  }

  static async getDoctorById(doctorId) {
    console.log(doctorId);
    const query = "SELECT * FROM doctor_details WHERE doctor_id = $1";

    try {
      const result = await db.query(query, [doctorId]);
      console.log(result.rowCount);
      if (result.rowCount === 0) {
        return null;
      }

      return result.rows[0];
    } catch (error) {
      console.error("Error fetching doctor:", error);
      throw error;
    }
  }

  static async updateDoctor(doctorId, updateData) {
    const {
      name,
      email,
      average_rating,
      experience_year,
      degree,
      biography,
      photo_url,
      location,
      specialty,
      disease,
      gender,
    } = updateData;

    const query = `
    UPDATE doctor_details
    SET 
        name = COALESCE($1, name),
        email = COALESCE($2, email),
        average_rating = COALESCE($3, average_rating),
        experience_year = COALESCE($4, experience_year),
        degree = COALESCE($5, degree),
        biography = COALESCE($6, biography),
        photo_url = COALESCE($7, photo_url),
        location = COALESCE($8, location),
        specialty = COALESCE($9, specialty),
        disease = COALESCE($10, disease),
        gender = COALESCE($11, gender),
        updated_at = CURRENT_TIMESTAMP
    WHERE doctor_id = $12
    RETURNING *;
  `;

    try {
      const result = await db.query(query, [
        name,
        email,
        average_rating,
        experience_year,
        degree,
        biography,
        photo_url,
        location,
        specialty,
        disease,
        gender,
        doctorId,
      ]);

      if (result.rowCount === 0) {
        throw new Error("Doctor not found");
      }

      return result.rows[0];
    } catch (error) {
      // handle unique email constraint violation
      if (error.code === "23505") {
        throw new Error("Email already exists");
      }
      console.error("Error updating doctor:", error);
      throw error;
    }
  }

  static async insertSchedule(scheduleData) {
    try {
      await db.query("BEGIN");

      const { doctor_id, date, shift, slotData } = scheduleData;

      // parse slotData from string to JSON object
      const slots = JSON.parse(slotData);

      const insertQuery = `
            INSERT INTO availability 
            (doctor_id, date, shift, slots) 
            VALUES ($1, $2, $3, $4) 
            RETURNING availability_id
        `;

      const result = await db.query(insertQuery, [
        doctor_id,
        date,
        shift,
        JSON.stringify(slots),
      ]);

      await db.query("COMMIT");

      return result.rows[0].availability_id;
    } catch (error) {
      await db.query("ROLLBACK");
      throw error;
    }
  }

  static async checkExistingSchedule(doctor_id, date, shift) {
    try {
      const query = `
          SELECT slots FROM availability
          WHERE doctor_id = $1
          AND date = $2
          AND shift = $3
      `;
      const result = await db.query(query, [doctor_id, date, shift]);

      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
      throw error;
    }
  }

  static async updateSlots(updatedSlotData, doctor_id, date, shift) {
    try {
      const query = `
              UPDATE availability 
              SET slots = $1 WHERE doctor_id = $2 
              AND date = $3 AND shift = $4
          `;
      const result = await db.query(query, [
        updatedSlotData,
        doctor_id,
        date,
        shift,
      ]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async getTotalDoctorRecords(filters) {
    const { query, values, index } = buildDoctorQuery(filters, true);
    console.log(query, values, index);
    try {
      const result = await db.query(query, values);
      return parseInt(result.rows[0].total_count);
    } catch (error) {
      console.error("Error getting total doctor records:", error);
      throw error;
    }
  }

  static async getFilteredDoctors(filters, pageNo, pageSize = 6) {
    const { query, values, index } = buildDoctorQuery(filters, false);

    const offset = (pageNo - 1) * pageSize;
    const paginatedQuery = `${query} LIMIT $${index} OFFSET $${index + 1}`;
    values.push(pageSize, offset);

    try {
      const result = await db.query(paginatedQuery, values);
      return result.rows;
    } catch (error) {
      console.error("Error getting filtered doctors:", error);
      throw error;
    }
  }
}

const buildDoctorQuery = (filters, countOnly = false) => {
  let query = countOnly
    ? `SELECT COUNT(*) AS total_count FROM doctor_details WHERE 1=1`
    : `SELECT * FROM doctor_details WHERE 1=1`;

  const values = [];
  let index = 1;

  console.log(filters);

  // handling Name, Specialty, and Disease as OR condition inside parentheses
  let searchConditions = [];

  if (filters.specialty) {
    searchConditions.push(
      `EXISTS (SELECT 1 FROM unnest(specialty) AS s WHERE s ILIKE $${index})`
    );
    values.push(`%${filters.specialty}%`);
    index++;
  }

  if (filters.disease) {
    searchConditions.push(
      `EXISTS (SELECT 1 FROM unnest(disease) AS d WHERE d ILIKE $${index})`
    );
    values.push(`%${filters.disease}%`);
    index++;
  }

  if (filters.doctor_name) {
    searchConditions.push(`name ILIKE $${index}`);
    values.push(`%${filters.doctor_name}%`);
    index++;
  }

  // apply OR conditions correctly by grouping them in parentheses
  if (searchConditions.length > 0) {
    query += ` AND (${searchConditions.join(" OR ")})`;
  }

  // gender Filter, skip if "all"
  if (filters.gender && filters.gender.toLowerCase() !== "all") {
    query += ` AND gender = $${index}`;
    values.push(filters.gender);
    index++;
  }

  // rating Filter
  if (filters.rating) {
    query += ` AND average_rating = $${index}`;
    values.push(parseFloat(filters.rating));
    index++;
  }

  // experience Filter, skip if "all"
  if (filters.experience && filters.experience.toLowerCase() !== "all") {
    if (filters.experience.includes("-")) {
      const [minExp, maxExp] = filters.experience.split("-").map(Number);
      query += ` AND experience_year BETWEEN $${index} AND $${index + 1}`;
      values.push(minExp, maxExp);
      index += 2;
    } else {
      query += ` AND experience_year >= $${index}`;
      values.push(parseInt(filters.experience));
      index++;
    }
  }

  // sorting
  if (!countOnly) {
    query += ` ORDER BY average_rating DESC`;
  }

  return { query, values, index };
};

export default DoctorModel;
