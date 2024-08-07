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


  //const {newBill,setNewBill}=useBill();
  const billTotal = props.items.reduce((acc, obj) => acc + obj.total, 0);

  const { cancelSaveBillPop, confirmSaveBill } = props;

  const [paid, setPaid] = useState(0);
  const [debt, setDebt] = useState(0);
  const [records, setRecords] = useState('');

  const { lang } = useLang();
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
      <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-around", alignItems: "baseline" }}>
        <h1>payments Check </h1>
        <h4>Customer name: {props.cName} </h4>

        <small>Bid: {props.bid}</small>

      </div>

      <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}  >
        <div style={{ overflowY: 'auto', height: '60vh', overflowX: 'hidden' }}>
          <div className="current-space" ref={currentRef}>
            <table>
              <tr><th>{lang == 'ar' ? 'التاريخ' : 'Date'}</th><th>{lang == 'ar' ? 'موبايل' : 'Phone'}</th><th>{lang == 'ar' ? 'الاسم' : 'Name'}</th></tr>
              <tr><td>{props.date}</td><td>{props.cPhone}</td><td>{props.cName}</td></tr>

            </table>
            <table>
              <tr>
                <td>
                  {lang == 'ar' ? 'الاسم' : 'Name'}
                </td>
                <td>
                  {lang == 'ar' ? 'الكمية المطلوبة' : 'Req. Qty'}
                </td>

                <td>
                  {lang == 'ar' ? 'سعر الوحدة' : 'Price/Unit'}
                </td>
                <td>
                  {lang == 'ar' ? 'اجمالي' : 'Total'}
                </td>
              </tr>
              {props.items.map((x) => (x.req_qty > 0 &&
                <tr>
                  <td>{x.name}</td>
                  <td>{x.req_qty}</td>

                  <td>${x.price_unit}</td>
                  <td>${x.total}</td>
                </tr>
              ))}

              <tr>
                <td>{lang == 'ar' ? 'اجمالي الفاتورة' : 'Bill Total'} </td>
                <td style={{ backgroundColor: "#a5a08e" }}>{billTotal}</td>
              </tr>
              <tr><td colSpan={4}>-------------------------</td></tr>
            </table>

          </div>
        </div>
        <div className="records-space" >


          <div ref={historyRef}>
            <h4>{lang == 'ar' ? 'المعاملات السابقة' : 'History of Ops.'} </h4>
            {records && records.length ?
              records.map((y) =>
              (y && y.date &&


                <div key={y.date} className="records" style={{ border: 'solid' }}>
                  <table style={{ overflowY: "auto", alignItems: "center" }}>
                    <tr style={{ boreder: 'dashed' }}>{lang == 'ar' ? 'بصاعة مضافة' : 'Added Items'} </tr>
                    {y && y.added_items && y.added_items ? <tr style={{ backgroundColor: "#a5a08e" }}><th>{lang == 'ar' ? 'الاسم' : 'Name'}</th><th>{lang == 'ar' ? 'الكمية' : 'Qty'}</th><th>{lang == 'ar' ? 'اجمالي' : 'Total'}</th></tr> : <tr></tr>}
                    {y && y.added_items && y.added_items !== "" ? JSON.parse(y.added_items).map((z) => z.ibid && <tr key={z.ibid}><td>{z.name}</td><td>{z.req_qty}</td><td>{z.total}</td></tr>) : (<tr><td colSpan="3">--</td>  </tr>)}
                    <tr style={{ boreder: 'dashed' }}>{lang == 'ar' ? 'مرتجع' : 'Restored'}</tr>
                    {y && y.restored_items && y.restored_items !== "" ? <tr style={{ backgroundColor: "#a5a08e" }}><th>{lang == 'ar' ? 'الاسم' : 'Name'}</th><th>{lang == 'ar' ? 'الكمية' : 'Qty'}</th><th>{lang == 'ar' ? 'اجمالي' : 'Total'}</th></tr> : <tr></tr>}

                    {y && y.restored_items && y.restored_items ? JSON.parse(y.restored_items).map((z) => z.ibid && <tr key={z.ibid}><td>{z.name}</td><td>{z.qty}</td><td>{z.total}</td></tr>) : (<tr><td colSpan="3">---</td>  </tr>)
                    }
                    <tr><td colSpan={3}>---</td></tr>
                  </table>


                  <table>

                    <tr style={{ boreder: 'dashed' }} >
                      <th style={{ backgroundColor: "#a5a08e" }}>{lang == 'ar' ? 'تاريخ المعاملة' : 'Op. Date'} </th><td>{y.date}</td>
                    </tr>
                    <tr><th style={{ backgroundColor: "#a5a08e" }}>{lang == 'ar' ? 'المطلوب' : 'Req.'}</th><td>{y.debt}</td></tr>
                    <tr><th style={{ backgroundColor: "#a5a08e" }}>{lang == 'ar' ? 'اجمالي المدفوع' : 'Total Paid'}  </th><td>{y.paid}</td></tr>
                    <tr><th style={{ backgroundColor: "#a5a08e" }}> {lang == 'ar' ? 'اجمالي الفاتورة' : 'Total of Bill'}</th><td>{y.b_total}</td></tr>
                    <tr><td colSpan={4}>---</td></tr>
                  </table>

                </div>
              )) : <div>{lang == 'ar' ? 'لا توجد معاملات سابقة' : 'No Previous Operations'}</div>}
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
            <h4>{lang == 'ar' ? 'المدفوع' : 'Paid'}</h4>
            <input
              type="number"
              min={0}
              max={debt > 0 ? debt : props.debt}
              value={paid}
              onChange={(e) => handlePaid(e)}
              style={{ height: "2vh", width: "3.7vw", border: "solid", marginLeft: "5px" }}
            />

            <h4 style={{ marginLeft: "5px", marginRight: "10px" }}>{lang == 'ar' ? 'المطلوب' : 'Required'}</h4>
            <h5 style={{ color: "red" }}>{debt}</h5>
            <h4 style={{ marginLeft: "5px", marginRight: "10px" }}>
              {lang == 'ar' ? 'اجمالي الفاتورة' : 'Bill`s Total'}

            </h4>
            <h5>{billTotal}</h5>
            <h4 style={{ marginLeft: "5px", marginRight: "10px" }}>{lang == 'ar' ? 'كمية السداد السابقة' : 'Total Paid'}</h4><h5> {props.paid}</h5>
          </span>




          <button
            className="confirm-save"
            onClick={(e) => handleSaveClick(e)
            }
          >
            {lang == 'ar' ? 'تأكيد' : 'Confirm'}
          </button>

          <button
            className="cancel-save"
            onClick={() => cancelSaveBillPop()}
          >
            {lang == 'ar' ? 'الغاء' : 'Cancel'}
          </button>
        </div>
      </div>

    </div>

  );
};
export default SaveBillPop