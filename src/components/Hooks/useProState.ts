import { useState, useCallback } from 'react';

function useProState<T>(props: T, callback?: () => any): [T, (newState: any) => void] {
  const [data, setData] = useState(callback || props);
  const setState = useCallback(newState => {
    setData((preState: any) => ({
        ...preState,
        ...newState,
      }));
    }, [],
  )

  return [<T>data, setState];
}

export default useProState;
