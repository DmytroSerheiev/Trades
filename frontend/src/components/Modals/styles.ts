import { Box, styled } from '@mui/material';

export const ModalWrapper = styled(Box)(() => ({
  position: 'fixed',
  zIndex: 100,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backdropFilter: 'blur(2px)',
  width: '100vw',
  height: '100vh',
  left: 0,
  top: 0,
}));

export const InnerBox = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  width: '394px',
  minHeight: '206px',
  borderRadius: '5px',
  background: '#000',
  border: '1px solid rgba(255, 255, 255, 0.2)',

  '@media (max-width: 899px)': {
    width: '90% !important',
  },
}));

export const IconsStyles = {
  position: 'absolute',
  top: '10px',
  width: '20px',
  height: '20px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  right: '10px',
  cursor: 'pointer',
};

export const MarginTabs = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
}));

export const InputBox = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  background: 'transparent',

  label: {
    fontFamily: 'Sora',
    fontSize: '14px',
    color: '#9AA3A4',
  },

  input: {
    marginTop: '8px',
    width: '100%',
    height: '35px',
    outline: 'none',
    border: '1px solid #9AA3A4',
    padding: '0 15px',
    background: 'transparent',
    borderRadius: '5px',
    color: '#fff',
  },
}));
