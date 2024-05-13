import './printPop.css';
import cancelIcon from '../../../assets/cancel.svg';
import AnonPic from '../../../assets/print.svg';
import { useLang } from '../../../langContext';
const PrintPop = (props) => {
    const { handleCancelPrint, handlePrint } = props;
    const { lang, setLang } = useLang()
    return (
        <div className='print-pop'>
            <button className='cancel-print-pop' onClick={handleCancelPrint}><img className='cancel-icon' src={cancelIcon} /></button>
            <div className='print-card-header'>
                <img className='print-pop-img' src={AnonPic} style={{ width: "60px" }} />
                <div className='print-info'>
                    <h2>{lang == 'ar' ? '  تأكيد حفظ الفاتورة ' : 'Are you sure you want to save bill ?'}</h2>

                    <div className="print-table">
                        <table>
                            <tr><th>Bid</th>  <th>{lang == 'ar' ? 'تاريخ' : 'Date'}</th><th>{lang == 'ar' ? 'اسم العميل' : 'Customer Name'} </th> <th>{lang == 'ar' ? 'موبايل' : 'Phone'}</th></tr>
                            <tr><td>{props.bid}</td> <td>{props.date}</td><td>{props.cName}</td>  <td>{props.cPhone}</td></tr>


                            <tr><th>{lang == 'ar' ? 'مدفوع' : 'Paid'}</th> <th>{lang == 'ar' ? 'مطلوب' : 'Required'}</th></tr>
                            <tr><td>{props.paid}</td> <td>{props.debt}</td></tr>
                        </table>
                    </div>
                </div>
            </div>

            <div className='print-table'>

                <div><button className='confirm-print-btn' onClick={handlePrint}>{lang == 'ar' ? 'حفظ' : 'Save'}</button></div>
            </div>

        </div>
    )
}
export default PrintPop;