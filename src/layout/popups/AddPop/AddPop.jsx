import './AddPop.css'; 
import cancelIcon from '../../../assets/cancel.svg'
const AddPop=({cancelAddPop})=>{
    return(
        <div className='add-pop'>
            <button className='cancel-add-pop' onClick={()=>cancelAddPop()}><img className='cancel-icon' src={cancelIcon}/></button>
            
            <div className='pop-body'></div>
            <h1> Add account </h1>
            <div className='add-account-form'>
            <form>
            <div><label className='form-label'>
         
                <input className='input' type="text" name="name"  placeholder='Set Name'/>
            </label>
            </div>

            <div><label className='form-label'>
               
                <input className='input' type="password" name="password" placeholder='Set Password'/>
            </label>
            </div>

            <div  className='form-label'><label>
                
                <input className='input' type="password" name="confirmPassword" placeholder='Confirm Password'/>
            </label>
            </div>

            <div className='form-label'>
            
            <label>
                Admin:
                <input className='input' type="radio" value="Admin" name="role" />
            </label> 
            <label>
                Worker:
                <input className='input' type="radio" value="Worker" name="role" />
            </label>
            </div>

            <div className='form-label'><input className='input' type="submit" value="Submit" /></div>
        </form>
            </div>
        </div>
    )
}
export default AddPop