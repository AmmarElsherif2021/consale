import './AddItemPop.css';
import cancelIcon from '../../../assets/cancel.svg'
import { useEffect, useState } from 'react';
import { useLang } from '../../../langContext';
const AddItemPop = (props) => {
    const { popId, cancelAddItemPop, handleAddSubmit } = props;
    const [parameter, setParameter] = useState('');
    const { lang } = useLang();
    const [newAddedItem, setNewAddedItem] = useState({
        id: popId,
        name: '',
        description: '',
        unit: '',
        price_unit: 0,
        price_import: 0,
        quantity_stock: 0
    });

    const handleAddPopSubmit = async (e) => {
        e.preventDefault();
        try {
            handleAddSubmit(newAddedItem)
            console.log(`POP ADDING THIS ${JSON.stringify(newAddedItem)}`)
        } catch (error) {
            console.log(`Error submittin,, ${error}`)
        };
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

            <h1>{lang == 'ar' ? 'اضف الى المخزن' : 'Add to stock'}</h1>
            <div className='pop-body'>


                <label className='form-label'><input className='input' type="text" name="name" placeholder={lang == 'ar' ? 'سجل الاسم ' : 'insert name'} onChange={(e) => setNewAddedItem(() => ({
                    ...newAddedItem,
                    name: e.target.value
                }))} />

                </label>
                <label className='form-label'>
                    <input className='input' type="text" name="description" placeholder={lang == 'ar' ? 'اكتب الوصف ' : 'Add description'} onChange={(e) => handleInputChange(e)} />

                </label>


                <div className='labels'>
                    <h4> {lang == 'ar' ? ' الوحدة المستخدمة ' : ' Unit used'}</h4>
                    <div className='radios-pack'>
                        <label>
                            {lang == 'ar' ? ' وزن ' : ' weight'}
                            <input className='input' type="radio"
                                value="weight" name="parameter"
                                onChange={
                                    () => {
                                        //handleInputChange(e);
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
                            {lang == 'ar' ? ' طول ' : 'length'}
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
                            {lang == 'ar' ? 'وحدات  ' : ' units'}
                            <input className='input' type="radio"
                                value="units" name="unit"
                                onChange={(e) => {
                                    handleInputChange(e);
                                    setParameter('units');
                                }} />
                        </label>
                    </div>
                </div>
                <div className='form-label'>
                    {lang == 'ar' ? 'جنيه ' : ' $'}
                    <input className='input' type="number" name="price_unit" placeholder={lang == 'ar' ? 'سعر الوحدة  ' : 'unit price'} style={{ height: "30px" }} onChange={handleInputChange} />
                </div>
                <div className='form-label'>
                    {lang == 'ar' ? 'جنيه ' : ' $'}
                    <input className='input' type="number" name="price_import" placeholder={lang == 'ar' ? 'سعر الوحدة - جملة  ' : 'imported unit price'} style={{ height: "30px" }} onChange={handleInputChange} />
                </div>
                <div className='form-label'>
                    {lang == 'ar' ? ' وحدة ' : ' unit'}<input className='input' type="number" name="quantity_stock" placeholder={lang == 'ar' ? ' حدد الكمية ' : ' set quantity'} onChange={handleInputChange} />
                </div>
                <div className='form-label'><button onClick={(e) => handleAddPopSubmit(e)} type="submit">{lang == 'ar' ? 'اضف  ' : ' Add'}</button></div>
            </div>

        </form>
    );
}
export default AddItemPop