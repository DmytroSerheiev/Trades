import React, { useEffect } from 'react';
import {
  SpreadAndPairSelects,
  StyledTable,
  Tablerows,
} from '@/styles/orderbook.styles';
import { Box } from '@mui/material';
import HandleSelectItems from '../handleSelectItems';
import { usePairTokensContext } from '@/context/pairTokensContext';
import { useOrderBookTradesContext } from '@/context/orderBookTradesContext';
import { SizeEquivalentsProps } from '@/utils/usdEquivalents';
import { Order } from '@/context/orderBookTradesContext';

enum Pair {
  USD = "USD",
  ETH = "ETH",
  BTC = "BTC"
}

// Props for OrderBook component
interface OrderBookProps {
  spread: number;
  pair: Pair;
  setSpread: (spread: number) => void;
  setPair: (pair: Pair) => void;
}

// Calculate bar width as a percentage
const calculateBarWidth = (total: number, max: number) => {
  return (total / max) * 100;
};

// Get USD value if token is USD
export const getUsdEquivalentOnly = ({
  size,
  currentMarkPrice,
  token,
}: SizeEquivalentsProps) => {
  if (token.toUpperCase() === 'USD') {
    return Math.trunc(size * currentMarkPrice);
  } else {
    return size;
  }
};

// Calculate total size for each order
const calculateTotal = (orders: Order[], pair: Pair, reverse: boolean = false) => {
  let cumulativeTotal = 0;
  const ordersCopy = reverse ? [...orders].reverse() : [...orders];
  const ordersWithTotal = ordersCopy.map(order => {
    const orderSize = order.sz;
    const orderPx = order.px; 
    let sizeEquivalent = pair.toUpperCase() === 'USD'
      ? getUsdEquivalentOnly({ size: orderSize, currentMarkPrice: orderPx, token: pair })
      : orderSize;

    cumulativeTotal += sizeEquivalent;

    const roundedTotal = Number(cumulativeTotal.toFixed(2));
    return { ...order, total: roundedTotal };
  });
  return reverse ? ordersWithTotal.reverse() : ordersWithTotal;
};

// Render table rows for orders
const renderOrderBookTable = (
  orders: { px: number; sz: number; n: number }[],
  type: string,
  pair: Pair,
  reverseTotal: boolean
) => {
  const ordersWithTotal = calculateTotal(orders, pair, reverseTotal);
  const maxOrderTotal = Math.max(...ordersWithTotal.map((order) => order.total));

  return (
    <tbody>
      {ordersWithTotal.map((order, index) => (
        <Tablerows
          key={index}
          type={type}
          width={calculateBarWidth(order.total, maxOrderTotal)}
        >
          <td className="first-column">{order.px.toFixed(2)}</td>
          <td>
            {pair.toUpperCase() === 'USD'
              ? Math.trunc(getUsdEquivalentOnly({
                  size: order.sz,
                  currentMarkPrice: order.px,
                  token: pair,
                }))
              : getUsdEquivalentOnly({
                  size: order.sz,
                  currentMarkPrice: order.px,
                  token: pair,
                }).toFixed(2)}
          </td>
          <td>{pair.toUpperCase() === 'USD' ? Math.trunc(order.total) : order.total}</td>
        </Tablerows>
      ))}
    </tbody>
  );
};

// Calculate spread percentage
const calculateSpreadPercentage = (asks: Order[], bids: Order[]) => {
  if (asks.length === 0 || bids.length === 0) return 0;
  const highestBid = bids[0].px;
  const lowestAsk = asks[asks.length-1].px
  const spread = lowestAsk - highestBid;
  const spreadPercentage = parseFloat(((spread / lowestAsk ) * 100).toFixed(2)); 
  return spreadPercentage;
};

// Main component for order book
const OrderBook = ({ spread, pair, setSpread, setPair }: OrderBookProps) => {
  const { tokenPairs } = usePairTokensContext();
  const { bookData, loadingBookData } = useOrderBookTradesContext();
  const [spreadPercentage, setSpreadPercentage] = React.useState(0);

  // Get asks and bids data
  //
  // @TODO investigate how sort orders with step: 1/2/5/10/100/1000
  function getBookData() {
    let limit = 10;
    const asks = bookData.asks
      .slice(0, limit)
      .sort((a, b) => b.px - a.px);
    const bids = bookData.bids
      .slice(0, limit)
    .sort((a, b) => b.px - a.px);
    return { asks, bids };
  }

  // Update spread percentage when book data changes
  useEffect(() => {
    if (!loadingBookData) {
      const { asks, bids } = getBookData();
      if (asks.length > 0 && bids.length > 0) {
        setSpreadPercentage(calculateSpreadPercentage(asks, bids));
      }
    }
  }, [bookData, loadingBookData]);

  return (
    <Box>
      <SpreadAndPairSelects>
        <div>
          <HandleSelectItems
            styles={{ background: '#131212' }}
            selectItem={spread}
            setSelectItem={setSpread}
            selectDataItems={['1', '2', '5', '10', '100', '1000']}
          />
        </div>
        <div>
          <HandleSelectItems
            styles={{ background: '#131212' }}
            selectItem={pair}
            setSelectItem={setPair}
            selectDataItems={Array.isArray(tokenPairs) ? tokenPairs.map(tokenPair => {
              return tokenPair ? tokenPair.toString() : '';
            }) : []}
          />
        </div>
      </SpreadAndPairSelects>

      <div id="the-order-book">
        <StyledTable>
          <thead id="header">
            <tr>
              <th>Price</th>
              <th>Size({pair})</th>
              <th>Total({pair})</th>
            </tr>
          </thead>

          {loadingBookData ? (
            <span style={{ color: '#fff' }}>loading...</span>
          ) : !loadingBookData &&
            bookData.asks.length === 0 &&
            bookData.bids.length === 0 ? (
            <tbody>
              <tr
                style={{
                  color: '#fff',
                  fontSize: '14px',
                }}
              >
                No data Available for {pair}
              </tr>
            </tbody>
          ) : (
            <>
              {renderOrderBookTable(getBookData().asks, 'asks', pair, true)} {}
              {getBookData().asks.length !== 0 &&
                getBookData().bids.length !== 0 && (
                  <thead className="spread">
                    <tr>
                      <th>Spread</th>
                      <th>{spread}</th>
                      <th>{spreadPercentage}%</th>
                    </tr>
                  </thead>
                )}
              {renderOrderBookTable(getBookData().bids, 'bids', pair, false)} {}
            </>
          )}
        </StyledTable>
      </div>
    </Box>
  );
};

export default OrderBook;
