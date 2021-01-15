import React, { useContext } from 'react';

import { Text, Box, DataTable } from 'grommet';

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
      { promiseInProgress ? (
        <DataTable
          columns={columns.map(c => ({
            ...c,
            search: c.property === 'EOLProductID',
          }))}
          data={eoxdata.eoxdata}
          step={step}
          size="medium"
          sortable
          placeholder={
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
          }
          onMore={() => { console.log(`InfiniteScroll fires onMore after loading ${step} items`) }} />
      ) : (
          <DataTable
            columns={columns.map(c => ({
              ...c,
              search: c.property === 'EOLProductID',
            }))}
            data={eoxdata.eoxdata}
            step={step}
            size="medium"
            sortable
            onMore={() => { console.log(`InfiniteScroll fires onMore after loading ${step} items`) }} />
        )
      }
    </Box>
  );
}

export default ListEOL;