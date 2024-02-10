import { useEffect, useState } from "react";
import { useDb } from "../../stockContext";

export default function Stock() {
  const testItem = {
    id: 'test4-id',
    name: 'Test Item',
    description: 'This is a test item.',
    unit: 'pcs',
    priceUnit: 10,
    quantityStock: 5,
  };



  const { db, items, bills, isLoading } = useDb();
  useEffect(() => console.log(typeof items, items), []);
  //add to db
  async function addItem(item) {
    try {
      // Check if an item with the same ID already exists
      const existingItem = await db.select(`
        SELECT id FROM items_table WHERE id = ?;
      `, [item.id]);

      if (existingItem.length > 0) {
        console.log(`Item with ID ${item.id} already exists. Skipping insertion.`);
        return; // Exit early if item exists
      }

      // Insert the new item into items_table
      await db.execute(`
        INSERT INTO items_table (id, name, description, unit, price_unit, quantity_stock)
        VALUES (?, ?, ?, ?, ?, ?);
      `, [item.id, item.name, item.description, item.unit, item.price_unit, item.quantity_stock]);

      console.log('Item added successfully!');
    } catch (error) {
      console.error('Error adding item:', error);
    }
  }



  //modify rcord
  async function updateItem(itemId, newPrice) {
    try {
      await db.execute(`
      UPDATE items_table
      SET price_unit = ?
      WHERE id = ?;
    `, [newPrice, itemId]);
      console.log('Item price updated successfully!');
    } catch (error) {
      console.error('Error updating item price:', error);
    }
  }

  //delete record
  async function deleteItem(itemId) {
    try {
      await db.execute(`
      DELETE FROM items_table
      WHERE id = ?;
    `, [itemId]);
      console.log('Item deleted successfully!');
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  }


  const [stockData, setStockData] = useState([]);
  let inc = 0;
  useEffect(() => { setStockData(items) }, [items])
  //trigger changes
  useEffect(() => console.log(stockData), [stockData]);

  //test

  useEffect(() => {
    [...items].length >= 5 ? items.map((x) => { deleteItem(x.id) })
      : addItem(testItem)
  }, []);
  if (isLoading) {
    return <p>Loading data...</p>;
  }

  return (
    <div className="route-content stock">
      <h2>Items........................................-------------------------------------</h2>

      <ul>
        {stockData && stockData.length && stockData.map((item) => (
          <li key={item.id}>{item.id}------------------------------------------------------------------------{item.name}</li>
        ))}
      </ul>
      <h2>Bills......................................................</h2>
      <ul>
        {bills.map((bill) => (
          <li key={bill.bid}>---------------------------------{bill.c_name}</li>
        ))}
      </ul>
    </div>
  );
}
