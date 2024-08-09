import { SelectItemsBox } from '@/styles/riskManager.styles';
import { Box } from '@mui/material';
import React, { useEffect, useState } from 'react';
import HandleSelectItems from '../handleSelectItems';
import { ButtonStyles, BuySellBtn, FlexItems } from '@/styles/common.styles';
import { RenderInput } from './commonInput';
import ConfirmationModal from '../Modals/confirmationModals';
import LiquidationContent from './liquidationContent';
import { useWebDataContext } from '@/context/webDataContext';
import { usePairTokensContext } from '@/context/pairTokensContext';
import { useHyperLiquidContext } from '@/context/hyperLiquidContext';
import { parsePrice, parseSize } from '@/utils/hyperliquid';
import toast from 'react-hot-toast';
import { OrderType } from '@/types/hyperliquid';
import { getUsdSizeEquivalents } from '@/utils/usdEquivalents';
import EstablishConnectionModal from '../Modals/establishConnectionModal';

const LimitComponent = () => {
  const { webData2 } = useWebDataContext();
  const { hyperliquid, establishedConnection, handleEstablishConnection } =
    useHyperLiquidContext();
  const { tokenPairs, tokenPairData, assetId } = usePairTokensContext();

  //------Local State------
  const [selectOrderType, setSelectOrderType] = useState<
    'Gtc' | 'Ioc' | 'Alo' | 'FrontendMarket'
  >('Gtc');
  const [radioValue, setRadioValue] = useState('');
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [isBuyOrSell, setIsBuyOrSell] = useState(''); //buy | sell
  const [selectItem, setSelectItem] = useState(`${tokenPairs[0]}`);
  const [size, setSize] = useState<number>(0.0);
  const [isLoading, setIsLoading] = useState(false);
  const [limitPx, setLimitPx] = useState<number>(0.0);
  const [establishConnModal, setEstablishedConnModal] = useState(false);
  //Take Profit / Stop Loss
  const [takeProfitPrice, setTakeProfitPrice] = useState('');
  const [stopLossPrice, setStopLossPrice] = useState('');
  const [gain, setGain] = useState('');
  const [loss, setLoss] = useState('');
  const [estLiqPrice, setEstLiquidationPrice] = useState('');
  const [fee, setFee] = useState('');

  const currentMarketPrice = tokenPairData[assetId]?.assetCtx.markPx;
  let szDecimals = tokenPairData[assetId]?.universe.szDecimals;

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

  //get the size equivalent in USD
  let sz =
    selectItem.toUpperCase() === 'USD'
      ? size / Number(currentMarketPrice)
      : size;
  //
  const handlePlaceOrder = async () => {
    try {
      setIsLoading(true);
      let isBuy = isBuyOrSell === 'buy';
      let orderType: OrderType = {
        limit: {
          tif: selectOrderType,
        },
      };
      let reduceOnly = radioValue === '1';

      const { success, data, msg } = await hyperliquid.placeOrder({
        asset: Number(assetId),
        isBuy,
        limitPx: parsePrice(Number(limitPx)),
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

      <SelectItemsBox>
        <RenderInput
          label={'Size'}
          placeholder="|"
          value={size.toString()}
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

      <RenderInput
        label="Price"
        placeholder="0"
        type="number"
        value={limitPx.toString()}
        onChange={(e: any) => setLimitPx(e.target.value)}
        styles={{
          marginTop: '4px',
          gap: 0,
          width: '100%',
          '.placeholder_box': {
            fontSize: '12px',
          },
          input: { width: '30%', padding: '0' },
        }}
      />

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

      <SelectItemsBox
        sx={{
          '&:hover': {
            border: 'none !important',
          },
        }}
      >
        <span>Order Type</span>
        <HandleSelectItems
          selectItem={selectOrderType}
          setSelectItem={setSelectOrderType}
          selectDataItems={['Gtc', 'Ioc', 'Alo']}
          styles={{
            marginTop: radioValue === '2' ? '10px' : '0',
          }}
        />
      </SelectItemsBox>

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
          onConfirm={handlePlaceOrder}
          isLimit={true}
          size={`${parseSize(sz, szDecimals)} ${tokenPairs[0]}`}
          price={limitPx}
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

      // liquidationPrice={10}
      // orderValue={}
      // marginRequired={}
      // fees={}
      />
    </Box>
  );
};

export default LimitComponent;
