import React from 'react';
import {
    Box,
    Markdown,
  } from 'grommet';

export const Help = () => {
  return (
    <Box pad="small">
      <Markdown>{
`## How to use

1. Enter Cisco device PIDs separated by commas
2. Press "Submit"
`}
      </Markdown>
    </Box>
  )
}
export default Help;