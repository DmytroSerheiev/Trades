import CreateSubAcc from '@/components/Modals/createSubAcc';
import RenameSubAccModal from '@/components/Modals/renameSubAcc';
import TransferFunds from '@/components/Modals/transferFunds';
import Layout from '@/components/layout';
import WalletConnectModal from '@/components/wallet-connect';
import { GreenBtn } from '@/styles/common.styles';
import {
  Accounts,
  ActionBtn,
  LinearBgColors,
  StyledAccTable,
  SubAccWrapper,
  SubAccountsInnerBox,
} from '@/styles/subAccounts.styles';
import { Box } from '@mui/material';
import { useAddress } from '@thirdweb-dev/react';
import React, { ReactElement, useEffect, useState } from 'react';
import { AccountProps, SubAccount } from '@/types/hyperliquid';
import toast from 'react-hot-toast';
import { useWebDataContext } from '@/context/webDataContext';
import Loader from '@/components/loaderSpinner';
import { useHyperLiquidContext } from '@/context/hyperLiquidContext';
import EstablishConnectionModal from '@/components/Modals/establishConnectionModal';
import { useSwitchTradingAccount } from '@/context/switchTradingAccContext';
import { useRouter } from 'next/router';

const bgImages = [
  {
    image: '/Ellipse1.svg',
    styles: {
      top: '0',
      left: '0px',
      width: '928px',
      height: '928px',
      '@media screen and (min-width: 1535px)': { height: 'calc(100vh - 70px)' },
    },
  },
  {
    image: '/Ellipse2.png',
    styles: {
      top: '-100px',
      left: '0px',
      width: '1000px',
      height: '1000px',
      opacity: 0.3,
    },
  },
  {
    image: '/Ellipse3.png',
    styles: { top: '0px', right: '0px', width: '400px', height: '400px' },
  },
  {
    image: '/Ellipse4.svg',
    styles: { bottom: '0px', right: '0px', width: '400px', height: '400px' },
  },
];

