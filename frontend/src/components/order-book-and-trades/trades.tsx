import React from 'react';
import { StyledTable, TradesRows } from '@/styles/orderbook.styles';
import { Box } from '@mui/material';
import { useOrderBookTradesContext } from '@/context/orderBookTradesContext';
import { usePairTokensContext } from '@/context/pairTokensContext';

const Trades = () => {
  const { tradesData } = useOrderBookTradesContext();
  const { pair, tokenPairs } = usePairTokensContext();

  const handleDetailsClick = (index: any) => {
    // Implement your logic here
    console.log('Clicked on details for index:', index);
  };

  return (
    <Box
      style={{
        marginTop: '10px',
        maxHeight: '100%',
        overflowY: 'auto',
        overflowX: 'hidden',
      }}
    >
      <StyledTable fontSize="13px">
        <thead
          style={{
            position: 'sticky',
            top: '0',
            zIndex: '1',
            backgroundColor: '#131212',
          }}
        >
          <tr>
            <th>Price</th>
            <th>Size({tokenPairs[0].toString()})</th>
            <th>Time</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(tradesData) &&
            tradesData.map((trade, index) => (
              <TradesRows
                key={index}
                className="first-column"
                side={trade.side}
              >
                <td className="first-column">{trade.px}</td>
                <td>{trade.sz}</td>
                <td>{trade.time}</td>
                <td
                  className="details-icon"
                  onClick={() => handleDetailsClick(index)}
                >
                  <img src="/linkIcon.svg" alt="link" />
                </td>
              </TradesRows>
            ))}
        </tbody>
      </StyledTable>
    </Box>
  );
};

export default Trades;
