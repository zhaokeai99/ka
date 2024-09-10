import { ProFormDateRangePicker } from '@ant-design/pro-form';
import { DatePicker } from 'antd';
import moment, { isMoment } from 'moment';
import React, { useCallback, useMemo, useEffect } from 'react';
import { ChangeTypeKeys } from '../data.d';

export interface IDateTimeItemPropsType {
  value?: any;
  onChange?: (v?: any) => any;
  changeTypeValue: string;
}

function getPreviousWorkday() {
  const workday = moment();
  const day = workday.day();
  let diff = 1;
  if (day == 0 || day == 1) {
    diff = day + 2;
  }
  return workday.subtract(diff, 'days');
}

const DateTimeItem: React.FC<IDateTimeItemPropsType> = (props) => {
  const disabledDate = useCallback((current: any) => {
    return (
      current &&
      (current < moment('2020-01-01') ||
        current > getPreviousWorkday() ||
        current === getPreviousWorkday())
    );
  }, []);

  const rangePickerValue: any = useMemo(() => {
    if (Array.isArray(props?.value)) {
      return props?.value;
    } else {
      return [getPreviousWorkday(), getPreviousWorkday()];
    }
  }, [props?.value]);

  const datePickerValue = useMemo(() => {
    if (isMoment(props?.value)) {
      return props?.value;
    } else {
      return getPreviousWorkday();
    }
  }, [props?.value]);

  useEffect(() => {
    if (props?.onChange) {
      if (props?.changeTypeValue === ChangeTypeKeys.CUSTOM) {
        props?.onChange([getPreviousWorkday(), getPreviousWorkday()]);
      } else {
        if (props?.value?.length) {
          props?.onChange(getPreviousWorkday());
        } else {
          props?.onChange(props?.value ?? getPreviousWorkday());
        }
      }
    }
  }, [props?.changeTypeValue]);

  if (props?.changeTypeValue === ChangeTypeKeys.CUSTOM) {
    return (
      <ProFormDateRangePicker
        placeholder={['开始时间', '结束时间']}
        formItemProps={{
          style: {
            marginBottom: 0,
          },
        }}
        fieldProps={{
          suffixIcon: null,
          picker: 'date',
          disabledDate: disabledDate,
          value: rangePickerValue,
          onChange: props?.onChange,
          style: { width: '100%' },
        }}
      />
    );
  } else {
    return (
      <DatePicker
        disabledDate={disabledDate}
        placeholder={'请选择日期'}
        value={datePickerValue}
        style={{ width: '100%' }}
        onChange={props?.onChange}
      />
    );
  }
};

export default DateTimeItem;
