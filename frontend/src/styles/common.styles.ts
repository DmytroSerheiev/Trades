import { Box, Button, styled } from '@mui/material';

export const ItemsSelect = styled('select')(() => ({
  height: '30px',
  padding: '5px',
  borderRadius: '5px',
  backgroundColor: '#171b26',
  color: '#fff',
  border: 'none',
  cursor: 'pointer',
}));

//buttons
export const TextBtn = styled(Button)(() => ({
  color: '#fff',
  backgroundColor: '#000',
  textTransform: 'none',
  fontFamily: 'inter',
  position: 'relative',

  '&:hover': {
    backgroundColor: '#000',
  },
}));

export const GreenBtn = styled(Button)(() => ({
  color: '#fff',
  backgroundColor: '#049260',
  textTransform: 'none',
  fontFamily: 'Montserrat',

  '&:hover': {
    backgroundColor: '#049260',
  },
}));

export const OutlinedBtn = styled(Button)(() => ({
  color: '#049260',
  backgroundColor: 'transparent',
  textTransform: 'none',
  fontFamily: 'Montserrat',
  border: '1px solid #049260',

  '&:hover': {
    backgroundColor: 'transparent',
  },
}));

export const ButtonStyles = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-evenly',
  width: '100%',
  position: 'absolute',
  bottom: '142px',
};

export const BuySellBtn = styled(Button)(() => ({
  color: '#fff',
  backgroundColor: '#171b26',
  textTransform: 'none',
  fontFamily: 'Montserrat',
  padding: '5px 5px !important',

  '&.buyBtn': {
    backgroundColor: '#049260',
  },

  '&.sellBtn': {
    backgroundColor: '#B04747',
  },
}));

//flex items
export const FlexItems = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  span: { fontSize: '13px', fontWeight: '400', fontFamily: 'Sora' },
}));

export const TabsButtons = styled(Button)(() => ({
  minWidth: 'fit-content',
  minHeight: '33px',
  borderRadius: '7px',
  backgroundColor: '#0F1A1F',
  textTransform: 'none',
  color: '#FFFFFF',
  fontSize: '15px',
  fontWeight: '600',
  fontFamily: 'Sora',
  transition: 'all 0.3s ease-in-out',

  '&:hover': {
    backgroundColor: '#063021',
  },
  '&.active': {
    backgroundColor: '#049260',
  },
}));
