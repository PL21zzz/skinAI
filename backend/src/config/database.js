import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

export const sequelize = new Sequelize(
  process.env.DB_NAME || "skin_disease_db",
  process.env.DB_USER || "admin", // User mặc định ta sẽ đặt trong Docker
  process.env.DB_PASSWORD || "123456",
  {
    host: process.env.DB_HOST || "db", // Quan trọng: 'db' là tên service trong docker-compose
    port: process.env.DB_PORT || 5432, // Port chuẩn của Postgres
    dialect: "postgres", // Đổi từ 'mysql' sang 'postgres'
    logging: false, // Tắt log cho gọn
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

export const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Kết nối PostgreSQL thành công!");
  } catch (error) {
    console.error("❌ Không thể kết nối tới PostgreSQL:", error);
  }
};
