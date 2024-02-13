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

const getDate = () => {
  const today = new Date();
  const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
  const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  const dateTime = date + ' ' + time;
  return dateTime;
}

const AddBill = () => {
  const { db, items, billsRecords, isLoading, setIsLoading, billsItems, setBillsItems } = useDb();


  if (isLoading) {
    return <div>Loading...</div>;
  }
  function handleDeleteItem(itemId) {
    // Use db.execute to delete the item from the database
    db.execute('DELETE FROM bill_items_table WHERE id = ?', [itemId])
      .then(() => {
        // Update the items state
        setBillsItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
      })
      .catch((error) => {
        console.error('Error deleting item:', error);

      });
  }


  return (

    <div className="route-content add-bill" >
      <div>
        <h2>bills items</h2>
        <table>
          <thead>
            <tr>
              <th>Ibid</th>
              <th>id</th>
              <th>name</th>
              <th>bid</th>
              <th>reqQty</th>
              <th>total</th>
            </tr>
          </thead>
          <tbody>
            {billsItems.map((item) => (
              <tr key={item.id}>
                <td>{item.ibid}</td>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.bid}</td>
                <td>{item.req_qty}</td>
                <td>{item.total}</td>
                <td>
                  <button onClick={() => handleDeleteItem(item.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>

    </div>
  )

};
export default AddBill


/*
<div>
        <h2>Items</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Quantity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.description}</td>
                <td>{item.quantity_stock}</td>
                <td>
                  <button onClick={() => handleDeleteItem(item.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
 
      </div>
 
*/