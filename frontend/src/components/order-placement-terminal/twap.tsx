import React, { useEffect, useState } from 'react';
import { SelectItemsBox } from '@/styles/riskManager.styles';
import { Box } from '@mui/material';
import HandleSelectItems from '../handleSelectItems';
import { RenderInput } from './commonInput';
import { ButtonStyles, BuySellBtn, FlexItems } from '@/styles/common.styles';
import ConfirmationModal from '../Modals/confirmationModals';
import LiquidationContent from './liquidationContent';
import { useWebDataContext } from '@/context/webDataContext';
import { usePairTokensContext } from '@/context/pairTokensContext';
import toast from 'react-hot-toast';
import EstablishConnectionModal from '../Modals/establishConnectionModal';
import { useHyperLiquidContext } from '@/context/hyperLiquidContext';

const TwapOrderTerminal = () => {
  const { webData2 } = useWebDataContext();
  const { tokenPairs } = usePairTokensContext();
  const { establishedConnection, handleEstablishConnection } =
    useHyperLiquidContext();

  const [isLoading, setIsLoading] = useState(false);
  const [timeBtwnIntervals, setTimeBtwnIntervals] = useState('');
  const [theTimeInterval, setTheTimeInterval] = useState('');
  const [radioValue, setRadioValue] = useState('');

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [isBuyOrSell, setIsBuyOrSell] = useState(''); //buy | sell
  const [selectItem, setSelectItem] = useState(`${tokenPairs[0]}`);
  const [size, setSize] = useState('');

  const [establishConnModal, setEstablishedConnModal] = useState(false);

  //Take Profit / Stop Loss
  const [takeProfitPrice, setTakeProfitPrice] = useState('');
  const [stopLossPrice, setStopLossPrice] = useState('');
  const [gain, setGain] = useState('');
  const [loss, setLoss] = useState('');
  const [totalNoOfOrders, setTotalNoOfOrders] = useState('5');

  const [estLiqPrice, setEstLiquidationPrice] = useState('100');
  const [fee, setFee] = useState('100');

  const toggleConfirmModal = (button: string) => {
    setConfirmModalOpen(true);
    setIsBuyOrSell(button);
  };

  const handleRadioChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setRadioValue(e.target.value);
  };
  const handleRadioClick = (e: any) => {
    if (radioValue === e.target.value) {
      setRadioValue('');
    }
  };

  useEffect(() => {
    setSelectItem(`${tokenPairs[0]}`);
  }, [tokenPairs]);

  const handlePlaceTwapOrder = () => {
    try {
      // const {}=hyperli
    } catch (error) {
      console.log(error);
      toast.error('Error placing order, please try again later.');
    }
  };

  return (
    <Box
      sx={{
        position: 'relative',
        height: radioValue === '2' ? 'calc(100% + 20px)' : '100%',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '5px',
          mt: '20px',
        }}
      >
        <FlexItems>
          <span>Available balance</span>
          <span>
            {Number(webData2.clearinghouseState?.withdrawable).toFixed(2)}
          </span>
        </FlexItems>
        <FlexItems>
          <span>Current position size</span>
          <span>0.0 APE</span>
        </FlexItems>
      </Box>

      <SelectItemsBox>
        <RenderInput
          label="Time Between Intervals"
          placeholder="|"
          type="number"
          value={theTimeInterval}
          onChange={(e: any) => setTheTimeInterval(e.target.value)}
          styles={{
            padding: '0 2px',
            '.placeholder_box': {
              width: '70% !important',
              fontSize: '12px',
            },
            background: 'transparent',
            ':hover': {
              border: 'none !important',
              '*': {
                fontSize: '11px',
              },
            },
            input: {
              width: '30%',
            },
          }}
        />
        <HandleSelectItems
          selectItem={timeBtwnIntervals}
          setSelectItem={setTimeBtwnIntervals}
          selectDataItems={['S', 'M']}
        />
      </SelectItemsBox>

      <SelectItemsBox>
        <RenderInput
          label="Size"
          placeholder="|"
          type="number"
          value={size}
          onChange={(e: any) => setSize(e.target.value)}
          styles={{
            background: 'transparent',
            ':hover': {
              border: 'none !important',
            },
          }}
        />
        <HandleSelectItems
          selectItem={selectItem}
          setSelectItem={setSelectItem}
          selectDataItems={[`${tokenPairs[0]}`, `${tokenPairs[1]}`]}
        />
      </SelectItemsBox>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          mt: '20px',
          gap: '8px',
          label: {
            marginRight: '8px',
            cursor: 'pointer',
          },
        }}
      >
        <FlexItems
          sx={{
            justifyContent: 'flex-start',
          }}
        >
          <label>
            <input
              type="radio"
              name="radio"
              value="1"
              checked={radioValue === '1'}
              onChange={handleRadioChange}
              onClick={handleRadioClick}
            />
          </label>
          <span>Reduce Only</span>
        </FlexItems>

        <FlexItems sx={{ justifyContent: 'flex-start' }}>
          <label>
            <input
              type="radio"
              name="radio"
              value="2"
              checked={radioValue === '2'}
              onChange={handleRadioChange}
              onClick={handleRadioClick}
            />
          </label>
          <span>Take Profit / Stop Loss</span>
        </FlexItems>
      </Box>

      {radioValue === '2' && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            mt: '10px',
            height: '70px',
            gap: '2px',
          }}
        >
          <FlexItems>
            <RenderInput
              label="TP Price"
              placeholder="0"
              type="number"
              value={takeProfitPrice}
              onChange={(e: any) => setTakeProfitPrice(e.target.value)}
              styles={{
                gap: 0,
                width: '49%',
                '.placeholder_box': {
                  fontSize: '12px',
                },
                input: { width: '30%', padding: '0' },
              }}
            />

            <RenderInput
              label="Gain"
              placeholder="$"
              styles={{
                gap: 0,
                width: '49%',
                '.placeholder_box': {
                  fontSize: '12px',
                },
                input: { width: '30%', padding: '0' },
              }}
            />
          </FlexItems>

          <FlexItems>
            <RenderInput
              label="SL Price"
              placeholder="0"
              type="number"
              value={stopLossPrice}
              onChange={(e: any) => setStopLossPrice(e.target.value)}
              styles={{
                gap: 0,
                width: '49%',
                '.placeholder_box': {
                  width: '90% !important',
                  fontSize: '12px',
                },
                input: { width: '20%', padding: '0' },
              }}
            />

            <RenderInput
              label="Loss"
              placeholder="$"
              styles={{
                gap: 0,
                width: '49%',
                '.placeholder_box': {
                  fontSize: '12px',
                },
                input: { width: '30%', padding: '0' },
              }}
            />
          </FlexItems>
        </Box>
      )}

      {!establishedConnection ? (
        <Box sx={{ ...ButtonStyles }}>
          <BuySellBtn
            className="buyBtn"
            sx={{ width: '100%' }}
            onClick={() => setEstablishedConnModal(true)}
          >
            Enable trading
          </BuySellBtn>
        </Box>
      ) : (
        <Box sx={{ ...ButtonStyles }}>
          <BuySellBtn
            sx={{ width: '112px' }}
            className="buyBtn"
            onClick={() => toggleConfirmModal('buy')}
          >
            Buy
          </BuySellBtn>
          <BuySellBtn
            sx={{ width: '112px' }}
            className="sellBtn"
            onClick={() => toggleConfirmModal('sell')}
          >
            Sell
          </BuySellBtn>
        </Box>
      )}

      {confirmModalOpen && (
        <ConfirmationModal
          onClose={() => setConfirmModalOpen(false)}
          onConfirm={function (): void {
            throw new Error('Function not implemented.');
          }}
          isTwap={true}
          size={`${size} ${selectItem}`}
          timeBetweenIntervals={`${theTimeInterval} ${timeBtwnIntervals}`}
          noOfOrders={totalNoOfOrders}
          isTpSl={radioValue === '2' ? true : false}
          takeProfitPrice={radioValue === '2' ? takeProfitPrice : undefined}
          stopLossPrice={radioValue === '2' ? stopLossPrice : undefined}
          estLiqPrice={estLiqPrice}
          fee={fee}
          isBuyOrSell={isBuyOrSell}
          loading={isLoading}
          setLoading={setIsLoading}
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

      <LiquidationContent
      //TODO: Add props

      // liquidationPrice={}
      // orderValue={}
      // marginRequired={}
      // fees={}
      />
    </Box>
  );
};

export default TwapOrderTerminal;
