import { SelectItemsBox } from '@/styles/riskManager.styles';
import { Box } from '@mui/material';
import React, { useEffect, useState } from 'react';
import HandleSelectItems from '../handleSelectItems';
import { ButtonStyles, BuySellBtn, FlexItems } from '@/styles/common.styles';
import { RenderInput } from './commonInput';
import { usePairTokensContext } from '@/context/pairTokensContext';
import ConfirmationModal from '../Modals/confirmationModals';
import { OrderType } from '@/types/hyperliquid';
import { useHyperLiquidContext } from '@/context/hyperLiquidContext';
import { parsePrice, parseSize } from '@/utils/hyperliquid';
import toast from 'react-hot-toast';
import LiquidationContent from './liquidationContent';
import { useWebDataContext } from '@/context/webDataContext';
import { getUsdSizeEquivalents } from '@/utils/usdEquivalents';
import EstablishConnectionModal from '../Modals/establishConnectionModal';

const MarketComponent = () => {
  const { tokenPairs, tokenPairData, assetId } = usePairTokensContext();
  const { hyperliquid, establishedConnection, handleEstablishConnection } =
    useHyperLiquidContext();
  const { webData2 } = useWebDataContext();

  const [radioValue, setRadioValue] = useState<string>('');
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [isBuyOrSell, setIsBuyOrSell] = useState(''); //buy | sell
  const [selectItem, setSelectItem] = useState(`${tokenPairs[0]}`);
  const [takeProfitPrice, setTakeProfitPrice] = useState('');
  const [stopLossPrice, setStopLossPrice] = useState('');
  const [gain, setGain] = useState('');
  const [loss, setLoss] = useState('');
  const [size, setSize] = useState<number>(0.0);
  const [establishConnModal, setEstablishedConnModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const currentMarketPrice = tokenPairData[assetId]?.assetCtx.markPx;
  let szDecimals = tokenPairData[assetId]?.universe.szDecimals;

  const handleSizeInput = (e: {
    target: { value: React.SetStateAction<number> };
  }) => {
    const value = e.target.value;
    setSize(value);
  };

  //setting the equivalent size in the selected token
  let TokenSize = getUsdSizeEquivalents({
    size: Number(size),
    currentMarkPrice: Number(currentMarketPrice),
    token: selectItem,
  });

  //maintain the size equivalent state of the  token
  useEffect(() => {
    if (TokenSize) {
      let newSize = Number(TokenSize.toFixed(szDecimals));
      setSize(newSize);
    }
  }, [selectItem]);

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

  //get the size equivalent in USD
  let sz =
    selectItem.toUpperCase() === 'USD'
      ? size / Number(currentMarketPrice)
      : size;

  let isBuy = isBuyOrSell === 'buy';
  let orderType: OrderType = {
    limit: {
      tif: 'FrontendMarket',
    },
  };
  let reduceOnly = radioValue === '1';

  // Calculate limit price based on buy or sell
  let normalLimitPx = isBuy
    ? Number(currentMarketPrice) * 1.03
    : Number(currentMarketPrice) * 0.97;

  //place order with no Take Profit/Stop Loss
  const handlePlaceOrder = async () => {
    try {
      setIsLoading(true);
      const { success, data, msg } = await hyperliquid.placeOrder({
        asset: Number(assetId),
        isBuy,
        limitPx: parsePrice(normalLimitPx),
        sz: parseSize(sz, szDecimals),
        orderType,
        reduceOnly,
      });

      if (success) {
        console.log('data', data);
        setIsLoading(false);
        setConfirmModalOpen(false);

        // Check if there's an error in statuses[0]
        if (
          data &&
          typeof data === 'object' &&
          'data' in data &&
          data.type === 'order' &&
          data.data &&
          data.data.statuses &&
          data.data.statuses.length > 0 &&
          data.data.statuses[0].error
        ) {
          //Toast error message
          toast.error(
            (
              data.data.statuses[0].error || 'Error ocured please try again'
            ).toString()
          );
        } else {
          //Toast success message if there's no error
          toast.success('Order placed successfully');
        }
      } else {
        console.log('msg', msg);
        setIsLoading(false);

        //Toast error msg
        toast.error((msg || 'Error ocured please try again').toString());
      }
    } catch (error) {
      console.log('error', error);
      setIsLoading(false);
    }
  };

  //place order with Take Profit/Stop Loss
  const placeOrderWithTpSl = async () => {
    try {
      setIsLoading(true);

      //if takeProfitPrice and stopLossPrice are present, validate it against currentMarketPrice
      //if one of the two is present validate each against currentMarketPrice
      if (
        takeProfitPrice.trim() !== '' &&
        Number(takeProfitPrice) < Number(currentMarketPrice) &&
        stopLossPrice.trim() !== '' &&
        Number(stopLossPrice) > Number(currentMarketPrice)
      ) {
        setIsLoading(false);
        setConfirmModalOpen(false);
        return toast.error(
          'TP price should be greater than current market price and SL price should be less than current market price'
        );
      } else if (
        takeProfitPrice.trim() !== '' &&
        Number(takeProfitPrice) < Number(currentMarketPrice)
      ) {
        setIsLoading(false);
        setConfirmModalOpen(false);
        return toast.error(
          'TP price should be greater than current market price'
        );
      } else if (
        stopLossPrice.trim() !== '' &&
        Number(stopLossPrice) > Number(currentMarketPrice)
      ) {
        setIsLoading(false);
        setConfirmModalOpen(false);
        return toast.error('SL price should be less than current market price');
      }

      let tpSlIsBuy = isBuyOrSell !== 'buy'; //tpSl of buy is opposite of normal
      // Calculate tp/sl limit price based on buy or sell
      let tpslLimitPx = tpSlIsBuy
        ? Number(currentMarketPrice) * 1.03
        : Number(currentMarketPrice) * 0.97;

      const { success, data, msg } = await hyperliquid.normalTpSl(
        {
          asset: Number(assetId),
          isBuy,
          limitPx: parsePrice(normalLimitPx),
          sz: parseSize(sz, szDecimals),
          orderType,
          reduceOnly,
        },
        takeProfitPrice.trim() !== ''
          ? {
              asset: Number(assetId),
              isBuy: tpSlIsBuy,
              limitPx: parsePrice(tpslLimitPx),
              sz: parseSize(sz, szDecimals),
              orderType: {
                trigger: {
                  isMarket: true,
                  tpsl: 'tp',
                  triggerPx: takeProfitPrice,
                },
              },
              reduceOnly: !reduceOnly,
            }
          : undefined,
        stopLossPrice.trim() !== ''
          ? {
              asset: Number(assetId),
              isBuy: tpSlIsBuy,
              limitPx: parsePrice(tpslLimitPx),
              sz: parseSize(sz, szDecimals),
              orderType: {
                trigger: {
                  isMarket: true,
                  tpsl: 'sl',
                  triggerPx: stopLossPrice,
                },
              },
              reduceOnly: !reduceOnly,
            }
          : undefined
      );

      if (success) {
        console.log('data', data);
        setIsLoading(false);
        setConfirmModalOpen(false);

        // Check if there's an error in statuses[0]
        if (
          data &&
          typeof data === 'object' &&
          'data' in data &&
          data.type === 'order' &&
          data.data &&
          data.data.statuses &&
          data.data.statuses.length > 0 &&
          data.data.statuses[0].error
        ) {
          //Toast error message
          toast.error(
            (
              data.data.statuses[0].error || 'Error ocured please try again'
            ).toString()
          );
        } else {
          //Toast success message if there's no error
          toast.success('Order placed successfully');
        }
      } else {
        console.log('msg', msg);
        setIsLoading(false);

        //Toast error msg
        toast.error((msg || 'Error ocured please try again').toString());
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box
      sx={{
        position: 'relative',
        height: radioValue === '2' ? 'calc(100% + 85px)' : '100%',
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

      <Box
        sx={{ display: 'flex', flexDirection: 'column', gap: '6px', mt: '6px' }}
      >
        <SelectItemsBox sx={{ '&:hover': { border: 'none' }, m: 0 }}>
          <span>Current Market Price</span>
          <span>${currentMarketPrice}</span>
        </SelectItemsBox>

        <SelectItemsBox sx={{ m: 0 }}>
          <RenderInput
            label={'Size'}
            placeholder="|"
            type="number"
            value={size.toString()}
            onChange={(e: any) => handleSizeInput(e)}
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

        <SelectItemsBox sx={{ '&:hover': { border: 'none' }, m: 0 }}>
          <span> Price</span>
          <span>$</span>
        </SelectItemsBox>
      </Box>

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
              value={gain}
              onChange={(e: any) => setGain(e.target.value)}
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
              value={loss}
              onChange={(e: any) => setLoss(e.target.value)}
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
            sx={{
              width: '112px',
              ':disabled': {
                cursor: 'none',
              },
            }}
            className="buyBtn"
            onClick={() => toggleConfirmModal('buy')}
            disabled={size <= 0}
          >
            Buy
          </BuySellBtn>
          <BuySellBtn
            sx={{
              width: '112px',
              ':disabled': {
                cursor: 'none',
              },
            }}
            className="sellBtn"
            onClick={() => toggleConfirmModal('sell')}
            disabled={size <= 0}
          >
            Sell
          </BuySellBtn>
        </Box>
      )}

      {confirmModalOpen && (
        <ConfirmationModal
          onClose={() => setConfirmModalOpen(false)}
          onConfirm={radioValue === '2' ? placeOrderWithTpSl : handlePlaceOrder}
          isMarket={true}
          currentMarketPrice={currentMarketPrice}
          size={`${parseSize(sz, szDecimals)} ${tokenPairs[0]}`}
          isTpSl={radioValue === '2' ? true : false}
          takeProfitPrice={radioValue === '2' ? takeProfitPrice : undefined}
          stopLossPrice={radioValue === '2' ? stopLossPrice : undefined}
          estLiqPrice={''}
          fee={''}
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

export default MarketComponent;
