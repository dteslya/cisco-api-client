import React, { useContext } from 'react';

import { Layer, Text, Box, DataTable } from 'grommet';
import { StatusCritical } from 'grommet-icons'
// Import Context
import { AppContext } from '../../App';
import { usePromiseTracker } from 'react-promise-tracker';

export const ListEOL = () => {
  const eoxdata = useContext(AppContext);
  const { promiseInProgress } = usePromiseTracker();

  // items to display
  const step = 10

  // define datatable columns
  const columns = [
    {
      property: 'key',
      header: 'Num',
      primary: true,
      size: "xxsmall"
    },
    {
      property: 'EOLProductID',
      header: "Device Product Number",
      size: "medium"
    },
    {
      property: 'EOXExternalAnnouncementDate',
      header: 'End Of Life',
      size: "xsmall"
    },
    {
      property: 'EndOfSaleDate',
      header: 'End Of Sale',
      size: "xsmall"
    },
    {
      property: 'LastDateOfSupport',
      header: 'End Of Support',
      size: "xsmall"
    },
    {
      property: 'MigrationProductName',
      header: 'Recommended Replacement'
    }

  ]
  return (
    <Box align="center" fill="horizontal" pad="medium" flex>
      <DataTable
        columns={columns.map(c => ({
          ...c,
          search: c.property === 'EOLProductID',
        }))}
        data={Array.isArray(eoxdata.eoxdata) ? eoxdata.eoxdata : []}
        step={step}
        size="medium"
        sortable
        // show spinner when loading
        placeholder={
          !Array.isArray(eoxdata.eoxdata) ? (
            //<Box>
            //  <StatusCritical /><Text weight="bold">Error fetching data</Text>
            //</Box>
            <Layer
              //position="top"
              modal={false}
              margin={{ vertical: 'medium', horizontal: 'small' }}
              //onEsc={onClose}
              responsive={false}
              plain
            >
              <Box
                align="center"
                direction="row"
                gap="small"
                justify="between"
                round="medium"
                elevation="medium"
                pad={{ vertical: 'xsmall', horizontal: 'small' }}
                background="status-critical"
              >
                <Box align="center" direction="row" gap="xsmall">
                  <StatusCritical />
                  <Text weight="bold">
                    Error fetching data
                  </Text>
                </Box>
              </Box>
            </Layer>
          )
            : promiseInProgress ? (
              <Box
                fill
                align="center"
                justify="center"
                direction="row"
                pad="large"
                gap="small"
                background={{ color: 'background-front', opacity: 'strong' }}
              >
                <Box
                  direction="row"
                  border={[
                    { side: 'all', color: 'transparent', size: 'medium' },
                    { side: 'horizontal', color: 'brand', size: 'medium' },
                  ]}
                  pad="small"
                  round="full"
                  animation={{ type: 'rotateRight', duration: 1500 }}
                />
                <Text weight="bold">Loading ...</Text>
              </Box>
            )
              : undefined
        }
        onMore={() => { console.log(`InfiniteScroll fires onMore after loading ${step} items`) }} />
    </Box>
  );
}

export default ListEOL;