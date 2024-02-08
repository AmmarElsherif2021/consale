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

import AnonPic from "../../../assets/bill-icon.svg"
const BillCard = (props) => {
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
            </div>




        </div>
    )
}
export default BillCard;