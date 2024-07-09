import { RowDataPacket, FieldPacket, ResultSetHeader } from "mysql2";
import { Pool } from "mysql2/promise";
import mysql from "mysql2/promise";
import pool from "./db";

interface Secret { //Secret object propertyk
  id: string;
  secret: string;
  createdAt: Date;
  expireAfter: Date;
  expireAfterViews: number;
}

export const findSecret = async (hash: string): Promise<Secret | null> => { //hash alapjan lekerdezzuk a hozza tartozo secret-et
  const [rows] = await pool.execute<RowDataPacket[]>(
    "SELECT * FROM secrets WHERE id = ?",
    [hash]
  );
  if (!rows || !rows.length) {
    return null;
  }
  console.log(rows);
  const secret = { //mielott visszakuldenenk, letaroljuk egy kulon valtozoba az objektumot
    id: rows[0].id,
    secret: rows[0].secret,
    createdAt: rows[0].createdAt,
    expireAfter: rows[0].expireAfter,
    expireAfterViews: rows[0].expireAfterViews,
  };

  const rn = new Date(); // mostani date-timeot megnezzuk, hogy kesobb osszehasonlithassuk a lejarati idovel
  if (
    (secret.expireAfter && rn > secret.expireAfter) || //ebbe az if ágba le-ellenorizuk, hogy lejart-e a secret ideje, vagy a hátralévő megtekintések elérték-e a 0-t
    secret.expireAfterViews <= 0
  ) {
    await removeSecret(secret.id); //toroljuk
    return null; // 
  }

  return secret; //ha ervenyes meg a secret akkor pedig returnoljuk
};

export const saveSecret = async ( //ebben a metodusban lementjuk a secretet az adatbazisban
  id: string,
  secretText: string,
  expireAfterMins: number,
  expireAfterViews: number
): Promise<void> => {
  const expireAfter =
    expireAfterMins > 0 ? new Date(Date.now() + expireAfterMins * 60000) : null;
  const createdAt = new Date(Date.now());
  const query =
    "INSERT INTO secrets (id, secret, createdAt, expireAfter, expireAfterViews) VALUES (?, ?, ?, ?, ?)";
  await pool.execute<ResultSetHeader>(query, [
    id,
    secretText,
    createdAt,
    expireAfter,
    expireAfterViews,
  ]);
};

export const decrementViews = async (id: string): Promise<void> => { //ebben a metodusban csokkentjuk a hatralevo megtekintesek szamat
  const query =
    "UPDATE secrets SET expireAfterViews = expireAfterViews - 1 WHERE id = ?";
  await pool.execute<ResultSetHeader>(query, [id]);
};

export const removeSecret = async (id: string): Promise<void> => { //ez kerul lefutasra, ha a secret ideje lejart, vagy tul sokszor tekintettek meg
  const query = "DELETE FROM secrets WHERE id = ?";
  await pool.execute<ResultSetHeader>(query, [id]);
};
