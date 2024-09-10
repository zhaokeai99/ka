import React, { useState } from 'react';
import { Select, DatePicker } from 'antd';
import styles from './index.less';
import moment from 'moment';

const { Option } = Select;

const pickerEnum = {
  date: '1',
  week: '2',
  month: '3',
  quarter: '4',
  year: '5',
};

const PickerComponent: React.FC<{
  onChange: any;
  initialDate?: any;
  initialType?: any;
  valueWidth?: any;
  labelWidth?: any;
}> = ({ onChange, initialDate, initialType, valueWidth, labelWidth }) => {
  const initialPickerType = initialType
    ? Object.keys(pickerEnum).find((k) => pickerEnum[k] === initialType)
    : 'date';
  const initialPickerDate = initialDate ? moment(initialDate) : '';
  const [type, setType] = useState(initialType || pickerEnum.date);
  const [pickerType, setPickerType] = useState<any>(initialPickerType);
  const [pickerValue, setPickerValue] = useState<any>(initialPickerDate);

  const selectOnChange = (value: any) => {
    let selectType = '';
    switch (value) {
      case pickerEnum.date:
        selectType = 'date';
        break;
      case pickerEnum.week:
        selectType = 'week';
        break;
      case pickerEnum.month:
        selectType = 'month';
        break;
      case pickerEnum.quarter:
        selectType = 'quarter';
        break;
      case pickerEnum.year:
        selectType = 'year';
        break;
      default:
        selectType = 'date';
        break;
    }
    setPickerType(selectType);
    setType(value);
    setPickerValue('');
  };

  const pickerOnChange = (value: any, valStr: any) => {
    setPickerValue(value);
    let params = {};
    switch (type) {
      case pickerEnum.date:
        params = {
          startDate: moment(value).format('YYYY-MM-DD'),
          endDate: moment(value).format('YYYY-MM-DD'),
        };
        break;
      case pickerEnum.week:
        params = {
          startDate: moment(value).day(1).format('YYYY-MM-DD'),
          endDate: moment(value).day(7).format('YYYY-MM-DD'),
        };
        break;
      default:
        params = {
          startDate: moment(value).startOf(pickerType).format('YYYY-MM-DD'),
          endDate: moment(value).endOf(pickerType).format('YYYY-MM-DD'),
        };
        break;
    }
    onChange({
      ...params,
      dateDimension: type,
      dateDur: valStr.replace(/([^\u0000-\u00FF])|([a-zA-Z])/g, ''),
    });
  };

  const disabledDate = (current: any) => {
    return current && (current < moment('2020-01-01') || current > moment().subtract(1, 'days'));
  };

  return (
    <div className={styles.pickerItem}>
      <label style={{ width: labelWidth || '120px' }}>时间维度：</label>
      <div style={{ width: valueWidth || '280px' }}>
        <Select
          defaultValue={initialType || pickerEnum.date}
          onChange={selectOnChange}
          style={{ width: '30%' }}
        >
          <Option value={pickerEnum.date}>日</Option>
          <Option value={pickerEnum.week}>周</Option>
          <Option value={pickerEnum.month}>月</Option>
          <Option value={pickerEnum.quarter}>季</Option>
          <Option value={pickerEnum.year}>年</Option>
        </Select>
        <DatePicker
          value={pickerValue}
          picker={pickerType}
          onChange={pickerOnChange}
          style={{ width: '65%' }}
          disabledDate={disabledDate}
        />
      </div>
    </div>
  );
};

export default PickerComponent;
