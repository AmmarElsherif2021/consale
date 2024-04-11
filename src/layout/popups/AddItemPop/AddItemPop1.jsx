import './AddItemPop.css';
import cancelIcon from '../../../assets/cancel.svg'
import { useEffect, useState } from 'react';
const AddItemPop = (props) => {
  const { cancelAddItemPop, handleAddSubmit, generateRandomId, addRecord } = props;
  const [newAddedItem, setNewAddedItem] = useState({
    id: generateRandomId().toString(),
    name: '',
    description: '',
    unit: 'length',
    price_unit: 0,
    quantity_stock: 0
  });

  const [parameter, setParameter] = useState('');
  const [itemName, setItemName] = useState({
    name: '',
    length: 1,
    width: 1
  });
  const [mPrice, setMPrice] = useState(0);
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
    else if (name === 'quantity_stock') {
      setNewAddedItem((p) => ({
        ...p,
        quantity_stock: event.target.value
      }))
    } else {
      setNewAddedItem({
        ...newAddedItem,
        [name]: event.target.type === 'number' ? Number(value) : value
      });
    }

    if (parameter === 'units') {
      setNewAddedItem((p) => ({
        ...p,
        price_unit: Math.round(itemName.width * itemName.length * p.price_unit)
      }))
    }
  }



  useEffect(() => console.log('para changed'), [newAddedItem, parameter]);



  // item name

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

  useEffect(
    () => {

      newAddedItem.unit === 'units' ? setNewAddedItem((p) =>
      (
        {
          ...p,
          price_unit: Math.round(mPrice * itemName.width * itemName.length).toFixed(2)
        }
      ))
        :
        setNewAddedItem((p) =>
        (
          {
            ...p,
            price_unit: mPrice
          }
        ))


    }

    , [itemName, mPrice]
  );


  return (
    <form className='add-item-pop' onSubmit={(e) => handleAddPopSubmit(e)}>
      <button className='cancel-add-item-pop' onClick={() => cancelAddItemPop()}><img className='cancel-icon' src={cancelIcon} /></button>

      <h1>اضف الى المخزن </h1>
      <h2>{newAddedItem.name}</h2>

      <div className='add-account-form'>

        <div>

          <div className='form-label labels'>

            <label style={{ display: 'flex', flexDirection: 'row' }}>

              <div>
                رول
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
                سجاد
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

            {parameter === 'units' &&
              <div>
                <input className='input' type="number" name="length" step="0.1" placeholder={1}
                  onChange={(e) => setItemName(() => ({
                    ...itemName,
                    length: e.target.value
                  }))} />طول
              </div>}
            {parameter === 'units' ?
              <div>
                <input className='input' type="number" name="width" step="0.1" placeholder={1} onChange={(e) => setItemName(() => ({
                  ...itemName,
                  width: e.target.value
                }))} /> عرض
              </div>
              :
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <label><input name='width' type='radio' value={0.6} onChange={(e) => setItemName((p) => ({ ...p, width: e.target.value }))} /> 0.6</label>
                <label><input name='width' type='radio' value={0.8} onChange={(e) => setItemName((p) => ({ ...p, width: e.target.value }))} /> 0.8</label>
                <label><input name='width' type='radio' value={1.0} onChange={(e) => setItemName((p) => ({ ...p, width: e.target.value }))} /> 1.0</label>
                <label><input name='width' type='radio' value={1.2} onChange={(e) => setItemName((p) => ({ ...p, width: e.target.value }))} /> 1.2</label>
                <label><input name='width' type='radio' value={1.5} onChange={(e) => setItemName((p) => ({ ...p, width: e.target.value }))} /> 1.5</label>
              </div>
            }
          </label>
            <label className='form-label'><input className='input' type="text" name="name" placeholder='سجل اسم' onChange={(e) => setItemName(() => ({
              ...itemName,
              name: e.target.value
            }))} /></label>
            <label className='form-label'>
              <input className='input' type="text" name="description" placeholder='اكتب وصف' onChange={(e) => handleInputChange(e)} />
            </label>
          </div>




          <div className='form-label'>
            جنيه<input className='input' type="number" name="price_unit" placeholder='سعر المتر'
              style={{ height: "30px" }} step={1} min={0} value={mPrice}
              onChange={(e) => {
                setMPrice(e.target.value)
              }} />{parameter === 'units' ? (itemName.width != 1 && itemName != 1 ? 'سعر المتر' : 'سعر القطعة') : 'سعر المتر'}
          </div>
          <div className='form-label'>
            {
              parameter === 'length' ?
                <div>
                  الطول<input className='input' type="number" step={0.1} name="quantity_stock" placeholder='حدد الطول' value={newAddedItem.quantity_stock} onChange={(e) => { setNewAddedItem((p) => ({ ...p, quantity_stock: e.target.value })) }} /> متر
                </div>
                :
                <div>
                  وحدة<input className='input' step={1} type="number" min={0} name="quantity_stock" placeholder='حدد الكمية' value={newAddedItem.quantity_stock} onChange={(e) => { setNewAddedItem((p) => ({ ...p, quantity_stock: e.target.value })) }} />
                </div>
            }
          </div>
          <div>{newAddedItem.unit === 'units' && `${newAddedItem.price_unit} سعر السجادة`}</div>

          <div className='form-label'><button onClick={(e) => parameter != '' && handleAddPopSubmit(e)} type="submit">أضف</button></div>
        </div>
      </div>
    </form>
  );
}
export default AddItemPop