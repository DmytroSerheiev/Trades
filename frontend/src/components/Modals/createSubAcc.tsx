import React from 'react';
import { IconsStyles, InnerBox, InputBox, ModalWrapper } from './styles';
import { Box, ClickAwayListener } from '@mui/material';
import { GreenBtn, OutlinedBtn } from '@/styles/common.styles';
import Loader from '../loaderSpinner';

interface ModalProps {
  onClose: () => void;
  onConfirm?: () => void;
  createNewAcc?: string;
  setCreateNewAcc: React.Dispatch<React.SetStateAction<string>>;
  isLoading?: boolean;
}

const CreateSubAcc: React.FC<ModalProps> = ({
  onClose,
  onConfirm,
  createNewAcc,
  setCreateNewAcc,
  isLoading,
}) => {
  return (
    <ModalWrapper>
      <ClickAwayListener onClickAway={onClose}>
        <InnerBox
          sx={{
            padding: '20px',
            width: '500px',
            h1: {
              fontSize: '16px',
              fontFamily: 'Sora',
              fontWeight: '500',
              color: '#fff',
            },
          }}
        >
          <Box id="closeIcon" sx={{ ...IconsStyles }} onClick={onClose}>
            <img src="/closeIcon.svg" alt="X" />
          </Box>
          <h1>Create Sub-Account</h1>
          <InputBox sx={{ mt: '20px' }}>
            <label>Name</label>
            <input
              type="text"
              value={createNewAcc}
              onChange={(e) => setCreateNewAcc(e.target.value)}
            />
          </InputBox>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'space-between',
              marginTop: '20px',
            }}
          >
            <OutlinedBtn sx={{ width: '48%' }} onClick={onClose}>
              Cancel
            </OutlinedBtn>
            <GreenBtn
              sx={{
                width: '48%',
                background: createNewAcc?.trim() !== '' ? '' : '#037855',
              }}
              disabled={createNewAcc?.trim() === ''}
              onClick={onConfirm}
            >
              {isLoading ? <Loader /> : 'Confirm'}
            </GreenBtn>
          </Box>
        </InnerBox>
      </ClickAwayListener>
    </ModalWrapper>
  );
};

export default CreateSubAcc;
