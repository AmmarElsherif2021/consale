import { createContext, useContext, useState, useEffect } from 'react';
import Database from "tauri-plugin-sql-api";

// Create a context
const DbContext = createContext();

// Create a provider component
export function DbProvider({ children }) {
    const [db, setDb] = useState(null);

    useEffect(() => {
        async function loadDb() {
            const db = await Database.load("sqlite:test.db");
            await db.execute("DROP TABLE IF EXISTS items_table");
            const tableExists = await db.select('SELECT name FROM sqlite_master WHERE type="table" AND name="bills_table"');
            if (tableExists.length === 0) {

                setDb(db);
            }

        }

        loadDb();
    }, []);

    return (
        <DbContext.Provider value={db}>
            {children}
        </DbContext.Provider>
    );
}

