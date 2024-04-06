import './AddItemPop.css';
import cancelIcon from '../../../assets/cancel.svg'
import { useEffect, useState } from 'react';
const AddItemPop = (props) => {
  const { cancelAddItemPop, handleAddSubmit, generateRandomId, addRecord } = props;
  const [parameter, setParameter] = useState('');
  const [itemName, setItemName] = useState({
    name: '',
    length: '',
    width: ''
  });
  const handleNameChange = () => {
    let newName = '';
    if (parameter === 'units') {
      newName = `${itemName.width}x${itemName.length}  :${itemName.name} `
    } else if (parameter === 'length') {
      newName = `${itemName.width}:${itemName.name} `

    }
    setNewAddedItem(() => ({
      ...newAddedItem,
      name: newName
    }))
  };
  useEffect(() => handleNameChange(), [itemName]);
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
  };

  //handle input change
  const handleInputChange = (event) => {
    const { name, value } = event.target;

    // If the selected parameter is "length" or "units", update the "parameter" state
    if (name === 'parameter') {
      setParameter(value);
      setNewAddedItem((p) => ({
        ...p,
        unit: value
      }))
    }

    else {
      setNewAddedItem({
        ...newAddedItem,
        [name]: event.target.type === 'number' ? value : Number(value)
      });
    }


  };
  useEffect(() => console.log('para changed'), [newAddedItem, parameter])

  return (
    <form className='add-item-pop' onSubmit={(e) => handleAddPopSubmit(e)}>
      <button className='cancel-add-item-pop' onClick={() => cancelAddItemPop()}><img className='cancel-icon' src={cancelIcon} /></button>
      <div className='pop-body'></div>
      <h1>اضف الى المخزن </h1>
      <div>{newAddedItem.name}</div>

      <div className='add-account-form'>
        <div>

          <div className='form-label labels'>
            <h4>الوحدة المستخدمة</h4>

            <label>
              <div>
                طول
                <input
                  className='radio-input'
                  type="radio"
                  value="length"
                  name="parameter"
                  checked={parameter === 'length'} // Check if parameter is "length"
                  onChange={handleInputChange}
                />
              </div>

              <div>
                وحدات
                <input
                  className='radio-input'
                  type="radio"
                  value="units"
                  name="parameter"
                  checked={parameter === 'units'} // Check if parameter is "units"
                  onChange={handleInputChange}
                />
              </div>
            </label>
          </div>


          <div><label className='form-label'>
            <input className='input' type="text" name="name" placeholder='سجل اسم' onChange={(e) => setItemName(() => ({
              ...itemName,
              name: e.target.value
            }))} />
            {parameter === 'units' &&
              <>
                <input className='input' type="number" name="name" step="0.1" placeholder={1.0}
                  onChange={(e) => setItemName(() => ({
                    ...itemName,
                    length: e.target.value
                  }))} />طول
              </>}
            <input className='input' type="number" name="name" step="0.1" placeholder={1.0} onChange={(e) => setItemName(() => ({
              ...itemName,
              width: e.target.value
            }))} /> عرض
          </label></div>
          <div><label className='form-label'>
            <input className='input' type="text" name="description" placeholder='اكتب وصف' onChange={(e) => handleInputChange(e)} />
          </label></div>


          <div className='form-label'>
            جنيه<input className='input' type="number" name="price_unit" placeholder='سعر الوحدة' style={{ height: "30px" }} onChange={handleInputChange} />
          </div>
          <div className='form-label'>
            وحدة<input className='input' type="number" name="quantity_stock" placeholder='حدد الكمية' onChange={(e) => handleInputChange(e)} />
          </div>
          <div className='form-label'><button onClick={(e) => handleAddPopSubmit(e)} type="submit">أضف</button></div>
        </div>
      </div>
    </form>
  );
}
export default AddItemPop