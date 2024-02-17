import { v4 as uuidv4 } from 'uuid';
import stock from './data/stock.json';
import billsData from './data/oldBills.json'
import './AddBill.css';
import Autocomplete from '@material-ui/lab/Autocomplete';
import cancelIcon from '../../assets/cancel.svg';
import sortIcon from '../../assets/sort.svg';
import refresh from '../../assets/refresh.svg';
import delIcon from '../../assets/del.svg';
//import { useBill, BillContext, BillProvider } from '../../billContext';
import { useEffect, useState, useMemo } from 'react';
import ItemToBill from '../../layout/popups/ItemToBill/ItemToBill';
import BillCard from '../../layout/cards/BillCard/BillCard';
import BillPop from '../../layout/popups/BillPop/BillPop';
import saveBill from '../../assets/saveBill.svg';
import PrintPop from '../../layout/popups/printPop/PrintPop';
import Database from "tauri-plugin-sql-api";
// using the Tauri API npm package:
import { invoke } from '@tauri-apps/api/tauri'


import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ControllableStates from './ControllableStates'
import DataTable from 'react-data-table-component';
import FilterComponent from '../../layout/FilterComponent/FilterComponent';
import SaveBillPop from '../../layout/popups/SaveBillPop/SaveBillPop';
import { useDb } from '../../stockContext';
import CountRestoredPop from '../../layout/popups/CountRestoredPop/CountRestoredPop';
import AddItemPop from '../../layout/popups/AddItemPop/AddItemPop';

const getDate = () => {
  const today = new Date();
  const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
  const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  const dateTime = date + ' ' + time;
  return dateTime;
}

