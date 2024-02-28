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

  // Filter options to include only items with id
  const optionsWithId = props.options.filter(option => option.name && option.id !== undefined);

  return (
    <div>
      <Autocomplete
        value={value}
        onChange={(event, newValue) => {
          const newObj = optionsWithId.filter((x) => x == newValue)[0]
          setValue(newObj);
          handleNewItemPop(event, newObj.id)
        }}
        disablePortal
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
        id="controllable-states-demo"
        options={optionsWithId} // Pass filtered options
        getOptionLabel={(option) => option.name} // Display only name
        sx={{ width: "38vw", zIndex: 10000 }}
        renderInput={(params) => <TextField {...params} />}
      />
    </div>
  );
}


