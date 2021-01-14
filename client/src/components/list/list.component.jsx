import React, { useContext } from 'react';

import { Box, DataTable } from 'grommet';

// Import Context
import { AppContext } from '../../App';

export const ListEOL = () => {
    const eoxdata = useContext(AppContext);

    const columns = [
        {
            property: 'EOLProductID',
            header: "Device Product Number",
            primary: true,
        },
        {
            property: 'EOXExternalAnnouncementDate',
            header: 'End Of Life',
        },
        {
            property: 'EndOfSaleDate',
            header: 'End Of Sale'
        },
        {
            property: 'LastDateOfSupport',
            header: 'End Of Support'
        },
        {
            property: 'MigrationProductName',
            header: 'Recommended Replacement'
        }

    ]
    //console.log("EOX list:", eoxdata);
    return (
        <Box align="center" pad="large">
            <DataTable columns={columns} data={eoxdata.eoxdata} step={10} />
        </Box>
    );
}

export default ListEOL;