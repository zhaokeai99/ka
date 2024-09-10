import React, { useState, useEffect } from 'react';
import ProCard from '@ant-design/pro-card';
import {
  queryFundManagerHoldBondInfo,
  queryFundManagerCombinationInfo,
  queryFundManagerHoldBondSenEvent,
  queryLastWorkDay,
  queryEventDateRange,
} from './service';
import { cardGutter, contentPadding } from '@/themes';
import EventCard from './EventCard';
import CombinationCard from './CombinationCard';
import BundCard from './BundCard';
import moment from 'moment';

interface dateRangeType {
  subTypeName: string;
  subTypeCode: string;
}

const FundManager: React.FC = () => {
  // 搜索项
  const [tDate, setTDate] = useState('');
  const [bondSearchContext, setBondSearchContext] = useState('');
  // 选定债券
  const [checkedBondCode, setCheckedBondCode] = useState('');
  // 债券清单
  const [bondData, setBondData] = useState<any[]>([]);
  // 组合持仓
  const [combinationList, setCombinationList] = useState<any[]>([]);
  const [combinationTotal, setCombinationTotal] = useState('');
  // 舆情信息 范围
  const [dateRangeVal, setDateRangeVal] = useState('');
  const [dateRangeOptions, setDateRangeOptions] = useState([]);
  // 舆情信息
  const [eventList, setEventList] = useState([]);
  const [eventTotal, setEventTotal] = useState('');

  // 获取初始化日期
  useEffect(() => {
    (async () => {
      const [date, dateRangeList] = await Promise.all([queryLastWorkDay(), queryEventDateRange()]);
      setTDate(date);
      setDateRangeVal(dateRangeList[0]?.subTypeCode);
      setDateRangeOptions(
        dateRangeList.map((i: dateRangeType) => ({ label: i.subTypeName, value: i.subTypeCode })),
      );
    })();
  }, []);

  // 请求债券清单数据
  useEffect(() => {
    (async () => {
      if (!tDate) return;
      setCombinationList([]);
      setCheckedBondCode('');
      setCombinationTotal('');
      const data = await queryFundManagerHoldBondInfo({ tDate, bondSearchContext });
      setBondData(data);
      setCheckedBondCode(data[0]?.bondCode || ' ');
    })();
  }, [tDate, bondSearchContext]);

  // 获取组合持仓情况
  useEffect(() => {
    (async () => {
      if (!(checkedBondCode && tDate)) return;
      const { combinationBaseInfoList, hldBalanceTotal } = await queryFundManagerCombinationInfo({
        tDate,
        bondCode: checkedBondCode,
      });
      setCombinationList(combinationBaseInfoList || []);
      setCombinationTotal(hldBalanceTotal || '');
    })();
  }, [checkedBondCode]);

  // 获取舆情信息
  useEffect(() => {
    (async () => {
      if (!(checkedBondCode && dateRangeVal && tDate)) return;
      setEventList([]);
      setEventTotal('');
      const data = await queryFundManagerHoldBondSenEvent({
        tDate: moment(new Date()).format('YYYY-MM-DD'),
        bondCode: checkedBondCode,
        eventDateRangeType: dateRangeVal,
      });
      setEventList(data.eventList || []);
      setEventTotal(data.eventTotal || '');
    })();
  }, [checkedBondCode, dateRangeVal]);

  return (
    <ProCard style={{ padding: contentPadding }} ghost gutter={[cardGutter, 0]} size="small">
      <ProCard ghost direction="column" gutter={[0, cardGutter]} colSpan={12}>
        <BundCard
          date={tDate}
          setDate={(date: string) => setTDate(date)}
          searchTextChange={setBondSearchContext}
          changeBund={setCheckedBondCode}
          dataSource={bondData}
        />
        {/* 组合持仓 */}
        <CombinationCard dataSource={combinationList} total={combinationTotal} />
      </ProCard>
      {/* 舆情信息 */}
      <ProCard ghost colSpan={12}>
        <EventCard
          dateRangeVal={dateRangeVal}
          eventList={eventList}
          eventTotal={eventTotal}
          setDateRangeVal={setDateRangeVal}
          dateRangeOptions={dateRangeOptions}
        />
      </ProCard>
    </ProCard>
  );
};

export default FundManager;
