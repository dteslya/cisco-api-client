import React, { useState, useContext } from 'react';

import { Box, Form, FormField, Button, TextArea } from 'grommet';
import { trackPromise } from 'react-promise-tracker';
// Import Context
import { AppContext } from '../../App'

export const PidInput = () => {

  const { setEoxdata } = useContext(AppContext);
  const [value, setValue] = useState({});

  // Looks up .env.local file when in development environment
  const backend_url = process.env.REACT_APP_BACKEND_URL;
  return (
    <Box width="medium" fill="horizontal" pad="medium">
      <Form
        validate="blur"
        value={value}
        onChange={nextValue => setValue(nextValue)}
        onReset={() => setValue({ pids: "" })}
        onSubmit={() => {
          setEoxdata([])
          trackPromise(
            fetch(`${backend_url}/eox/`, {
              method: 'POST',
              headers: {
                'Content-type': 'application/json',
              },
              // Remove spaces and newlines from input. 
              // Note that JSON.stringify escapes newlines (e.g. \n becomes \\n)
              body: JSON.stringify(value).replace(/\s/g, '').replace(/(\\r\\n|\\n|\\r)/gm, ",")
            })
              .then(res => res.json())
              .then(setEoxdata)
          )
        }
        }
      >
        <FormField
          name="pids"
          htmlfor="text-input-id"
          label="Enter Product IDs"
          htmlFor="text-area"
          component={TextArea}
          placeholder="WS-C6506-E,CISCO2901/K9"
          required
          validate={[
            { regexp: /^[a-z0-9]*[a-z0-9/-]*\s*,*\s*[a-z0-9]+[a-z0-9/-]*\s*/i },
            name => {
              if (name && name.length === 1) return 'must be >1 character';
              return undefined;
            },
          ]}
        />
        <Box direction="row" justify="between" margin={{ top: 'medium' }}>
          <Button type="submit" primary label="Submit" />
          <Button type="reset" label="Reset" />
        </Box>
      </Form>
    </Box>
  );
}

export default PidInput;
