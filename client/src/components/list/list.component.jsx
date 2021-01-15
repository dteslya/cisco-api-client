import React, { useContext } from 'react';

import { Box, DataTable } from 'grommet';

// Import Context
import { AppContext } from '../../App';

export const ListEOL = () => {
    const eoxdata = useContext(AppContext);
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
                //columns={columns}
                columns={columns.map(c => ({
                    ...c,
                    search: c.property === 'EOLProductID',
                }))}
                data={eoxdata.eoxdata}
                step={step}
                size="medium"
                //resizeable
                sortable
                onMore={() => { console.log(`InfiniteScroll fires onMore after loading ${step} items`) }} />
        </Box>
    );
}

export default ListEOL;