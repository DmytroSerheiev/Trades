import React from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { useFundingHistoryContext } from '@/context/fundingHistoryContext';
import { timestampToDateTime } from '@/utils/toHumanReadableTime';

interface Column {
  id: 'time' | 'coin' | 'size' | 'direction' | 'payment' | 'rate';
  label: string;
  align?: 'right' | 'center' | 'left';
}

const columns: Column[] = [
  { id: 'time', label: 'Time', align: 'center' },
  { id: 'coin', label: 'Coin', align: 'center' },
  { id: 'size', label: 'Size', align: 'center' },
  { id: 'direction', label: 'Direction', align: 'center' },
  { id: 'payment', label: 'Payment', align: 'center' },
  { id: 'rate', label: 'Rate', align: 'center' },
];

const row: any[] = [];

const FundingHistoryComponentTable = () => {
  //------use Context Hooks-------
  const { loadingFundingHistoryData, fundingHistoryData } =
    useFundingHistoryContext();
  return (
    <Paper
      sx={{
        width: '100%',
        overflow: 'hidden',
        background: 'transparent',
      }}
    >
      <TableContainer sx={{ maxHeight: 300, paddingBottom: '60px' }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  sx={{
                    background: '#100e0e',
                    color: 'white',
                    padding: '10px',
                    borderBottom: '2px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loadingFundingHistoryData ? (
              <Box
                sx={{
                  color: '#fff',
                  fontFamily: 'Sora',
                  fontWeight: '400',
                  fontSize: '13px',
                  p: '10px',
                }}
              >
                loading...
              </Box>
            ) : !loadingFundingHistoryData &&
              fundingHistoryData.length === 0 ? (
              <Box
                sx={{
                  color: '#fff',
                  fontFamily: 'Sora',
                  fontWeight: '400',
                  fontSize: '13px',
                  p: '10px',
                }}
              >
                No open position yet
              </Box>
            ) : !loadingFundingHistoryData &&
              fundingHistoryData.length !== 0 ? (
              <>
                {fundingHistoryData.fundings.map((row: any, index: any) => {
                  return (
                    <TableRow
                      key={index}
                      sx={{
                        td: {
                          background: 'transparent',
                          color: 'white',
                          padding: '8px',
                          border: 'none',
                          textAlign: 'center',
                        },
                      }}
                    >
                      <TableCell>{timestampToDateTime(row.time)}</TableCell>
                      <TableCell>{row.coin}</TableCell>
                      <TableCell>
                        {row.szi}&nbsp;{row.coin}
                      </TableCell>
                      <TableCell>
                        {row.side === 'B'
                          ? 'Long'
                          : row.side === 'A'
                          ? 'Short'
                          : '- -'}
                      </TableCell>
                      <TableCell
                        sx={{
                          color:
                            Number(row.usdc) < 0
                              ? '#E10000 !important'
                              : 'green !important',
                        }}
                      >
                        {`${row.usdc < 0 ? '-' : ''}$${Math.abs(
                          row.usdc
                        ).toFixed(4)}`}
                      </TableCell>
                      <TableCell>{Number(row.fundingRate) + '%'}</TableCell>
                    </TableRow>
                  );
                })}
              </>
            ) : null}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default FundingHistoryComponentTable;
