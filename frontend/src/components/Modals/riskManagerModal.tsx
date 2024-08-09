import { Box, Button, ClickAwayListener, styled } from '@mui/material';
import React, { useState } from 'react';
import { IconsStyles, InnerBox, ModalWrapper } from './styles';

interface ModalProps {
  onClose: () => void;
  portfolioValue: string | number;
  setPortfolioValue: React.Dispatch<React.SetStateAction<string | number>>;
  AmountValue: string | number;
  setAmountValue: React.Dispatch<React.SetStateAction<string | number>>;
}

const RiskManagerModal: React.FC<ModalProps> = ({
  onClose,
  portfolioValue,
  setPortfolioValue,
  AmountValue,
  setAmountValue,
}) => {
  const [isPortfolio, setIsPortfolio] = useState(true);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    isPortfolio ? setPortfolioValue(value) : setAmountValue(value);
  };

  const handleButtonClick = (value: boolean) => {
    setIsPortfolio(value);
    setPortfolioValue('');
    setAmountValue('');
  };

  return (
    <ModalWrapper>
      <ClickAwayListener onClickAway={onClose}>
        <InnerBox sx={{ alignItems: 'center', justifyContent: 'center' }}>
          <Box id="closeIcon" sx={{ ...IconsStyles }} onClick={onClose}>
            <img src="/closeIcon.svg" alt="X" />
          </Box>
          <R_InputBox>
            <span>1R =</span>
            <input
              type="number"
              value={isPortfolio ? portfolioValue : AmountValue}
              onChange={handleChange}
            />
          </R_InputBox>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              mt: '10px',
              width: '255px',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <Buttons
              onClick={() => handleButtonClick(true)}
              className={isPortfolio ? 'active' : ''}
            >
              % Portfolio
            </Buttons>
            <Buttons
              onClick={() => handleButtonClick(false)}
              className={isPortfolio ? '' : 'active'}
            >
              $ Amount
            </Buttons>
          </Box>
        </InnerBox>
      </ClickAwayListener>
    </ModalWrapper>
  );
};

export default RiskManagerModal;

const R_InputBox = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  background: '#171b26',
  width: '255px',
  height: '33px',
  borderRadius: '7px',
  padding: '0 15px',

  ':hover': {
    border: '1px solid #fff',
    cursor: 'pointer',
  },
  span: {
    color: '#fff',
    fontFamily: 'Sora',
    fontWeight: '600',
    fontSize: '13px',
    marginRight: '10px',
  },

  input: {
    outline: 'none',
    border: 'none',
    color: '#fff',
    fontFamily: 'Sora',
    fontSize: '13px',
    fontWeight: '400',
    background: 'transparent',
    width: '80%',
    height: '100%',
  },
}));

const Buttons = styled(Button)(() => ({
  textTransform: 'capitalize',
  color: '#fff',
  fontFamily: 'Sora',
  fontWeight: '400',
  fontSize: '13px',
  background: '#171b26',
  width: '124px',
  height: '33px',
  borderRadius: '7px',
  cursor: 'pointer',

  ':hover': {
    background: '#063021',
  },
  '&.active': {
    background: '#049260',
  },
}));
