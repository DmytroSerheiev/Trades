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
import { useTradeHistoryContext } from '@/context/tradeHistoryContext';
import { timestampToDateTime } from '@/utils/toHumanReadableTime';

interface Column {
  id:
    | 'time'
    | 'coin'
    | 'direction'
    | 'price'
    | 'size'
    | 'tradeValue'
    | 'fee'
    | 'closedPNL';
  label: string;
  align?: 'right' | 'center' | 'left';
}

const columns: Column[] = [
  { id: 'time', label: 'Time', align: 'center' },
  { id: 'coin', label: 'Coin', align: 'center' },
  { id: 'direction', label: 'Direction', align: 'center' },
  { id: 'price', label: 'Price', align: 'center' },
  { id: 'size', label: 'Size', align: 'center' },
  { id: 'tradeValue', label: 'Trade Value', align: 'center' },
  { id: 'fee', label: 'Fee', align: 'center' },
  { id: 'closedPNL', label: 'Closed PNL', align: 'center' },
];

const TradeHistoryComponentTable = () => {
  //------use Context Hooks------
  const { tradeHistoryData, loadingTradeHistoryData } =
    useTradeHistoryContext();
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
            {loadingTradeHistoryData ? (
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
            ) : !loadingTradeHistoryData && tradeHistoryData.length === 0 ? (
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
            ) : !loadingTradeHistoryData && tradeHistoryData.length !== 0 ? (
              <>
                {tradeHistoryData.fills.map((row: any, index: any) => {
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
                      <TableCell>{row.dir}</TableCell>
                      <TableCell>{row.px}</TableCell>
                      <TableCell>{row.sz}</TableCell>
                      <TableCell>{row.tradeValue ? '' : '- -'}</TableCell>
                      <TableCell>{row.fee}</TableCell>
                      <TableCell>{row.closedPnl}</TableCell>
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

export default TradeHistoryComponentTable;
