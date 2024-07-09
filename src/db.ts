import { createPool, Pool, RowDataPacket, PoolOptions  } from 'mysql2';
import mysql from "mysql2/promise";
import dotenv from 'dotenv';

dotenv.config();

const conn: PoolOptions = { //db csatlakozas adatai
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3000,
  database: process.env.DB_DATABASE || 'secret-server'
};

const pool = mysql.createPool(conn);

export default pool;