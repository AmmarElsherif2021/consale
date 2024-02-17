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
import { useEffect } from 'react';

const BillPop = (props) => {
    const { cancelBillPop, openBill } = props;
    const { db, items, billsRecords, isLoading, setItems, setIsLoading } = useDb();



    return (
        <div className='oldbill-pop'>
            <button className='cancel-bill-pop' onClick={cancelBillPop}><img className='cancel-icon' src={cancelIcon} /></button>

            <div className='pop-header'>
                <img className='bill-pop-img' src={AnonPic} />
                <h4>B-id: <span>{props.bid}</span> <br />
                    اسم العميل: <span>{props.cName}</span><br />
                    موبايل: <span>{props.phone}</span><br />
                    تاريخ: <span>{props.date}</span><br />

                    <small>اجمالي:{props.bTotal}</small> --
                    <small> المدفوع:{props.paid}</small> --
                    <small > الدين: <span style={{ color: "#DD3522" }}>{props.debt}</span></small>
                </h4>
            </div>
            <div style={{ overflowY: "scroll" }}>

                <table className="bill-pop-table">
                    <thead >
                        <tr >
                            <th><small>الاسم</small></th>
                            <th><small>الكمية المطلوبة</small></th>
                            <th><small>الوحدة</small></th>
                            <th><small>سعر الوحدة</small></th>

                            <th><small>اجمالي</small></th>


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
                </table>

            </div>
            <div><button className='open-bill-btn' onClick={openBill}>تعديل الفاتورة</button></div>
        </div>
    )
}
export default BillPop;