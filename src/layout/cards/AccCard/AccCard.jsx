/*
-For each account: last closed,operations by day :[each operation is tangeled to bills excuted records (BID)].
-Each Account Card:
        -Wid: Worker id
        -w_name: worker name
        -short:short per shift
        -lastClosed:last closed
        -theme:random color for decoration
*/
import './AccCard.css';

import AnonPic from "../../../assets/anon.svg"
const AccCard=(props)=>{
    return(
    <div className='acc-card'>

        <div className='card-header'>
            <img className='card-img' src={AnonPic}/>
            <h1>{props.w_name}</h1>
        </div>

        <div className='card-p'>
            <h4>Short: <span>{props.short}</span> <br/> Last closed: <span>{props.lastClosed}</span> </h4>
        </div>

    </div>
    )
}
export default AccCard;