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



            <tr className='bill-card-p'>
                <td>{props.date}</td>
                <td>اجمالي  {props.bTotal} </td>
                <td> المطلوب {props.debt}  </td>
                <td> المدفوع  {props.paid} </td>
                <td><button onClick={() => db.execute('DELETE FROM bills_table WHERE bid = ?', [props.bid])}>Del</button></td>

            </tr>





        </div>
    )
}
export default BillCard;