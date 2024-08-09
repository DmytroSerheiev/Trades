import React from 'react';
import { useHyperLiquidContext } from '@/context/hyperLiquidContext';
import { SwitchTradingAccWrapper } from '@/styles/navbar.styles';
import { Box, ClickAwayListener } from '@mui/material';
import { useAddress, useDisconnect } from '@thirdweb-dev/react';
import toast from 'react-hot-toast';
import { useSwitchTradingAccount } from '@/context/switchTradingAccContext';

interface SwitchTradingAccountModalProps {
  onClose: () => void;
}

const SwitchTradingAccountModal: React.FC<SwitchTradingAccountModalProps> = ({
  onClose,
}) => {
  //------Third Web Hooks------
  const disconnect = useDisconnect();
  const userAddress = useAddress();

  //------context Hooks------
  const { subaccounts } = useHyperLiquidContext();
  const { currentAccount, switchAccountHandler } = useSwitchTradingAccount();

  //copy address to clipboard
  const handleCopy = (
    userAddress: string | undefined,
    event: React.MouseEvent<HTMLImageElement>
  ) => {
    if ((event.target as HTMLImageElement).tagName === 'IMG' && userAddress) {
      navigator.clipboard.writeText(userAddress);
      toast.success('Copied to clipboard');
    }
  };

  //switch trading account to master or sub account
  const handleSwitchTradingAcc = (
    event: React.MouseEvent<HTMLImageElement>,
    address: string | any,
    name: string | any
  ) => {
    try {
      if ((event.target as HTMLImageElement).tagName !== 'IMG') {
        //switch account
        switchAccountHandler(address, name);

        //close modal after switching account
        onClose();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ClickAwayListener onClickAway={onClose}>
      <SwitchTradingAccWrapper>
        <Box
          className="tradingAccItems"
          onClick={(event: React.MouseEvent<HTMLImageElement>) => {
            handleSwitchTradingAcc(event, userAddress, 'Master');
          }}
        >
          <label>Master</label>
          <Box className="master">
            <label>
              {currentAccount.address?.slice(0, 6) +
                '...' +
                currentAccount.address?.slice(-4)}
            </label>
            <img
              src="/CopyIcon.png"
              onClick={(event) => handleCopy(currentAccount.address, event)}
            />
          </Box>
        </Box>

        {/*map subaccounts*/}
        {subaccounts.map((account, index) => (
          <Box
            key={index}
            className="tradingAccItems"
            onClick={(event: React.MouseEvent<HTMLImageElement>) =>
              handleSwitchTradingAcc(
                event,
                account.subAccountUser,
                account.name
              )
            }
          >
            <label>Sub</label>
            <label>{account.name}</label>
          </Box>
        ))}
        <Box
          onClick={disconnect}
          sx={{
            display: 'flex',

            ':hover': {
              span: {
                color: '#00FF9F',
              },
            },
          }}
        >
          <span>Disconnect</span>
        </Box>
      </SwitchTradingAccWrapper>
    </ClickAwayListener>
  );
};

export default SwitchTradingAccountModal;
