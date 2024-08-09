import { Box, styled } from '@mui/material';

interface TokenPairsProps {
  tableISOpen?: boolean;
}

export const TokenPairsWrapper = styled(Box)<TokenPairsProps>((props) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-start',
  alignItems: 'center',
  padding: '0 10px',
  width: 'calc(100vw - 720px)',
  minHeight: '55px',
  borderRadius: '5px',
  backgroundColor: '#13121296',
  gap: '25px',
  border: '1px solid rgba(255, 255, 255, 0.1)',

  '.pair_tokens': {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minWidth: '100px',
    height: '100%',
    fontFamily: 'Sora',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    span: {
      marginRight: '10px',
    },
  },

  '.upDownIcon': {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    transform: props.tableISOpen ? 'rotate(0)' : 'rotate(180deg)',
    transition: 'transform 0.3s ease-in-out',
    img: {
      width: '12px',
    },
  },

  '.pairDetails': {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',

    span: {
      fontFamily: 'Sora',
      fontSize: '13px',
      fontWeight: '300',
      color: '#FFFFFF99',
    },

    '#toRed': {
      color: '#E10000',
    },

    '#toGreen': {
      color: '#3DBA3D',
    },

    '.value': {
      color: '#fff',
    },
  },

  '@media (max-width: 1535px)': {
    width: 'calc(100vw - 670px)',
    overflowX: 'auto',
    overflowY: 'hidden',
    cursor: 'move',

    //webkit scroll height 5px
    '&::-webkit-scrollbar': {
      height: '5px',
    },
  },

  '@media (max-width: 1200px)': {
    width: 'calc(100vw - 400px)',
  },

  '@media (max-width: 899px)': {
    width: 'calc(100vw - 20px)',
    marginLeft: '-8px',

    alignItems: 'center',
    justifyContent: 'center',
  },
}));

export const TokenPairsInfoTableWrapper = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  width: '694px',
  height: '348px',
  background: '#000000',
  borderRadius: '5px',
  border: '1px solid #D9D9D947',
  position: 'absolute',
  zIndex: 10,
  top: 'calc(100% + 2px)',
  left: '2px',
  padding: '5px',

  '*': {
    fontFamily: 'Sora',
    fontSize: '12px',
    fontWeight: '400',
  },

  input: {
    width: '100%',
    minHeight: '35px',
    borderRadius: '5px',
    backgroundColor: 'transparent',
    border: '1px solid #D9D9D947',
    color: '#fff',
    padding: '0 10px',

    '&::placeholder': {
      color: '#fff',
    },
  },

  '@media (max-width: 899px)': {
    width: 'calc(100vw - 20px)',
    marginLeft: '-8px',
  },
}));

export const TokenTableTabsWrapper = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  gap: '20px',
  width: '100%',
  minHeight: '30px',
  paddingBottom: '1px',

  overflowX: 'auto',
  overflowY: 'hidden',

  button: {
    border: 'none',
    backgroundColor: 'transparent',
    color: '#FFFFFF9C',
    cursor: 'pointer',
    fontWeight: '600',
    minWidth: 'fit-content',

    '&:hover': {
      color: '#049260',
    },

    '&.active': {
      color: '#049260',
    },
  },
  '@media (max-width: 599px)': {
    cursor: 'auto',
    //webkit scroll height 5px
    '&::-webkit-scrollbar': {
      // height: "5px",
      display: 'none',
    },
  },
}));

export const PairTableContainer = styled('table')(() => ({
  width: '100%',
  borderCollapse: 'collapse',
  marginTop: '8px',

  thead: {
    color: '#FFFFFF99',
    fontSize: '13px',
    fontWeight: '400',
    fontFamily: 'Sora',
    width: '100%',
    textAlign: 'left',

    th: {
      minWidth: '20px',
    },
  },

  tbody: {
    tr: {
      position: 'relative',
      '&:hover': {
        backgroundColor: '#0F1A1F',
        cursor: 'pointer',
      },
    },

    td: {
      padding: '5px 0px',
    },

    '#centered-content': {
      display: 'flex',
      alignItems: 'center',
    },
  },

  '.favButton': {
    marginRight: '5px',
  },

  '& .greenBox': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#049260',
    width: '32px',
    height: '20px',
    padding: '1px',
    borderRadius: '4px',
    marginLeft: '5px',
  },

  '@media (max-Width: 694px)': {
    width: '690px',
  },
}));
