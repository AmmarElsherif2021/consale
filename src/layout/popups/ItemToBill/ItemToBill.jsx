import './ItemToBill.css';
import AnonPic from "../../../assets/product.svg"
import cancelIcon from '../../../assets/cancel.svg'
import addPlus from '../../../assets/add-plus.svg'
import { useState, useEffect } from 'react';
//const db = await Database.load("sqlite:test.db");

/*
Item attributes in the bill items list:
-ibid
-name
-req_qty
-unit
-price_unit
-total
*/
const ItemToBill = (props) => {

    /* async function getAvailable(iid) {
         const maxAvailable = await db.query('SELECT quantity_stock FROM items_table WHERE id = ?', [iid]);
         return (maxAvailable)
     }
 */
    const { cancelItemToBill, handleItemsListPush, handleReqQty } = props;
    const [reqQty, setReqQty] = useState(0);
    useEffect(() => console.log, [reqQty]);
    function handleChange(e) {
        e.preventDefault();
        setReqQty(e.target.value)
        handleReqQty(e.target.value);
    }

    const styleParagraph = { display: "flex", flexDirection: "row-reverse", alignItems: "center" }

    return (
        <div className='item-bill-pop'>
            <button className='cancel-item-bill-pop' onClick={cancelItemToBill}><img className='cancel-icon' src={cancelIcon} /></button>
            <div className='item-bill-pop-header'>
                <img className='item-bill-pop-img' src={AnonPic} />

                <h4 style={{ marginLeft: "5px", paddingLeft: "15px" }}>
                    <span style={styleParagraph
                    }>

                        <p>الاسم </p> <p style={{ minWidth: "140px", backgroundColor: "#8fc9b7", marginRight: '5px' }}>{props.name}</p></span>
                    <span style={styleParagraph
                    }>
                        <p>الوحدة</p><p style={{ minWidth: "135px", backgroundColor: "#8fc9b7", marginRight: '5px' }}>{props.unit}</p></span>
                    <span style={styleParagraph
                    }>
                        <p>سعر الوحدة </p><p style={{ minWidth: "110px", backgroundColor: "#8fc9b7", marginRight: '5px' }}>{props.priceUnit}</p></span>
                    <span style={styleParagraph
                    }>
                        <p>المتاح</p><p style={{ minWidth: "140px", backgroundColor: "#8fc9b7", marginRight: '5px' }}>{props.stockQty}</p></span>

                </h4>
            </div>

            <div className='item-bill-pop-p'>

                <h4 style={{ marginLeft: "5px", paddingLeft: "5px", display: "flex", flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-between" }}>
                    <p style={styleParagraph
                    }>الكمية المطلوبة <span><input style={{ width: "70px", margin: "5px" }} min="0" max={props.stockQty} type="number" id="reqQty" value={reqQty} onChange={(e) => handleChange(e)} /></span></p> <br />
                    <p style={styleParagraph
                    }><p> اجمالي السعر </p> <span style={{ backgroundColor: "#8fc9b7", marginRight: '5px' }}>{Number(reqQty) * Number(props.priceUnit)}</span><br /></p>
                </h4>
                <div ><button className='add-item-bill-btn' onClick={(e) => handleItemsListPush(e, props.id)}><img src={addPlus} className='add-plus' /></button></div>
            </div>
        </div >
    )
}
export default ItemToBill