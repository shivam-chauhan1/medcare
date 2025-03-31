import db from "../config/db.js";

class User {
  constructor({ email, name, password_hashed, role }) {
    this.email = email;
    this.name = name;
    this.password_hashed = password_hashed;
    this.role = role;
  }

  async save() {
    try {
      const query = `INSERT INTO users (email, name, password_hashed, role, created_at, updated_at) 
                           VALUES ($1, $2, $3, $4, NOW(), NOW()) RETURNING *`;
      const values = [this.email, this.name, this.password_hashed, this.role];
      const { rows } = await db.query(query, values);
      return rows[0];
    } catch (err) {
      return err;
    }
  }

  static async findByEmail(email) {
    try {
      const query = `SELECT * FROM users WHERE email = $1`;
      const { rows } = await db.query(query, [email]);
      return rows[0];
    } catch (err) {
      return err;
    }
  }

  static async getUserById(user_id) {
    try {
      const query = `SELECT * FROM users WHERE user_id = $1`;
      const { rows } = await db.query(query, [user_id]);
      return rows[0];
    } catch (err) {
      return err;
    }
  }
}

export default User;
