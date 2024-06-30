import './ItemToBill.css';
import AnonPic from "../../../assets/product.svg"
import cancelIcon from '../../../assets/cancel.svg'
import addPlus from '../../../assets/add-plus.svg'
import { useState, useEffect } from 'react';
import { useLang } from '../../../langContext';
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
    const { cancelItemToBill, handleItemsListPush, handleReqQty, remainedStock } = props;
    const { lang, setLang } = useLang();
    const [reqQty, setReqQty] = useState(0);
    useEffect(() => console.log, [reqQty]);
    function handleChange(e) {
        setReqQty(e.target.value)
        handleReqQty(e.target.value);
    }

    const styleParagraph = { display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", padding: 0, marginRight: "5px" }

    return (
        <form className='item-bill-pop' onSubmit={(e) => handleItemsListPush(e, props.id)}>
            <button className='cancel-item-bill-pop' onClick={cancelItemToBill}><img className='cancel-icon' src={cancelIcon} /></button>
            <div className='item-bill-pop-header'>
                <img className='item-bill-pop-img' src={AnonPic} />

                <h4 style={{ marginLeft: "5px", paddingLeft: "15px" }}>
                    <span style={styleParagraph
                    }>

                        <p>{lang == 'ar' ? 'الاسم' : 'Name'} </p> <p style={{ minWidth: "140px", marginRight: '5px' }}>{props.name}</p>

                    </span>


                    <span style={styleParagraph
                    }>
                        <p style={{ minWidth: "110px", marginRight: '5px' }}>{lang == 'ar' ? 'السعر' : 'Price'}:  </p>   <p>{props.priceUnit} / {props.unit === 'length' ? 'm' : 'unit'}</p></span>
                    <span style={styleParagraph
                    }>
                        <p style={{ minWidth: "140px", marginRight: '3px' }}>{lang == 'ar' ? 'المتاح' : 'Available'}: </p>  <p > {props.remainedStock} {props.unit === 'length' ? 'm' : 'Unit'}</p></span>

                </h4>
            </div>

            <div className='item-bill-pop-p'>

                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", maxHeight: '17vh' }}>
                    <p style={styleParagraph
                    }>{lang == 'ar' ? 'الكمية المطلوبة' : 'Req. Qty.'}  <span><input style={{ width: "70px", margin: "5px" }} min="0" step={props.unit === 'length' ? 0.01 : 1} max={props.stockQty} type="number" id="reqQty" value={reqQty} onChange={(e) => handleChange(e)} /></span></p> <br />
                    <p style={styleParagraph
                    }> {lang == 'ar' ? 'اجمالي السعر' : 'Total Price'} <span style={{ marginLeft: '5px' }}>{Math.round(Number(reqQty) * Number(props.priceUnit))}</span><br /></p>

                </div>

                <div ><button className='add-item-bill-btn' type='submit'><img src={addPlus} className='add-plus' /></button></div>

            </div>
        </form >
    )
}
export default ItemToBill