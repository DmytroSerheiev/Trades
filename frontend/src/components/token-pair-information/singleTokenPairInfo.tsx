import React from 'react';
import { TokenPairsWrapper } from '@/styles/tokenPairs.styles';
import { Box } from '@mui/material';
import UpDownIcon from '../../../public/upDownIcon';
import { usePairTokensContext } from '@/context/pairTokensContext';

interface SingleTokenPairInfoProps {
  tableISOpen: boolean;
  toggleTablePairs: () => void;
}

const PairDetail = ({ label, value, isRed }: any) => (
  <Box className="pairDetails">
    <span>{label}</span>
    <span className={isRed ? 'value toRed' : 'value'}>{value}</span>
  </Box>
);

const SingleTokenPairInfo = ({
  tableISOpen,
  toggleTablePairs,
}: SingleTokenPairInfoProps) => {
  const { tokenPairData, assetId, selectedPairsTokenData } =
    usePairTokensContext();

  const pairDataInformation = () => {
    if (tokenPairData.length > 0) {
      return tokenPairData[assetId];
    } else {
      return selectedPairsTokenData;
    }
  };

  return (
    <TokenPairsWrapper tableISOpen={tableISOpen}>
      <Box className="pair_tokens" onClick={toggleTablePairs}>
        <span>{pairDataInformation()?.pairs}</span>
        <div className="upDownIcon">
          <UpDownIcon />
        </div>
      </Box>

      <PairDetail
        label="Mark Price"
        value={pairDataInformation()?.assetCtx?.markPx}
      />
      <PairDetail
        label="Oracle Price"
        value={pairDataInformation()?.assetCtx?.oraclePx}
      />
      <Box className="pairDetails">
        <span>
          24hr change(<span id="toRed">in % </span>and <span id="toRed">$</span>
          )
        </span>
        <span className="value" id="toRed">
          {pairDataInformation()?.hr24change
            ? pairDataInformation()?.hr24change
            : '--'}
        </span>
      </Box>
      <PairDetail
        label="24hr Volume"
        value={
          pairDataInformation()?.volume ? pairDataInformation()?.volume : '--'
        }
      />
      <PairDetail
        label="OI"
        value={pairDataInformation()?.assetCtx?.openInterest}
      />
      <Box className="pairDetails">
        <span>Funding/Funding Countdown</span>
        <span className="value">
          <span id="toGreen">
            {pairDataInformation()?.funding}&nbsp;&nbsp;{' '}
          </span>
          &nbsp;&nbsp;
          {pairDataInformation()?.countDown}
        </span>
      </Box>
    </TokenPairsWrapper>
  );
};

export default SingleTokenPairInfo;
