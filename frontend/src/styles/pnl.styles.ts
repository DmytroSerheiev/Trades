import { Box, Button, styled } from '@mui/material';

export const PnlWrapper = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  gap: '5px',
  backgroundColor: '#000',
  width: '100vw',
  minHeight: 'calc(100vh - 70px)',
  height: 'auto',
  justifyContent: 'center',
  padding: '10px 20px',

  '@media (max-width: 1535px)': {
    // flexWrap: 'wrap',
  },
  '@media (max-width: 1200px)': {
    flexWrap: 'wrap',
  },
  // justifyContent: "space-between",
  // alignContent: "flex-start",
  '@media (max-width: 899px)': {
    padding: '5px !important',
  },
}));

export const TradingViewComponent = styled(Box)(() => ({
  display: 'flex',
  width: 'calc(100vw - 720px)',
  height: '550px',
  borderRadius: '5px',
  backgroundColor: '#171b26',
  justifyContent: 'center',

  '@media (max-width: 1535px)': {
    width: 'calc(100vw - 670px)',
  },
  '@media (max-width: 1200px)': {
    width: 'calc(100vw - 400px)',
  },

  '@media (max-width: 899px)': {
    width: 'calc(100vw - 20px)',
    marginLeft: '-8px',
  },

  div: {
    width: '100%',
  },

  '@media screen and (min-width: 1535px)': {
    height: 'calc(100vh - 450px)',
  },
}));

export const WalletBox = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
  padding: '50px 20px 15px 20px', //top right bottom left
  border: '2px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '7.29px',
  width: '325px',
  height: 'auto',
  minHeight: '232px',
  maxHeight: 'max-content',
  background: '#13121296',

  '& .green': {
    color: '#049160',
  },

  '@media (max-width: 650px)': {
    width: 'calc(100vw - 20px)',
    marginLeft: '-8px',
  },
  '@media screen and (min-width: 1535px)': {
    height: 'calc(100vh - 710px)',
  },
  '@media screen and (max-width: 1535px)': {
    width: '315px !important',
  },
}));

export const ChatBox = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  padding: '10px 15px 20px 15px',
  border: '2px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '7.29px',
  width: '325px',
  height: '340px',
  background: '#13121296',

  '.header_nav': {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '5px  0',

    img: {
      cursor: 'pointer',
    },
  },

  header: {
    fontFamily: 'Sora',
    fontSize: '15px',
    fontWeight: '400',
    color: '#FFFFFF',
  },

  '.chat_room': {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    height: 'calc(100% - 30px)',
    width: '100%',
    position: 'relative',
  },

  '.chat_messages': {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    overflowY: 'auto',
    overflowX: 'hidden',
    width: '100%',
    height: 'calc(100% - 40px)',
    padding: '10px',

    // "&::-webkit-scrollbar": {
    //   width: "10px",
    //   backgroundColor: "#fff",
    // },
    // "&::-webkit-scrollbar-thumb": {
    //   backgroundColor: "gray",
    //   cursor: "pointer",
    // },
  },

  '.chat_input': {
    display: 'flex',
    borderRadius: '8px',
    alignItems: 'center',
    justifyContent: 'space-between',
    border: '1px solid #FFFFFF99',
    width: '100%',
    height: '36px',
    position: 'absolute',
    bottom: '0',
    padding: '0 10px',

    input: {
      width: 'calc(100% - 25px)',
      height: '100%',
      backgroundColor: 'transparent',
      border: 'none',
      outline: 'none',
      padding: '0 10px',
      color: '#fff',
      fontFamily: 'Sora',
      fontSize: '15px',
      fontWeight: '400',
    },
  },
  '.send_bubble': {
    display: 'flex',
    color: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: '90%',
    height: 'fit-content',
    padding: '2px 10px',
    borderRadius: '5px',
    backgroundColor: '#049260',
    fontfamily: 'Sora',
    fontSize: '14px',
    fontWeight: '400',
    margin: '5px 0 5px auto',
    lineHeight: '1.5',
    position: 'relative',
  },
  '.received_bubble': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: '90%',
    height: 'fit-content',
    padding: '2px 10px',
    borderRadius: '5px',
    backgroundColor: '#171b26',
    fontfamily: 'Sora',
    fontSize: '14px',
    fontWeight: '400',
    margin: '5px auto 5px 0',
    lineHeight: '1.5',
    position: 'relative',
  },

  '@media (max-width: 650px)': {
    width: 'calc(100vw - 20px)',
    marginLeft: '-8px',
    height: '400px',
  },
  '@media screen and (min-width: 1535px)': {
    height: 'calc(100vh - 660px)',
  },
  '@media screen and (max-width: 1535px)': {
    width: '315px !important',
  },
}));

export const BtnWithIcon = styled(Button)(() => ({
  padding: '0',
  minWidth: '40px',
  height: '100%',

  // img: {
  //   width: "20px",
  //   height: "20px",
  // },
}));
