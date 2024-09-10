import { useState, useCallback } from 'react';
import { dispatchPass } from '@/services/service';
import { API } from '@/services/api';

export default () => {
  const [dateInfo, setDateInfo] = useState<any>(null);

  const fetchDateInfo = useCallback(async () => {
    const { data } = await dispatchPass(API.marketingApi.queryFundCalendar);
    setDateInfo({ ...data });
  }, []);

  return [{ dateInfo }, { fetchDateInfo }];
};
