import { cardGutter, contentPadding } from '@/themes';
import ProCard from '@ant-design/pro-card';
import { Spin } from 'antd';
import moment from 'moment';
import React, { memo, useEffect, useState } from 'react';
import { queryIndustryPolicyListLimit, queryIndustryPolicyDataGroupBy } from './service';
import ViewList from './ViewList';
import ViewSearch from './ViewSearch';
import PreliminaryResults from './Chartsanalyse';

const dateFormat = 'YYYY-MM-DD';

// 行业政策
const IndustryPolicy = () => {
  const [pagination, setPagination] = useState<any>({ current: 1, pageSize: 10 });
  const [listData, setListData] = useState<any>([]);
  const [barData, setBarData] = useState<any>([]);
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
    if (!params?.industryName) return;

    setLoading(true);

    const result = await queryIndustryPolicyDataGroupBy(params);
    const { success, data } = result;

    if (success) {
      setBarData(data || []);
    }

    setLoading(false);
  };

  // 获取列表数据
  const getListData = async (params: any) => {
    if (!params?.industryName) return;

    setLoadingList(true);

    const result = await queryIndustryPolicyListLimit(params);

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

    const { current, pageSize, publicSentiment, chainName, chainNodeName, isFormSearch, emotion } =
      params;

    getListData({
      emotion,
      current,
      pageSize,
      startDate,
      endDate,
      publicSentiment,
      industryName: chainName?.label,
      nodeName: chainNodeName,
    });

    if (isFormSearch) {
      // 获取 情绪图表 数据
      getChartData({
        emotion,
        startDate,
        endDate,
        publicSentiment,
        nodeName: chainNodeName,
        industryName: chainName?.label,
        queryType: 'emotion',
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
    getList(searchValue);
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
          <PreliminaryResults data={barData} total={num} />
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

IndustryPolicy.isProCard = true;

export default memo(IndustryPolicy);
