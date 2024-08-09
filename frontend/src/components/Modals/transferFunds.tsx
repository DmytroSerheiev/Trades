import React, { useEffect, useState } from 'react';
import { Box, ClickAwayListener, styled } from '@mui/material';
import { IconsStyles, InnerBox, ModalWrapper } from './styles';
import { GreenBtn, TextBtn } from '@/styles/common.styles';
import BigNumber from 'bignumber.js';
import HandleSelectItems from '../handleSelectItems';
import Loader from '../loaderSpinner';
import { AccountProps } from '@/types/hyperliquid';
import { useWebDataContext } from '@/context/webDataContext';

interface ModalProps {
  onClose: () => void;
  onConfirm?: () => void;
  amount?: number;
  setAmount?: React.Dispatch<React.SetStateAction<number>>;
  masterAccount?: AccountProps;
  subAccount?: AccountProps;
  allAccountsData?: any;
  isLoading?: boolean;
  setIsDeposit: React.Dispatch<React.SetStateAction<boolean>>;
  setActiveToAccData: React.Dispatch<React.SetStateAction<AccountProps>>; // State to hold active data for the selected "To" account
  activeFromAccData: AccountProps; // State to hold active data for the selected "From" account
  setActiveFromAccData: React.Dispatch<
    React.SetStateAction<AccountProps> // State to hold active data for the selected "From" account
  >;
  isDeposit: boolean;
}

const TransferFunds: React.FC<ModalProps> = ({
  onClose,
  onConfirm,
  amount,
  setAmount,
  masterAccount,
  subAccount,
  allAccountsData,
  isLoading,
  setIsDeposit,
  setActiveToAccData,
  activeFromAccData,
  setActiveFromAccData,
  isDeposit,
}) => {
  const { webData2 } = useWebDataContext();

  // State to manage the selected "From" account
  const [selectFromAcc, setSelectFromAcc] = useState<string>(
    `${masterAccount?.name}`
  );

  // State to manage the selected "To" account
  const [selectToAcc, setSelectToAcc] = useState<string>(`${subAccount?.name}`);

  // Function to get active account data by account name
  const getActiveAccountData = (accountName: string) => {
    return allAccountsData.find((acc: any) => acc.name === accountName);
  };

  // Function to check if the input amount is greater than the balance
  const isInputAmountGreaterThanBalance =
    new BigNumber(amount || 0).isGreaterThan(
      new BigNumber(activeFromAccData?.equity)
    ) || parseFloat(String(amount)) === 0;

  // Function to set the input amount to the maximum available balance
  //{Number(webData2.clearinghouseState?.withdrawable).toFixed(2)}
  let withdrawable = Number(webData2.clearinghouseState?.withdrawable);

  const handleMaxClick = () => {
    if (activeFromAccData.name === 'Master Account') {
      setAmount?.(withdrawable);
    } else {
      if (Number(activeFromAccData.equity) > 0) {
        setAmount?.(activeFromAccData.equity);
      }
    }
  };

  // Function to switch the selected "From" and "To" accounts
  const handleSwitchAccounts = () => {
    setSelectFromAcc(selectToAcc);
    setSelectToAcc(selectFromAcc);
  };

  // Update active account data when selected accounts change
  useEffect(() => {
    setActiveFromAccData(getActiveAccountData(selectFromAcc));
    setActiveToAccData(getActiveAccountData(selectToAcc));
  }, [selectFromAcc, selectToAcc]);

  useEffect(() => {
    setIsDeposit(selectFromAcc === 'Master Account');
  }, [selectFromAcc]);

  //TODO: Check the isDeposit, selectFromAcc, selectToAcc and disable button

  return (
    <ModalWrapper>
      <ClickAwayListener onClickAway={onClose}>
        <InnerBox>
          <CloseIcon id="closeIcon" onClick={onClose} sx={IconsStyles}>
            <img src="/closeIcon.svg" alt="X" />
          </CloseIcon>
          <HeaderDivider />
          <ContentBox>
            <h1>Transfer USDC</h1>
            <Box className="switcher_box">
              <Box className="from_to">
                <label>From</label>
                <HandleSelectItems
                  toLowerCase={true}
                  selectItem={selectFromAcc}
                  setSelectItem={setSelectFromAcc}
                  selectDataItems={allAccountsData.map(
                    (item: any) => item.name
                  )}
                  className="acc_name"
                  styles={{
                    border: 'none',
                  }}
                />
              </Box>
              <img
                src="/SwitchIcon.png"
                alt="switch"
                onClick={handleSwitchAccounts}
              />
              <Box className="from_to">
                <label>To</label>
                <HandleSelectItems
                  toLowerCase={true}
                  selectItem={selectToAcc}
                  setSelectItem={setSelectToAcc}
                  selectDataItems={allAccountsData.map(
                    (item: any) => item.name
                  )}
                  className="acc_name"
                  styles={{
                    border: 'none',
                  }}
                />
              </Box>
            </Box>
            <Box className="amount_box">
              <input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount?.(parseFloat(e.target.value))}
              />
              <TextBtn sx={{ color: '#049260' }} onClick={handleMaxClick}>
                Max
              </TextBtn>
            </Box>
            <AvailableBalanceStyles>
              <span>Available to transfer</span>
              <span>
                {activeFromAccData.name === 'Master Account'
                  ? withdrawable.toFixed(2)
                  : Number(activeFromAccData?.equity).toFixed(2)}
              </span>
            </AvailableBalanceStyles>
          </ContentBox>
          <ActionBox>
            <GreenBtn
              disabled={
                isInputAmountGreaterThanBalance || String(amount).trim() === ''
              }
              onClick={onConfirm}
            >
              {isLoading ? <Loader /> : 'Confirm'}
            </GreenBtn>
          </ActionBox>
        </InnerBox>
      </ClickAwayListener>
    </ModalWrapper>
  );
};

