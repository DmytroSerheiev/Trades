import React from 'react';
import PairTokensProvider from './pairTokensContext';
import OrderBookTradesProvider from './orderBookTradesContext';
import WebDataProvider from './webDataContext';
import HyperliquidProvider from './hyperLiquidContext';
import TradeHistoryProvider from './tradeHistoryContext';
import FundingHistoryProvider from './fundingHistoryContext';
import OrderHistoryProvider from './orderHistoryContext';
import TwapHistoryProvider from './twapHistoryContext';
import SwitchAccountProvider from './switchTradingAccContext';

const ContextProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <WebDataProvider>
      <HyperliquidProvider>
        <PairTokensProvider>
          <OrderBookTradesProvider>
            <TradeHistoryProvider>
              <FundingHistoryProvider>
                <OrderHistoryProvider>
                  <TwapHistoryProvider>
                    <SwitchAccountProvider>
                      <React.Fragment>{children}</React.Fragment>
                    </SwitchAccountProvider>
                  </TwapHistoryProvider>
                </OrderHistoryProvider>
              </FundingHistoryProvider>
            </TradeHistoryProvider>
          </OrderBookTradesProvider>
        </PairTokensProvider>
      </HyperliquidProvider>
    </WebDataProvider>
  );
};

export default ContextProviders;
