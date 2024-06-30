import './ItemPop.css';
import cancelIcon from '../../../assets/cancel.svg';
import AnonPic from "../../../assets/product.svg";
import { useEffect, useState } from 'react';
import { useLang } from '../../../langContext';
const ItemPop = (props) => {
    const { cancelItemPop, handleItemEdit } = props;
    let { lang } = useLang()
    const [qty, setQty] = useState(0);
    useEffect(() => console.log('editing item price'), [qty]);
    const handleQty = (e) => {
        setQty(e.target.value);
    }

    const [price, setPrice] = useState(Number(props.priceUnit));
    const [priceStore, setPriceStore] = useState(Number(props.priceStore));
    useEffect(() => console.log('editing unit price'), [price]);
    const handlePrice = (e) => {
        setPrice(e.target.value);
    }
    const handlePriceStore = (e) => {
        setPriceStore(e.target.value);
    }
    return (
        <form onSubmit={() => handleItemEdit(props.id, (Number(qty) + Number(props.qtyStock)), price, priceStore)} className='item-pop'>
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
                    <br /><span style={{ height: "30px" }}> {lang == 'ar' ? 'سعر المخزن|اخر تسجبل' : 'Imported price-last recorded: '}<span style={{ width: "25px" }}>{props.priceStore} :</span></span><span><input type="number" value={priceStore} onChange={handlePriceStore} className='edit-input' style={{ width: "25px" }} /><small> {props.unit === 'length' ? (lang == 'ar' ? 'جنيه\متر' : '$/m') : (lang == 'ar' ? 'جنيه\وحدة' : '$/unit')}</small></span>

                    <br /><span style={{ height: "30px" }}> {lang == 'ar' ? 'سعر المخزن|اخر تسجبل' : 'Imported price-last recorded: '}<span style={{ width: "25px" }}>{props.priceUnit} :</span></span><span><input type="number" value={price} onChange={handlePrice} className='edit-input' style={{ width: "25px" }} /><small> {props.unit === 'length' ? (lang == 'ar' ? 'جنيه\متر' : '$/m') : (lang == 'ar' ? 'جنيه\وحدة' : '$/unit')}</small></span>
                    <br /> <small style={{ height: "30px" }}>{lang == 'ar' ? 'الكمية|اخر تسجيل' : 'Quantity-last recorded: '}<span style={{ width: "25px" }}>{props.qtyStock} :</span><span> <small style={{ color: 'red' }}>  {lang == 'ar' ? 'الكمية بعد التعديل' : 'Quantity after mod.'} :{Number(qty) + Number(props.qtyStock)}</small>
                        <br />
                        <input className='edit-input' type="number" value={qty} onChange={handleQty} style={{ width: "40px" }} /> {lang == 'ar' ? 'الكمية المضافة' : 'Added quantity'} </span> </small>
                </div>
            </div>
            <div>
                <button type='submit' className='item-pop-btn'>{lang == 'ar' ? 'حفظ' : 'Save'}</button>
            </div>
        </form>
    )
}
export default ItemPop;