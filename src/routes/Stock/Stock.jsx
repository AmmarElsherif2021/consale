/*async function dropTables() {
  await db.execute("DROP TABLE IF EXISTS items_table");
  await db.execute("DROP TABLE IF EXISTS bills_table");
  await db.execute("DROP TABLE IF EXISTS bill_items_table");
  await db.execute("DROP TABLE IF EXISTS records_table");
}*/

//useEffect(() => { addRecord('B000', 'xxx', 'bbb', 'kg', 80, 80) }, [])
//stock data ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
import { useState, useEffect, useMemo } from 'react';
import { CSVLink } from 'react-csv';
import FilterComponent from '../../layout/FilterComponent/FilterComponent';
import './Stock.css';
import ItemPop from '../../layout/popups/ItemPop/ItemPop';
import DelItemPop from '../../layout/popups/DelItemPop/DelItemPop';
import AddItemPop from '../../layout/popups/AddItemPop/AddItemPop';
import addPlus from '../../assets/add-plus.svg'
import delIcon from '../../assets/del.svg';
import editIcon from '../../assets/edit.svg';
import { StockProvider, useDb } from '../../stockContext';

// sqlite. The path is relative to `tauri::api::path::BaseDirectory::App`.

//searchbar and teble imports
import DataTable from 'react-data-table-component';


// Function to confirm deletion with the user
const confirmDelete = () => {
  if (window.confirm("Are you sure you want to flush all database tables and records? This action cannot be undone.")) {
    return true;
  }
  return false;
};

// Function to flush the database tables and records
async function flushDatabase() {
  if (!confirmDelete()) {
    return; // Early return if user cancels confirmation
  }

  try {
    // Load the database
    const db = await Database.load("sqlite:your_database.db"); // Replace with your database path

    // Get all table names
    const tables = await db.all("SELECT name FROM sqlite_master WHERE type = 'table'");

    // Execute DELETE statements for each table
    await Promise.all(
      tables.map(async (table) => {
        await db.execute(`DELETE FROM ${table.name}`);
      })
    );

    console.log("Database flushed successfully!");
  } catch (error) {
    console.error("Error flushing database:", error);
    // Handle errors gracefully, e.g., display an error message to the user
  }
}

// Use the flushDatabase function responsibly
const FlushButton = () => {
  const [isFlushing, setIsFlushing] = useState(false);

  const handleFlush = async () => {
    setIsFlushing(true); // Indicate flushing in progress
    await flushDatabase();
    setIsFlushing(false); // Indicate flushing completion
  };

  return (
    <button onClick={handleFlush} disabled={isFlushing}>
      {isFlushing ? "Flushing..." : "Flush Database"}
    </button>
  );
};





//search bar

//export csv component

const Export = ({ onExport }) => (
  <CSVLink data={onExport()} filename={'stockData.csv'} className='export-link'>
    <small>انسخ بيانات المخزن</small>
  </CSVLink>
);
//db-----------------------------------------------------


//await db.execute("DROP TABLE IF EXISTS items_table");

// Select all items





