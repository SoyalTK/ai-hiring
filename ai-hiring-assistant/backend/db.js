import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ai_hiring_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export const initDb = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Successfully connected to MySQL database.");
    
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        gender ENUM('male', 'female', 'other', 'prefer_not_to_say'),
        bio TEXT,
        location VARCHAR(100),
        profile_image VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS history (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        type ENUM('analysis', 'tailor') NOT NULL,
        job_description TEXT,
        result_content MEDIUMTEXT NOT NULL,
        resume_text_sample TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    
    console.log("✅ Users table ensured.");
    connection.release();
  } catch (err) {
    console.error("❌ Failed to connect to MySQL database:", err);
  }
};

export default pool;
