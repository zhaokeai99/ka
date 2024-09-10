import { cardGutter, contentPadding } from '@/themes';
import ProCard from '@ant-design/pro-card';
import { Spin } from 'antd';
import moment from 'moment';
import React, { memo, useEffect, useState } from 'react';
import TabsContent from './TabsContent';
import { queryIndustryNewsLimit, queryIndustryNewsChart } from './service';
import ViewList from './ViewList';
import ViewSearch from './ViewSearch';

const dateFormat = 'YYYY-MM-DD';

// 行业舆情
const IndustryPO = () => {
  const [pagination, setPagination] = useState<any>({ current: 1, pageSize: 10 });
  const [listData, setListData] = useState<any>([]);
  const [barData, setBarData] = useState<any>([]);
  const [lineData, setLineData] = useState<any>([]);
  const [num, setNum] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingList, setLoadingList] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<any>({
    ...pagination,
    chainName: {},
    isFormSearch: true,
    publicSentiment: undefined,
    chainNodeName: undefined,
    replyDate: [],
  });

  // 获取图表数据
  const getChartData = async (params: any) => {
    if (!params?.chainName) return;

    setLoading(true);

    const result = await queryIndustryNewsChart(params);
    const { success, data } = result;

    if (success) {
      if (params?.queryType === 'emotion') {
        setBarData(data || []);
      } else {
        setLineData(data || []);
      }
    }

    setLoading(false);
  };

  // 获取列表数据
  const getListData = async (params: any) => {
    if (!params?.chainName) return;

    setLoadingList(true);

    const result = await queryIndustryNewsLimit(params);

    const { success, data } = result;
    const { total, current, pageSize, dataList } = data || {};

    if (success) {
      setNum(total);
      setListData(dataList);
      setPagination({ current, pageSize });
    }

    setLoadingList(false);
  };

  // 请求list数据
  const getList = async (params: any) => {
    const startDate = params?.replyDate?.length
      ? moment(params?.replyDate[0]).format(dateFormat)
      : undefined;
    const endDate = params?.replyDate?.length
      ? moment(params?.replyDate[1]).format(dateFormat)
      : undefined;

    const { current, pageSize, publicSentiment, chainName, chainNodeName, isFormSearch } = params;

    getListData({
      current,
      pageSize,
      startDate,
      endDate,
      publicSentiment,
      chainName: chainName?.label,
      nodeId: chainNodeName,
    });

    if (isFormSearch) {
      // emotion=情绪图表  popularity=热度图表
      // 获取 情绪图表 数据
      getChartData({
        startDate,
        endDate,
        publicSentiment,
        nodeId: chainNodeName,
        chainName: chainName?.label,
        queryType: 'emotion',
      });

      // 获取 热度图表 数据
      getChartData({
        startDate,
        endDate,
        publicSentiment,
        nodeId: chainNodeName,
        chainName: chainName?.label,
        queryType: 'popularity',
      });
    }
  };

  // 条件查询获取
  const handleSearch = (value: any) => {
    const { current, pageSize } = value;

    setPagination({ current, pageSize });

    setSearchValue({ ...searchValue, ...value });
  };

  useEffect(() => {
    getList({ ...searchValue });
  }, [searchValue]);

  return (
    <ProCard
      ghost
      size="small"
      direction="column"
      gutter={[0, cardGutter]}
      style={{ padding: contentPadding, marginTop: 4 }}
    >
      <ViewSearch handleSearch={handleSearch} />
      <ProCard size="small" style={{ marginTop: '12px' }}>
        <Spin spinning={loading}>
          <TabsContent barData={barData} lineData={lineData} total={num} />
        </Spin>
        <Spin spinning={loadingList}>
          <ViewList
            total={num}
            data={listData}
            handleSearch={handleSearch}
            pagination={pagination}
          />
        </Spin>
      </ProCard>
    </ProCard>
  );
};

IndustryPO.isProCard = true;

export default memo(IndustryPO);
