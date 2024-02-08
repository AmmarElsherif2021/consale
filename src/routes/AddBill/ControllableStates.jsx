import { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Placeholder } from 'react-bootstrap';

export default function ControllableStates(props) {
  const { handleNewItemPop } = props;
  const [value, setValue] = useState({});
  useEffect(() => console.log('value changed'), [value])
  const [inputValue, setInputValue] = useState('');
  useEffect(() => console.log('input value changed'), [inputValue])

  return (
    <div>

      <Autocomplete
        value={value}
        onChange={(event, newValue) => {
          const newObj = props.options.filter((x) => x == newValue)[0]
          setValue(newObj);
          console.log('Selected item:', newValue);
          console.log('Selected item ID:', newObj.id);
          console.log('Selected item name:', newObj.name);
          handleNewItemPop(event, newObj.id)
        }}
        disablePortal
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
        id="controllable-states-demo"
        options={props.options}
        getOptionLabel={(option) => option.name}
        sx={{ width: 500, zIndex: 10000 }}
        renderInput={(params) => <TextField {...params} />}
      />
    </div>
  );
}
