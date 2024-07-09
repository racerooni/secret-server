import { createPool, Pool, RowDataPacket, PoolOptions  } from 'mysql2';
import mysql from "mysql2/promise"

const conn: PoolOptions = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'secret-server'
};

const pool = mysql.createPool(conn);

export default pool;