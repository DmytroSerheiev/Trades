import React from 'react';
import { IconsStyles, InnerBox, InputBox, ModalWrapper } from './styles';
import { Box, ClickAwayListener } from '@mui/material';
import { GreenBtn, OutlinedBtn } from '@/styles/common.styles';
import Loader from '../loaderSpinner';

interface ModalProps {
  onClose: () => void;
  onConfirm?: () => void;
  renameAcc?: string | any;
  setRenameAcc: React.Dispatch<React.SetStateAction<string | any>>;
  isLoading?: boolean;
}

const RenameSubAccModal: React.FC<ModalProps> = ({
  onClose,
  onConfirm,
  renameAcc,
  setRenameAcc,
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
          <h1>Rename Sub-Account</h1>
          <InputBox sx={{ mt: '20px' }}>
            <label>Name</label>
            <input
              type="text"
              value={renameAcc}
              onChange={(e) => setRenameAcc(e.target.value)}
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
                background: renameAcc?.trim() !== '' ? '' : '#037855',
              }}
              disabled={renameAcc?.trim() === ''}
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

export default RenameSubAccModal;
