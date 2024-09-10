import React, { useEffect, useState } from 'react';
import { Empty, Select, Space } from 'antd';
import ProCard from '@ant-design/pro-card';
import ProCardPlus from '@/components/ProCardPlus';
import { Area } from '@ant-design/charts';
import { queryMutualFundCollectChart } from '../service';
import { GUTTER_SIZE } from '@/utils/utils';

const config = {
  xField: 'date',
  yField: 'total',
  seriesField: 'fundType',
  style: { width: '100%' },
  xAxis: {
    label: {
      autoRotate: true,
    },
  },
  slider: {
    start: 0.85,
    end: 1,
  },
};

const { Option } = Select;
const DateSelectComponent = ({ type, setType }: any) => {
  return (
    <Space>
      <label>频度:</label>
      <Select
        value={type}
        onChange={(value) => {
          setType(value);
        }}
      >
        <Option value="DAY">日</Option>
        <Option value="WEEK">周</Option>
        <Option value="MONTH">月</Option>
        <Option value="QUARTER">季</Option>
        <Option value="YEAR">年</Option>
      </Select>
    </Space>
  );
};

const DataArea = () => {
  const [publishDateType, setPublishDateType] = useState('WEEK');
  const [reportDateType, setReportDateType] = useState('WEEK');
  const [publishData, setPublishData] = useState([]);
  const [reportData, setReportData] = useState([]);
  const [publishLoad, setPublishLoad] = useState(true);
  const [reportLoad, setReportLoad] = useState(true);

  useEffect(() => {
    (async () => {
      setPublishLoad(true);
      const { data } = await queryMutualFundCollectChart({
        chartType: 'REPORT',
        dateCycle: publishDateType,
      });
      setPublishLoad(false);
      setPublishData(data || []);
    })();
  }, [publishDateType]);

  useEffect(() => {
    (async () => {
      setReportLoad(true);
      const { data } = await queryMutualFundCollectChart({
        chartType: 'PUBLISH',
        dateCycle: reportDateType,
      });
      setReportLoad(false);
      setReportData(data || []);
    })();
  }, [reportDateType]);

  return (
    <ProCard gutter={[GUTTER_SIZE, 0]} ghost direction="row">
      <ProCardPlus
        loading={publishLoad}
        colSpan={12}
        title="上报增长趋势"
        layout="center"
        style={{ height: 490 }}
        extra={<DateSelectComponent type={publishDateType} setType={setPublishDateType} />}
      >
        {publishData.length === 0 ? (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        ) : (
          <Area {...config} data={publishData} />
        )}
      </ProCardPlus>
      <ProCardPlus
        loading={reportLoad}
        colSpan={12}
        title="发行增长趋势"
        layout="center"
        style={{ height: 490 }}
        extra={<DateSelectComponent type={reportDateType} setType={setReportDateType} />}
      >
        {reportData.length === 0 ? (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        ) : (
          <Area {...config} data={reportData} />
        )}
      </ProCardPlus>
    </ProCard>
  );
};
DataArea.isProCard = true;

export default DataArea;
