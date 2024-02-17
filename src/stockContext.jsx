import { createContext, useState, useEffect, useContext } from 'react';
//import { db, migrateDb, getDbVersion, setDbVersion } from './db';
import Database from "tauri-plugin-sql-api";

const db = await Database.load("sqlite:test.db");

// ... Migration functions (migrateDb, getDbVersion, setDbVersion) remain the same
const migrations = {
    queries: [
        `CREATE TABLE IF NOT EXISTS items_table (
      id TEXT PRIMARY KEY, 
      name TEXT,
      description TEXT,
      unit TEXT,
      price_unit REAL,
      quantity_stock REAL
    );
  
    `,
        `CREATE TABLE IF NOT EXISTS bills_table (
      bid TEXT PRIMARY KEY,
      c_name TEXT,
      c_phone TEXT,
      date TEXT,
      b_total INTEGER,
      debt INTEGER,
      paid INTEGER,
      discount INTEGER
    );

    `,
        `CREATE TABLE IF NOT EXISTS bill_items_table (
      ibid TEXT PRIMARY KEY,
      id TEXT,
      name TEXT,
      bid TEXT,
      unit TEXT,
      price_unit REAL,
      req_qty REAL,
      total INTEGER,
      FOREIGN KEY(bid) REFERENCES bills_table(bid) ON DELETE CASCADE, 
      FOREIGN KEY(id) REFERENCES items_table(id) ON DELETE CASCADE 
    );
    
    `,


        `CREATE TABLE IF NOT EXISTS records_table (
      

      date TEXT PRIMARY KEY,
        bid TEXT,
        added_items TEXT,
        restored_items TEXT,
        b_total INTEGER,
        paid INTEGER,
        debt INTEGER,
        FOREIGN KEY(bid) REFERENCES bills_table(bid) ON DELETE CASCADE 
    );`,

    ],
    versions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
};

async function migrateDb(db) {
    const currentVersion = await getDbVersion(db) || 0; // Get current version or default to 0

    for (let i = currentVersion + 1; i <= migrations.versions.length; i++) {
        const version = migrations.versions[i - 1];
        for (const migration of migrations.queries) {
            try {
                await db.execute(migration);
            } catch (error) {
                console.error('Error executing migration:', error);
                throw error; // Re-throw for proper handling
            }
        }
        // Update version in database after each successful migration
        await setDbVersion(db, version);
    }
}
async function getDbVersion(db) {
    try {
        const result = await db.select('PRAGMA user_version');
        const version = result[0]?.user_version;
        console.log('Database version:', version);
        return version;
    } catch (error) {
        console.error('Error getting database version:', error);
        throw error; // Re-throw for proper handling
    }
}

async function setDbVersion(db, version) {
    try {
        await db.execute(`PRAGMA user_version = ${version + 1}`);
    } catch (error) {
        console.error('Error setting database version:', error);
        throw error; // Re-throw for proper handling
    }
}


const DbContext = createContext();

export function StockProvider({ children }) {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function loadAndMigrateDb() {
            try {
                await migrateDb(db);
            } catch (error) {
                setError(error);
            } finally {
                setIsLoading(false);
            }
        }

        loadAndMigrateDb();
    }, []);

    return (
        <DbContext.Provider value={{ db, isLoading, setIsLoading, error, setError }}>
            {children}
        </DbContext.Provider>
    );
}
// Create a hook to use the context
// useDb.js



export function useDb() {
    const { db, isLoading, setIsLoading, setError } = useContext(DbContext);
    //stock state
    const [items, setItems] = useState([]);
    //bills table state
    const [billsRecords, setBillsRecords] = useState([]);
    const [billsItems, setBillsItems] = useState([])
    //billsHistory... ??!!
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const [itemsResult, billsRecordsResult, billItemsResult] = await Promise.all([
                    db.select('SELECT * FROM items_table'),
                    db.select('SELECT * FROM bills_table'),
                    db.select('SELECT * FROM bill_items_table'),
                ]);
                setItems(itemsResult);
                setBillsRecords(billsRecordsResult);
                setBillsItems(billItemsResult)
                console.log(`bill items table length ${billItemsResult.length}`)
            } catch (error) {
                setError(error);
            } finally {
                setIsLoading(false);
            }
        };

        // Load data only when DB or loading state changes
        db && items.length == 0 && fetchData();
    }, [db, items, isLoading]); // Only trigger if db or isLoading changes
    console.log('types of db and items')
    console.log(typeof db);
    console.log(typeof items);
    return { db, items, billsRecords, setBillsRecords, isLoading, setItems, setIsLoading, billsItems, setBillsItems };
}
