// db.js
// import Database from "tauri-plugin-sql-api";

// const db = await Database.load("sqlite:test.db");

// // ... Migration functions (migrateDb, getDbVersion, setDbVersion) remain the same
// const migrations = {
//     1: [
//         `CREATE TABLE IF NOT EXISTS items_table (
//       id TEXT PRIMARY KEY,
//       name TEXT,
//       description TEXT,
//       unit TEXT,
//       price_unit INTEGER,
//       quantity_stock REAL
//     );
//     INSERT INTO items_table (id, name, description, unit, price_unit, quantity_stock) VALUES (
//         "ITEM_ID", "Item Name", "Item Description", "Unit", 10, 5.0
//       );
//     `,
//         `CREATE TABLE IF NOT EXISTS bills_table (
//       bid TEXT PRIMARY KEY,
//       c_name TEXT,
//       c_phone TEXT,
//       date TEXT,
//       b_total INTEGER,
//       debt INTEGER,
//       paid INTEGER,
//       discount INTEGER
//     );`,
//         `CREATE TABLE IF NOT EXISTS bill_items_table (
//       ibid TEXT PRIMARY KEY,
//       id TEXT,
//       name TEXT,
//       bid TEXT,
//       req_qty INTEGER,
//       total INTEGER,
//       FOREIGN KEY(bid) REFERENCES bills_table(bid) ON DELETE CASCADE,
//       FOREIGN KEY(id) REFERENCES items_table(id) ON DELETE CASCADE
//     );`,
//         `CREATE TABLE IF NOT EXISTS records_table (
//       date TEXT PRIMARY KEY,
//       bid TEXT,
//       added_items TEXT,
//       restored_items TEXT,
//       FOREIGN KEY(bid) REFERENCES bills_table(bid) ON DELETE CASCADE
//     );`
//     ],
// };

// async function migrateDb(db, currentVersion) {
//     for (const version in migrations) {
//         if (version > currentVersion) {
//             for (const migration of migrations[version]) {
//                 try {
//                     await db.execute(migration);
//                 } catch (error) {
//                     console.error('Error executing migration:', error);
//                     throw error; // Re-throw to halt migration process
//                 }
//             }
//             // Update version in database after successful migrations
//             await setDbVersion(db, version);
//         }
//     }
// }

// async function getDbVersion(db) {
//     try {
//         const result = await db.select('PRAGMA user_version');
//         const version = result[0]?.user_version;
//         console.log('Database version:', version);
//         return version;
//     } catch (error) {
//         console.error('Error getting database version:', error);
//         throw error; // Re-throw for proper handling
//     }
// }

// async function setDbVersion(db, version) {
//     try {
//         await db.execute(`PRAGMA user_version = ${version}`);
//     } catch (error) {
//         console.error('Error setting database version:', error);
//         throw error; // Re-throw for proper handling
//     }
// }

//export { db, migrateDb, getDbVersion, setDbVersion };