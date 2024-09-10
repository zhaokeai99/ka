import { Select } from 'antd';
import moment from 'moment';
import { memo, useEffect, useState } from 'react';

interface DateRadioGroupProps {
  onChange: (value: any) => void;
  type?: string;
}

const DateRadioGroup = (props: DateRadioGroupProps) => {
  const [dateList, setDateList] = useState<any>([]);
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    const month = moment().month();
    const year = moment().year();
    const dateMD = ['1231', '0930', '0630', '0331'];
    let startYear;
    let startIndex;

    if (month > 8) {
      startIndex = 1;
      startYear = year;
    } else if (month > 5) {
      startIndex = 2;
      startYear = year;
    } else if (month > 2) {
      startIndex = 3;
      startYear = year;
    } else {
      startIndex = 0;
      startYear = year - 1;
    }

    const list = [];
    let lastDate = selectedDate;

    while (list.length < 8) {
      const reportDate = startYear + dateMD[startIndex];

      list.push({ label: reportDate, value: reportDate });
      // 4月1日-7月31日，默认上年1231,8月1日-10月31日默认今年0630,11月1日-次年3月31日默认今年的0930
      if (!lastDate) {
        if (month + 1 > 7 && month + 1 < 11) {
          //8,9,10
          startIndex = 2; // 0630
          startYear = year;
        } else if (month + 1 > 10) {
          // 11,12
          startIndex = 1; // 0930
          startYear = year;
        } else if (month + 1 > 3 && month + 1 < 8) {
          // 4,5,6,7
          startIndex = 0; // 1231
          startYear = year - 1;
        } else {
          // 1,2,3
          startIndex = 1; // 0930
          startYear = year - 1;
        }

        lastDate = startYear + dateMD[startIndex];
      }

      if (startIndex === 3) {
        startIndex = 0;
        startYear = startYear - 1;
      } else {
        startIndex++;
      }
    }

    setSelectedDate(lastDate);
    setDateList(list);

    if (lastDate) {
      props.onChange(selectedDate);
    }
  }, [selectedDate]);

  return (
    <Select
      size="small"
      defaultValue={selectedDate}
      key={selectedDate}
      onChange={(timer) => {
        props.onChange(timer);
      }}
      options={dateList}
    />
  );
};

export default memo(DateRadioGroup);
