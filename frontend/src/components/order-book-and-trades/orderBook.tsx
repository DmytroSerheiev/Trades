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

enum Pair {
  USD = "USD",
  ETH = "ETH",
  BTC = "BTC"
}

interface OrderBookProps {
  spread: number;
  pair: string;
  pair: Pair;
  setSpread: (spread: number) => void;
  setPair: (pair: string) => void;
}

const calculateBarWidth = (total: number, max: number) => {
  return (total / max) * 100;
};

interface Order {
  sz: number;
  px: number;
}


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


const calculateTotal = (orders: Order[], pair: Pair, reverse: boolean = false) => {
  let cumulativeTotal = 0;
  const ordersCopy = reverse ? [...orders].reverse() : [...orders];
  const ordersWithTotal = ordersCopy.map(order => {
    const orderSize = order.sz;
    const orderPx = order.px;
    let sizeEquivalent = pair.toUpperCase() === 'USD'
      ? getUsdEquivalentOnly({ size: orderSize, currentMarkPrice: orderPx, token: pair })
      : orderSize;

    // Переконайтеся, що sizeEquivalent є числом
    sizeEquivalent = Number(sizeEquivalent);

    if (isNaN(sizeEquivalent)) {
      throw new TypeError(`sizeEquivalent має бути числом, але отримано ${typeof sizeEquivalent} зі значенням ${sizeEquivalent}`);
    }

    cumulativeTotal += sizeEquivalent;

    console.log('Тип cumulativeTotal:', typeof cumulativeTotal, 'Значення:', cumulativeTotal);

    if (typeof cumulativeTotal !== 'number' || isNaN(cumulativeTotal)) {
      throw new TypeError(`cumulativeTotal має бути числом, але отримано ${typeof cumulativeTotal} зі значенням ${cumulativeTotal}`);
    }

    const roundedTotal = Number(cumulativeTotal.toFixed(2));
    return { ...order, total: roundedTotal };
  });
  return reverse ? ordersWithTotal.reverse() : ordersWithTotal;
};





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
          <td className="first-column">{Number(order.px).toFixed(2)}</td>
          <td>
            {pair.toUpperCase() === 'USD'
              ? Math.trunc(getUsdEquivalentOnly({
                  size: Number(order.sz),
                  currentMarkPrice: Number(order.px),
                  token: pair,
                }))
              : Number(getUsdEquivalentOnly({
                  size: Number(order.sz),
                  currentMarkPrice: Number(order.px),
                  token: pair,
                })).toFixed(2)}
          </td>
          <td>{pair.toUpperCase() === 'USD' ? Math.trunc(order.total) : order.total}</td>
        </Tablerows>
      ))}
    </tbody>
  );
};

const calculateSpreadPercentage = (asks: Order[], bids: Order[]) => {
  if (asks.length === 0 || bids.length === 0) return 0;
  const highestBid = bids[0].px;
  const lowestAsk = asks[0].px;
  const spread = lowestAsk - highestBid;
  const spreadPercentage = parseFloat(((spread / lowestAsk) * 100).toFixed(2)); 
  return spreadPercentage;
};

const OrderBook = ({ spread, pair, setSpread, setPair }: OrderBookProps) => {
  const { tokenPairs } = usePairTokensContext();
  const { bookData, loadingBookData } = useOrderBookTradesContext();
  const [spreadPercentage, setSpreadPercentage] = React.useState(0);

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
