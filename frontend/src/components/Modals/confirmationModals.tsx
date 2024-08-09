import React, { useRef, useState } from 'react';
import { Box, ClickAwayListener } from '@mui/material';
import Draggable from 'react-draggable';
import { CaptionsBtn, SelectItemsBox } from '@/styles/riskManager.styles';
import { FlexItems, GreenBtn } from '@/styles/common.styles';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { IconsStyles } from './styles';
import Loader from '../loaderSpinner';

const commonStyles = {
  width: '100vw',
  height: '100vh',
  position: 'fixed',
  top: 0,
  left: 0,
};

interface OrderTypeProps {
  isMarket?: boolean;
  isLimit?: boolean;
  isScale?: boolean;
  isChase?: boolean;
  isTwap?: boolean;
}

interface ConfirmationModalProps extends OrderTypeProps {
  open?: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isBuyOrSell?: string;

  // Order values
  size?: number | string;
  currentMarketPrice?: number | string;
  price?: number | string;

  // ...Scale order values
  skew?: number | string;
  noOfOrders?: number | string;

  // ...Chase order values
  allowanceBeforeMarketPurchase?: number | string;

  // ...TWAP order values
  timeBetweenIntervals?: number | string;

  //...others
  isReduceOnly?: boolean;
  isTpSl?: boolean;

  // If isTpSl is true
  takeProfitPrice?: number | string;
  stopLossPrice?: number | string;
  estLiqPrice?: number | string;
  fee?: number | string;

  //loading
  loading?: boolean;
  setLoading?: React.Dispatch<React.SetStateAction<boolean>>;
}

