
/* Dashboard is ought to be a control panel of creating accounts for workers and managing authorities of each account:
-For each account: last closed,operations by day :[each operation is tangeled to bills excuted records (BID)].
-Each Account Card:
        -Wid: Worker id
        -w_name: worker name
        -short:short per shift
        -lastClosed:last closed
        -theme:random color for decoration


-For further development:Sales cummulative chart.
   
*/
import './Dashboard.css';
import axios from 'axios'
import AccCard from "../../layout/cards/AccCard/AccCard";
import { invoke } from '@tauri-apps/api/tauri';
import addPlus from '../../assets/add-plus.svg';
import data from './data/accounts.json';
import AddPop from '../../layout/popups/AddPop/AddPop';
import AccPop from "../../layout/popups/AccPop/AccPop";

import { LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar, Legend } from 'recharts';

import { useEffect, useState } from "react";
import { useDb } from "../../stockContext";
import { useLang } from '../../langContext';

//####################################################################
const Dashboard = () => {

    //Receiver dir. 
    //const appDataDir = BaseDirectory.AppData;
    //accounts state carries accounts.json records

    const { lang } = useLang();
    const [accounts, setAccounts] = useState([]);
    useEffect(() => {
        setAccounts([...data])
    }, []);

    useEffect(() => {
        console.log(`-------- >  ${accounts} <-----------`)
    }, [accounts]);

    // Request add account popup:---------------------------------------
    const [addPop, setAddPop] = useState(false);
    useEffect(() => console.log('add account request started/terminated'), [addPop])
    //terminate add acc. request
    const cancelAddPop = () => {
        setAddPop(false);
    }
    //add account --------------------------------------------------------


    //Acc card popup ------------------------------------------------------
    const [accPop, setAccPop] = useState({});
    const handleCardClick = (e, id) => {
        e.preventDefault();
        const selected = accounts.filter((x) => x.wid == id)
        setAccPop(selected[0]);
        console.log(`accPop ----->${accPop}`)
    }
    useEffect(() => { console.log({ ...accPop }) }, [accPop])
    useEffect(() => { console.log({ ...accPop }) }, [accounts]);
    //cancel Acc card popup-------------------------------------------
    const cancelAccPop = () => {
        setAccPop({})
        console.log(`accPop ----->${accPop}`)
    };

    //Db
    const { db } = useDb();
    const [billsData, setBillsData] = useState([]);
    async function fetchBillsData() {

        try {
            let newBills = await db.select('SELECT * FROM bills_table')
            // Update the bills state
            setBillsData(newBills);
        } catch (error) {
            console.error('Error deleting bill:', error);
        }
    }
    //prepare cummulative chart for debt and paid
    useEffect(() => {
        fetchBillsData();

    }, []);

    // Calculate cumulative values for line chart
    let cumulativePaid = 0;
    let cumulativeDebt = 0;
    let cummulativeBtotal = 0;

    const lineChartData = billsData.map(bill => {
        cumulativePaid += bill.paid;
        cumulativeDebt += bill.debt;
        cummulativeBtotal += bill.b_total;
        return {
            date: bill.date,
            paid: cumulativePaid,
            debt: cumulativeDebt,
            total: cummulativeBtotal,
        };
    });
    //prepare high sold graph

    const [salesArr, setSalesArr] = useState([]);

    async function fetchSoldItems() {
        try {
            let items_sales = await db.select(`
        SELECT id,name, SUM(req_qty) AS total_exports, COUNT(*) AS item_sales
FROM bill_items_table
GROUP BY id`);
            setSalesArr(items_sales)
        }
        catch (error) { console.error(error) }
    };
    useEffect(() => {
        fetchSoldItems()
    }, [])
    //Delete databases

    //auth to delete:
    const [password, setPassword] = useState('')
    const changePass = (e) => {
        setPassword(e.target.value)
    }
    async function emptyTables(table) {
        try {
            // List of table names
            const tableNames = [
                'items_table',
                'bills_table',
                'bill_items_table',
                'records_table',
            ];
            await db.execute(`DELETE FROM ${table};`);
            console.log(`All records deleted from ${table}`);
            if (table === 'bill_items_table') {
                await db.execute(`DELETE FROM records_table;`);
            }
        } catch (error) {
            console.error(`Error: ${error}`);
        }
    }

    return (
        <div className="route-content dashboard">


            {addPop ? <AddPop cancelAddPop={cancelAddPop} /> : <div></div>}
            {accPop.wid ? <AccPop w_name={accPop.w_name} short={accPop.short} lastClosed={accPop.last_closed} cancelAccPop={cancelAccPop} /> : <div></div>}
            {
                /*
                 <div className="accounts" style={accPop && accPop.wid ? { filter: "blur(2px)" } : { filter: "none" }}>
                       <h1>الحسابات</h1>
                {Array.isArray(accounts) ? accounts.map((account) => (
                    <div key={account.wid}
                        onClick={
                            (e) => { handleCardClick(e, account.wid); }}>
                        <AccCard
                            key={account.wid}
                            wid={account.wid}
                            w_name={account.w_name}
                            short={account.short}
                            lastClosed={account.last_closed}
                            style={account.theme}
                        />

                    </div>



                )) : <div>No accounts found</div>}
                <div><button className='add-acc-btn' onClick={() => setAddPop(true)}><img className='add-img-1' src={addPlus} /></button></div>

            </div>
                */
            }


            <h1>{lang == 'ar' ? 'بيانات المدفوعات والمستحقات' : 'Payments and Billings Management'}  </h1>
            <div className="charts">
                <LineChart width={600} height={300} data={lineChartData}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="paid" stroke="#8884d8" name={lang == 'ar' ? 'مدفوعات' : 'Paid'} />
                    <Line type="monotone" dataKey="debt" stroke="#f56a00" name={lang == 'ar' ? 'مستحق' : 'Debt'} />
                    <Line type="monotone" dataKey="total" stroke="#28a745" name={lang == 'ar' ? 'اجمالي' : 'Total'} />
                    <Legend />
                </LineChart>
            </div>

            <h1>{lang == 'ar' ? 'بيانات المبيعات' : 'Sales Data'} </h1>
            <div className="charts">
                <BarChart width={600} height={300} data={salesArr}>
                    <XAxis dataKey="name" tickFormatter={name => (name.length > 15 ? `${name.slice(0, 15)}...` : name)} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="total_exports" fill="#ffc107" name={lang == 'ar' ? 'الصادر' : 'Exported'} />
                    <Bar dataKey="item_sales" fill="#4caf50" name={lang == 'ar' ? 'عدد مرات التصدير' : 'Number of exports'} />
                    <Legend />
                </BarChart>
            </div>
            <div className='delete-tables'>
                <h1>{lang == 'ar' ? 'حذف السجلات' : 'Delete Records'} </h1>
                {
                    password != '43310' ?
                        <div>
                            <input type='password' placeholder="enter password" value={password} onChange={changePass} />

                        </div>
                        :
                        <div className="del-btns">
                            <button onClick={() => emptyTables('bills_table')}> مسح سجلات الفواتير </button>
                            <button onClick={() => emptyTables('items_table')}> مسح جدول الصادرات</button>
                            <button onClick={() => emptyTables('bill_items_table')}>  مسح سجلات المخزن </button>
                        </div>
                }

            </div>
        </div>
    )
}
export default Dashboard;
