//
import React, { createContext, useContext, useEffect, useState } from 'react';
import { AllWebData2 } from '../../types/hyperliquid';
import { useAddress, useChainId } from '@thirdweb-dev/react';

interface OrderHistoryProps {
  orderHistoryData: AllWebData2 | any;
  loadingOrderHistory: boolean;
}
const OrderHistoryContext = createContext({} as OrderHistoryProps);

export const useOrderHistoryContext = () => {
  const context = useContext(OrderHistoryContext);
  if (!context) {
    throw new Error('context must be used within a OrderHistoryProvider');
  }
  return context;
};

const OrderHistoryProvider = ({ children }: { children: React.ReactNode }) => {
  const [orderHistoryData, setOrderHistoryData] = useState<any>([]);
  const [loadingOrderHistory, setLoadingOrderHistory] = useState<boolean>(true);
  const userAddress = useAddress();
  const chainId = useChainId();

  useEffect(() => {
    if (userAddress) {
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
            type: 'userHistoricalOrders',
            user: userAddress,
          },
        });
        ws.send(message);
      };

      // Listen for messages from the WebSocket server
      ws.onmessage = (event) => {
        setLoadingOrderHistory(true);
        const message = JSON.parse(event.data);
        const data = message.data;

        if (message.channel === 'userHistoricalOrders') {
          if (data) {
            setOrderHistoryData(data);
            setLoadingOrderHistory(false);
          }
        } else if (message.channel === 'error') {
          setLoadingOrderHistory(false);
          console.error('Error:', message.data);
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
    } else {
      setLoadingOrderHistory(false);
      setOrderHistoryData([]);
    }
  }, [userAddress]);

  return (
    <OrderHistoryContext.Provider
      value={{
        orderHistoryData,
        loadingOrderHistory,
      }}
    >
      {children}
    </OrderHistoryContext.Provider>
  );
};

export default OrderHistoryProvider;
