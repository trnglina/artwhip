import Database from 'bun:sqlite';
import { drizzle } from 'drizzle-orm/bun-sqlite';

const sqlite = new Database(process.env['DB_PATH']);
export default drizzle(sqlite);
