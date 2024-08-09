import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAddress } from '@thirdweb-dev/react';

// Define the context type
type SwitchAccountContextType = {
  currentAccount: {
    address: string;
    name: string;
  };
  switchAccountHandler: (address: string, name: string) => void;
};

// Create the context
const SwitchAccountContext = createContext({} as SwitchAccountContextType);

// Custom hook to access the context
export const useSwitchTradingAccount = () => {
  const context = useContext(SwitchAccountContext);
  if (!context) {
    throw new Error(
      'useSwitchTradingAccount must be used within a SwitchAccountProvider'
    );
  }
  return context;
};

// Create the context provider component
const SwitchAccountProvider = ({ children }: { children: React.ReactNode }) => {
  const userAddress = useAddress();

  //by default  set current account to master when adress from userAddress is available
  const [currentAccount, setCurrentAccount] = useState({
    address: userAddress ? userAddress : '',
    name: userAddress ? userAddress : '',
  });

  // Handler to switch the current account
  const switchAccountHandler = (address: string, name: string) => {
    setCurrentAccount({ address, name });
    console.log(`Switched to account: ${name}`, address);
  };

  useEffect(() => {
    if (userAddress) {
      setCurrentAccount({ address: userAddress, name: 'Master' });
    }
  }, [userAddress]);

  return (
    <SwitchAccountContext.Provider
      value={{ currentAccount, switchAccountHandler }}
    >
      {children}
    </SwitchAccountContext.Provider>
  );
};

export default SwitchAccountProvider;
