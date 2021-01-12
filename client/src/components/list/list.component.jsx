import React, { useState, useEffect, useContext } from 'react';
import { trackPromise } from 'react-promise-tracker';

import { Box, DataTable } from 'grommet';

// Import Context
import { AppContext } from '../../App';

export const ListEOL = () => {
    const [eoxlist, setEoxList] = useState([]);
    const { state } = useContext(AppContext);
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
    useEffect(() => {
        trackPromise(
            fetch('http://localhost:8000/eox/').then(res => res.json()).then(data => {
                setEoxList(data.data);
            })
        );
    }, [state]);
    console.log("State:", state);
    console.log("EOX list:", eoxlist);
    return (
        <Box align="center" pad="large">
            <DataTable columns={columns} data={eoxlist} step={10} />
        </Box>
    );
}

export default ListEOL;