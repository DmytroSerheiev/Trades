import React, { useState } from "react";
import {
  PositionTabsButtonsWrapper,
  PositionsOrdersHistoryWrapper,
} from "@/styles/positionsOrdersHistory.styles";
import PositionComponentTable from "./positions";
import OpenOrdersComponentTable from "./openOrders";
import TwapComponentTable from "./twap";
import TradeHistoryComponentTable from "./tradehistory";
import FundingHistoryComponentTable from "./fundingHistory";
import OrderHistoryComponentTable from "./orderHistory";
import { TabsButtons } from "@/styles/common.styles";

const PositionsOrdersHistory = () => {
  const tabLabels = [
    "Positions",
    "Open Orders",
    "TWAP",
    "Trade History",
    "Funding History",
    "Order History",
  ];

  const [activeTab, setActiveTab] = useState(tabLabels[0]);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <PositionsOrdersHistoryWrapper>
      <PositionTabsButtonsWrapper>
        {tabLabels.map((label, index) => (
          <TabsButtons
            key={index}
            className={activeTab === label ? "active" : ""}
            onClick={() => handleTabClick(label)}
          >
            {label}
          </TabsButtons>
        ))}
      </PositionTabsButtonsWrapper>

      {/*tableComponents*/}
      {activeTab === "Positions" && <PositionComponentTable />}
      {activeTab === "Open Orders" && <OpenOrdersComponentTable />}
      {activeTab === "TWAP" && <TwapComponentTable />}
      {activeTab === "Trade History" && <TradeHistoryComponentTable />}
      {activeTab === "Funding History" && <FundingHistoryComponentTable />}
      {activeTab === "Order History" && <OrderHistoryComponentTable />}
    </PositionsOrdersHistoryWrapper>
  );
};

export default PositionsOrdersHistory;
