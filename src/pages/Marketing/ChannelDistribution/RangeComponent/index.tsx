import React, { useState } from 'react';
import { Select, DatePicker, Row, Col } from 'antd';
import moment from 'moment';

const { RangePicker } = DatePicker;
const { Option } = Select;

const RangeComponent: React.FC<{
  onChange: any;
  selectType?: any;
  startDate?: any;
  endDate?: any;
}> = ({ onChange, selectType, startDate, endDate }) => {
  const [showRangePicker, setShowRangePicker] = useState(false);
  const [rangeDate, setRangeDate] = useState<any>([
    moment(startDate) || moment().startOf('weeks'),
    moment(endDate) || moment().subtract(1, 'days'),
  ]);

  const selectOnChange = (value: any) => {
    let start: any = '';
    switch (value) {
      case 'halfYear':
        const currentMonth = moment().month() + 1;
        const currentYear = moment().year();
        start = currentMonth > 6 ? moment(`${currentYear}-07-01`) : moment(`${currentYear}-01-01`);
        break;
      case 'more':
        start = '';
        break;
      default:
        start = moment().startOf(value);
        break;
    }
    if (value !== 'more') {
      setShowRangePicker(false);
      setRangeDate([start, moment().subtract(1, 'days')]);
      onChange({
        startDate: moment(start).format('YYYY-MM-DD'),
        endDate: moment().subtract(1, 'days').format('YYYY-MM-DD'),
      });
    } else {
      setShowRangePicker(true);
    }
  };

  const rangeOnChange = (value: any) => {
    setRangeDate(value || []);
    onChange({
      startDate: value && value[0].format('YYYY-MM-DD'),
      endDate: value && value[1].format('YYYY-MM-DD'),
    });
  };

  const disabledDate = (current: any) => {
    return current && (current < moment('2020-01-01') || current > moment().subtract(1, 'days'));
  };

  return (
    <Row style={{ width: '400px' }} gutter={[8, 0]}>
      <Col span={8}>
        <Select
          defaultValue={selectType || 'weeks'}
          style={{ width: '100%' }}
          onChange={selectOnChange}
        >
          <Option value="weeks">本周</Option>
          <Option value="months">本月</Option>
          <Option value="quarters">本季度</Option>
          <Option value="halfYear">半年</Option>
          <Option value="years">今年以来</Option>
          <Option value="more">更多时间</Option>
        </Select>
      </Col>
      <Col span={16}>
        <RangePicker
          style={{ width: '100%' }}
          onChange={rangeOnChange}
          disabled={!showRangePicker}
          value={rangeDate}
          disabledDate={disabledDate}
        />
      </Col>
    </Row>
  );
};

export default RangeComponent;
