import { Box, Button, styled } from '@mui/material';

export const PositionsOrdersHistoryWrapper = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '8px',
  border: '2px solid rgba(255, 255, 255, 0.1)',
  width: 'calc(100vw - 720px)',
  height: '304px',
  // maxHeight: "400px",
  background: '#13121296',
  // "linear-gradient(180deg, rgba(4, 146, 96, 0.12) 0%, rgba(15, 57, 74, 0.12) 100%)",

  '@media (max-width: 1535px)': {
    // width: "calc(100vw - 400px)",
    width: 'calc(100vw - 670px)',
    height: '306px',
  },

  '@media (max-width: 1200px)': {
    width: 'calc(100vw - 400px)',
  },

  '@media (max-width: 899px)': {
    width: 'calc(100vw - 20px)',
    marginLeft: '-8px',
  },
}));

export const PositionTabsButtonsWrapper = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
  // height: "38px",
  padding: '10px 20px 5px 20px',
  gap: '10px',
  // paddingBottom: "1px",
  // borderBottom: "1px solid #FFFFFF99",
  overflowX: 'auto',
  overflowY: 'hidden',

  //webkit scroll height 5px
  '&::-webkit-scrollbar': {
    height: '5px',
  },
}));
