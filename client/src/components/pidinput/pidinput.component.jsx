import React from 'react';

import { Box, Form, FormField, Button, TextArea} from 'grommet';

export const PidInput = () => {

  const [value, setValue] = React.useState({});

  return (
    <Form
      value={value}
      onChange={nextValue => setValue(nextValue)}
      onReset={() => setValue({pids: ""})}
      //onReset={() => console.log(value)}
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
        .then(res => console.log(res));
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
      />
      <Box direction="row" gap="medium">
        <Button type="submit" primary label="Submit" />
        <Button type="reset" label="Reset" />
      </Box>
    </Form>
  );
}


