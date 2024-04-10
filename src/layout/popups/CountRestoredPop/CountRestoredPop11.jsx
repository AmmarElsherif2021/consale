import './CountRestoredPop.css';
import cancelIcon from '../../../assets/cancel.svg';
import { useEffect, useState } from 'react';
const CountRestoredPop = (props) => {
    const { cancelCountRestoredPop, confirmRestoredPop } = props;
    const [restored, setRestored] = useState(0);
    useEffect(() => console.log(`props.id=============>`, props.ibid), [])
    return (
        <div className='count-restored-pop'>
            <button className='cancel-count-restored-pop' onClick={cancelCountRestoredPop}><img className='cancel-icon' src={cancelIcon} /></button>
            <div className='card-body' style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <h3>مرتجع</h3>

                <small style={{ color: "red" }}>انت الان تقوم بارجاع</small>
                <small>{props.name} </small>
                <div>
                    <input type='number' min={0} max={props.reqQty} step={0.01} value={restored}
                        onChange={((e) => setRestored(e.target.value))} style={{ width: "65px" }} />
                    <small>{props.unit == 'length' ? 'طول بالمتر' : 'وحدة'}</small>
                </div>
                <div>
                    <small>بقيمة</small>
                    <small> : </small>
                    <small>{props.unit === 'length' ? restored * props.priceUnit * Number(props.name.split(':')[0]) : restored * props.priceUnit}</small>
                </div>
                <div className='btns-section'>
                    <button className='count-restored-btn confirm'
                        style={{ backgroundColor: "#00994d" }}
                        onClick={() => { confirmRestoredPop(props.id, props.ibid, restored) }}>تأكيد</button>
                    <button className='count-restored-btn '
                        style={{ backgroundColor: "#ff5c33" }}
                        onClick={cancelCountRestoredPop}>الغاء</button>
                </div>
            </div>
        </div>
    )
}
export default CountRestoredPop;