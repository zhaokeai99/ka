import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Radio, DatePicker, Button } from 'antd';
import styles from './index.less';
import { queryDateInfo } from '../service';
import moment from 'moment';
import useResizeObserver from '@react-hook/resize-observer';
import { TabLayoutContext } from '@/components/thfund-front-component/src';
import rafSchd from 'raf-schd';

const { RangePicker } = DatePicker;

type PropsType = {
  onChange: ({}) => void;
};

const useSize = (target: any) => {
  const [size, setSize] = useState<number>(0);

  useLayoutEffect(() => {
    if (target.current) {
      setSize(target.current.getBoundingClientRect());
    }
  }, [target]);

  useResizeObserver(target, (entry) => {
    if (entry?.contentRect?.width) {
      setSize((entry.contentRect.width - 32) as number);
    }
  });
  return size;
};

// 时间筛选组件
const TimePicker = (props: PropsType) => {
  const { onChange } = props;
  const ref = useRef<any>();
  const { currentRef } = useContext(TabLayoutContext);
  const [curValue, setCurValue] = useState('1');
  const [timeInfo, setTimeInfo] = useState<any>({});
  const [confirmTime, setConfirmTime] = useState({
    startTime: '--',
    endTime: '--',
  });
  const [dateValue, setDateValue] = useState<any[]>([]);
  const size = useSize(currentRef);

  const schedule = rafSchd((e: any) => {
    const top = e.target.scrollTop;
    const { current }: any = ref;
    const { width } = e.target.getBoundingClientRect();
    const { position } = current.style;

    if (top > 12 && position !== 'fixed') {
      current.style.position = 'fixed';
      current.style['z-index'] = 999;
      current.style.top = '85px';
      e.target.style['padding-top'] = '60px';
      current.style.width = `${width - (/Mac/.test(navigator.userAgent) ? 32 : 49)}px`;
    } else if (top <= 12) {
      current.style.width = '100%';
      current.style.position = 'static';
      e.target.style['padding-top'] = '0px';
    }
  });

  // 吸顶
  useEffect(() => {
    const onScroll = (e: any) => {
      schedule(e);
    };

    currentRef?.current?.addEventListener('scroll', onScroll, false);

    return () => {
      currentRef?.current?.removeEventListener('scroll', onScroll);
      schedule.cancel();
    };
  }, []);

  // 查询默认时间信息
  useEffect(() => {
    (async () => {
      const result = await queryDateInfo();
      const obj = {};
      result?.dateDimensionInfoList?.map((i: any) => (obj[i.dateDur] = i));
      setTimeInfo({ ...obj, maxDate: result?.maxDate, minDate: result?.minDate });
      setConfirmTime({
        startTime: moment(obj[curValue]?.startDate).format('YYYY-MM-DD'),
        endTime: moment(obj[curValue]?.endDate).format('YYYY-MM-DD'),
      });
      onChange({ ...obj[curValue] });
    })();
  }, []);

  // 时间维度事件
  const radioChange = (val: any) => {
    const index = val.target.value;
    setCurValue(index);
    const start = index === '6' ? timeInfo['minDate'] : timeInfo[index]['startDate'];
    const end = index === '6' ? timeInfo['maxDate'] : timeInfo[index]['endDate'];
    setConfirmTime({
      startTime: moment(start).format('YYYY-MM-DD'),
      endTime: moment(end).format('YYYY-MM-DD'),
    });
    // 自定义回填默认值
    if (index === '6') {
      setDateValue([moment(start), moment(end)]);
    }
    onChange({ dateDur: index, startDate: start, endDate: end });
  };

  // 时间限制
  const disabledDate = (current: any) => {
    return (
      current &&
      (current < moment(timeInfo?.minDate) || current > moment(timeInfo?.maxDate).endOf('day'))
    );
  };

  // 查询按钮
  const onBtnClick = () => {
    setConfirmTime({
      startTime: dateValue ? moment(dateValue[0]).format('YYYY-MM-DD') : '',
      endTime: dateValue ? moment(dateValue[1]).format('YYYY-MM-DD') : '',
    });
    onChange({
      dateDur: curValue,
      startDate: dateValue ? moment(dateValue[0]).format('YYYYMMDD') : '',
      endDate: dateValue ? moment(dateValue[1]).format('YYYYMMDD') : '',
    });
  };

  return (
    <div
      className={styles['time-picker-container']}
      style={{ width: size ? `${size}px` : '100%', border: '1px solid #f5f5f5' }}
      ref={ref}
    >
      <div className={styles['left-content']}>
        <div style={{ marginRight: '8px', padding: '8px 0' }}>
          <span>时间筛选：</span>
          <Radio.Group onChange={radioChange} size="middle" defaultValue="1">
            <Radio.Button value="1">本日</Radio.Button>
            <Radio.Button value="2">本周</Radio.Button>
            <Radio.Button value="3">本月</Radio.Button>
            <Radio.Button value="4">本季</Radio.Button>
            <Radio.Button value="5">今年以来</Radio.Button>
            <Radio.Button value="6">自定义</Radio.Button>
          </Radio.Group>
        </div>
        {curValue === '6' && (
          <div style={{ padding: '8px 0' }}>
            <RangePicker
              disabled={curValue !== '6'}
              onChange={(val: any) => setDateValue(val)}
              size="middle"
              format="YYYY-MM-DD"
              value={dateValue}
              disabledDate={disabledDate}
            />
            <Button
              style={{ marginLeft: '8px' }}
              disabled={!dateValue}
              type="primary"
              onClick={onBtnClick}
            >
              查询
            </Button>
          </div>
        )}
      </div>
      <div className={styles['right-content']}>
        业绩数据区间：{confirmTime.startTime || '--'} ~ {confirmTime.endTime || '--'}
      </div>
    </div>
  );
};

TimePicker.isProCard = true;

export default TimePicker;
