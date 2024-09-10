import { useCallback, useState, useEffect } from 'react';
import Total from './Total';
import Compare from './Compare';
import SwitchBar from './SwitchBar';
import styles from './index.less';
import { queryProductScale } from './service';
const nameMap = {
  person: '个人',
  organ: '机构',
  total: '合计',
};

export default function (props: { sectorId: number | string; floodFund: any }) {
  const [scaleData, setScaleData] = useState({
    barChartList: [],
    totalList: [],
  });
  const [types, setNewTypes] = useState({
    timeFrequency: 'day', // 时间频率
    timeFrame: 'month', // 时间范围
    scaleType: 'funds', // 类型
  });

  // 时间频率，时间范围，规模切换
  const typeChange = useCallback((item) => {
    setNewTypes(item);
  }, []);

  useEffect(() => {
    (async () => {
      if (props?.sectorId) {
        const params = {
          ...types,
          trackId: props.sectorId,
          floodFund: props.floodFund,
        };
        const data = await queryProductScale(params);

        const { scaleType } = types; // 资金规模：funds 客户规模：customer
        const isFunds = scaleType === 'funds'; // 是否是资金规模

        // 根据资金和客户渲染不同的数据
        const barChartList = (data?.barChartList || []).map((item: any) => {
          return {
            isFunds,
            date: item?.dataDate,
            name: nameMap[item?.type],
            value: isFunds ? item?.navAmt : item?.orgHolderCnt, // 存量
            totalAmount: isFunds ? item?.fundNavAmt : item?.holderAddCnt, // 合计存量
            net: isFunds ? item?.navAddAmt : item?.orgHolderAddCnt, // 净增
            totalNet: isFunds ? item?.navAddAmt : item?.orgHolderAddCnt, // 净增
            growth: Number(isFunds ? item?.rate : item?.orgHolderRate), // 增速
          };
        });

        const totalList = (data?.totalList || []).map((item: any) => {
          return {
            isFunds,
            name: nameMap[item?.type],
            date: item?.dataDate,
            totalNet: isFunds ? item?.fundNavAddAmt : item?.holderAddCnt, // 合计净增
            growth: Number(isFunds ? item?.fundNavRate : item?.holderRate), // 合计增速
          };
        });

        setScaleData({ barChartList, totalList });
      }
    })();
  }, [props?.sectorId, types, props?.floodFund]);

  return (
    <div className={styles['container']}>
      <SwitchBar
        types={types}
        onChange={(item: any) => {
          typeChange(item);
        }}
      />
      <Total data={scaleData?.barChartList as any} type={types.scaleType} />
      <Compare type={types.scaleType} data={scaleData as any} />
    </div>
  );
}
