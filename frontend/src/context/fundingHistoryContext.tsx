//
import React, { createContext, useContext, useEffect, useState } from 'react';
import { AllWebData2 } from '../../types/hyperliquid';
import { useAddress, useChainId } from '@thirdweb-dev/react';

interface FundingHistoryProps {
  fundingHistoryData: AllWebData2 | any;
  loadingFundingHistoryData: boolean;
}

const FundingHistoryContext = createContext({} as FundingHistoryProps);

export const useFundingHistoryContext = () => {
  const context = useContext(FundingHistoryContext);
  if (!context) {
    throw new Error('context must be used within a FundingHistoryProvider');
  }
  return context;
};

const FundingHistoryProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [fundingHistoryData, setFundingHistoryData] = useState<any>([]);
  const [loadingFundingHistoryData, setLoadingFundingHistoryData] =
    useState<boolean>(true);
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
            type: 'userFundings',
            user: userAddress,
          },
        });
        ws.send(message);
      };

      // Listen for messages from the WebSocket server
      ws.onmessage = (event) => {
        setLoadingFundingHistoryData(true);
        const message = JSON.parse(event.data);
        const data = message.data;

        if (message.channel === 'userFundings') {
          if (data) {
            setFundingHistoryData(data);
            setLoadingFundingHistoryData(false);
          }
        } else if (message.channel === 'error') {
          setLoadingFundingHistoryData(false);
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
      setLoadingFundingHistoryData(false);
      setFundingHistoryData([]);
    }
  }, [userAddress]);

  return (
    <FundingHistoryContext.Provider
      value={{
        fundingHistoryData,
        loadingFundingHistoryData,
      }}
    >
      {children}
    </FundingHistoryContext.Provider>
  );
};

export default FundingHistoryProvider;
