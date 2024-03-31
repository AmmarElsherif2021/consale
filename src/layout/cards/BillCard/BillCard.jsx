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
import { useUser } from '../../../userContext';
import { useState, useEffect } from 'react';
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
    const { user, setUser } = useUser();
    // const cardColors = ['#d0836c', '#d8af50', '#54b17b']
    // const [cardTheme, setCardTheme] = useState('')
    // useEffect(() => {
    //     if (props.debt > 0) {
    //         setCardTheme(cardColors[0])
    //     } else if (props.debt === 0) {
    //         setCardTheme(cardColors[1])
    //     } else if (props.debt < 0) {
    //         setCardTheme(cardColors[2])
    //     }
    // }, [])
    return (
        <div className='bill-card' style={{ background: props.cardTheme }}>

            <div className='card-header' >
                <img className='card-img' src={AnonPic} />
                <h1>{props.cName}<br />BID: {props.bid}</h1>


            </div>



            <tr className='bill-card-p'>
                <td>{props.date}</td>
                <td>اجمالي  {props.bTotal} </td>
                <td> المطلوب {props.debt}  </td>
                <td> المدفوع  {props.paid} </td>

            </tr>





        </div>
    )
}
export default BillCard;