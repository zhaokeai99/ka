import { cardGutter, contentPadding } from '@/themes';
import ProCard from '@ant-design/pro-card';
import { Spin } from 'antd';
import moment from 'moment';
import React, { memo, useEffect, useState } from 'react';
import PreliminaryResults from './Chartsanalyse';
import { queryIndustryReportInfoLimit, queryIndustryReportInfoToChart } from './service';
import ViewList from './ViewList';
import ViewSearch from './ViewSearch';

const dateFormat = 'YYYYMMDD';

// 研报分析
const RestoAnalyse: React.FC = () => {
  const [pagination, setPagination] = useState<any>({ current: 1, pageSize: 10 });
  const [listData, setListData] = useState<any>([]);
  const [barData, setBarData] = useState<any>([]);
  const [num, setNum] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [chartLoading, setChartLoading] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<any>({
    isFormSearch: true,
    reportViewpoint: undefined,
    replyDate: undefined,
    ratingInstitute: undefined,
    industryName: undefined,
    ...pagination,
  });

  const getChartData = async (params: any) => {
    setChartLoading(true);

    const result = await queryIndustryReportInfoToChart(params);
    const { success, data } = result;

    if (success) {
      setBarData(data || []);
    }

    setChartLoading(false);
  };

  const getListData = async (params: any) => {
    setLoading(true);

    const result = await queryIndustryReportInfoLimit(params);
    const { success, data } = result;
    const { total, current, pageSize, dataList } = data || {};

    if (success) {
      setNum(total);
      setListData(dataList);
      setPagination({ current, pageSize });
    }

    setLoading(false);
  };

  // 请求list数据
  const getList = async (params: any) => {
    const startDate = params?.replyDate?.length
      ? moment(params?.replyDate[0]).format(dateFormat)
      : undefined;
    const endDate = params?.replyDate?.length
      ? moment(params?.replyDate[1]).format(dateFormat)
      : undefined;

    const { current, pageSize, reportViewpoint, ratingInstitute, industryName, isFormSearch } =
      params;

    getListData({
      current,
      pageSize,
      startDate,
      endDate,
      reportViewpoint,
      ratingInstitute,
      industryName,
    });

    if (isFormSearch) {
      getChartData({
        startDate,
        endDate,
        reportViewpoint,
        ratingInstitute,
        industryName,
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
      style={{ padding: contentPadding }}
    >
      <ViewSearch handleSearch={handleSearch} />
      <Spin spinning={chartLoading}>
        <PreliminaryResults data={barData} total={num} />
      </Spin>
      <Spin spinning={loading}>
        <ViewList total={num} handleSearch={handleSearch} pagination={pagination} data={listData} />
      </Spin>
    </ProCard>
  );
};

export default memo(RestoAnalyse);
