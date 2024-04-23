import './SaveBillPop.css';
import cancelIcon from '../../../assets/cancel.svg';
import printIcon from '../../../assets/print.svg';
import historyIcon from '../../../assets/history.svg'
import { useState, useEffect, useRef } from 'react';
import { BillProvider, useBill } from '../../../billContext';
import { ProgressBar } from 'react-bootstrap';
import { Table } from '@material-ui/core';
import { useDb } from '../../../stockContext';
import { useLang } from '../../../langContext';

import ReactToPrint from 'react-to-print';



const getDate = () => {
  const today = new Date();
  const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
  const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  const dateTime = date + ' ' + time;
  return dateTime;
}



const SaveBillPop = (props) => {
  const { db, items, billsRecords, isLoading, setItems } = useDb();
  const { lang, setLang } = useLang()

  //const {newBill,setNewBill}=useBill();
  const billTotal = props.items.reduce((acc, obj) => acc + obj.total, 0);

  const { cancelSaveBillPop, confirmSaveBill } = props;

  const [paid, setPaid] = useState(0);
  const [debt, setDebt] = useState(0);
  const [records, setRecords] = useState('');


  useEffect(() => {
    const fetchRecordsData = async () => {
      try {
        const result = await db.select("SELECT * FROM records_table WHERE bid=?", [props.bid]);
        setRecords(result)
        console.log(`records   ${result}======================================= &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&& --> ${JSON.stringify(result)}`)
        console.log(records)
      } catch (error) {
        console.error('Error fetching stock data:', error);
      }
    };

    fetchRecordsData();

  }, [])
  useEffect(() => setPaid(0), []);

  useEffect(() => setDebt(billTotal - paid - Number(props.paid)), [paid]);


  const handlePaid = (e) => {
    setPaid(e.target.value);
  };

  const handleSaveClick = (e) => {
    e.preventDefault();
    console.log('payments updates sent from pop ');
    confirmSaveBill(props.bid, billTotal, paid, debt);
  }

  const styleParagraph = { display: "flex", flexDirection: "row-reverse", alignItems: "center" };




  const historyRef = useRef();
  const currentRef = useRef();
  const createHistoryRef = async () => {
    const content = historyRef.current;
    const opt = {
      margin: 5,
      filename: "my-component.pdf",
      image: { type: "pdf", quality: 0.98 },
      html2canvas: { scale: 1 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };
    await html2pdf().from(content).set(opt).outputPdf();
  };

  const createCurrentRef = async () => {
    const content = currentRef.current;
    content.style.overflow = 'visible';
    const opt = {
      margin: 5,
      filename: "my-component.pdf",
      image: { type: "pdf", quality: 0.98 },
      html2canvas: { scale: 1 },
      jsPDF: { unit: "mm", format: "a5", orientation: "portrait", pagesplit: true },
    };
    content.style.overflow = 'auto';
    await html2pdf().from(content).set(opt).outputPdf();
  };

  return (


    <div className="save-bill-pop">

      <button className="cancel-save-bill-pop" onClick={cancelSaveBillPop}>
        <img className='cancel-icon' src={cancelIcon} />
      </button>
      <div style={{ display: "flex", flexDirection: "row-reverse", justifyContent: "center", alignItems: "center" }}>
        <h3>

          مراجعة الفاتورة </h3>
        {props.cName} --- Bid: {props.bid}

      </div>

      <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}  >
        <div style={{ overflowY: 'auto', height: '60vh', overflowX: 'hidden' }}>
          <div className="current-space" ref={currentRef}>

            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-evenly" }}>
              <small>{props.date}</small>

              <small style={{ display: "flex", flexDirection: "row", alignItems: "center" }} >   {props.cPhone}
                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M721.7 184.9L610.9 295.8l120.8 120.7-8 21.6A481.29 481.29 0 0 1 438 723.9l-21.6 8-.9-.9-119.8-120-110.8 110.9 104.5 104.5c10.8 10.7 26 15.7 40.8 13.2 117.9-19.5 235.4-82.9 330.9-178.4s158.9-213.1 178.4-331c2.5-14.8-2.5-30-13.3-40.8L721.7 184.9z"></path><path d="M877.1 238.7L770.6 132.3c-13-13-30.4-20.3-48.8-20.3s-35.8 7.2-48.8 20.3L558.3 246.8c-13 13-20.3 30.5-20.3 48.9 0 18.5 7.2 35.8 20.3 48.9l89.6 89.7a405.46 405.46 0 0 1-86.4 127.3c-36.7 36.9-79.6 66-127.2 86.6l-89.6-89.7c-13-13-30.4-20.3-48.8-20.3a68.2 68.2 0 0 0-48.8 20.3L132.3 673c-13 13-20.3 30.5-20.3 48.9 0 18.5 7.2 35.8 20.3 48.9l106.4 106.4c22.2 22.2 52.8 34.9 84.2 34.9 6.5 0 12.8-.5 19.2-1.6 132.4-21.8 263.8-92.3 369.9-198.3C818 606 888.4 474.6 910.4 342.1c6.3-37.6-6.3-76.3-33.3-103.4zm-37.6 91.5c-19.5 117.9-82.9 235.5-178.4 331s-213 158.9-330.9 178.4c-14.8 2.5-30-2.5-40.8-13.2L184.9 721.9 295.7 611l119.8 120 .9.9 21.6-8a481.29 481.29 0 0 0 285.7-285.8l8-21.6-120.8-120.7 110.8-110.9 104.5 104.5c10.8 10.8 15.8 26 13.3 40.8z"></path></svg>
              </small>
              <small>
                اسم العميل: {props.cName}
              </small>


            </div>
            <table>


            </table>
            <table>
              <tr>
                <th> {lang == 'ar' ? 'اسم الصنف' : 'product name'}</th>
                <th> {lang == 'ar' ? ' العرض' : 'Width'}</th>
                <th> {lang == 'ar' ? ' الطول' : 'Length'}</th>
                <th> {lang == 'ar' ? 'الكمية المطلوبة' : 'Qty. Req'}</th>
                <th> {lang == 'ar' ? 'النوع' : 'Sort'}</th>
                <th> {lang == 'ar' ? 'اجمالي' : 'Total'}</th>
              </tr>
              {props.items.map((x) => (x.req_qty > 0 &&
                <tr>
                  <td>{x.name.split(':')[1]}</td>
                  <td>{x.name.split(':')[0].split('x')[0]}</td>
                  <td>{x.unit === 'units' ? x.name.split(':')[0].split('x')[1] : x.req_qty}</td>
                  <td>{x.unit === 'units' ? x.req_qty : 1}</td>
                  <td>{x.unit === 'length' ? 'رول' : 'سجادة'}</td>
                  <td>${x.total}</td>
                </tr>
              ))}

              <tr>
                <td>اجمالي الفاتورة</td>
                <td style={{ backgroundColor: "#a5a08e" }}>{billTotal}</td>
              </tr>
              <tr><td colSpan={4}>-------------------------</td></tr>
            </table>

            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-evenly" }}>


              <span style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-evenly" }}>
                <svg stroke="currentColor" fill="currentColor" stroke-width="0" version="1.1" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M13.641 2.325c-1.497-1.5-3.488-2.325-5.609-2.325-4.369 0-7.925 3.556-7.925 7.928 0 1.397 0.366 2.763 1.059 3.963l-1.125 4.109 4.203-1.103c1.159 0.631 2.463 0.966 3.787 0.966h0.003c0 0 0 0 0 0 4.369 0 7.928-3.556 7.928-7.928 0-2.119-0.825-4.109-2.322-5.609zM8.034 14.525v0c-1.184 0-2.344-0.319-3.356-0.919l-0.241-0.144-2.494 0.653 0.666-2.431-0.156-0.25c-0.663-1.047-1.009-2.259-1.009-3.506 0-3.634 2.956-6.591 6.594-6.591 1.759 0 3.416 0.688 4.659 1.931 1.244 1.247 1.928 2.9 1.928 4.662-0.003 3.637-2.959 6.594-6.591 6.594zM11.647 9.588c-0.197-0.1-1.172-0.578-1.353-0.644s-0.313-0.1-0.447 0.1c-0.131 0.197-0.512 0.644-0.628 0.778-0.116 0.131-0.231 0.15-0.428 0.050s-0.838-0.309-1.594-0.984c-0.588-0.525-0.987-1.175-1.103-1.372s-0.013-0.306 0.088-0.403c0.091-0.088 0.197-0.231 0.297-0.347s0.131-0.197 0.197-0.331c0.066-0.131 0.034-0.247-0.016-0.347s-0.447-1.075-0.609-1.472c-0.159-0.388-0.325-0.334-0.447-0.341-0.116-0.006-0.247-0.006-0.378-0.006s-0.347 0.050-0.528 0.247c-0.181 0.197-0.694 0.678-0.694 1.653s0.709 1.916 0.809 2.050c0.1 0.131 1.397 2.134 3.384 2.991 0.472 0.203 0.841 0.325 1.128 0.419 0.475 0.15 0.906 0.128 1.247 0.078 0.381-0.056 1.172-0.478 1.338-0.941s0.166-0.859 0.116-0.941c-0.047-0.088-0.178-0.137-0.378-0.238z"></path></svg>
                <small>{' 0100 665 8433'}</small>
              </span>
              <span>
                <small>الذوق الرفيع للسجاد</small>
              </span>


            </div>
          </div>
        </div>
        <div className="records-space" >


          <div ref={historyRef}>
            <h4>تاريخ المعاملات</h4>
            {records && records.length ?
              records.map((y) =>
              (y && y.date &&


                <div key={y.date} className="records" style={{ border: 'solid' }}>
                  <table style={{ overflowY: "auto", alignItems: "center" }}>
                    <tr style={{ boreder: 'dashed' }}>بضاعة مضافة</tr>
                    {y && y.added_items && y.added_items ? <tr style={{ backgroundColor: "#a5a08e" }}><th>الاسم</th><th>كمية</th><th>اجمالي</th></tr> : ` `}
                    {y && y.added_items && y.added_items !== "" ? JSON.parse(y.added_items).map((z) => z.ibid && <tr key={z.ibid}><td>{z.name}</td><td>{z.req_qty}</td><td>{z.total}</td></tr>) : (<tr><td colSpan="3">----------</td>  </tr>)}
                    <tr style={{ boreder: 'dashed' }}>مرتجع</tr>
                    {y && y.restored_items && y.restored_items !== "" ? <tr style={{ backgroundColor: "#a5a08e" }}><th>الاسم</th><th>كمية</th><th>اجمالي</th></tr> : <tr></tr>}

                    {y && y.restored_items && y.restored_items ? JSON.parse(y.restored_items).map((z) => z.ibid && <tr key={z.ibid}><td>{z.name}</td><td>{z.qty}</td><td>{z.total}</td></tr>) : (<tr><td colSpan="3">----------</td>  </tr>)
                    }
                    <tr><td colSpan={3}>-------------------------</td></tr>
                  </table>


                  <table>

                    <tr style={{ boreder: 'dashed' }} >
                      <th style={{ backgroundColor: "#a5a08e" }}>تاريخ المعاملة</th><td>{y.date}</td>
                    </tr>
                    <tr><th style={{ backgroundColor: "#a5a08e" }}>المطلوب</th><td>{y.debt}</td></tr>
                    <tr><th style={{ backgroundColor: "#a5a08e" }}>تم دفع </th><td>{y.paid}</td></tr>
                    <tr><th style={{ backgroundColor: "#a5a08e" }}>اجمالي الفاتورة</th><td>{y.b_total}</td></tr>
                    <tr><td colSpan={4}>-------------------------</td></tr>
                  </table>

                </div>
              )) : <div>لا توجد معاملات سابقة</div>}
          </div>
        </div>
      </div>

      <div>
        <div className="btns-section">
          <ReactToPrint
            trigger={() => <button style={{ width: "3.5vw", height: "3.5vw", padding: "1px", marginTop: "5px", backgroundColor: "#33987d" }}
              onClick={() => createCurrentRef()}><img src={printIcon} style={{ width: "2vw" }} /></button>}
            content={() => currentRef.current}
          />
          <ReactToPrint
            trigger={() => <button style={{ width: "3.5vw", height: "3.5vw", padding: "1px", marginTop: "5px", backgroundColor: "#33987d" }}
              onClick={() => createHistoryRef()}><img src={historyIcon} style={{ width: "2vw" }} /></button>}
            content={() => historyRef.current}
          />


          <span style={{ minWidth: "200px", display: "flex", flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center" }}>
            <h4>مدفوع</h4>
            <input
              type="number"
              min={0}
              max={debt > 0 ? debt : props.debt}
              value={paid}
              onChange={(e) => handlePaid(e)}
              style={{ height: "2vh", width: "5vw", border: "solid", marginLeft: "5px" }}
            />

            <h4 style={{ marginLeft: "5px", marginRight: "10px" }}>المطلوب</h4>
            <h5 style={{ color: "red" }}>{debt}</h5>
            <h4 style={{ marginLeft: "5px", marginRight: "10px" }}>
              اجمالي الفاتورة

            </h4>
            <h5>{billTotal}</h5>
            <h4 style={{ marginLeft: "5px", marginRight: "10px" }}>كمية السداد السابقة </h4><h5> {props.paid}</h5>
          </span>




          <button
            className="confirm-save"
            onClick={(e) => handleSaveClick(e)
            }
          >
            تأكيد
          </button>

          <button
            className="cancel-save"
            onClick={() => cancelSaveBillPop()}
          >
            الغاء
          </button>
        </div>
      </div>

    </div >

  );
};
export default SaveBillPop