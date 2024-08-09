import React, { useEffect, useState } from 'react';
import { NavbarContainer, TradingAccSwitcherBtn } from '@/styles/navbar.styles';
import { Box } from '@mui/material';
import { TextBtn } from '@/styles/common.styles';
import WalletConnectModal from '../wallet-connect';
import SettingsModal from '../Modals/settingsModal';
import { useRouter } from 'next/router';
import { useAddress } from '@thirdweb-dev/react';
import UpDownIcon from '../../../public/upDownIcon';
import SwitchTradingAccountModal from '../Modals/switchTradingAccountModal';
import { useSwitchTradingAccount } from '@/context/switchTradingAccContext';

const Navbar = () => {
  //------Hooks------
  const userAddress = useAddress();
  const { currentAccount, switchAccountHandler } = useSwitchTradingAccount();

  //------Router------
  const router = useRouter();

  //------Local State------
  const [settingsModal, setSettingsModal] = useState(false);
  const [tradingAccModal, setTradingAccModal] = useState(false);

  const toggleSettingsModal = () => setSettingsModal((prev) => !prev);

  const toggleTradingAccModal = () => setTradingAccModal((prev) => !prev);

  useEffect(() => {
    if (!userAddress) {
      setTradingAccModal(false);
    }
  }, [userAddress]);

  return (
    <NavbarContainer>
      <Box className="logo" onClick={() => router.push('/')}>
        <img src="/PNL.GREEN.svg" alt="PNL.GREEN" />
      </Box>

      <Box className="external-links">
        <TextBtn className="active">Docs</TextBtn>
        <TextBtn>Twitter</TextBtn>
        <TextBtn>Discord</TextBtn>
        <TextBtn>Original Frontend</TextBtn>
      </Box>

      <Box className="user-config">
        {userAddress ? (
          <Box sx={{ position: 'relative' }}>
            <TradingAccSwitcherBtn
              tradingAccModal={tradingAccModal}
              onClick={toggleTradingAccModal}
            >
              {currentAccount.address === userAddress
                ? userAddress.slice(0, 6) + '...' + userAddress.slice(-4)
                : `Sub: ${currentAccount.name}`}
              <Box className="icon">
                <UpDownIcon color="#fff" width="10" />
              </Box>
            </TradingAccSwitcherBtn>
            {tradingAccModal && (
              <SwitchTradingAccountModal
                onClose={() => setTradingAccModal(false)}
              />
            )}
          </Box>
        ) : (
          <WalletConnectModal />
        )}

        <img
          src="/userIcon.svg"
          alt="user"
          className="user-icon"
          onClick={() => router.push('/sub-accounts')}
        />
        <Box sx={{ position: 'relative' }}>
          <img
            src="/settingsIcon.svg"
            alt="settings"
            className="settings-icon"
            onClick={toggleSettingsModal}
          />
          {settingsModal && (
            <SettingsModal onClose={() => setSettingsModal(false)} />
          )}
        </Box>
        {/* <img src="/moreIcon.svg" alt="more" className="more-icon" /> */}
      </Box>
    </NavbarContainer>
  );
};

export default Navbar;
