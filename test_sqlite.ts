import { DatabaseSync } from 'node:sqlite';
const db = new DatabaseSync(':memory:');
db.exec('CREATE TABLE data(key TEXT, value TEXT);');
console.log('SQLite works!');
