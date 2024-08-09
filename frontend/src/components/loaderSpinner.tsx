import React from 'react';
import { Box, keyframes, styled } from '@mui/material';

const LoaderSpinner = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  gap: '10px',
  justifyContent: 'center',
  alignItems: 'center',

  span: {
    fontFamily: 'Sora',
    fontSize: '14px',
  },
}));

const SpinnerBox = styled(Box)(() => ({
  width: '20px',
  height: '20px',
  borderRadius: '50%',
  border: '2px solid #fff',
  backgroundColor: 'transparent',
  borderTop: '2px solid transparent',
}));

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

// Styled component for the spinning icon
const SpinningIcon = styled(SpinnerBox)`
  animation: ${spin} 1s linear infinite; /* Apply the spin animation */
`;

const Loader = ({ message }: { message?: string }) => {
  return (
    <LoaderSpinner>
      <SpinningIcon />
      <span>{message}</span>
    </LoaderSpinner>
  );
};

export default Loader;
