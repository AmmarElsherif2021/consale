import './ItemPop.css';
import cancelIcon from '../../../assets/cancel.svg';
import AnonPic from "../../../assets/product.svg";
import { useEffect, useState } from 'react';

const ItemPop = (props) => {
    const { cancelItemPop, handleItemEdit } = props;
    const [qty, setQty] = useState(Number(props.qtyStock));
    useEffect(() => console.log('editing item price'), [qty]);
    const handleQty = (e) => {
        setQty(e.target.value);
    }

    const [price, setPrice] = useState(Number(props.priceUnit));
    useEffect(() => console.log('editing unit price'), [price]);
    const handlePrice = (e) => {
        setPrice(e.target.value);
    }
    return (
        <div className='item-pop'>
            <button className='cancel-item-pop' onClick={cancelItemPop}><img className='cancel-icon' src={cancelIcon} /></button>
            <div className='item-pop-header'>
                <img className='item-pop-img' src={props.img ? props.img : AnonPic} />
                <div className='item-info'>
                    <h1>{props.name}</h1>
                    <h5>{props.discription}</h5>
                </div>
            </div>

            <div className='item-pop-p'>
                <div>ID: <span>{props.id}</span>
                    <br /><span style={{ height: "30px" }}> اخر تسجيل <span style={{ height: "30px" }}>{props.priceUnit} :</span></span><span><input type="number" value={price} onChange={handlePrice} style={{ height: "20px" }} /><small>سعر الوحدة</small></span>
                    <br /> <span style={{ height: "30px" }}>اخر تسجيل<span style={{ height: "25px" }}>{props.qtyStock} :</span><span><input type="number" value={qty} onChange={handleQty} style={{ height: "20px" }} /> <small>الكمية المتاحة </small></span> </span>
                </div>
                <div>
                    <button onClick={() => handleItemEdit(props.id, qty, price)} className='item-pop-btn'>حفظ</button>
                </div>
            </div>
        </div>
    )
}
export default ItemPop;