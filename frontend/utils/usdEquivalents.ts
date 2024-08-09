export interface SizeEquivalentsProps {
  size: number;
  currentMarkPrice: number;
  token: string;
}

// To calculate the USD equivalent of a given size of a token pair
export const getUsdSizeEquivalents = ({
  size,
  currentMarkPrice,
  token,
}: SizeEquivalentsProps) => {
  if (token.toUpperCase() === 'USD') {
    return size * currentMarkPrice;
  } else {
    return size / currentMarkPrice;
  }
};
