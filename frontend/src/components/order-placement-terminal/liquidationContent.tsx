import React from 'react';
import { LiquidationWrapper } from '@/styles/riskManager.styles';
import { Box } from '@mui/material';

interface LiquidationContentProps {
  liquidationPrice?: number;
  orderValue?: number;
  marginRequired?: number;
  fees?: number;
}

const LiquidationContent: React.FC<LiquidationContentProps> = ({
  liquidationPrice,
  orderValue,
  marginRequired,
  fees,
}) => {
  return (
    <LiquidationWrapper sx={{ position: 'absolute', bottom: 0 }}>
      <Box className="items">
        <span>Liquidation Price</span>
        <span>{liquidationPrice ? liquidationPrice : 'N/A'}</span>
      </Box>
      <Box className="items">
        <span>Order Value</span>
        <span>{orderValue ? orderValue : 'N/A'}</span>
      </Box>
      <Box className="items">
        <span>Margin Required</span>
        <span>{marginRequired ? marginRequired : 'N/A'}</span>
      </Box>
      <Box className="items">
        <span>Fees</span>
        <span>{fees ? fees : 'N/A'}</span>
      </Box>
    </LiquidationWrapper>
  );
};

export default LiquidationContent;
