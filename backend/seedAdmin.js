import bcrypt from "bcrypt";
import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";

dotenv.config();

// PostgreSQL connection pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const seedAdmin = async () => {
  try {
    // Check if the admin already exists
    const checkAdminQuery = "SELECT * FROM users WHERE email = $1";
    const adminEmail = "admin@gmail.com";
    const result = await pool.query(checkAdminQuery, [adminEmail]);

    if (result.rows.length > 0) {
      console.log("Admin user already exists");
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    // Insert the admin user
    const insertAdminQuery = `
      INSERT INTO users (name, email, password_hashed, role)
      VALUES ($1, $2, $3, $4)
    `;
    const adminData = ["Admin", adminEmail, hashedPassword, "admin"];

    await pool.query(insertAdminQuery, adminData);
    console.log("Admin user created successfully");
  } catch (error) {
    console.error("Error seeding admin user:", error);
  } finally {
    // Close the database connection
    await pool.end();
  }
};

seedAdmin();
