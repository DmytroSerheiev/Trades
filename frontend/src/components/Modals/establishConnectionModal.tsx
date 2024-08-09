import React from 'react';
import { IconsStyles, InnerBox, ModalWrapper } from './styles';
import { Box, ClickAwayListener, Divider } from '@mui/material';
import { GreenBtn } from '@/styles/common.styles';
import Loader from '../loaderSpinner';

interface ModalProps {
  onClose: () => void;
  onEstablishConnection: () => void;
  isLoading?: boolean;
}

//TODO: establish connection if not connected, make the modal global

const EstablishConnectionModal: React.FC<ModalProps> = ({
  onClose,
  onEstablishConnection,
  isLoading,
}) => {
  return (
    <ModalWrapper sx={{ zIndex: 102 }}>
      <ClickAwayListener onClickAway={onClose}>
        <InnerBox sx={{ alignItems: 'center' }}>
          <Box id="closeIcon" sx={{ ...IconsStyles }} onClick={onClose}>
            <img src="/closeIcon.svg" alt="X" />
          </Box>
          <Divider
            sx={{
              background: 'rgba(255, 255, 255, 0.3)',
              width: '100%',
              mt: '50px',
            }}
          />

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '125px',
              h1: {
                color: '#fff',
                fontFamily: 'Sora',
                fontSize: '16px',
                fontWeight: '500',
                mt: '10px',
                mb: '5px',
              },
              p: {
                color: '#fff',
                fontFamily: 'Sora',
                fontSize: '13px',
                fontWeight: '300',
                textAlign: 'center',
              },
            }}
          >
            <h1>Establish Connection</h1>
            <p>
              This signature is gas-free to send. It opens a decentralized
              channel for gas-free and instantaneous trading.
            </p>
          </Box>

          <Box
            sx={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderTop: '1px solid rgba(255, 255, 255, 0.3)',
              height: '70px',
            }}
          >
            <GreenBtn
              sx={{ width: '80%' }}
              onClick={onEstablishConnection}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader message="Establishing ..." />
              ) : (
                'Establish Connection'
              )}
            </GreenBtn>
          </Box>
        </InnerBox>
      </ClickAwayListener>
    </ModalWrapper>
  );
};

export default EstablishConnectionModal;
