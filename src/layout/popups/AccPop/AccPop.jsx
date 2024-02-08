import './AccPop.css';
import AnonPic from "../../../assets/anon.svg"
import cancelIcon from '../../../assets/cancel.svg'
const AccPop = (props) => {
    const { cancelAccPop } = props;

    return(
        <div className='acc-pop'>
            <button className='cancel-acc-pop' onClick={cancelAccPop}><img className='cancel-icon' src={cancelIcon}/></button>
            <div className='acc-pop-header'>
                <img className='acc-pop-img' src={AnonPic}/>
                <div>
                <h1>{props.w_name}</h1>
                <button>Delete Account</button>
                </div>
                 
            </div>

            <div className='acc-pop-p'>
               
                <h4>
                Last opened: <span>{props.lastOpened}</span><br/>
                Last closed: <span>{props.lastClosed}</span><br/>
                </h4>
                <h4>
                 Shift income: <span>{props.shiftIncome}</span><br/>
                 Desk Revision: <span>{props.deskRevision}</span><br/>
                 Short: <span>{props.short}</span> <br/>

                </h4>
                
            </div>
        </div>
    )
}
export default AccPop