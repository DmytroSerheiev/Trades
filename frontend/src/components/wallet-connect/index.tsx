import { Box } from '@mui/material';
import {
  ConnectWallet,
  darkTheme,
  useDisconnect,
  useSwitchChain,
} from '@thirdweb-dev/react';

interface WalletConnProps {
  bgColor?: string;
  textColor?: string;
  btnTitle?: string;
}
export default function WalletConnectModal({
  bgColor,
  textColor,
  btnTitle,
}: WalletConnProps) {
  return (
    <Box
      sx={{
        height: '40px',
        img: {
          width: '20px',
          height: '20px',
        },
      }}
    >
      <ConnectWallet
        modalSize={'compact'}
        showThirdwebBranding={false}
        hideSendButton={true}
        hideReceiveButton={true}
        hideSwitchToPersonalWallet={true}
        hideTestnetFaucet={true}
        btnTitle={btnTitle ? btnTitle : 'wallet connect'}
        modalTitleIconUrl={''}
        style={{
          width: '100%',
          height: '100%',
          color: '#fff',
        }}
        theme={darkTheme({
          colors: {
            primaryButtonBg: bgColor ? bgColor : '#049260',
            primaryButtonText: textColor ? textColor : '#fff',
            skeletonBg: '#049260',
            accentButtonBg: '#049260',
            accentText: '#049260',
          },
          fontFamily: 'Sora',
        })}
      />
    </Box>
  );
}