const AddBill = () => {
  const { db, items, billsRecords, setBillsRecords, isLoading, setIsLoading, billsItems, setBillsItems } = useDb();


  // Create new actual bill

  const [newBill, setNewBill] = useState({

  });
  useEffect(() =>
    setNewBill({
      bid: `b-${Math.random().toString(36).substring(2, 7).slice(0, 5)}`,
      c_name: "",
      c_phone: "",
      b_total: 0,
      discount: 0,
      items: [],
      paid: 0,
      debt: 0,
      date: getDate(),
      records: [

      ],
    })
    , [])



  //Left section >> Create bill section ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
  //|||||||||||||||||||||||||||||||||||||||||||||---||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
  //||||||||||||||||||||||||||||||||||||||||||---|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
  //||||||||||||||||||||||||||||||||||||||||---|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
  //|||||||||||||||||||||||||||||||||||||---------------------------------------------||||||||||||||||||||||||||
  //||||||||||||||||||||||||||||||||||||||||---|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
  //||||||||||||||||||||||||||||||||||||||||||---|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
  //|||||||||||||||||||||||||||||||||||||||||||||---||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
  //||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
  //stock state
  const [stockData, setStockData] = useState([]);
  const fetchData = async () => {
    const newStock = await db.select('SELECT * FROM items_table');
    setStockData([...newStock])
  };






  //restore item from bill:
  const [restored, setRestored] = useState([]);


  useEffect(() => console.log(`item  restored------------------------------------------------------`), [restored]);


  const [countRestoredPop, setCountRestoredPop] = useState({})
  const handleOldItem = (x, bid, num) => {
    newBill && newBill.bid == bid && newBill.items.map((y) => {
      y.ibid == x.ibid && setCountRestoredPop({

        bid: newBill.bid, id: y.id, ibid: y.ibid, name: y.name, req_qty: y.req_qty, unit: y.unit, price_unit: y.price_unit
      })
    })
  };


  const confirmCountRestored = async (id, ibid, restQty, bid) => {
    const items = await db.select(`SELECT * FROM items_table WHERE id=?;`, [id]);
    const newQty = Number(items[0].quantity_stock) + Number(restQty);
    const itemFromTable = await db.select(`SELECT * FROM bill_items_table WHERE ibid=?;`, [ibid]);
    const newReq = Number(itemFromTable[0].req_qty) - Number(restQty);
    const newTotal = newReq * itemFromTable[0].price_unit;
    const newDebt = restQty * itemFromTable[0].price_unit;
    const restoredText = JSON.stringify(restored)

    if (restQty != 0) {
      try {
        await db.execute(`
              UPDATE items_table
              SET 
              quantity_stock=?
              WHERE id = ?;
              
              UPDATE bill_items_table
              SET 
              req_qty =?,
              total=?
              WHERE ibid = ?;

              UPDATE bills_table
              SET 
              debt = ?
              WHERE bid = ?;

              UPDATE records_table
              SET 
              restored_items = ?
              WHERE bid = ?;
          `, [newQty, id, newReq, newTotal, ibid, newDebt, bid, restoredText, bid]);
        setCountRestoredPop({});
        newBill && newBill.bid && fetchBillData(newBill.bid);
      } catch (error) {
        console.log(error);
      }
    }


  }
  const confirmRestoredPop = async (id, ibid, restQty) => {
    const items = await db.select(`SELECT * FROM items_table WHERE id=?;`, [id]);
    const itemFromTable = await db.select(`SELECT * FROM bill_items_table WHERE ibid=?;`, [ibid]);
    const newReq = Number(itemFromTable[0].req_qty) - Number(restQty);

    const newTotal = newReq * itemFromTable[0].price_unit;

    const restoredText = JSON.stringify(restored)
    setRestored((prev) => [...prev,
    {
      name: items[0].name,
      qty: restQty,
      price_unit: items[0].price_unit,
      //total: newDebt
    }
    ]);
    setNewBill((prev) => ({
      ...prev,
      items: newReq == 0 ? newBill.items.filter((x) => x.ibid != ibid) : [...newBill.items.filter((x) => x.ibid != ibid), { id: id, ibid: ibid, name: itemFromTable[0].name, price_unit: itemFromTable[0].price_unit, req_qty: itemFromTable[0].req_qty, total: newTotal, unit: itemFromTable[0].unit }]
    }))
    console.log(`RESTORED: ${JSON.stringify(restored)}`);
    setCountRestoredPop({})
  }
  const deleteOldItem = (x, id, num) => {
    newBill && newBill.bid == id && setNewBill((prev) => ({
      ...prev,
      items: [...prev.items.filter((y) => y.ibid != x.ibid)]

    }));
    newBill && newBill.items && setRestored((prev) => ([...prev, x]));

  }
  // del newItem
  const deleteNewItem = (x) => {
    setAddedItems((prev) => prev.filter((y) => y.ibid != x.ibid))
  }

  //state of new added item object
  const [newAdded, setNewAdded] = useState({});
  //assure newAdded 

  //added items list to bill
  const [addedItems, setAddedItems] = useState([]);
  // assure addedItems on 1st render
  useEffect(() => console.log('added items list ready to be filled||||||||||||||||||||||||||||||||')
    , [addedItems])

  //add new item to bill  
  const handleNewItemPop = (e, id) => {
    e.preventDefault();
    const newItem = stockData.filter((x) => x.id == id)[0];
    const prevReq = addedItems.filter((x) => x.id == id)[0] ? addedItems.filter((x) => x.id == id)[0] : {};

    setNewAdded({
      ...newItem,
      ibid: uuidv4(),
      req_qty: 0,
      total: newItem.req_qty * newItem.price_unit,

    });


    console.log(`new added =============================>${JSON.stringify(newItem)}`);
  };
  const handleReqQty = (reqQty) => {
    setNewAdded((prev) => ({ ...prev, req_qty: reqQty, total: reqQty * Number(newAdded.price_unit) }))
  };



  const cancelItemToBill = () => {
    setNewAdded({})
  }

  //add selected newAdded item to bill
  const handleItemsListPush = (e, id) => {
    e.preventDefault();

    if (newAdded && newAdded.id === id) {
      setAddedItems((prev) => [...prev.filter(x => x.id !== id), newAdded]); // Add newAdded regardless of addedItems' length

    } else {
      console.log(`did not add ${JSON.stringify(newAdded)} to bill items list`);
    }

    setNewAdded({});
  };

  useEffect(() => addedItems && console.log(`added items to bill `)
    , [addedItems])

  //Right section >> Navigate old bills ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
  //||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||---||||||||||||||||||||||||||||||
  //|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||---||||||||||||||||||||||||||
  //||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||---||||||||||||||||||||||||
  //|||||||||||||||||||||||||||||||||||||-----------------------------------------------|||||||||||||||||||
  //||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||---||||||||||||||||||||||||
  //|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||---||||||||||||||||||||||||||
  //||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||---||||||||||||||||||||||||||||||
  //||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
  //let billsData=[...billsDataArr];
  const [bills, setBills] = useState([]);
  async function fetchBillsData() {
    // Use db.execute to delete the bill from the database
    try {
      let newBills = await db.select('SELECT * FROM bills_table');
      // Update the bills state
      setBillsRecords(newBills);
      setBills(newBills);
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  }
  async function fetchBillData(bid) {
    // Use db.execute to delete the bill from the database
    try {
      const newBill = await db.select('SELECT * FROM bills_table WHERE bid=?', [bid]);
      const newItems = await db.select('SELECT * FROM bill_items_table WHERE bid=?', [bid]);
      const records = await db.select('SELECT * FROM records_table WHERE bid=?', [bid]);
      // Update the bills state
      const sameBill = bills.filter((x) => x.bid == bid)[0]
      setNewBill({
        ...sameBill,
        items: newItems,
        records: records
      })
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  }



  //handle click on card:
  const [oldBillPop, setOldBillPop] = useState({});


  const handleCardClick = async (e, id) => {
    e.preventDefault();
    const clicked = bills && bills.length ? bills.filter((x) => x.bid == id)[0] : {};
    const items = await fetchBillItemsData(id);
    setOldBillPop({
      ...clicked,
      b_total: items && items.length ? clicked.b_total : 0,
      items: items && items.length ? [...items] : []
    });
  };



  const cancelBillPop = () => {
    setOldBillPop({})
  };

  // add items of old bill
  const fetchBillItemsData = async (bid) => {
    try {
      const newItems = await db.select('SELECT * FROM bill_items_table WHERE bid=?', [bid]);
      return newItems;
    } catch (error) {
      console.error(`!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!did not get items from db` + error);
      return [];
    }
  }

  const openBill = async () => {
    const oldItems = await fetchBillItemsData(oldBillPop.bid);

    setNewBill(() => ({
      ...oldBillPop,
      records: oldBillPop.records && oldBillPop.records.length ? [...oldBillPop.records] : [],
      items: [...oldItems]
    }));

    setOldBillPop({});
    setRestored([]);
  }



  //filter old bills memo:
  //Search |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
  const [filterText, setFilterText] = useState('');
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

  const filteredItems = bills.filter(
    item => item.c_name && item.c_name.toLowerCase().includes(filterText.toLowerCase()),
  );
  const handleClear = () => {
    if (filterText) {
      setResetPaginationToggle(!resetPaginationToggle);
      setFilterText('');
    }
  };

  //arrange bills based on debt |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
  const [arranged, setArranged] = useState(false);


  const handleArrange = (e) => {
    e.preventDefault();
    const sortedArr = bills.sort((p1, p2) => p1.debt < p2.debt ? 1 : p1.debt > p2.debt ? -1 : 0);
    setArranged((prev) => !prev);
    arranged ? setBills([...sortedArr]) : setBills([...bills]);
  }





  /*|||||||||||||||||||||||||||||||||||||||||||||||||||....||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
  |||||||||||||||||||||||||||||||||||||||||||||||||||||....||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
  |||||||||||||||||||||||||||||||||||||||||||||||||||||....||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
  |||||||||||||||||||||||||||||||||||||||||||||||||||||....||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
  |||||||||||||||||||||||||||||||||||||||||||.......................|||||||||||||||||||||||||||||||||||||||||||||||||
  |||||||||||||||||||||||||||||||||||||||||||.......................|||||||||||||||||||||||||||||||||||||||||||||||||
  |||||||||||||||||||||||||||||||||||||||||||||||||||||....||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
  |||||||||||||||||||||||||||||||||||||||||||||||||||||....||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
  |||||||||||||||||||||||||||||||||||||||||||||||||||||....||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
  |||||||||||||||||||||||||||||||||||||||||||||||||||||....||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
  */
  const [confirmSave, setConfirmSave] = useState(false);
  const [printableBill, setPrintableBill] = useState({ ...newBill });
  const fetchHistoryBillData = async (bid) => {
    try {
      const result = await db.select("SELECT * FROM records_table WHERE bid=?", [bid]);
      setPrintableBill(result);
    } catch (error) {
      console.error('Error fetching History data:', error);
    }
  };

  const confirmSaveBill = (bid, bTotal, p, d) => {
    let totalPaid = Number(Number(p) + Number(newBill.paid));
    setPrintableBill(() => ({
      bid: bid,
      c_name: newBill.c_name == "" ? "anon" : newBill.c_name,
      c_phone: newBill.c_phone,
      debt: d,
      paid: totalPaid,
      b_total: bTotal,
      discount: 0,
      date: newBill.date,
      items: [...newBill.items, ...addedItems],
      records:
        newBill && newBill.records && newBill.records.length
          ? [
            ...newBill.records,
            {
              date: getDate(),
              debt: d,
              paid: totalPaid,
              b_total: bTotal,
              added_items: addedItems.length && [...addedItems],
              restored_items: restored.length && [...restored]
            },
          ]
          : [
            {
              date: getDate(),
              paid: totalPaid,
              debt: d,
              b_total: bTotal,
              added_items: addedItems.length && JSON.stringify([...addedItems]).replace(/\\/g, ''),
              restored_items: restored.length && JSON.stringify([...restored]).replace(/\\/g, '')
            },
          ],
    }))
    console.log(`JSON PRINTABLE BILL |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||>>>> ${JSON.stringify(printableBill)}`);
    setConfirmSave(false);
    setPrintPop(true);
    console.log(`bills 1 ${bills.map((x) => x.bid)}`);

  };

  const cancelSaveBillPop = () => {
    setConfirmSave(false);
  };


  const handleAddBill = (e) => {
    setConfirmSave(true);

  };




  //Final stage of confirm pop that substracts the actual db data|||||||||||||||||||||||||||||||||||||||||;

  /*|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
    |||||||||||||||||||||||||||||||||||||||||||||||||||||.............|||||||||||||||||||||||||||||||||||||||||||||||||
    |||||||||||||||||||||||||||||||||||||||||||||||||||||..............||||||||||||||||||||||||||||||||||||||||||||||||
    |||||||||||||||||||||||||||||||||||||||||||||||||||||....|||||||...||||||||||||||||||||||||||||||||||||||||||||||||
    |||||||||||||||||||||||||||||||||||||||||||||||||||||....|||||||...||||||||||||||||||||||||||||||||||||||||||||||||
    |||||||||||||||||||||||||||||||||||||||||||||||||||||..............||||||||||||||||||||||||||||||||||||||||||||||||
    |||||||||||||||||||||||||||||||||||||||||||||||||||||.............|||||||||||||||||||||||||||||||||||||||||||||||||
    |||||||||||||||||||||||||||||||||||||||||||||||||||||....||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
    |||||||||||||||||||||||||||||||||||||||||||||||||||||....||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
    |||||||||||||||||||||||||||||||||||||||||||||||||||||....||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
    |||||||||||||||||||||||||||||||||||||||||||||||||||||....||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
    |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
    */
  const [printPop, setPrintPop] = useState(false);



  //add new bill to db:
  async function addBillRecord(bid, c_name, c_phone, date, b_total, debt, paid, discount = 0) {
    // Check if the item already exists in the table
    const billExists = await db.select('SELECT * FROM bills_table WHERE bid = ? AND c_name = ?', [bid, c_name]);

    // If the item doesn't exist, insert it
    if (billExists.length === 0) {
      await db.execute("INSERT INTO bills_table VALUES (?, ?, ?, ?, ?, ?,?,?)", [bid, c_name, c_phone, date, b_total, debt, paid, discount]);
    }
    else {
      await db.execute("UPDATE bills_table SET b_total = ?, debt = ?, paid = ? WHERE bid = ?", [b_total, debt, paid, bid]);
    }
  }



  //add items to bill in db:
  async function addItemBillRecord(ibid, id, name, bid, unit, price_unit, req_qty, total) {
    // Check if the item already exists in the table
    const ibidExists = await db.select('SELECT ibid FROM bill_items_table WHERE ibid = ?', [ibid]);
    if (ibidExists.length == 0) {
      await db.execute("INSERT INTO bill_items_table VALUES (?,?,?,?,?,?,?,?)", [ibid, id, name, bid, unit, price_unit, req_qty, total]);
    }
    const idExists = await db.select('SELECT * FROM items_table WHERE id = ?', [id]);
    if (idExists) {
      const newQtyStock = Number(idExists[0].quantity_stock) - req_qty
      await db.execute("UPDATE items_table SET quantity_stock=? WHERE id=?", [newQtyStock, id]);
    }
  };

  //add new bill to db:
  async function addBillHistoryRecord(bid, date, b_total, debt, paid, added, restored) {
    // Check if the item already exists in the table
    //const billExists = await db.select('SELECT * FROM bills_table WHERE bid = ? AND c_name = ?', [bid, c_name]);

    try { await db.execute("INSERT INTO records_table VALUES (?, ?, ?, ?, ?, ?,?)", [date, bid, added, restored, b_total, paid, debt]); }
    catch (error) {
      console.log('error adding history', error)
    }

  }

  //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> print
  const handlePrint = () => {
    printPop && printableBill.items && printableBill.items.length &&
      console.log(`Ready to print ${JSON.stringify(printableBill)}`);
    restored.map((x) => confirmCountRestored(x.id, x.ibid, x.qty, printableBill.bid))
    const { bid, c_name, c_phone, date, b_total, debt, paid, discount, records } = printableBill;
    addBillRecord(bid, c_name, c_phone, date, b_total, debt, paid, discount);
    addedItems.map((x) => {
      const { ibid, name, id, unit, price_unit, req_qty, total } = x;
      addItemBillRecord(ibid, id, name, bid, unit, price_unit, req_qty, total)
    });
    const lastRecord = records.length > 0 ? records[records.length - 1] : null;
    const restoredText = JSON.stringify(restored)
    // lastRecord && lastRecord.restored_items ? JSON.stringify(lastRecord.restored_items) : '';
    const addedText = JSON.stringify(addedItems)
    //lastRecord && lastRecord.added_items ? JSON.stringify(addedItems) : '';

    if (lastRecord) {
      addBillHistoryRecord(bid, lastRecord.date, lastRecord.b_total, lastRecord.debt, lastRecord.paid, addedText, restoredText);
      console.log(`Restored @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@`, restoredText)
    }

    setRestored([]);
    setAddedItems([]);

    setPrintPop(false);
  }



  const handleCancelPrint = () => {
    setBills((prev) => (
      [...prev.filter((x) => x.bid != printableBill.bid), printableBill]));
    setPrintPop(false);
  };



  // 01033619196 .. .. .. 



  //useEffect


  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => console.log('newBill changed'), [newBill]);

  useEffect(() => {
    fetchBillsData();
  }, [newBill, printPop]);
  /* useEffect(() => {
     fetchBillData(newBill.bid);
   }, [countRestoredPop]);*/

  useEffect(() => console.log(`stock retrieved ${[...stockData]}`), [stockData])
  useEffect(() => {
    setNewBill(() => ({
      bid: `b-${Math.random().toString(36).substring(2, 7).slice(0, 5)}`,
      c_name: "",
      c_phone: "",
      b_total: 0,
      discount: 0,
      items: [],
      paid: 0,
      debt: 0,
      date: getDate(),
      records: [

      ],
    })
    );
  }

    , [])

  useEffect(() => { console.log(`bills..> `) }, [bills]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const tableCheck = await db.select("SELECT name FROM sqlite_master WHERE type='table' AND name='bill_items_table';");
        if (tableCheck.length > 0) {
          const result = await db.select("SELECT * FROM bill_items_table WHERE bid = ?", [newBill.bid]);
          setNewBill((prev) => ({ ...prev, items: result && result.length ? [...result] : [] }))
        } else {
          console.log("bill_items_table does not exist.");
        }
      } catch (error) {
        console.error('Error fetching stock data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [oldBillPop]);

  useEffect(() => setAddedItems([]), [newBill]);
  useEffect(() => console.log('newAdded activated'), [newAdded, countRestoredPop]);
  useEffect(() => console.log('filtering'), [filterText]);
  useEffect(() => console.log('paginating'), [resetPaginationToggle]);
  useEffect(() => console.log('arranging?'), [arranged]);
  useEffect(() => console.log(arranged), [arranged, bills]);
  useEffect(() => setPrintableBill({ bid: newBill.bid, c_name: newBill.c_name, c_phone: newBill.c_phone }), []);
  useEffect(() => console.log(`bills updated..`), [bills]);
  useEffect(() => console.log(`update bill and bills`), [printableBill, bills]);
  useEffect(() => console.log(`confirm save ?${confirmSave}`), [confirmSave]);
  useEffect(() => console.log(JSON.stringify(newBill)), [confirmSave]);
  useEffect(() => console.log(`bills ${bills.map((x) => x.bid)}`), [bills]);
  useEffect(() => console.log('printpop triggered'), [printPop]);






  return (

    <div className="route-content add-bill" >
      {
        printPop ? (<div><PrintPop
          cName={printableBill.c_name}
          cPhone={printableBill.c_phone}
          bid={printableBill.bid}
          paid={printableBill.paid}
          debt={printableBill.debt}
          date={printableBill.date}
          handleCancelPrint={handleCancelPrint}
          handlePrint={handlePrint}
        /></div>) : (<div></div>)
      }

      {
        newAdded && newAdded.id ?
          <div>
            <ItemToBill
              name={newAdded.name}
              unit={newAdded.unit}
              priceUnit={newAdded.price_unit}
              stockQty={newAdded.quantity_stock}
              id={newAdded.id}
              total={newAdded.total}
              cancelItemToBill={cancelItemToBill}
              handleItemsListPush={handleItemsListPush}
              handleReqQty={handleReqQty}
            />
          </div>
          :
          <div></div>
      }
      {
        countRestoredPop && countRestoredPop.ibid ?
          <div>
            <CountRestoredPop
              name={countRestoredPop.name}
              ibid={countRestoredPop.ibid}
              id={countRestoredPop.id}
              bid={countRestoredPop.bid}
              unit={countRestoredPop.unit}
              priceUnit={countRestoredPop.price_unit}
              cancelCountRestoredPop={() => setCountRestoredPop({})}
              confirmRestoredPop={confirmRestoredPop}
              reqQty={countRestoredPop.req_qty} />
          </div>
          :
          <div></div>
      }


      {
        oldBillPop && oldBillPop.bid ?
          (<BillPop
            bid={oldBillPop.bid}
            cName={oldBillPop.c_name}
            cPhone={oldBillPop.c_phone}
            bTotal={oldBillPop.b_total}
            discount={oldBillPop.discount}
            items={oldBillPop.items}
            date={oldBillPop.date}
            time={oldBillPop.time}
            paid={oldBillPop.paid}
            debt={oldBillPop.debt}
            cancelBillPop={cancelBillPop}
            openBill={openBill}


          />)
          : (<div></div>)
      }
      {confirmSave ? (
        <div style={{ zIndex: 100000 }}>
          <SaveBillPop
            key={newBill.bid}
            bid={newBill.bid}
            cName={newBill.c_name}
            items={addedItems ? [...newBill.items, ...addedItems] : [...newBill.items]}
            confirmSaveBill={confirmSaveBill}
            cancelSaveBillPop={cancelSaveBillPop}
            bTotal={newBill.b_total}
            records={newBill.records}
            debt={newBill.debt}
            paid={newBill.paid}
          />
        </div>
      ) : (
        <div></div>
      )}

      <h1>فاتورة جديدة</h1>




      <div className='add-bill-sections'>

        <div className="new-bill-section left-pane" >


          <div className='bill-data-box' style={{ color: "white" }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="section-header">
                <ControllableStates options={stockData} handleNewItemPop={handleNewItemPop} />
                <button style={{ width: "60px", height: "60px", padding: "10px", margin: "5px", backgroundColor: "#428d82" }} onClick={() => {

                  setNewBill(() => ({
                    bid: `b-${Math.random().toString(36).substring(2, 7).slice(0, 5)}`,
                    c_name: "",
                    c_phone: "",
                    b_total: 0,
                    discount: 0,
                    items: [],
                    paid: 0,
                    debt: 0,
                    date: getDate(),
                    records: [

                    ],
                  })
                  );


                  ;

                }}>
                  <img src={refresh} style={{ width: "40px" }} />
                </button>
              </div>
              <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-evenly" }}>
                <div style={{ display: 'flex', flexDirection: 'row', }}>

                  {newBill && newBill.records && newBill.records.length > 1 ? <h4>{'Customer Name: '}{newBill.c_name}</h4>
                    :
                    <input
                      style={{ maxHeight: '30px', margin: '5px', maxWidth: '120px' }}
                      type='text'
                      onChange={(e) => setNewBill((prev) => ({ ...prev, c_name: e.target.value }))}
                      value={oldBillPop && oldBillPop.bid ? oldBillPop.c_name : newBill.c_name}
                      placeholder='أدخل اسم العميل'
                    />}
                </div>

                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <input
                    type='tel'
                    value={oldBillPop && oldBillPop.bid ? oldBillPop.phone : newBill.c_phone}
                    onChange={(e) => setNewBill((prev) => ({ ...prev, c_phone: e.target.value }))}
                    style={{ maxHeight: '30px', margin: '5px', maxWidth: '120px' }}
                    placeholder='01xxxxxxxxx'
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                  <h5 style={{ color: 'red', margin: '2px' }}>BID: {oldBillPop && oldBillPop.bid ? oldBillPop.bid : newBill.bid}</h5>
                </div>

                <button className='open-save-bill-btn' onClick={(e) => handleAddBill(e)}><img className='bill-save-add-plus' alt="حفظ" src={saveBill} /></button>
              </div>


            </div>

            {
              /*|||||||||||||||||||||||||||||||||||||||||||||||||||....||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
              |||||||||||||||||||||||||||||||||||||||||||||||||||||....||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
              |||||||||||||||||||||||||||||||||||||||||||||||||||||....||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
              |||||||||||||||||||||||||||||||||||||||||||||||||||||....||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
              |||||||||||||||||||||||||||||||||||||||||||.......................|||||||||||||||||||||||||||||||||||||||||||||||||
              |||||||||||||||||||||||||||||||||||||||||||.......................|||||||||||||||||||||||||||||||||||||||||||||||||
              |||||||||||||||||||||||||||||||||||||||||||||||||||||....||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
              |||||||||||||||||||||||||||||||||||||||||||||||||||||....||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
              |||||||||||||||||||||||||||||||||||||||||||||||||||||....||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
              |||||||||||||||||||||||||||||||||||||||||||||||||||||....||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
              */
            }

          </div>

          <div className='new-bill-space'>

            <div className='bill-items-table' >
              <table >
                <tr>
                  <th>الاسم</th>
                  <th>الكمبة المطلوبة</th>
                  <th>الوحدة</th>
                  <th>سعر الوحدة</th>
                  <th>اجمالي</th>
                </tr>
                {newBill.items && newBill.items.length ? newBill.items.map((x) => x.req_qty > 0 &&
                  <tr key={x.ibid}>
                    <td style={{ backgroundColor: "#5e9b88" }}>{x.name}</td>
                    <td>{x.req_qty}</td>
                    <td>{x.unit}</td>
                    <td>${x.price_unit}</td>
                    <td>${x.total}</td>
                    <td><button className='del-row' key={x.ibid} onClick={() => handleOldItem(x, newBill.bid, 7)}><img src={delIcon} style={{ width: "20px" }} /></button></td>
                  </tr>
                )
                  : (<tr></tr>)}
                {addedItems.length ? addedItems.map((x) =>
                (<tr key={x.ibid}>
                  <td>{x.name}</td>
                  <td>{x.req_qty}</td>
                  <td>{x.unit}</td>
                  <td>${x.price_unit}</td>
                  <td>${x.total}</td>
                  <td><button className='del-row' onClick={() => deleteNewItem(x)}><img src={delIcon} style={{ width: "20px" }} /></button></td>
                </tr>))
                  : (<tr></tr>)}


              </table>

            </div>





          </div>
          <div className='total-div' >
            <table>
              <tr>
                <th>اجمالي الفاتورة</th>
                <td className='total-cell'>
                  {
                    addedItems.length && newBill.items && newBill.items.length ? [...addedItems, ...newBill.items].reduce((acc, obj) => acc + obj.total, 0)
                      :
                      newBill.items && newBill.items.length ? newBill.items.reduce((acc, obj) => acc + obj.total, 0)
                        :
                        addedItems.length && addedItems.reduce((acc, obj) => acc + obj.total, 0)
                  }</td>
              </tr>
            </table>
          </div>

        </div>







        <div className="right-pane old-bills-section">
          <div className='right-section-header'>
            <div className='filter-bills'>
              <FilterComponent onFilter={e => setFilterText(e.target.value)} onClear={handleClear()} filterText={filterText} />
            </div>
            <button className='arrange' onClick={(e) => handleArrange(e)} ><img className='cancel-icon' src={sortIcon} /></button>
          </div>



          <div className='old-bills-space'>

            <div style={{ fontSize: 8 }} className="bills-roll">

              {
                bills && bills.length > 0 ?
                  bills.map(
                    (x) => x.bid &&
                      <div onClick={(e) => handleCardClick(e, x.bid)}>
                        <BillCard
                          bid={x.bid}
                          cName={x.c_name}
                          bTotal={x.b_total}
                          date={x.date}
                          paid={x.paid}
                          debt={x.debt}
                          records={x.records}
                        />
                      </div>)
                  :
                  <div></div>

              }

            </div>
          </div>
        </div>
      </div>
    </div>




  )

};
export default AddBill