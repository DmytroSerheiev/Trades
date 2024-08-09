//
import React, { createContext, useContext, useEffect, useState } from 'react';
import { AllWebData2 } from '../../types/hyperliquid';
import { useAddress, useChainId } from '@thirdweb-dev/react';

interface WebDataProps {
  webData2: AllWebData2 | any;
  loadingWebData2: boolean;
}

const WebDataContext = createContext({} as WebDataProps);

export const useWebDataContext = () => {
  const context = useContext(WebDataContext);
  if (!context) {
    throw new Error('context must be used within a WebDataProvider');
  }
  return context;
};

const WebDataProvider = ({ children }: { children: React.ReactNode }) => {
  const [webData2, setWebData2] = useState<any>([]);
  const [loadingWebData2, setLoadingWebData2] = useState<boolean>(true);
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
            type: 'webData2',
            user: userAddress,
          },
        });
        ws.send(message);
      };

      // Listen for messages from the WebSocket server
      ws.onmessage = (event) => {
        setLoadingWebData2(true);
        const message = JSON.parse(event.data);
        const data = message.data;

        if (message.channel === 'webData2') {
          if (data) {
            setWebData2(data);
            setLoadingWebData2(false);
          }
        } else if (message.channel === 'error') {
          setLoadingWebData2(false);
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
      setLoadingWebData2(false);
      setWebData2([]);
    }
  }, [userAddress]);

  return (
    <WebDataContext.Provider
      value={{
        webData2,
        loadingWebData2,
      }}
    >
      {children}
    </WebDataContext.Provider>
  );
};

export default WebDataProvider;
