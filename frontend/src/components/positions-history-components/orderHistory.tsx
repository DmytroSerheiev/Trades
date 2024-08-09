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
import { timestampToDateTime } from '@/utils/toHumanReadableTime';
import { useOrderHistoryContext } from '@/context/orderHistoryContext';

interface Column {
  id:
    | 'time'
    | 'type'
    | 'coin'
    | 'direction'
    | 'size'
    | 'originalSize'
    | 'orderValue'
    | 'price'
    | 'triggerCondition'
    | 'tpsl'
    | 'status'
    | 'Order ID';
  label: string;
  align?: 'right' | 'center' | 'left';
}

const columns: Column[] = [
  { id: 'time', label: 'Time', align: 'center' },
  { id: 'type', label: 'Type', align: 'center' },
  { id: 'coin', label: 'Coin', align: 'center' },
  { id: 'direction', label: 'Direction', align: 'center' },
  { id: 'size', label: 'Size', align: 'center' },
  { id: 'originalSize', label: 'Original Size', align: 'center' },
  { id: 'orderValue', label: 'Order Value', align: 'center' },
  { id: 'price', label: 'Price', align: 'center' },
  { id: 'triggerCondition', label: 'Trigger Condition', align: 'center' },
  { id: 'tpsl', label: 'TP/SL', align: 'center' },
  { id: 'status', label: 'Status', align: 'center' },
  { id: 'Order ID', label: 'Order ID', align: 'center' },
];

const row: any[] = [];

const OrderHistoryComponentTable = () => {
  const { orderHistoryData, loadingOrderHistory } = useOrderHistoryContext();
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
            {loadingOrderHistory ? (
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
            ) : !loadingOrderHistory && orderHistoryData.length === 0 ? (
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
            ) : !loadingOrderHistory && orderHistoryData.length !== 0 ? (
              <>
                {orderHistoryData.orderHistory.map((row: any, index: any) => {
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
                        {timestampToDateTime(row.order.timestamp)}
                      </TableCell>
                      <TableCell>{row.order.orderType}</TableCell>
                      <TableCell>{row.order.coin}</TableCell>
                      <TableCell>
                        {row.order.side === 'B' ? 'Long' : 'Short'}
                      </TableCell>
                      <TableCell>{row.order.sz}</TableCell>
                      <TableCell>{row.order.origSz}</TableCell>
                      <TableCell>
                        {(
                          Number(row.order.sz) * Number(row.order.limitPx)
                        ).toFixed(2)}
                      </TableCell>
                      <TableCell>{row.order.limitPx}</TableCell>
                      <TableCell>{row.order.triggerCondition}</TableCell>
                      <TableCell>{'- -'}</TableCell>
                      <TableCell>
                        {row.status.charAt(0).toUpperCase() +
                          row.status.slice(1)}
                      </TableCell>
                      <TableCell>{row.order.oid}</TableCell>
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

export default OrderHistoryComponentTable;
