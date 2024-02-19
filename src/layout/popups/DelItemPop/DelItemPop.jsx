import './DelItemPop.css';
import cancelIcon from '../../../assets/cancel.svg';
import { useEffect } from 'react';
const DelItemPop = (props) => {
    const { cancelDelItemPop, confirmDelItem } = props;
    useEffect(() => console.log(`props.id=============>`, props.id), [])
    return (
        <div className='del-item-pop'>
            <button className='cancel-del-item-pop' onClick={cancelDelItemPop}><img className='cancel-icon' src={cancelIcon} /></button>
            <div className='card-body' style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <h3> هل تريد حذف هذا الصنف </h3>
                <h3>{props.name} ? </h3>
                <div className='btns-section'>
                    <button className='del-item-btn confirm'
                        style={{ backgroundColor: "#307c5b" }}
                        onClick={(e) => confirmDelItem(e, props.id)}>تأكيد</button>
                    <button className='del-item-btn '
                        style={{ backgroundColor: "#ff5c33" }}
                        onClick={cancelDelItemPop}>الغاء</button>
                </div>
            </div>
        </div>
    )
}
export default DelItemPop;