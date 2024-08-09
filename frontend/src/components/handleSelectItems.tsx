import React from 'react';
import { ItemsSelect } from '@/styles/common.styles';

export interface HandleSelectProps {
  selectItem: any;
  setSelectItem: React.Dispatch<React.SetStateAction<any>>;
  selectDataItems: string[];
  styles?: React.CSSProperties;
  className?: string;
  toLowerCase?: boolean;
}

const HandleSelectItems = ({
  selectItem,
  setSelectItem,
  selectDataItems,
  styles,
  className,
  toLowerCase,
}: HandleSelectProps) => {
  return (
    <ItemsSelect
      sx={styles}
      value={selectItem}
      onChange={(e) => setSelectItem(e.target.value)}
      className={className}
    >
      {selectDataItems?.map((value, index) => (
        <option key={index} value={value}>
          {toLowerCase ? value : value.toUpperCase()}
        </option>
      ))}
    </ItemsSelect>
  );
};

export default HandleSelectItems;
