import { SettingsModalWrapper, StyledCheckBox } from '@/styles/navbar.styles';
import { Box, ClickAwayListener } from '@mui/material';
import React, { useState } from 'react';

interface settingsProps {
  onClose: () => void;
}

type SettingsState = {
  [key: string]: boolean;
};

const settingsOptions = [
  { id: 'skipOrderOpen', label: 'Skip Order Open Confirmation' },
  { id: 'skipOrderClose', label: 'Skip Order Close Confirmation' },
  { id: 'persistentConnection', label: 'Persistent Trading Connection' },
  { id: 'customizeLayout', label: 'Customize Layout' },
  { id: 'orderbookSetSize', label: 'Orderbook Set Size on Click' },
  { id: 'displayVerboseErrors', label: 'Display Verbose Errors' },
  { id: 'displayNotification', label: 'Display Notification' },
  { id: 'showWarnings', label: 'Show Warnings' },
];
const SettingsModal: React.FC<settingsProps> = ({ onClose }) => {
  const [settings, setSettings] = useState<SettingsState>({
    skipOrderOpen: false,
    skipOrderClose: false,
    persistentConnection: false,
    customizeLayout: false,
    orderbookSetSize: false,
    displayVerboseErrors: false,
    displayNotification: false,
    showWarnings: false,
    returnDefault: false,
  });

  const handleSettingChange =
    (settingId: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setSettings((prevSettings) => ({
        ...prevSettings,
        [settingId]: event.target.checked,
      }));
    };

  const resetToDefault = () => {
    setSettings({
      skipOrderOpen: false,
      skipOrderClose: false,
      persistentConnection: false,
      customizeLayout: false,
      orderbookSetSize: false,
      displayVerboseErrors: false,
      displayNotification: false,
      showWarnings: false,
      returnDefault: true,
    });
  };

  const SettingItem: React.FC<{
    label: string;
    checked: boolean;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  }> = ({ label, checked, onChange }) => (
    <Box className="settingItems">
      <label>{label}</label>
      <StyledCheckBox>
        <input type="checkbox" checked={checked} onChange={onChange} />
      </StyledCheckBox>
    </Box>
  );

  return (
    <ClickAwayListener onClickAway={onClose}>
      <SettingsModalWrapper>
        <Box className="innerBox">
          {settingsOptions.map((option) => (
            <SettingItem
              key={option.id}
              label={option.label}
              checked={settings[option.id]}
              onChange={handleSettingChange(option.id)}
            />
          ))}
          <Box sx={{ padding: '2px 0' }} onClick={resetToDefault}>
            <label>
              <span>Return to Default Layout</span>
            </label>
          </Box>
        </Box>
      </SettingsModalWrapper>
    </ClickAwayListener>
  );
};

export default SettingsModal;
