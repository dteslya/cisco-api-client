import { React, useState, useEffect} from 'react';

import { Box, DataTable, Text } from 'grommet';

export const ListEOL = () => {
    const columns = [
        {
          property: 'EOLProductID',
          header: <Text>Device Product Number</Text>,
          primary: true,
        },
        {
          property: 'EOXExternalAnnouncementDate',
          header: 'EOL Date',
        },
    ]
    const [state, setState] = useState([]);
    useEffect(() => {
        async function fetchData() {
            const res = await fetch("http://localhost:8000/eox/");
            res
            .json()
            .then(res => setState(res.data))
        }
        fetchData();
    }, [])
    console.log(state);
        return (
        <Box align="center" pad="large">
          <DataTable columns={columns} data={state} step={10} />
        </Box>
    );
}