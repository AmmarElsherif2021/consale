
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
import { Chart } from "react-google-charts";

import { writeTextFile, BaseDirectory } from "@tauri-apps/api/fs";
import addPlus from '../../assets/add-plus.svg'
import './Dashboard.css';
import axios from 'axios'
import AccCard from "../../layout/cards/AccCard/AccCard";
import { useEffect, useState } from "react";
import data from './data/accounts.json';
import AddPop from '../../layout/popups/AddPop/AddPop';
import AccPop from "../../layout/popups/AccPop/AccPop";
import { useDb } from "../../stockContext";








//####################################################################
const Dashboard = () => {

    //Receiver dir. 
    const appDataDir = BaseDirectory.AppData;
    //accounts state carries accounts.json records
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

    //generate Id
    function generateRandomId() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }
    // write on json file so or look for authentication plugin
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
    const { db } = useDb();
    const [billsData, setBillsData] = useState([]);
    async function fetchBillsData() {

        try {
            let newBills = await db.select('SELECT * FROM bills_table')
            // Update the bills state
            setBillsData(newBills);
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    }
    useEffect(() => {
        fetchBillsData();
        console.log(`billsData length= ${billsData.length}`)
    }, []);
    const chartData = [
        ['تاريخ -', ' المدفوع- ', 'مستحق - ', 'اجمالي '],
        ...billsData.map(item => [item.date, item.paid, item.debt, item.b_total])
    ];
    return (
        <div className="route-content dashboard">
            <h1>الحسابات</h1>

            {addPop ? <AddPop cancelAddPop={cancelAddPop} /> : <div></div>}
            {accPop.wid ? <AccPop w_name={accPop.w_name} short={accPop.short} lastClosed={accPop.last_closed} cancelAccPop={cancelAccPop} /> : <div></div>}


            <div className="accounts" style={accPop && accPop.wid ? { filter: "blur(2px)" } : { filter: "none" }}>

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
            <h1>بيانات المدفوعات والمستحقات</h1>
            <div className='charts'>

                <Chart
                    width={'100%'}
                    height={'400px'}
                    chartType="LineChart"
                    loader={<div>Loading Chart</div>}
                    data={chartData}
                    options={{
                        title: 'بيان المدفوعات والمستحقات',
                        curveType: 'function',
                        legend: { position: 'bottom' },
                    }}
                />
            </div>
        </div>
    )
}
export default Dashboard;
