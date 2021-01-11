import React, { useState } from "react";
import {
    Box,
    Button,
    Collapsible,
    Heading,
    Grommet,
    Layer,
    Footer,
    Anchor,
    ResponsiveContext,
  } from 'grommet';
import { CircleQuestion, FormClose, Github } from 'grommet-icons';
import { PidInput } from './components/pidinput/pidinput.component';
import { Help } from './components/help/help.component';
import { ListEOL } from './components/list/list.component';
const theme = {
  global: {
    colors: {
      brand: '#01A460',
    },
    font: {
      family: 'Roboto',
      size: '18px',
      height: '20px',
    },
  },
};
const AppBar = (props) => (
  <Box
    tag='header'
    direction='row'
    align='center'
    justify='between'
    background='brand'
    pad={{ left: 'medium', right: 'small', vertical: 'small' }}
    elevation='medium'
    style={{ zIndex: '1' }}
    {...props}
  />
);
function App() {
  const [showSidebar, setShowSidebar] = useState(false);
  return (
    <Grommet theme={theme} themeMode="dark" full>
      <ResponsiveContext.Consumer>
        {size => (
      <Box fill>
        <AppBar>
          <Heading level='3' margin='none'>Cisco Support API Client</Heading>
          <Button
            icon={<CircleQuestion />}
            onClick={() => setShowSidebar(!showSidebar)}
          />        
        </AppBar>
        <Box direction='row' flex overflow={{ horizontal: 'hidden' }}>
          <Box flex align='center' justify='center'>
              <PidInput />
              <ListEOL />
          </Box>
          {(!showSidebar || size !== 'small') ? (
            <Collapsible direction="horizontal" open={showSidebar}>
              <Box
                flex
                width='medium'
                background='light-2'
                elevation='small'
                align='start'
                justify='center'
              >
                <Help />
              </Box>
            </Collapsible>
          ): (
            <Layer>
              <Box
                background='light-2'
                tag='header'
                justify='end'
                align='center'
                direction='row'
              >
                <Button
                  icon={<FormClose />}
                  onClick={() => setShowSidebar(false)}
                />
              </Box>
              <Box
                fill
                background='light-2'
                align='start'
                justify='center'
              >
                <Help />
              </Box>
            </Layer>
          )}
        </Box>
        <Footer justify="center" background="brand" pad="small">
          <Anchor href="https://github.com/dteslya/cisco-api" target="_blank"><Github /></Anchor>
        </Footer>
      </Box>
      )}
      </ResponsiveContext.Consumer>
    </Grommet>
  );
}

export default App;