const Stock = () => {
  const db = useDb();
  //table columns

  const columns = [
    {
      name: 'ID',
      selector: 'id',
      width: '70px',
    },
    {
      name: 'اسم الصنف',
      selector: 'name',
      width: '130px',
    },
    {
      name: 'وصف',
      selector: 'description',
      width: '130px',
    },
    {
      name: 'وحدة القياس',
      selector: 'unit',
      width: '130px',
    },
    {
      name: 'سعر الوحدة',
      selector: 'price_unit',
      width: '130px',
    },
    {
      name: 'الكمية المتاحة',
      selector: 'quantity_stock',
      width: '130px',
    },

    {
      name: ' ',
      selector: 'actions',
      width: '228px',
      cell: (row) => (
        <div>
          <button variant="contained" className='table-btn edit' color="primary" onClick={(e) => handleOpenEdit(e, row.id)}>
            <img src={editIcon} style={{ width: "15px" }} />
          </button>
          <button variant="contained" className='table-btn delete' color="secondary" onClick={(e) => handleItemDel(e, row.id)}>
            <img src={delIcon} style={{ width: "15px" }} />
          </button>
        </div>
      ),
    },
  ];

  const [stockData, setStockData] = useState([]);
  const fetchData = async () => {
    if (db) {
      try {
        const result = await db.select("SELECT * FROM items_table"); // Use db.all for fetching all rows
        setStockData(result); // Update state directly with result
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  //Edit an item popup ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
  const [itemPop, setItemPop] = useState({});


  const handleOpenEdit = (e, iid) => {
    e.preventDefault();
    const items = stockData.filter((x) => x.id == iid)
    setItemPop({ ...items[0] })
  };



  useEffect(() => {
    fetchData();
  }, [itemPop]);

  useEffect(() => console.log(`ItemPop ----->${itemPop}`), [itemPop]);




  // cancel item pop:
  const cancelItemPop = () => {
    setItemPop({})
    console.log(`ItemPop ----->${{ ...itemPop }}`)
  };



  //Edit Item:
  const handleItemEdit = (iid, qty, p) => {
    itemPop.id && itemPop.id == iid && setStockData((prev) => prev.map((x) => x.id === iid ? { ...x, quantity_stock: qty, price_unit: p } : { ...x }));
    cancelItemPop();
  }



  //Delete Item |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
  const [delItemPop, setDelItemPop] = useState({});
  const handleItemDel = (e, iid) => {
    e.preventDefault();

    const items = stockData.filter((x) => x.id == iid)
    setDelItemPop({ ...items[0] })
  };
  // delete item pop:
  const cancelDelItemPop = () => {
    setDelItemPop({})
    console.log(`ItemPop ----->${{ ...delItemPop }}`)
  };
  //Delete record:
  async function deleteRecord(id) {
    await db.execute("DELETE FROM items_table WHERE id = ?l", [id]);
  }
  const confirmDelItem = (e, iid) => {
    e.preventDefault();
    deleteRecord(iid);
    const newStock = stockData.filter((x) => x.id != iid);
    setStockData([...newStock]);
    fetchData();
    setDelItemPop({});
  }
  useEffect(() => { fetchData() }, [delItemPop])
  useEffect(() => console.log([...stockData]), [stockData])


  // Add item pop:|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
  const [addedItemPop, setAddedItemPop] = useState({});

  const cancelAddItemPop = () => {
    setAddedItemPop({})
    console.log(`AddedItemPop ----->${{ ...addedItemPop }}`)
  };


  //generate Id
  function generateRandomId() {
    return Math.random().toString(36).substring(2, 15);
  }



  const handleAddItemClick = (e) => {
    e.preventDefault();
    const newId = generateRandomId();
    setAddedItemPop({
      id: newId.toString(),

      name: '',
      image: '',
      description: '',
      quantity_stock: 0,
      price_unit: 0,
      unit: '',

    })
  }

  //confirm add submit............................................................................................
  const handleAddSubmit = (newAdded) => {
    // Destructure the id out of newAdded
    const { id, ...restOfNewAdded } = newAdded;
    // Update addedItemPop state
    setAddedItemPop(prev => ({
      id: prev.id,
      ...restOfNewAdded
    }));

    // Add new item to stockData
    fetchData();

    // Reset addedItemPop state
    setAddedItemPop({});

  };

  //add new record:
  async function addRecord(id, name, description, unit, price_unit, quantity_stock) {
    // Check if the item already exists in the table
    let itemExists;
    try {
      itemExists = await db.select('SELECT * FROM items_table WHERE name = ? AND description = ? AND unit = ? AND price_unit = ? AND quantity_stock = ?', [name, description, unit, price_unit, quantity_stock]);
    } catch (error) {
      console.log(error)
      itemExists = []
    }
    // If the item doesn't exist, insert it
    if (itemExists.length === 1) {
      await db.execute("INSERT INTO items_table VALUES (?, ?, ?, ?, ?, ?)", [id, name, description, unit, price_unit, quantity_stock]);
    }
    fetchData();
  }

  useEffect(() => {
    fetchData();
  }, [addedItemPop]);




  //Search |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
  const [filterText, setFilterText] = useState('');
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const filteredItems = stockData.filter(
    item => item.name && item.name.toLowerCase().includes(filterText.toLowerCase()),
  );

  const subHeaderComponentMemo = useMemo(() => {
    const handleClear = () => {
      if (filterText) {
        setResetPaginationToggle(!resetPaginationToggle);
        setFilterText('');
      }
    };

    return (
      <div className='filter'><FilterComponent onFilter={e => setFilterText(e.target.value)} onClear={handleClear} filterText={filterText} /></div>
    );
  }, [filterText, resetPaginationToggle]);


  const customStyles = {
    headCells: {
      style: {
        fontWeight: '800',
        borderBottom: 'dotted'
      },
    },
  };


  const handleExport = () => {
    const csvData = stockData.map(({ id, ...rest }) => rest);
    return csvData;
  };


  const actionsMemo = useMemo(() => <Export onExport={handleExport} />, []);
  //table grid|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||

  useEffect(() => {
    (async () => {
      if (db) {
        const result = await db.execute("SELECT name, sql FROM sqlite_master WHERE type='table'");
        // Log the result
        console.log(`|||||||||||||||||||||||||||||||||||||||--------------------------------|||||||||||||||||||||||||||||||||||||||`);
        if (result && result.rows) {
          console.log(result.rows.map((x) => JSON.stringify(x)));
        } else {
          console.log('result or result.rows is undefined');
        }
      }
    })();
  }, [db]);

  //||||||||||||||||||||||||||||||||||||||||||||##||||||||||||||||||||||||||||||||||||||||||||||
  //||||||||||||||||||||||||||||||||||||||||||||##||||||||||||||||||||||||||||||||||||||||||||||
  //||||||||||||||||||||||||||||||||||||||||||||##||||||||||||||||||||||||||||||||||||||||||||||
  //||||||||||||||||||||||||||||||||||||||||||||##||||||||||||||||||||||||||||||||||||||||||||||
  //||||||||||||||||||||||||||||||||||||||||#|||##||||#||||||||||||||||||||||||||||||||||||||||||
  //||||||||||||||||||||||||||||||||||||||||##||##||##||||||||||||||||||||||||||||||||||||||||||
  //||||||||||||||||||||||||||||||||||||||||||#|##|#||||||||||||||||||||||||||||||||||||||||||||
  //||||||||||||||||||||||||||||||||||||||||||||##||||||||||||||||||||||||||||||||||||||||||||||

  return (


    <div className="route-content stock">
      <FlushButton />
      {itemPop && itemPop.id ?
        <ItemPop cancelItemPop={cancelItemPop} id={itemPop.id}
          img={itemPop.image} name={itemPop.name} discription={itemPop.discription} unit={itemPop.unit}
          priceUnit={itemPop.price_unit} qtyStock={itemPop.quantity_stock} handleItemEdit={handleItemEdit} />
        :
        <div></div>
      }


      {
        delItemPop && delItemPop.id ? <DelItemPop confirmDelItem={confirmDelItem}
          cancelDelItemPop={cancelDelItemPop} name={delItemPop.name} id={delItemPop.id} /> : <div></div>
      }


      {
        addedItemPop && addedItemPop.id ?
          <AddItemPop
            addRecord={addRecord}
            handleAddSubmit={handleAddSubmit}
            cancelAddItemPop={cancelAddItemPop}
            generateRandomId={generateRandomId}
          /> : <div></div>
      }
      <h1>إدارة المخزن</h1>

      <div className='add-stock'>
        <h3>اضف صنف جديد</h3>
        <div><button className='add-item-btn' onClick={(e) => handleAddItemClick(e)}><img className='add-img' src={addPlus} /></button></div>
      </div>
      <div className='data-table'>
        <DataTable
          keyField='id'
          columns={columns}
          data={filteredItems}
          className='data-table table'
          pagination
          paginationResetDefaultPage={resetPaginationToggle} // optionally, a hook to reset pagination to page 1
          subHeader
          customStyles={customStyles}
          subHeaderComponent={subHeaderComponentMemo}
          selectableRows
          persistTableHead
          fixedHeader
          actions={actionsMemo}
        />

      </div>

    </div>





  )
}
export default Stock;