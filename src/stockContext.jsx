import { createContext, useContext, useState, useEffect } from 'react';
import Database from "tauri-plugin-sql-api";

// Create a context
const DbContext = createContext();

const migrations = {
    1: [
        `CREATE TABLE IF NOT EXISTS items_table (
      id TEXT PRIMARY KEY, 
      name TEXT,
      description TEXT,
      unit TEXT,
      price_unit INTEGER,
      quantity_stock REAL
    );`,
        `CREATE TABLE IF NOT EXISTS bills_table (
      bid TEXT PRIMARY KEY,
      c_name TEXT,
      c_phone TEXT,
      date TEXT,
      b_total INTEGER,
      debt INTEGER,
      paid INTEGER,
      discount INTEGER
    );`,
        `CREATE TABLE IF NOT EXISTS bill_items_table (
      ibid TEXT PRIMARY KEY,
      id TEXT,
      name TEXT,
      bid TEXT,
      req_qty INTEGER,
      total INTEGER,
      FOREIGN KEY(bid) REFERENCES bills_table(bid) ON DELETE CASCADE, 
      FOREIGN KEY(id) REFERENCES items_table(id) ON DELETE CASCADE 
    );`,
        `CREATE TABLE IF NOT EXISTS records_table (
      date TEXT PRIMARY KEY,
      bid TEXT,
      added_items TEXT,
      restored_items TEXT,
      FOREIGN KEY(bid) REFERENCES bills_table(bid) ON DELETE CASCADE 
    );`
    ],
    2: [
        `CREATE TABLE IF NOT EXISTS items_table (
      id TEXT PRIMARY KEY, 
      name TEXT,
      description TEXT,
      unit TEXT,
      price_unit INTEGER,
      quantity_stock REAL
    );`,
        `CREATE TABLE IF NOT EXISTS bills_table (
      bid TEXT PRIMARY KEY,
      c_name TEXT,
      c_phone TEXT,
      date TEXT,
      b_total INTEGER,
      debt INTEGER,
      paid INTEGER,
      discount INTEGER
    );`,
        `CREATE TABLE IF NOT EXISTS bill_items_table (
      ibid TEXT PRIMARY KEY,
      id TEXT,
      name TEXT,
      bid TEXT,
      req_qty INTEGER,
      total INTEGER,
      FOREIGN KEY(bid) REFERENCES bills_table(bid) ON DELETE CASCADE, 
      FOREIGN KEY(id) REFERENCES items_table(id) ON DELETE CASCADE 
    );`,
        `CREATE TABLE IF NOT EXISTS records_table (
      date TEXT PRIMARY KEY,
      bid TEXT,
      added_items TEXT,
      restored_items TEXT,
      FOREIGN KEY(bid) REFERENCES bills_table(bid) ON DELETE CASCADE 
    );`
    ],
    // Add new versions here...
};

async function migrateDb(db, currentVersion) {
    for (const version in migrations) {
        if (version > currentVersion) {
            for (const migration of migrations[version]) {
                try {
                    await db.execute(migration);
                } catch (error) {
                    console.error('Error executing migration:', error);
                }
            }
            // Update version in database...
        }
    }
}
async function getDbVersion(db) {
    try {
        const result = await db.query('PRAGMA user_version');
        const version = result[0]?.user_version;
        console.log('Database version:', version);
        return version;
    } catch (error) {
        console.error('Error getting database version:', error);
    }
};
async function setDbVersion(db, version) {
    try {
        await db.execute(`PRAGMA user_version = ${version}`);
    } catch (error) {
        console.error('Error setting database version:', error);
    }
}
;


export function StockProvider({ children }) {

    const [db, setDb] = useState(null);


    useEffect(() => {
        async function loadAndMigrateDb() {
            try {
                // 1. Load the database first
                const db = await Database.load("sqlite:test.db");

                // 2. Get the current database version
                const currentVersion = await getDbVersion(db);
                await setDbVersion(currentVersion + 1)
                // 3. Perform migrations if needed
                await migrateDb(db, currentVersion + 1);

                // 4. Set the database state after successful loading and migration
                setDb(db);
            } catch (error) {
                console.error('Error loading or migrating database:', error);
                // Handle errors appropriately, e.g., display user feedback
            }
        }

        loadAndMigrateDb();
    }, []);


    return (
        <DbContext.Provider value={db}>
            {children}
        </DbContext.Provider>
    );
}

// Create a hook to use the context
export function useDb() {
    return useContext(DbContext);
}
