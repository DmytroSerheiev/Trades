import { Box } from '@mui/material';
import React, { useState } from 'react';
import {
  RiskManagerWrapper,
  TabsButton,
  TabsWrapper,
} from '@/styles/riskManager.styles';
import MarketComponent from './market';
import LimitComponent from './limit';
import TwapOrderTerminal from './twap';
import ChaseOrderTerminal from './chase';
import ScaleOrderTerminal from './scale';
import RiskManagerModal from '../Modals/riskManagerModal';
import LeverageModal from '../Modals/leverageModal';
import MarginTypeModal from '../Modals/marginTypeModal';

// Interface to define the shape of the modals state
interface optionsProps {
  [key: string]: any;
  riskManager: boolean;
  leverage: boolean;
  marginType: boolean;
}

// Array to hold the types and labels for various modal options
const options = [
  { type: 'riskManager', label: 'Risk Manager' },
  { type: 'leverage', label: 'Leverage' },
  { type: 'marginType', label: 'Margin Type' },
];

const OrderPlacementTerminal = () => {
  const [activeTab, setActiveTab] = useState('Market'); // Track the active tab
  const [activeButton, setActiveButton] = useState<string | null>(null); // Track the active modal button
  // ------Modal Visibility states------
  const [modals, setModals] = useState<optionsProps>({
    riskManager: false,
    leverage: false,
    marginType: false,
  });

  //------Risk Manager States------
  const [portfolioValue, setPortfolioValue] = useState<string | number>('');
  const [AmountValue, setAmountValue] = useState<string | number>('');

  // Toggle the visibility of a modal and set the active button
  const toggleModal = (modalType: string) => {
    setModals({
      ...modals,
      [modalType]: !modals[modalType],
    });
    setActiveButton(modalType);
  };

  // Close a specific modal and reset the active button
  const closeModal = (modalType: string) => {
    setModals({
      ...modals,
      [modalType]: false,
    });
    setActiveButton(null);
  };

  // Set the active tab based on the clicked tab nam
  const handleTabChange = (tabName: string) => {
    setActiveTab(tabName);
  };

  return (
    <RiskManagerWrapper id="order-placement-terminal">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        {options.map(({ type, label }) => (
          <div
            key={type}
            className={`captions ${activeButton === type ? 'active' : ''}`}
            onClick={() => toggleModal(type)}
          >
            {label}
          </div>
        ))}
      </Box>

      {/* Render modals based on the modals state */}
      {modals.riskManager && (
        <RiskManagerModal
          onClose={() => closeModal('riskManager')}
          portfolioValue={portfolioValue}
          setPortfolioValue={setPortfolioValue}
          AmountValue={AmountValue}
          setAmountValue={setAmountValue}
        />
      )}
      {modals.leverage && (
        <LeverageModal
          onClose={() => {
            closeModal('leverage');
            setPortfolioValue('');
            setAmountValue('');
          }}
        />
      )}
      {modals.marginType && (
        <MarginTypeModal onClose={() => closeModal('marginType')} />
      )}

      <TabsWrapper>
        {['Market', 'Limit', 'TWAP', 'Chase', 'Scale'].map((tabName) => (
          <TabsButton
            key={tabName}
            className={activeTab === tabName ? 'active' : ''}
            onClick={() => handleTabChange(tabName)}
          >
            {tabName}
          </TabsButton>
        ))}
      </TabsWrapper>

      {/* Conditionally render components based on active tab */}
      {activeTab === 'Market' && <MarketComponent />}
      {activeTab === 'Limit' && <LimitComponent />}
      {activeTab === 'TWAP' && <TwapOrderTerminal />}
      {activeTab === 'Chase' && <ChaseOrderTerminal />}
      {activeTab === 'Scale' && <ScaleOrderTerminal />}
    </RiskManagerWrapper>
  );
};

export default OrderPlacementTerminal;
