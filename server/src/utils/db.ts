import pool from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

/**
 * Helper pour exécuter une requête SELECT
 * Retourne un tableau de résultats typés
 */
export async function query<T = any>(sql: string, params?: any[]): Promise<T[]> {
  const [rows] = await pool.query<RowDataPacket[]>(sql, params);
  return rows as T[];
}

/**
 * Helper pour exécuter une requête INSERT/UPDATE/DELETE
 * Retourne le ResultSetHeader avec insertId, affectedRows, etc.
 */
export async function execute(sql: string, params?: any[]): Promise<ResultSetHeader> {
  const [result] = await pool.execute<ResultSetHeader>(sql, params);
  return result;
}

/**
 * Helper pour obtenir un seul résultat
 * Retourne null si aucun résultat
 */
export async function queryOne<T = any>(sql: string, params?: any[]): Promise<T | null> {
  const rows = await query<T>(sql, params);
  return rows.length > 0 ? rows[0] : null;
}

export default { query, execute, queryOne };
