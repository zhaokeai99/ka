import { createContext } from 'react';

const value: {
  compareIndexCodes: string[];
  setCompareIndexCodes: any;
} = {
  compareIndexCodes: [],
  setCompareIndexCodes: () => {},
};

export const IndexMapContext = createContext(value);
