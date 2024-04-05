/* Bill atts:
    - Bid
      - c_name (optional)
        - c_phone
          - b_total
    - discount
      - items
        - date
          - time




            `CREATE TABLE IF NOT EXISTS bill_items_table (
      ibid TEXT PRIMARY KEY,
      id TEXT,
      name TEXT,
      bid TEXT,
      req_qty INTEGER,
      total INTEGER,
      FOREIGN KEY(bid) REFERENCES billsRecords_table(bid) ON DELETE CASCADE, 
      FOREIGN KEY(id) REFERENCES items_table(id) ON DELETE CASCADE 
    )
*/
import './BillPop.css';

import AnonPic from "../../../assets/bill-icon.svg";
import cancelIcon from '../../../assets/cancel.svg';
import { useDb } from '../../../stockContext';
import { useState, useEffect } from 'react';
import { useUser } from '../../../userContext';

import delIcon from '../../../assets/del.svg';
import { useLang } from '../../../langContext';

const BillPop = (props) => {
    const { cancelBillPop, openBill } = props;
    const { db, items, billsRecords, isLoading, setItems, setIsLoading } = useDb();

    const { user, setUser } = useUser();
    const handleDel = () => {
        if (user.userName === 'smsm' && props.debt == 0) {
            db.execute('DELETE FROM bills_table WHERE bid = ?', [props.bid]);
            cancelBillPop();
        }

    }

    //theme
    const cardColors = ['#d0836c', '#d8af50', '#54b17b']
    const [cardTheme, setCardTheme] = useState('')
    const { lang, setLang } = useLang()
    useEffect(() => {
        if (props.debt > 0) {
            setCardTheme(cardColors[0])
        } else if (props.debt === 0) {
            setCardTheme(cardColors[1])
        } else if (props.debt < 0) {
            setCardTheme(cardColors[2])
        }
    }, [])

    return (
        <div className='oldbill-pop' style={{ background: cardTheme }}>
            <button className='cancel-bill-pop' onClick={cancelBillPop}><img className='cancel-icon' src={cancelIcon} /></button>

            <div className='pop-header'>
                <img className='bill-pop-img' style={{ width: "50px" }} src={AnonPic} />
                <h4>B-id: <span>{props.bid}</span> <br />
                    {lang == 'ar' ? 'اسم العميل' : 'Customer'}: <span>{props.cName}</span><br />
                    {lang == 'ar' ? 'موبايل' : 'Phone'}: <span>{props.cPhone}</span><br />
                    {lang == 'ar' ? 'تاريخ' : 'Date'}: <span>{props.date}</span><br />

                    <small> {lang == 'ar' ? 'اجمالي الفاتورة' : 'B. Total'}:{props.bTotal}</small> --
                    <small>  {lang == 'ar' ? 'المدفوع' : 'Paid'}:{props.paid}</small> --
                    <small >  {lang == 'ar' ? 'مطلوب' : 'Debt'}: <span style={{ color: "#DD3522" }}>{props.debt}</span></small>
                </h4>
            </div>
            <div>

                <table className="bill-pop-table" style={{ overflowY: "scroll" }}>
                    <thead >
                        <tr >
                            <th> {lang == 'ar' ? 'الاسم' : 'Name'}</th>
                            <th> {lang == 'ar' ? 'الكمية' : 'Qty'}</th>
                            <th> {lang == 'ar' ? 'الوحدة' : 'Unit'}</th>
                            <th> {lang == 'ar' ? 'سعر الوحدة' : 'Price/Unit'} </th>

                            <th>{lang == 'ar' ? 'اجمالي' : 'Total'}</th>


                        </tr>
                    </thead>
                    <tbody>
                        {props.items && props.items.length && props.items.map(
                            (x) => (x.req_qty > 0 && <tr>
                                <td><small>{x.name}</small></td>
                                <td><small>{x.req_qty}</small></td>
                                <td><small>{x.unit}</small></td>
                                <td><small>{x.price_unit}</small></td>
                                <td><small>{x.total}</small></td>

                            </tr>))}



                    </tbody>
                </table >

            </div >
            <div>
                <button className='open-bill-btn' onClick={openBill}>تعديل الفاتورة</button>
                <button style={{ width: "60px", position: 'absolute', right: "15px", marginTop: "10px" }} onClick={() => handleDel()}>  <img src={delIcon} style={{ width: "20px" }} /></button>



            </div>
        </div >
    )
}
export default BillPop;