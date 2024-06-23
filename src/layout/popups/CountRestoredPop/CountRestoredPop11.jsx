import './CountRestoredPop.css';
import cancelIcon from '../../../assets/cancel.svg';
import { useEffect, useState } from 'react';
import { useLang } from '../../../langContext';
const CountRestoredPop = (props) => {
    const { lang, setLang } = useLang();
    const { cancelCountRestoredPop, confirmRestoredPop } = props;
    const [restored, setRestored] = useState(0);
    useEffect(() => console.log(`props.id=============>`, props.ibid), [])
    return (
        <div className='count-restored-pop'>
            <button className='cancel-count-restored-pop' onClick={cancelCountRestoredPop}><img className='cancel-icon' src={cancelIcon} /></button>
            <div className='card-body' style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <h3>{lang == 'ar' ? 'مرتجع' : 'Restoring'}</h3>

                <small style={{ color: "red" }}>{lang == 'ar' ? 'انت الان تقوم بارجاع' : 'You are storing'}</small>
                <small>{props.name} </small>
                <div>
                    <input type='number' min={0} max={props.reqQty} step={0.01} value={restored}
                        onChange={((e) => setRestored(Number(e.target.value).toFixed(2)))} style={{ width: "65px" }} />
                    <small>{props.unit == 'length' ? (lang == 'ar' ? 'طول بالمتر' : 'length in m') : (lang == 'ar' ? 'وحدة' : 'unit')}</small>
                </div>
                <div>
                    <small>{lang == 'ar' ? 'بقيمة' : 'Valued'}</small>
                    <small> : </small>
                    <small>{props.unit === 'length' ? (restored * props.priceUnit * Number(props.name.split(':')[0])).toFixed(2) : (restored * props.priceUnit).toFixed(2)}</small>
                </div>
                <div className='btns-section'>
                    <button className='count-restored-btn confirm'
                        style={{ backgroundColor: "#00994d" }}
                        onClick={() => { confirmRestoredPop(props.id, props.ibid, restored) }}>{lang == 'ar' ? 'تأكيد' : 'confirm'}</button>
                    <button className='count-restored-btn '
                        style={{ backgroundColor: "#ff5c33" }}
                        onClick={cancelCountRestoredPop}>{lang == 'ar' ? 'الغاء' : 'cancel'}</button>
                </div>
            </div>
        </div>
    )
}
export default CountRestoredPop;