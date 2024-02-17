/* Bill atts:
    - Bid
      - c_name (optional)
        - c_phone
          - b_total
    - discount
      - items
        - date
          - time
*/
import './BillCard.css';
import { useDb } from '../../../stockContext';

import AnonPic from "../../../assets/bill-icon.svg"
const BillCard = (props) => {
    /* const { db, items, billsRecords, setBillsRecords, isLoading, setIsLoading, billsItems, setBillsItems } = useDb();
     function handleBillDel() {
         // Use db.execute to delete the bill from the database
         db.execute('DELETE FROM bills_table WHERE bid = ?', [props.bid])
             .then(() => {
                 // Update the bills state
                 setBillsRecords((prev) => prev.filter((bill) => bill.bid !== props.bid));
             })
             .catch((error) => {
                 console.error('Error deleting item:', error);
 
             });
     }*/
    const { db, items, billsRecords, setBillsRecords, isLoading, setIsLoading, billsItems, setBillsItems } = useDb();
    return (
        <div className='bill-card'>

            <div className='card-header'>
                <img className='card-img' src={AnonPic} />
                <h1>{props.cName}<br />BID: {props.bid}</h1>


            </div>



            <div className='bill-card-p'>
                <h3>
                    <span>{props.date}  </span>
                </h3>

                <h3>
                    <span>اجمالي {props.bTotal}  </span>
                </h3>
                <h3>
                    <span>المطلوب {props.debt}  </span>
                </h3>
                <h3>
                    <span>المدفوع {props.paid}  </span>
                </h3>
                <button onClick={() => db.execute('DELETE FROM bills_table WHERE bid = ?', [props.bid])}>Del</button>
            </div>





        </div>
    )
}
export default BillCard;