import {
  PairTableContainer,
  TokenPairsInfoTableWrapper,
  TokenTableTabsWrapper,
} from '@/styles/tokenPairs.styles';
import { Box, ClickAwayListener } from '@mui/material';
import React, { useEffect, useState } from 'react';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import { usePairTokensContext } from '@/context/pairTokensContext';

interface TokenPairsInfoTableProps {
  handleClose?: () => void;
  tableISOpen?: boolean;
  fav?: any;
  setFav?: React.Dispatch<React.SetStateAction<any>>;
  id?: any;
}

//on click of star icon return the filled start else the outlined star
const FavButton = ({ fav, setFav, id }: TokenPairsInfoTableProps) => {
  const handleFavToggle = (id: any) => {
    const newFav = [...fav];
    const indexExists = newFav.indexOf(id) !== -1; //check if the id is already selected
    if (indexExists) {
      // Deselect the row
      setFav?.(newFav.filter((favIndex) => favIndex !== id));
      sessionStorage.setItem(
        'fav',
        JSON.stringify(newFav.filter((favIndex) => favIndex !== id))
      );
    } else {
      // Select the row
      newFav.push(id);
      setFav?.(newFav);

      sessionStorage.setItem('fav', JSON.stringify(newFav));
    }
  };

  return (
    <span className="favButton" onClick={() => handleFavToggle(id)}>
      {fav.includes(id) ? (
        <StarIcon fontSize="small" sx={{ color: '#049260' }} />
      ) : (
        <StarBorderIcon fontSize="small" sx={{ color: '#FFFFFF99' }} />
      )}
    </span>
  );
};

const TokenPairsInfoTable = ({
  tableISOpen,
  handleClose,
}: TokenPairsInfoTableProps) => {
  //------Hooks------
  const { tokenPairData, setAssetId, setSelectPairsTokenData } =
    usePairTokensContext();

  //------Local State------
  const [activeTab, setActiveTab] = useState('All'); // Default active tab
  const [fav, setFav] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const tabs = [
    'All',
    'DEX Only',
    'Trending',
    'Pre-launch',
    'Layer 1',
    'Defi',
    'Gaming',
    'Meme',
  ];

  const handleClickTab = (tabName: string) => {
    setActiveTab(tabName);
  };

  const handleSelectPairs = (
    data: any,
    event: any,
    assetId: number | string
  ) => {
    if (event.target.tagName === 'svg' || event.target.tagName === 'path') {
      return;
    }
    setSelectPairsTokenData(data);
    setAssetId(assetId);

    //store to local storage
    sessionStorage.setItem('assetId', JSON.stringify(assetId));
    sessionStorage.setItem('selectPairsTokenData', JSON.stringify(data));
  };

  // Sort the data based on the fav array
  const sortingDataFunction = (tokenPairData: any) => {
    const sortedPairDataArray = [...tokenPairData].sort((a, b) => {
      const isAFav = fav.includes(a.assetId);
      const isBFav = fav.includes(b.assetId);
      if (isAFav && !isBFav) return -1;
      if (!isAFav && isBFav) return 1;
      return 0;
    });
    return sortedPairDataArray;
  };

  // Filter the data based on the search query
  const filteredPairDataArray = tokenPairData?.filter((pairData: any) =>
    pairData.universe.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedOrBySearchData = () => {
    if (searchQuery.trim() === '') {
      return sortingDataFunction(tokenPairData);
    } else {
      return sortingDataFunction(filteredPairDataArray);
    }
  };

  useEffect(() => {
    // Load fav from sessionStorage when component mounts
    const savedFav = sessionStorage.getItem('fav');
    if (savedFav && tableISOpen) {
      setFav(JSON.parse(savedFav));
    }
  }, [tableISOpen]);

  return (
    <ClickAwayListener onClickAway={() => handleClose?.()}>
      <TokenPairsInfoTableWrapper>
        <input
          placeholder="Search coins..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <TokenTableTabsWrapper>
          {tabs.map((tabName) => (
            <button
              key={tabName}
              className={tabName === activeTab ? 'active' : ''}
              onClick={() => handleClickTab(tabName)}
            >
              {tabName}
            </button>
          ))}
        </TokenTableTabsWrapper>

        <Box
          sx={{
            maxHeight: '100%',
            overflowY: 'auto',
            overflowX: 'auto',

            '@media (max-width :599px)': {
              '&::-webkit-scrollbar': {
                display: 'none',
              },
            },
          }}
        >
          <PairTableContainer>
            <thead
              style={{
                position: 'sticky',
                top: '0',
                zIndex: '1',
                background: '#000000',
              }}
            >
              <tr>
                <th>Symbol</th>
                <th>Last Price</th>
                <th>24hr Change</th>
                <th>8hr Funding</th>
                <th>Volume</th>
                <th>Open Interest</th>
              </tr>
            </thead>
            <tbody>
              {sortedOrBySearchData()?.map((pairData, index) => (
                <tr
                  key={index}
                  onClick={(event) =>
                    handleSelectPairs(pairData, event, pairData.assetId)
                  }
                >
                  <td id="centered-content">
                    <FavButton
                      fav={fav}
                      setFav={setFav}
                      id={pairData.assetId}
                    />
                    <span>{pairData.pairs}</span>
                    <span className="greenBox">
                      {pairData.universe.maxLeverage}X
                    </span>
                  </td>
                  <td>{pairData.assetCtx.markPx}</td>
                  <td
                    style={{
                      color: pairData.changeIncrease
                        ? 'rgb(0, 255, 0)'
                        : 'rgb(255, 0, 0)',
                    }}
                  >
                    {pairData.hr24Change ? pairData.hr24Cahnge : '- -'}
                  </td>
                  <td>{pairData.assetCtx.funding}</td>
                  <td>{pairData.volume ? pairData.volume : '- -'}</td>
                  <td>{pairData.assetCtx.openInterest}</td>
                </tr>
              ))}
            </tbody>
          </PairTableContainer>
        </Box>
      </TokenPairsInfoTableWrapper>
    </ClickAwayListener>
  );
};

export default TokenPairsInfoTable;
