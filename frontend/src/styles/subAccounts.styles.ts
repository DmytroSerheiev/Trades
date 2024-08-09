import { Box, styled } from '@mui/material';
import { TextBtn } from './common.styles';

export const SubAccWrapper = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: 'calc(100vh - 70px)',
  background: '#000000',
  position: 'relative',
  //   padding:"100px 100px",
  alignItems: 'center',
  justifyContent: 'center',
  '@media (max-width: 1235px)': {
    padding: '0 20px',
  },
}));

interface linearBgProps {
  styles?: React.CSSProperties;
  bgimage?: string | any;
}

export const LinearBgColors = styled(Box)<linearBgProps>((props) => ({
  position: 'absolute',
  backgroundImage: `url('${props.bgimage}')`,
  backgroundSize: '100%, 100%',
  backgroundRepeat: 'no-repeat',
  zIndex: 0,
  ...props.styles,
  '@media (max-width: 768px)': {
    display: 'none',
  },
}));

export const SubAccountsInnerBox = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  width: '1235px',
  minHeight: '392px',
  background: '#0B0B0B',
  position: 'relative',
  zIndex: 1,
  padding: '20px 30px',
  //   boxShadow: "0px 0px 5px 0px rgba(255,255,255,0.1)",

  h1: {
    fontFamily: 'Sora',
    fontWeight: '600',
    fontSize: '20px',
  },

  '.tabs': {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    bottom: 'calc(100% + 60px)',
    width: '100%',
    left: '0px',
    gap: '5px',
  },

  '@media (max-width: 1235px)': {
    width: '100%',
  },
  '@media (max-width: 899px)': {
    padding: '20px 10px',

    h1: {
      fontSize: '18px',
    },
  },
}));

export const Accounts = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',

  h2: {
    fontFamily: 'Sora',
    fontWeight: '600',
    fontSize: '18px',
  },

  '@media (max-width: 899px)': {
    h2: {
      fontSize: '16px',
    },
  },
}));

export const ActionBtn = styled(TextBtn)(() => ({
  color: '#049260',
  padding: '0',
  background: 'transparent',
}));

//styled table

export const StyledAccTable = styled('table')(() => ({
  width: '100%',
  borderCollapse: 'collapse',
  marginTop: '20px',

  '.center-row': {
    width: '400px',
  },

  '.paddingRight': {
    paddingRight: '20px',
  },

  '.master_actions': {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContents: 'center',
    width: 'max-content',
  },

  tr: {
    color: '#fff',
    fontFamily: 'Sora',
    fontWeight: '600',
    fontSize: '15px',
  },

  thead: {
    tr: {
      borderBottom: '1px solid #FFFFFF59',
      td: {
        padding: '10px 0',
        minWidth: '150px',
      },
      '.with-actionBtn': {
        textAlign: 'right',
      },
    },
  },

  tbody: {
    tr: {
      td: {
        fontWeight: '400',
        fontSize: '14px',
        padding: '8px 0',

        span: '',
      },
      img: {
        cursor: 'pointer',
      },

      '.with-actionBtn': {
        textAlign: 'right',
      },
      '&.actions': {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContents: 'center',
        width: 'max-content',
      },
    },
  },
  '@media (max-width: 1235px)': {
    '.center-row': {
      width: '10px !important',
    },
    td: {
      minWidth: 'max-content !important',
    },
  },
  '@media (max-width: 899px)': {
    tr: {
      fontSize: '14px',
    },
    tbody: {
      tr: {
        td: {
          fontSize: '13px',
        },
      },
    },
  },
  '@media (max-width: 730px)': {
    td: {
      minWidth: '150px !important',
    },
    '.center-row': {
      minWidth: '10px !important',
    },
  },
}));
