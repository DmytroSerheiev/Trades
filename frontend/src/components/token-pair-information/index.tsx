import React, { useState } from 'react';
import SingleTokenPairInfo from './singleTokenPairInfo';
import TokenPairsInfoTable from './tokenPairsInfoTable';
import { Box } from '@mui/material';

const TokenPairInformation = () => {
  const [tableISOpen, setTableISOpen] = useState(false);

  const toggleTablePairs = () => {
    setTableISOpen((prev) => !prev);
  };

  return (
    <Box sx={{ position: 'relative' }}>
      <SingleTokenPairInfo
        tableISOpen={tableISOpen}
        toggleTablePairs={toggleTablePairs}
      />
      {tableISOpen && (
        <TokenPairsInfoTable
          handleClose={toggleTablePairs}
          tableISOpen={tableISOpen}
        />
      )}
    </Box>
  );
};

export default TokenPairInformation;
