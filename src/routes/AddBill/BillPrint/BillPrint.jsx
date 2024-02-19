





import './BillPrint.css';
import cancelIcon from '../../../assets/cancel.svg';
import { useState, useEffect } from 'react';


import { useDb } from '../../../stockContext';

const getDate = () => {
  const today = new Date();
  const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
  const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  const dateTime = date + ' ' + time;
  return dateTime;
}



const BillPrint = (props) => {
  const { db, items, billsRecords, isLoading, setItems } = useDb();

  //const {newBill,setNewBill}=useBill();
  const billTotal = props.items.reduce((acc, obj) => acc + obj.total, 0);

  const { cancelBillPrint, confirmSaveBill } = props;

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


  //const restored_items = ;
  //.substring(0, restored.lastIndexOf('"}]') + 2)


  return (

    <div className="save-bill-pop">
      <button className="cancel-save-bill-pop" onClick={cancelBillPrint}>
        <img className='cancel-icon' src={cancelIcon} />
      </button>
      <div style={{ display: "flex", flexDirection: "row-reverse", justifyContent: "center", alignItems: "center" }}>
        <h3>

          --   هل تريد حفظ فاتورة -- </h3>
        {props.cName} --- Bid: {props.bid}

      </div>

      <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
        <div className="current-space">

          <table>
            <tr>
              <td>
                <h4>الاسم</h4>
              </td>
              <td>
                <h4>الكمية المطلوبة</h4>
              </td>
              <td>
                <h4>الوحدة</h4>
              </td>
              <td>
                <h4>سعر الوحدة</h4>
              </td>
              <td>
                <h4>الاجمالي</h4>
              </td>
            </tr>
            {props.items.map((x) => (x.req_qty > 0 &&
              <tr>
                <td>{x.name}</td>
                <td>{x.req_qty}</td>
                <td>{x.unit}</td>
                <td>${x.price_unit}</td>
                <td>${x.total}</td>
              </tr>
            ))}

            <tr>
              <td>اجمالي الفاتورة</td>
              <td style={{ backgroundColor: "#b5584d" }}>{billTotal}</td>
            </tr>

          </table>

        </div>
        <div className="records-space">
          <h4>تاريخ المعاملات</h4>
          {records && records.length ?
            records.map((y) =>
            (y && y.date &&


              <div className="records">
                <table style={{ overflowY: "auto", alignItems: "center" }}>
                  <tr>بضاعة مضافة</tr>
                  {y && y.added_items && y.added_items ? <tr><th>الاسم</th><th>كمية</th><th>اجمالي</th></tr> : ` `}
                  {y && y.added_items && y.added_items !== "" ? JSON.parse(y.added_items).map((z) => z.ibid && <tr><td>{z.name}</td><td>{z.req_qty}</td><td>{z.total}</td></tr>) : `----------`}
                  <tr>مرتجع</tr>
                  {y && y.restored_items && y.restored_items !== "" ? <tr><th>الاسم</th><th>كمية</th><th>اجمالي</th></tr> : <tr></tr>}

                  {y && y.restored_items && y.restored_items ? JSON.parse(y.restored_items).map((z) => z.ibid && <tr><td>{z.name}</td><td>{z.qty}</td><td>{z.total}</td></tr>) : `----------`
                  }

                </table>


                <table>

                  <tr >
                    <th>تاريخ المعاملة</th><td>{y.date}</td>
                  </tr>
                  <tr><th>المطلوب</th><td>{y.debt}</td></tr>
                  <tr><th>تم دفع </th><td>{y.paid}</td></tr>
                  <tr><th>اجمالي الفاتورة</th><td>{y.b_total}</td></tr>
                </table>

              </div>


            )) : <div>لا توجد معاملات سابقة</div>}
        </div>
      </div>
      <div>



        <div className="btns-section">




          <span style={{ minWidth: "200px", display: "flex", flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center" }}>
            <h4>مدفوع</h4>
            <input
              type="number"
              min={0}
              max={debt > 0 ? debt : props.debt}
              value={paid}
              onChange={(e) => handlePaid(e)}
              style={{ height: "15px", width: "70px", border: "solid", marginLeft: "5px" }}
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


            onClick={() => cancelBillPrint()}
          >
            الغاء
          </button>
        </div>
      </div>

    </div>

  );
};
export default BillPrint