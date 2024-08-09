import React, { useEffect, useState } from "react";
import { TabsButtons } from "@/styles/common.styles";
import {
  OrderBookContainer,
  OrderBookTabsWrapper,
} from "@/styles/orderbook.styles";
import OrderBook from "./orderBook";
import Trades from "./trades";
import { usePairTokensContext } from "@/context/pairTokensContext";

const OrderBookAndTrades = () => {
  const [activeTab, setActiveTab] = useState("Order Book");
  const [spread, setSpread] = useState(1);
  const { pair, setPair } = usePairTokensContext();

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <OrderBookContainer>
      <OrderBookTabsWrapper>
        {["Order Book", "Trades"].map((label) => (
          <TabsButtons
            key={label}
            sx={{
              backgroundColor: "#34484D",
              minWidth: "110px",
              height: "30px",
            }}
            className={activeTab === label ? "active" : ""}
            onClick={() => handleTabClick(label)}
          >
            {label}
          </TabsButtons>
        ))}
      </OrderBookTabsWrapper>

      {activeTab === "Order Book" && (
        <OrderBook
          spread={spread}
          pair={pair}
          setSpread={setSpread}
          setPair={setPair}
        />
      )}
      {activeTab === "Trades" && <Trades />}
    </OrderBookContainer>
  );
};

export default OrderBookAndTrades;
