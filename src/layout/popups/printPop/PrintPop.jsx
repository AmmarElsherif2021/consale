import './printPop.css';
import cancelIcon from '../../../assets/cancel.svg';
import AnonPic from '../../../assets/print.svg';

const PrintPop = (props) => {
    const { handleCancelPrint, handlePrint } = props;
    return (
        <div className='print-pop'>
            <button className='cancel-print-pop' onClick={handleCancelPrint}><img className='cancel-icon' src={cancelIcon} /></button>
            <div className='print-card-header'>
                <img className='print-pop-img' src={AnonPic} style={{ width: "60px" }} />
                <div className='print-info'>
                    <h2>هل تريد حفظ الفاتورة؟</h2>

                    <div className="print-table">
                        <table>
                            <tr><th>Bid</th>  <th>تاريخ</th><th>اسم العميل</th> <th>تليفون</th></tr>
                            <tr><td>{props.bid}</td> <td>{props.date}</td><td>{props.cName}</td>  <td>{props.cPhone}</td></tr>


                            <tr><th>مدفوع</th> <th>مطلوب</th></tr>
                            <tr><td>{props.paid}</td> <td>{props.debt}</td></tr>
                        </table>
                    </div>
                </div>
            </div>

            <div className='print-table'>

                <div><button className='confirm-print-btn' onClick={handlePrint}>حفظ</button></div>
            </div>

        </div>
    )
}
export default PrintPop;