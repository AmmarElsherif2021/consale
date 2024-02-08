import { useEffect } from 'react';
import { useDb } from '../../stockContext';

export default function Stock() {
    const db = useDb();

    useEffect(() => {
        // You can now use the db object to interact with the database
        if (db) {
            // Example: Fetch data from the items_table
            db.select("SELECT * FROM items_table")
                .then(items => console.log("Items:", items))
                .catch(error => console.error("Error fetching items:", error));
        }
    }, [db]); // Only rerun the effect when the db value changes

    return (
        <h1>Stock</h1>
    );
}
