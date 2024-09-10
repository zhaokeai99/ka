import { createContext } from 'react';

const value: {
  date: string[];
  serDate: any;
} = {
  date: [],
  serDate: () => {},
};

export default createContext(value);
