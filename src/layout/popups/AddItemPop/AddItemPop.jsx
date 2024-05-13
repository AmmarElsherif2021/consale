import './AddItemPop.css';
import cancelIcon from '../../../assets/cancel.svg'
import { useEffect, useState } from 'react';
import { useLang } from '../../../langContext';
const AddItemPop = (props) => {
    const { cancelAddItemPop, handleAddSubmit, generateRandomId, addRecord } = props;
    const [parameter, setParameter] = useState('');
    const { lang, useLang } = useLang();
    const [newAddedItem, setNewAddedItem] = useState({
        id: generateRandomId().toString(),
        name: '',
        description: '',
        unit: '',
        price_unit: 0,
        quantity_stock: 0
    });

    const handleAddPopSubmit = (e) => {
        e.preventDefault();

        handleAddSubmit(e, newAddedItem);
        //addRecord(newAddedItem);

    }

    const handleInputChange = (event) => {
        setNewAddedItem({
            ...newAddedItem,
            [event.target.name]: event.target.type === 'number' ? Number(event.target.value) : event.target.value
        });
    };

    useEffect(() => console.log(`new adding -->${{ ...newAddedItem }}`), [newAddedItem])

    return (
        <form className='add-item-pop' onSubmit={(e) => handleAddPopSubmit(e)}>
            <button className='cancel-add-item-pop' onClick={() => cancelAddItemPop()}><img className='cancel-icon' src={cancelIcon} /></button>
            <div className='pop-body'></div>
            <h1>{lang == 'ar' ? 'اضف الى المخزن' : 'Add to stock'}</h1>
            <div className='add-account-form'>
                <div>
                    <div><label className='form-label'>
                        <input className='input' type="text" name="name" placeholder='سجل اسم' onChange={handleInputChange} />
                    </label></div>
                    <div><label className='form-label'>
                        <input className='input' type="text" name="description" placeholder='اكتب وصف' onChange={handleInputChange} />
                    </label></div>
                    <div className='form-label labels'>
                        <h4> المستخدمة</h4>
                        <label>
                            وزن
                            <input className='input' type="radio"
                                value="weight" name="parameter"
                                onChange={
                                    (e) => {
                                        handleInputChange(e);
                                        setParameter('weight');
                                    }
                                } />
                            {parameter === 'weight' && (
                                <div className='second-radios'>
                                    <label>
                                        <input type="radio" name="unit" value="kg" onChange={(e) => { handleInputChange(e); }} /> kg
                                    </label>
                                    <label>
                                        <input type="radio" name="unit" value="g" onChange={(e) => { handleInputChange(e); }} /> g
                                    </label>
                                </div>
                            )}
                        </label>
                        <label>
                            طول
                            <input className='input' type="radio" value="length" name="parameter"
                                onChange={(e) => {
                                    handleInputChange(e);
                                    setParameter('length');
                                }} />
                            {parameter === 'length' && (
                                <div className='second-radios'>
                                    <label>
                                        <input type="radio" value="m" name="unit" onChange={handleInputChange} /> m
                                    </label>
                                    <label>
                                        <input type="radio" value="cm" name="unit" onChange={handleInputChange} /> cm
                                    </label>
                                    <label>
                                        <input type="radio" value="mm" name="unit" onChange={handleInputChange} /> mm
                                    </label>
                                </div>
                            )}
                        </label>
                        <label>
                            وحدات
                            <input className='input' type="radio"
                                value="units" name="unit"
                                onChange={(e) => {
                                    handleInputChange(e);
                                    setParameter('units');
                                }} />
                        </label>
                    </div>
                    <div className='form-label'>
                        جنيه<input className='input' type="number" name="price_unit" placeholder='سعر الوحدة' style={{ height: "30px" }} onChange={handleInputChange} />
                    </div>
                    <div className='form-label'>
                        وحدة<input className='input' type="number" name="quantity_stock" placeholder='حدد الكمية' onChange={handleInputChange} />
                    </div>
                    <div className='form-label'><button onClick={(e) => handleAddPopSubmit(e)} type="submit">أضف</button></div>
                </div>
            </div>
        </form>
    );
}
export default AddItemPop