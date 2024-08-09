import React, { useState } from 'react';
import { Box, ClickAwayListener, Slider } from '@mui/material';
import { IconsStyles, InnerBox, ModalWrapper } from './styles';
import { GreenBtn } from '@/styles/common.styles';
import { usePairTokensContext } from '@/context/pairTokensContext';
import { useHyperLiquidContext } from '@/context/hyperLiquidContext';
import EstablishConnectionModal from './establishConnectionModal';
import toast from 'react-hot-toast';
import Loader from '../loaderSpinner';

interface ModalProps {
  onClose: () => void;
  onConfirm?: () => void;
}

const LeverageModal: React.FC<ModalProps> = ({ onClose, onConfirm }) => {
  //------Hooks------
  const { assetId, tokenPairData, tokenPairs, activeAssetData } =
    usePairTokensContext();
  const { establishedConnection, handleEstablishConnection, hyperliquid } =
    useHyperLiquidContext();

  const marginType = activeAssetData?.leverage.type ?? '';
  let maxLeverage = Number(tokenPairData[assetId]?.universe.maxLeverage);
  let currentLeverage = Number(activeAssetData?.leverage.value);

  const [sliderValue, setSliderValue] = useState<number>(currentLeverage);
  const [establishConnModal, setEstablishedConnModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSliderChange = (event: any, newValue: number | number[]) => {
    if (
      typeof newValue === 'number' &&
      newValue >= 0 &&
      newValue <= maxLeverage
    ) {
      setSliderValue(newValue);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value === '' ? 0 : Number(event.target.value);
    if (typeof value === 'number' && value >= 0 && value <= maxLeverage) {
      setSliderValue(value);
    }
  };

  const handleLeverageUpdate = async () => {
    try {
      setIsLoading(true);
      let asset = Number(assetId);
      let isCross = marginType === 'cross';
      let leverage = sliderValue;

      const { data, msg, success } = await hyperliquid.updateLeverage(
        asset,
        isCross,
        leverage
      );

      if (success) {
        setIsLoading(false);
        onClose(); // Close the modal

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
          toast.success('Leverage updated successfully');
        }
      } else {
        console.log('msg', msg);
        setIsLoading(false);

        //Toast error msg
        toast.error((msg || 'Error ocured please try again').toString());
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to update leverage');
    }
  };

  return (
    <>
      {!establishConnModal && (
        <ModalWrapper>
          <ClickAwayListener onClickAway={onClose}>
            <InnerBox sx={{ width: '562px' }}>
              <Box
                id="closeIcon"
                sx={{
                  ...IconsStyles,
                  img: { width: '16px', height: '16px' },
                  right: '20px',
                  top: '15px',
                }}
                onClick={onClose}
              >
                <img src="/closeIcon.svg" alt="X" />
              </Box>
              <Box
                sx={{
                  width: '100%',
                  padding: '20px 30px',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
                  fontSize: '20px',
                  fontFamily: 'Sora',
                }}
              >
                Adjust Leverage
              </Box>
              <Box
                sx={{
                  width: '100%',
                  padding: '40px 30px',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
                  fontSize: '14px',
                  fontFamily: 'Sora',
                  display: 'flex',
                  flexDirection: 'column',

                  p: {
                    color: '#FFFFFF',
                  },

                  span: {
                    mt: '20px',
                    color: '#B04747',
                  },
                }}
              >
                <p>
                  Control the leverage used when opening positions for{' '}
                  {`${tokenPairs[0]}`}. The maximum leverage is {maxLeverage}x.
                </p>
                <span>
                  Note that setting a higher leverage increases the risk of
                  liquidation.
                </span>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    mt: '25px',
                    gap: '20px',
                    '.slider': {
                      mt: '-55px',
                    },
                    '.counterBox': {
                      display: 'flex',
                      border: '1px solid #8B8B8B',
                      borderRadius: '4px',
                      width: '54px',
                      height: '27px',
                      alignItems: 'center',
                      justifyContent: 'center',
                      input: {
                        width: '100%',
                        height: '100%',
                        outline: 'none',
                        border: 'none',
                        borderRadius: 'inherit',
                        background: 'transparent',
                        color: '#fff',
                        textAlign: 'center',
                      },
                    },
                  }}
                >
                  <Box sx={{ width: '300px' }} className="slider">
                    <Slider
                      value={sliderValue}
                      onChange={handleSliderChange}
                      aria-label="custom thumb label"
                      valueLabelDisplay="off"
                      max={maxLeverage}
                      sx={{
                        '.MuiSlider-thumb': {
                          background: '#171717',
                          border: '1px solid #049260',
                          width: '24px',
                          height: '24px',
                        },
                        '.MuiSlider-rail': {
                          background: '#8B8B8B',
                          height: '6px',
                          borderRadius: '2px',
                        },
                        '.MuiSlider-track': {
                          background: '#049260',
                          border: 'none',
                        },
                      }}
                    />
                  </Box>
                  <Box className="counterBox">
                    <input value={sliderValue} onChange={handleInputChange} />
                  </Box>
                </Box>
              </Box>

              <GreenBtn
                sx={{
                  m: '15px 30px',
                  borderRadius: '7px',
                  height: '42px',
                  fontSize: '16px',
                }}
                onClick={
                  !establishedConnection
                    ? () => setEstablishedConnModal(true)
                    : handleLeverageUpdate
                }
              >
                {!establishedConnection ? (
                  'Establish Connection'
                ) : isLoading ? (
                  <Loader />
                ) : (
                  'Confirm'
                )}
              </GreenBtn>
            </InnerBox>
          </ClickAwayListener>
        </ModalWrapper>
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

export default LeverageModal;
