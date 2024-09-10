import ProCardPlus from '@/components/ProCardPlus';
import { Col, DatePicker, Radio, Row, Space } from 'antd';
import moment from 'moment';
import React, { useCallback, useMemo, useState } from 'react';
import ItemBar from './ItemBar';
import ItemColumn from './ItemColumn';
import ItemPie from './ItemPie';

const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';

const DataChart = () => {
  const [chartType, setChartType] = useState('ISSUE');
  const [dateRange, setDateRange] = useState({
    startDate: moment().subtract(1, 'year').format(dateFormat),
    endDate: moment().format(dateFormat),
  });

  const handleDateChange = useCallback((_dateList, dataStr) => {
    setDateRange((preState) => {
      return {
        startDate: dataStr[0] || preState.startDate,
        endDate: dataStr[1] || preState.endDate,
      };
    });
  }, []);

  const handleRadioChange = useCallback(
    (e) => {
      const val = e.target.value;
      setChartType(val);
    },
    [dateRange],
  );

  const TabRender = useMemo(() => {
    return (
      <Radio.Group
        value={chartType}
        onChange={handleRadioChange}
        optionType="button"
        buttonStyle="solid"
      >
        <Radio.Button value="RESERVE">产品储备</Radio.Button>
        <Radio.Button value="ISSUE">产品新发</Radio.Button>
      </Radio.Group>
    );
  }, [chartType, handleRadioChange]);

  const TitleRender = useMemo(() => {
    return (
      <Space>
        <label>统计范围:</label>
        <RangePicker
          value={[moment(dateRange.startDate), moment(dateRange.endDate)]}
          format={dateFormat}
          onChange={handleDateChange}
        />
      </Space>
    );
  }, [dateRange]);

  return (
    <ProCardPlus
      ghost
      style={{ background: '#fff' }}
      bordered
      headerBordered
      title={TitleRender}
      extra={TabRender}
    >
      <Row>
        <Col span={8}>
          <ItemColumn
            chartType={chartType}
            startDate={dateRange?.startDate}
            endDate={dateRange?.endDate}
          />
        </Col>
        <Col span={8}>
          <ItemBar
            chartType={chartType}
            startDate={dateRange?.startDate}
            endDate={dateRange?.endDate}
          />
        </Col>
        <Col span={8}>
          <ItemPie
            chartType={chartType}
            startDate={dateRange?.startDate}
            endDate={dateRange?.endDate}
          />
        </Col>
      </Row>
    </ProCardPlus>
  );
};

DataChart.isProCard = true;

export default DataChart;