export default TransferFunds;

//styles
const CloseIcon = styled(Box)(() => ({
  cursor: 'pointer',
}));

const HeaderDivider = styled(Box)(() => ({
  width: '100%',
  height: '40px',
  borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
}));

const ContentBox = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  padding: '30px 20px',
  borderBottom: '1px solid rgba(255, 255, 255, 0.2)',

  h1: {
    fontFamily: 'Sora',
    fontWeight: '400',
    fontSize: '20px',
    textAlign: 'center',
  },

  '.switcher_box': {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    marginTop: '20px',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',

    img: {
      position: 'absolute',
      cursor: 'pointer',
      left: '50%',
      transform: 'translateX(-50%)',
    },

    '.from_to': {
      display: 'flex',
      flexDirection: 'column',
    },

    label: {
      color: '#B2AEAE',
      fontFamily: 'Sora',
      fontWeight: '400',
      fontSize: '15px',
    },

    '.acc_name': {
      marginTop: '10px',
      background: '#0F1A1F',
      fontFamily: 'Sora',
      fontWeight: '400',
      fontSize: '15px',
      padding: '5px 8px',
    },
  },

  '.amount_box': {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    height: '38px',
    padding: '0 0 0 10px',
    border: '1px solid #FFFFFF38',
    borderRadius: '4px',
    justifyContent: 'space-between',
    marginTop: '20px',

    input: {
      outline: 'none',
      border: 'none',
      height: '100%',
      width: '80%',
      padding: '0 0 0 10px',
      background: 'inherit',
      color: '#fff',
      fontFamily: 'Sora',
      fontWeight: '400',
      fontSize: '14px',

      '::placeholder': {
        color: '#fff',
      },
    },
  },
}));

const ActionBox = styled(Box)(() => ({
  display: 'flex',
  padding: '10px 20px',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',

  button: {
    width: '100%',
  },
}));

const AvailableBalanceStyles = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  marginTop: '10px',

  fontFamily: 'Sora',
  fontWeight: '400',
  fontSize: '14px',
}));