const OuterShell = ({
  isDragging,
  children,
  onClose,
  removeOutSideClick,
}: {
  onClose: () => void;
  isDragging: boolean;
  children?: React.ReactNode;
  removeOutSideClick?: boolean;
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',

        transition: 'background-color 0.3s, backdrop-filter 0.3s',
        ...commonStyles,
        zIndex: 999,
        ...(!removeOutSideClick
          ? {
              backgroundColor: isDragging
                ? 'rgba(0, 0, 0, 0)'
                : 'rgba(0, 0, 0, 0.2)',
              backdropFilter: isDragging ? 'blur(0px)' : 'blur(2px)',
            }
          : {
              cursor: 'not-allowed',
            }),
      }}
    >
      {removeOutSideClick ? (
        <React.Fragment>{children}</React.Fragment>
      ) : (
        <ClickAwayListener onClickAway={onClose}>
          <div>{children}</div>
        </ClickAwayListener>
      )}
    </Box>
  );
};

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  open,
  onClose,
  onConfirm,
  isReduceOnly,
  isTpSl,
  isBuyOrSell,

  // Order Types
  isMarket,
  isLimit,
  isScale,
  isChase,
  isTwap,

  // Order values
  size,
  currentMarketPrice,
  price,
  skew,
  noOfOrders,
  allowanceBeforeMarketPurchase,
  timeBetweenIntervals,

  // If isTpSl is true
  takeProfitPrice,
  stopLossPrice,
  estLiqPrice,
  fee,

  //loading
  loading,
  setLoading,
}) => {
  //When it initially pops up, the confirm window should come with the whole screen around it being slightly blurred. However, if the user decides to drag that popup around, the blur will disappear.
  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const dragRef: any = useRef(null);

  const handleDrag = (e: any, position: any) => {
    setIsDragging(true);

    if (e.isTrusted) {
      setDragPosition({
        x: position.x, // Update the x position of the dragged component
        y: position.y, // Update the y position of the dragged component
      });
    }
  };

  const handleDragEnd = (e: any, position: any) => {
    setIsDragging(false);

    setDragPosition({
      x: position.x, // Update the x position of the dragged component
      y: position.y, // Update the y position of the dragged component
    });
  };

  const handleMouseOver = () => {
    setIsDragging(true);
    setDragPosition((prevPosition) => ({
      x: prevPosition.x + 1, // Update the x position of the dragged component
      y: prevPosition.y + 1, // Update the y position of the dragged component
    }));
  };

  const xyPositionChange = dragPosition.x !== 0 || dragPosition.y !== 0;

  return (
    <OuterShell
      onClose={() => {
        onClose();
        setLoading?.(false);
      }}
      isDragging={isDragging}
      removeOutSideClick={xyPositionChange}
    >
      <Draggable
        handle="#isdraggable"
        bounds="parent"
        onDrag={(e, data) => handleDrag(e, data)}
        onStop={(e, data) => handleDragEnd(e, data)}
        ref={dragRef}
      >
        <Box
          id="isdraggable"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            width: '279px',
            height: 'auto',
            minHeight: '300px',
            backgroundColor: '#080808',
            boxShadow: xyPositionChange
              ? '0 0 10px rgba(255, 255, 255, 0.5)'
              : '',
            padding: '10px 12px',
            borderRadius: '4px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            gap: '10px',
            cursor: !isDragging ? 'initial' : 'grabbing',

            '#span': {
              fontSize: '10px',
            },
          }}
        >
          <Box
            id="dragIcon"
            sx={{
              ...IconsStyles,
              left: '10px',
              cursor: isDragging ? 'grab' : 'grabbing',
            }}
            onMouseOver={handleMouseOver}
            onMouseLeave={() => {
              setIsDragging(false);
            }}
          >
            <DragIndicatorIcon sx={{ fontSize: 'small', color: '#fff' }} />
          </Box>
          <Box
            id="closeIcon"
            sx={{
              ...IconsStyles,
              right: '10px',
              cursor: 'pointer',
            }}
            onClick={() => {
              onClose();
              setLoading?.(false);
            }}
          >
            <img src="/closeIcon.svg" alt="X" />
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              mt: 8,
            }}
          >
            <CaptionsBtn>Leverage</CaptionsBtn>
            <CaptionsBtn>Margin</CaptionsBtn>
          </Box>

          <SelectItemsBox
            sx={{
              '&:hover': { border: 'none' },
              background: '#34484D',
              mt: 0,
            }}
          >
            <span>{isScale || isTwap ? 'Total Size' : 'Size'}</span>
            <span>{size}</span>
          </SelectItemsBox>

          {isMarket && (
            <SelectItemsBox
              sx={{
                '&:hover': { border: 'none' },
                background: '#34484D',
                mt: 0,
              }}
            >
              <span>Current Market Price</span>
              <span>${currentMarketPrice}</span>
            </SelectItemsBox>
          )}

          {isLimit && (
            <SelectItemsBox
              sx={{
                '&:hover': { border: 'none' },
                background: '#34484D',
                mt: 0,
              }}
            >
              <span>Price</span>
              <span>${price}</span>
            </SelectItemsBox>
          )}

          {isScale && (
            <SelectItemsBox
              sx={{
                '&:hover': { border: 'none' },
                background: '#34484D',
                mt: 0,
              }}
            >
              <span>Price Range</span>
              <span>$1000</span>
            </SelectItemsBox>
          )}

          {isChase && (
            <SelectItemsBox
              sx={{
                '&:hover': { border: 'none' },
                background: '#34484D',
                mt: 0,
              }}
            >
              <span id="span">Allowance Before Market Purchase</span>
              <span>{allowanceBeforeMarketPurchase}%</span>
            </SelectItemsBox>
          )}

          {isTwap && (
            <>
              <SelectItemsBox
                sx={{
                  '&:hover': { border: 'none' },
                  background: '#34484D',
                  mt: 0,
                }}
              >
                <span>Time between intervals</span>
                <span>{timeBetweenIntervals}</span>
              </SelectItemsBox>

              <SelectItemsBox
                sx={{
                  '&:hover': { border: 'none' },
                  background: '#34484D',
                  mt: 0,
                }}
              >
                <span>No.of Orders</span>
                <span>{noOfOrders}</span>
              </SelectItemsBox>
            </>
          )}
          {isScale && (
            <FlexItems sx={{ gap: '5px' }}>
              <SelectItemsBox
                sx={{
                  '&:hover': { border: 'none' },
                  background: '#34484D',
                  mt: 0,
                  width: '50%',
                }}
              >
                <span>Skew</span>
                <span>${skew}</span>
              </SelectItemsBox>
              <SelectItemsBox
                sx={{
                  '&:hover': { border: 'none' },
                  background: '#34484D',
                  mt: 0,
                }}
              >
                <span>No.of orders</span>
                <span>{noOfOrders}</span>
              </SelectItemsBox>
            </FlexItems>
          )}

          {isTpSl && (
            <FlexItems sx={{ gap: '5px' }}>
              <SelectItemsBox
                sx={{
                  '&:hover': { border: 'none' },
                  background: '#34484D',
                  mt: 0,
                }}
              >
                <span>TP Price</span>
                <span>${takeProfitPrice}</span>
              </SelectItemsBox>
              <SelectItemsBox
                sx={{
                  '&:hover': { border: 'none' },
                  background: '#34484D',
                  mt: 0,
                }}
              >
                <span>SL Price</span>
                <span>${stopLossPrice}</span>
              </SelectItemsBox>
            </FlexItems>
          )}

          {/*Liquidation & Fee prices */}
          <FlexItems sx={{ gap: '5px' }}>
            <SelectItemsBox
              sx={{
                '&:hover': { border: 'none' },
                background: '#34484D',
                mt: 0,
              }}
            >
              <span>Est Liq Price</span>
              <span>${estLiqPrice}</span>
            </SelectItemsBox>
            <SelectItemsBox
              sx={{
                '&:hover': { border: 'none' },
                background: '#34484D',
                mt: 0,
                width: '50%',
              }}
            >
              <span>Fee</span>
              <span>${fee}</span>
            </SelectItemsBox>
          </FlexItems>

          <GreenBtn
            onClick={onConfirm}
            sx={{
              background: isBuyOrSell === 'sell' ? '#B04747' : '',
              ':hover': {
                background: isBuyOrSell === 'sell' ? '#B04747' : '',
              },
            }}
            disabled={loading}
          >
            {loading ? <Loader message="placing..." /> : 'Place Order'}
          </GreenBtn>
        </Box>
      </Draggable>
    </OuterShell>
  );
};

export default ConfirmationModal;