const SubAccounts = () => {
  const router = useRouter();

  //--------------------useContext hooks------------------
  const { webData2, loadingWebData2 } = useWebDataContext();
  const {
    subaccounts,
    hyperliquid,
    setReloadSubAccounts,
    establishedConnection,
    handleEstablishConnection,
  } = useHyperLiquidContext();
  const { switchAccountHandler } = useSwitchTradingAccount();

  // ------------------ Thirdweb Hooks ------------------
  const userAddress = useAddress();

  // ------------------ Local State ------------------
  const [isRenameSubAccModalOpen, setRenameSubAccModalOpen] = useState(false);
  const [renameAcc, setRenameAcc] = useState('');
  const [createSubAccModal, setcreateSubAccModal] = useState(false);
  const [createNewAcc, setCreateNewAcc] = useState('');
  const [isTransferModalOpen, setTransferModalOpen] = useState(false);
  const [amount, setAmount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [establishConnModal, setEstablishedConnModal] = useState(false);
  const [allAccountsData, setAllAccountsData] = useState<any>([]);
  const masterAccount: AccountProps = {
    name: 'Master Account',
    address: userAddress,
    equity: webData2.clearinghouseState?.marginSummary.accountValue,
  };
  const [subAccount, setSubAccount] = useState<AccountProps>({
    name: '',
    address: '',
    equity: '',
  });
  const [isDeposit, setIsDeposit] = useState(true);
  // State to hold active data for the selected "To" account
  const [activeToAccData, setActiveToAccData] = useState<AccountProps | any>(
    {}
  );
  // State to hold active data for the selected "From" account
  const [activeFromAccData, setActiveFromAccData] = useState<
    AccountProps | any
  >({});

  //toggleRenameSubAccModal
  const toggleRenameSubAccModal = (subaccount: SubAccount) => {
    setRenameSubAccModalOpen((prev) => !prev);
    setSubAccount({
      name: subaccount.name,
      address: subaccount.subAccountUser,
      equity: subaccount.clearinghouseState.marginSummary.accountValue,
    });
  };

  //toggleCreateSubAccModal
  const toggleCreateSubAccModal = () => {
    setcreateSubAccModal((prev) => !prev);
  };

  //toggleTransferModal
  const toggleTransferModal = (subaccount: SubAccount) => {
    if (!loadingWebData2) {
      setTransferModalOpen((prev) => !prev);
      setSubAccount({
        name: subaccount.name,
        address: subaccount.subAccountUser,
        equity: subaccount.clearinghouseState.marginSummary.accountValue,
      });
    }
  };

  //closeTransferModal
  const closeTransferModal = () => {
    if (isTransferModalOpen) {
      setAmount(0);
      setTransferModalOpen(false);
      setIsLoading(false);
    }
  };

  //create a SubAcc
  const createSubAccountHandler = async () => {
    try {
      setIsLoading(true);

      let { success, data, msg } = await hyperliquid.createSubAccount(
        createNewAcc
      );

      if (success) {
        // TODO: toast success message
        setIsLoading(false);
        toast.success('Sub-account created successfully');
        setReloadSubAccounts((prev) => !prev);
      } else {
        // TODO: toast error message
        if (msg?.includes('User or API')) {
          toast.error('User or API Wallet does not exist');
          setIsLoading(false);
        } else {
          toast.error((msg || 'Error ocured please try again').toString());
          setIsLoading(false);
        }
      }
      console.log({ success, data, msg });
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  //rename subaccount
  const handleSubAccountModify = async (subAccountUser: String) => {
    try {
      setIsLoading(true);

      let { success, data, msg } = await hyperliquid.subAccountModify(
        renameAcc,
        subAccountUser
      );

      if (success) {
        toast.success('Sub-account renamed successfully');

        // reload sub-accounts
        setReloadSubAccounts((prev) => !prev);

        setRenameSubAccModalOpen(false);
        setIsLoading(false);
        setRenameAcc('');
      } else {
        setIsLoading(false);
        toast.error((msg || 'Error ocured please try again').toString());
      }
      console.log({ success, data, msg });
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  //deposit to subaccount
  const subAccountTransfer = async () => {
    // subAccountTransfer
    try {
      setIsLoading(true);
      let subAccountUser = isDeposit
        ? activeToAccData.address
        : activeFromAccData.address;

      let usd = String(amount);

      let { success, data, msg } = await hyperliquid.subAccountTransfer(
        isDeposit,
        subAccountUser,
        usd
      );

      if (success) {
        setIsLoading(false);
        toast.success('Successfully transfered');
        setReloadSubAccounts((prev) => !prev);
        setTransferModalOpen((prev) => !prev);
      } else {
        setIsLoading(false);
        toast.error((msg || 'Error ocured please try again').toString());
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      toast.error('Error occured please try again');
    }
  };

  // Copy address to clipboard
  const copyAddress = (
    address: string | undefined,
    from?: 'master' | 'sub-acc'
  ) => {
    if (address) {
      navigator.clipboard.writeText(address);
      if (from === 'master') {
        toast.success('Copied to clipboard');
      } else if (from === 'sub-acc') {
        toast.error(
          'Warning: You are copying an address that is generated on the Pnl.Green. Do not send funds directly to this address, or your funds will be lost.'
        );
      }
    } else {
      toast.error('connect wallet');
    }
  };

  useEffect(() => {
    // Combine the fetched data with the previous allAccountsData and the master account
    if (Array.isArray(subaccounts)) {
      const restructuredAccounts = subaccounts.map((account) => ({
        name: account.name,
        address: account.subAccountUser,
        equity: account.clearinghouseState.marginSummary.accountValue,
      }));

      setAllAccountsData([...restructuredAccounts, masterAccount]);
    }
  }, [subaccounts]);

  return (
    <>
      <SubAccWrapper>
        {bgImages.map((bg, index) => (
          <LinearBgColors key={index} bgimage={bg.image} styles={bg.styles} />
        ))}

        <SubAccountsInnerBox>
          <Box className="tabs">
            <h1>Sub-Accounts</h1>
            {!userAddress ? (
              <WalletConnectModal />
            ) : (
              <>
                {!establishedConnection ? (
                  <GreenBtn
                    onClick={() =>
                      handleEstablishConnection({
                        setIsLoading: setIsLoading,
                        setEstablishedConnModal: setEstablishedConnModal,
                      })
                    }
                  >
                    {isLoading ? (
                      <Loader message="Establishing..." />
                    ) : (
                      'Establish Connection'
                    )}
                  </GreenBtn>
                ) : (
                  <GreenBtn onClick={toggleCreateSubAccModal}>
                    Create Sub-Account
                  </GreenBtn>
                )}
              </>
            )}
          </Box>

          <Accounts>
            <h2>Master Account</h2>
            <Box
              sx={{
                width: '100%',
                '@media (max-width: 730px)': {
                  overflowX: 'auto',
                  overflowY: 'hidden',
                  cursor: 'move',
                  '&::-webkit-scrollbar': {
                    display: 'none',
                  },
                },
              }}
            >
              <StyledAccTable>
                <thead>
                  <tr>
                    <td>Name</td>
                    <td>Address</td>
                    <td className="center-row" />
                    <td>Account Equity</td>
                    <td className="with-actionBtn paddingRight">Action</td>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td>{masterAccount.name}</td>
                    <td>
                      <span className="master_actions">
                        {userAddress}
                        &nbsp;&nbsp;
                        <img
                          src="/CopyIcon.png"
                          onClick={() => copyAddress(userAddress, 'master')}
                        />
                      </span>
                    </td>
                    <td className="center-row"></td>
                    <td>
                      {webData2.length === 0
                        ? '- -'
                        : `$${Number(masterAccount.equity).toFixed(2)}`}
                    </td>
                    <td className="with-actionBtn paddingRight">
                      {userAddress ? (
                        establishedConnection ? (
                          <ActionBtn
                            onClick={() => {
                              switchAccountHandler(userAddress, 'Master');
                              router.push('/');
                            }}
                          >
                            Trade
                          </ActionBtn>
                        ) : (
                          <ActionBtn
                            onClick={() => setEstablishedConnModal(true)}
                          >
                            connect
                          </ActionBtn>
                        )
                      ) : (
                        <WalletConnectModal
                          bgColor="transparent"
                          textColor="green"
                          btnTitle="Wallet connect"
                        />
                      )}
                    </td>
                  </tr>
                </tbody>
              </StyledAccTable>
            </Box>
          </Accounts>

          <Accounts sx={{ mt: '80px' }}>
            <h2>Sub-Accounts</h2>
            <Box
              sx={{
                width: '100%',
                '@media (max-width: 730px)': {
                  overflowX: 'auto',
                  overflowY: 'hidden',
                  cursor: 'move',
                  '&::-webkit-scrollbar': {
                    display: 'none',
                  },
                },
              }}
            >
              <StyledAccTable>
                <thead>
                  <tr>
                    <td>Name</td>
                    <td>Address</td>
                    <td className="center-row" />
                    <td>Account Equity</td>
                    <td className="with-actionBtn paddingRight">Action</td>
                  </tr>
                </thead>

                <tbody>
                  {subaccounts
                    .sort((a: any, b: any) => a.name.localeCompare(b.name))
                    .map((subAccount: any, index: any) => (
                      <tr key={index}>
                        <td>
                          <span className="actions">
                            {subAccount.name}&nbsp;&nbsp;
                            <img
                              src="/EditIcon.png"
                              onClick={() => {
                                if (!establishedConnection) {
                                  toast.error('Establish connection first');
                                } else {
                                  toggleRenameSubAccModal(subAccount);
                                }
                              }}
                            />
                          </span>
                        </td>
                        <td>
                          <span className="actions">
                            {subAccount.subAccountUser?.slice(0, 4) +
                              '...' +
                              subAccount.subAccountUser?.slice(-4)}
                            &nbsp;&nbsp;
                            <img
                              src="/CopyIcon.png"
                              onClick={() =>
                                copyAddress(
                                  subAccount.subAccountUser,
                                  'sub-acc'
                                )
                              }
                            />
                          </span>
                        </td>
                        <td className="center-row" />
                        <td>
                          $
                          {Number(
                            subAccount.clearinghouseState.marginSummary
                              .accountValue
                          ).toFixed(2)}
                        </td>
                        <td
                          className={
                            establishedConnection
                              ? 'with-actionBtn'
                              : 'with-actionBtn paddingRight'
                          }
                        >
                          <span className="actions">
                            {establishedConnection ? (
                              <>
                                <ActionBtn
                                  onClick={() => {
                                    if (!establishedConnection) {
                                      toast.error('Establish connection first');
                                    } else {
                                      toggleTransferModal(subAccount);
                                    }
                                  }}
                                >
                                  Transfer
                                </ActionBtn>
                                <ActionBtn
                                  onClick={() => {
                                    switchAccountHandler(
                                      subAccount.subAccountUser,
                                      subAccount.name
                                    );
                                    router.push('/');
                                  }}
                                >
                                  Trade
                                </ActionBtn>
                              </>
                            ) : (
                              <ActionBtn
                                onClick={() => setEstablishedConnModal(true)}
                              >
                                connect
                              </ActionBtn>
                            )}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </StyledAccTable>
            </Box>
          </Accounts>
        </SubAccountsInnerBox>
      </SubAccWrapper>

      {isRenameSubAccModalOpen && (
        <RenameSubAccModal
          onClose={() => {
            setRenameSubAccModalOpen(false);
            setIsLoading(false);
            setRenameAcc('');
          }}
          renameAcc={renameAcc}
          setRenameAcc={setRenameAcc}
          onConfirm={() => handleSubAccountModify(subAccount.address)}
          isLoading={isLoading}
        />
      )}

      {createSubAccModal && (
        <CreateSubAcc
          onClose={() => {
            setcreateSubAccModal(false);
            setIsLoading(false);
            setCreateNewAcc('');
          }}
          createNewAcc={createNewAcc}
          setCreateNewAcc={setCreateNewAcc}
          onConfirm={createSubAccountHandler}
          isLoading={isLoading}
        />
      )}

      {isTransferModalOpen && (
        <TransferFunds
          onClose={closeTransferModal}
          onConfirm={subAccountTransfer}
          isLoading={isLoading}
          amount={amount}
          setAmount={setAmount}
          masterAccount={masterAccount}
          subAccount={subAccount}
          allAccountsData={allAccountsData}
          setIsDeposit={setIsDeposit}
          setActiveToAccData={setActiveToAccData}
          activeFromAccData={activeFromAccData}
          setActiveFromAccData={setActiveFromAccData}
          isDeposit={isDeposit}
        />
      )}

      {establishConnModal && (
        <EstablishConnectionModal
          onClose={() => setEstablishedConnModal(false)}
          onEstablishConnection={() =>
            handleEstablishConnection({
              setIsLoading: setIsLoading,
              setEstablishedConnModal: setEstablishedConnModal,
            })
          }
          isLoading={isLoading}
        />
      )}
    </>
  );
};

export default SubAccounts;

SubAccounts.getLayout = function getLayout(page: ReactElement) {
  return <Layout pageTitle="Pnl.Green | Sub-Accounts">{page}</Layout>;
};
