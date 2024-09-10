import React, { useEffect, useState, useCallback, useMemo, memo } from 'react';
import { AutoComplete, Empty } from 'antd';
// import ProCard from '@ant-design/pro-card';
import ProCardPlus from '@/components/ProCardPlus';
import { Pie } from '@ant-design/charts';
import { queryFundCompanyList, queryNumByManagerGroupByFundType } from '../service';

interface propsType {
  startDate: string;
  endDate: string;
  chartType: string;
}

//基金储备数量
const ItemPie = (props: propsType) => {
  const { startDate, endDate, chartType } = props;
  const [managerName, setManagerName] = useState('');
  const [companyList, setCompanyList] = useState([]);
  const [list, setList] = useState<any[]>([]);
  const [totalStr, setTotalStr] = useState('');
  const [loading, setLoading] = useState(true);

  const getCompanyList = useCallback(async () => {
    const result = await queryFundCompanyList({});
    setCompanyList(() => {
      return result.map((key: string) => {
        return { value: key };
      });
    });
  }, []);

  // 获取基金储备数量
  const getNumByManagerGroupByFundType = useCallback(async (paramsObj) => {
    setLoading(true);
    const {
      dataList,
      total = '',
      manager = '',
    } = await queryNumByManagerGroupByFundType(paramsObj);
    setLoading(false);
    setTotalStr(total);
    setManagerName(manager);
    if (!Array.isArray(dataList)) {
      return;
    }
    setList(() => {
      return dataList.map((item: any) => {
        return {
          ...item,
          value: Number(item.value),
        };
      });
    });
  }, []);

  const handleCompanyChange = useCallback(
    (value) => {
      getNumByManagerGroupByFundType({
        startDate,
        endDate,
        chartType,
        manager: value,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [startDate, endDate, chartType],
  );

  useEffect(
    () => {
      getCompanyList();
      getNumByManagerGroupByFundType({
        startDate,
        endDate,
        chartType,
        manager: '',
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [startDate, endDate, chartType],
  );

  const pieConfig: any = useMemo(() => {
    return {
      data: list,
      angleField: 'value',
      colorField: 'name',
      style: { width: '98%', height: '98%' },
      radius: 1,
      innerRadius: 0.6,
      label: {
        type: 'inner',
        offset: '-50%',
        content: '{value}',
        style: {
          textAlign: 'center',
          fontSize: 14,
        },
      },
      legend: {
        itemName: {
          formatter: (text: string, item: any, index: number) => {
            const currItem: any = list[index] || {};
            return `${currItem.name} ｜ ${currItem.percent}  ${currItem.value}`;
          },
        },
        maxWidthRatio: 0.4,
      },
      statistic: {
        title: {
          content: `${managerName}存储数量`,
          style: {
            whiteSpace: 'pre-wrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            fontSize: '12px',
            lineHeight: '16px',
          },
        },
        content: {
          style: {
            whiteSpace: 'pre-wrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            fontSize: '16px',
            lineHeight: '24px',
          },
          content: totalStr,
        },
      },
    };
  }, [list, totalStr, managerName]);

  return (
    <ProCardPlus
      loading={loading}
      size="small"
      title="基金储备数量"
      layout="center"
      style={{ height: 300 }}
      extra={
        <AutoComplete
          size="small"
          style={{ width: 200 }}
          options={companyList}
          placeholder="基金公司-单选"
          filterOption={(inputValue, option) =>
            option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
          }
          onSelect={handleCompanyChange}
        />
      }
    >
      {list.length === 0 ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /> : <Pie {...pieConfig} />}
    </ProCardPlus>
  );
};

export default memo(ItemPie);
