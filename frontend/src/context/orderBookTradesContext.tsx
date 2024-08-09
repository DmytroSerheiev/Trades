//get data from websocket and pass it to the context

import React, { createContext, useContext, useEffect, useState } from 'react';
import { BookDataProps, WsTrades } from '@/types/hyperliquid';
import { usePairTokensContext } from './pairTokensContext';
import { useChainId } from '@thirdweb-dev/react';

interface OrderBookTradesProps {
  bookData: BookDataProps;
  tradesData: WsTrades[];
  loadingBookData: boolean;
}

const OrderBookTradesContext = createContext({} as OrderBookTradesProps);

export const useOrderBookTradesContext = () => {
  const context = useContext(OrderBookTradesContext);
  if (!context) {
    throw new Error(
      'useOrderBookTrades must be used within a OrderBookTradesProvider'
    );
  }
  return context;
};

const OrderBookTradesProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { pair, tokenPairs } = usePairTokensContext();
  const [bookData, setBookData] = useState<BookDataProps>({
    asks: [],
    bids: [],
  });

  const [tradesData, setTradesData] = useState<WsTrades | any>({});
  const [loadingBookData, setLoadingBookData] = useState<boolean>(true);

  const chainId = useChainId();

  //Subscribe to trades for a specific coin:
  //{ "method": "subscribe", "subscription": { "type": "trades", "coin": "<coin_symbol>" } }

  useEffect(() => {
    // Create a new WebSocket connection
    const ws = new WebSocket(
      chainId === 42161
        ? 'wss://api.hyperliquid.xyz/ws'
        : 'wss://api.hyperliquid-testnet.xyz/ws'
    );

    // When the WebSocket connection is open, send the subscribe message
    ws.onopen = () => {
      const message = JSON.stringify({
        method: 'subscribe',
        subscription: {
          type: 'trades',
          coin: `${tokenPairs[0]}`,
        },
      });
      ws.send(message);
    };

    // Listen for messages from the WebSocket server
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      const data = message.data;

      if (message.channel === 'trades') {
        if (data) {
          // Format the time to HH:MM:SS
          const tradesData = data.map((trade: WsTrades) => {
            const date = new Date(trade.time);
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');
            const newTime = `${hours}:${minutes}:${seconds}`;

            return {
              ...trade, //maintain the rest of the data
              time: newTime, // Replace the timestamp with the formatted time
            };
          });

          setTradesData(tradesData);
        }
      } else if (message.channel === 'error') {
        console.error('Error:', message.data);
        setTradesData(null);
      }
    };

    // Handle WebSocket errors
    ws.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };

    // Clean up the WebSocket connection when the component unmounts
    return () => {
      ws.close();
    };
  }, [pair]);

  useEffect(() => {
    // Create a new WebSocket connection

    const ws = new WebSocket(
      chainId === 42161
        ? 'wss://api.hyperliquid.xyz/ws'
        : 'wss://api.hyperliquid-testnet.xyz/ws'
    );

    // When the WebSocket connection is open, send the subscribe message
    ws.onopen = () => {
      const message = JSON.stringify({
        method: 'subscribe',
        subscription: {
          type: 'l2Book',
          coin: `${tokenPairs[0]}`,
          nSigFigs: 5,
        },
      });
      ws.send(message);
    };

    // Listen for messages from the WebSocket server
    ws.onmessage = (event) => {
      setLoadingBookData(true);
      const message = JSON.parse(event.data);
      const data = message.data.levels;

      if (message.channel === 'l2Book') {
        if (data) {
          const asks: any[] = data[1];
          const bids: any[] = data[0];

          setBookData({ asks, bids });
          setLoadingBookData(false);
        }
      } else if (message.channel === 'error') {
        setLoadingBookData(false);
        console.error('Error:', message.data);
        setBookData({ asks: [], bids: [] });
      }
    };

    // Handle WebSocket errors
    ws.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };

    // Clean up the WebSocket connection when the component unmounts
    return () => {
      ws.close();
    };
  }, [pair]);

  return (
    <OrderBookTradesContext.Provider
      value={{
        bookData,
        tradesData,
        loadingBookData,
      }}
    >
      {children}
    </OrderBookTradesContext.Provider>
  );
};

export default OrderBookTradesProvider;
