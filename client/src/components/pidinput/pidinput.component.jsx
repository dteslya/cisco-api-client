import React, { useState, useContext } from 'react';

import { Box, Form, FormField, Button, TextArea} from 'grommet';

// Import Context
import { AppContext } from '../../App'

export const PidInput = () => {
  
  const { dispatch } = useContext(AppContext);
  const [value, setValue] = useState({});

  return (
    <Form
      value={value}
      onChange={nextValue => setValue(nextValue)}
      onReset={() => setValue({pids: ""})}
      onSubmit={() => {
        console.log(value)
        fetch('http://localhost:8000/eox/', {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
          },
          body: JSON.stringify(value)
        })
        .then(res => res.json())
        .then(res => console.log(res))
        .then(res => dispatch({ type: 'UPDATE_EOX_LIST', data: res,}))
        .then(res => console.log("Dispatch here"));
        }
      }
    >
      <FormField
        name="pids"
        htmlfor="text-input-id"
        label="Enter Product IDs"
        htmlFor="text-area"
        component={TextArea}
        placeholder="Enter PID(s)"
        required
      />
      <Box direction="row" gap="medium">
        <Button type="submit" primary label="Submit" />
        <Button type="reset" label="Reset" />
      </Box>
    </Form>
  );
}

export default PidInput;
