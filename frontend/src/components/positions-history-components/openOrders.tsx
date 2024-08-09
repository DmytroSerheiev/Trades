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
import { useWebDataContext } from '@/context/webDataContext';
import { timestampToDateTime } from '../../../utils/toHumanReadableTime';

interface Column {
  id:
    | 'time'
    | 'type'
    | 'coin'
    | 'direction'
    | 'size'
    | 'originalPrice'
    | 'orderValue'
    | 'price'
    | 'triggerCondition'
    | 'tpsl';
  label: string;
  align?: 'right' | 'center' | 'left';
}

const columns: Column[] = [
  { id: 'time', label: 'Time', align: 'center' },
  { id: 'type', label: 'Type', align: 'center' },
  { id: 'coin', label: 'Coin', align: 'center' },
  { id: 'direction', label: 'Direction', align: 'center' },
  { id: 'size', label: 'Size', align: 'center' },
  { id: 'originalPrice', label: 'Original Price', align: 'center' },
  { id: 'orderValue', label: 'Order Value', align: 'center' },
  { id: 'price', label: 'Price', align: 'center' },
  { id: 'triggerCondition', label: 'Trigger Condition', align: 'center' },
  { id: 'tpsl', label: 'TP/SL', align: 'center' },
];

const OpenOrdersComponentTable = () => {
  const { webData2, loadingWebData2 } = useWebDataContext();

  const openOrdersData = webData2.openOrders;
  console.log(openOrdersData)

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
            {loadingWebData2 ? (
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
            ) : (!loadingWebData2 && webData2.length === 0) ||
              openOrdersData.length === 0 ? (
              <Box
                sx={{
                  color: '#fff',
                  fontFamily: 'Sora',
                  fontWeight: '400',
                  fontSize: '13px',
                  p: '10px',
                }}
              >
                No open orders yet
              </Box>
            ) : (
              <>
                {openOrdersData.map((row: any, index: any) => {
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
                      <TableCell>
                        {timestampToDateTime(row.timestamp)}
                      </TableCell>
                      <TableCell>{row.orderType}</TableCell>
                      <TableCell>{row.coin}</TableCell>
                      <TableCell>
                        {row.side === 'A' ? 'short' : 'Long'}
                      </TableCell>
                      <TableCell>{row.sz}</TableCell>
                      <TableCell>{row.origSz}</TableCell>
                      <TableCell>{''}</TableCell>
                      <TableCell>{row.limitPx}</TableCell>
                      <TableCell>{row.triggerCondition}</TableCell>
                      <TableCell>{'--'}</TableCell>
                    </TableRow>
                  );
                })}
              </>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default OpenOrdersComponentTable;
