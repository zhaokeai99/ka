import React, { useState } from 'react';

export const FilterContext = React.createContext({
  subObj: {},
  subscribe: (key: string, value: string) => {
    console.log(key, value);
  },
});

export function Filter({ children }: any) {
  const [sub, setSub] = useState({
    subObj: {},
    subscribe: (key: string, value: string) => {
      setSub({
        ...sub,
        subObj: {
          ...sub.subObj,
          [key]: value,
        },
      });
    },
  });

  return <FilterContext.Provider value={sub}>{children}</FilterContext.Provider>;
}
