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
import { useTwapHistoryContext } from '@/context/twapHistoryContext';
import { timestampToDateTime } from '@/utils/toHumanReadableTime';

interface Column {
  id:
    | 'coin'
    | 'size'
    | 'executedSize'
    | 'averagePrice'
    | 'runningTimeTotal'
    | 'reduceOnly'
    | 'creationTime'
    | 'Terminate';
  label: string;
  align?: 'right' | 'center' | 'left';
}

const columns: Column[] = [
  { id: 'coin', label: 'Coin', align: 'center' },
  { id: 'size', label: 'Size', align: 'center' },
  { id: 'executedSize', label: 'Executed Size', align: 'center' },
  { id: 'averagePrice', label: 'Average Price', align: 'center' },
  { id: 'runningTimeTotal', label: 'Running Time/Total', align: 'center' },
  { id: 'reduceOnly', label: 'Reduce Only', align: 'center' },
  { id: 'creationTime', label: 'Creation Time', align: 'center' },
  { id: 'Terminate', label: 'Terminate', align: 'center' },
];

const row: any[] = [
  //   {
  //     coin: "BTC",
  //     size: "0.1",
  //     executedSize: "0.1",
  //     averagePrice: "0.1",
  //     runningTimeTotal: "0.1",
  //     reduceOnly: "0.1",
  //     creationTime: "0.1",
  //     Terminate: "0.1",
  //   },
];

const TwapComponentTable = () => {
  //------use Context Hooks
  const { twapHistoryData, loadingTwapData } = useTwapHistoryContext();
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
            {loadingTwapData ? (
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
            ) : !loadingTwapData && twapHistoryData.length === 0 ? (
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
            ) : !loadingTwapData && twapHistoryData.length !== 0 ? (
              <>
                {twapHistoryData.history.map((row: any, index: any) => {
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
                      {/* <TableCell>{timestampToDateTime(row.time)}</TableCell> */}
                      <TableCell>{row.state.coin}</TableCell>
                      <TableCell>{row.state.sz}</TableCell>
                      <TableCell>{row.state.executedSz}</TableCell>
                      <TableCell>{'- -'}</TableCell>
                      <TableCell>
                        {row.state.minutes === 60
                          ? '1 hour'
                          : row.state.minutes + ' minutes'}
                      </TableCell>
                      <TableCell>{row.state.reduceOnly? 'Yes' : 'No'}</TableCell>
                      <TableCell>{'- -'}</TableCell>
                      <TableCell>{'- -'}</TableCell>
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

export default TwapComponentTable;
