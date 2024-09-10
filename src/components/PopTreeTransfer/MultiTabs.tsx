import { Tag, DatePicker, Button } from 'antd';
import React, { memo, useState } from 'react';
import { pull as _pull } from 'lodash';
import type { Moment } from 'moment';
import moment from 'moment';
import styles from './index.less';

const { RangePicker } = DatePicker;

interface TreeTransferProps {
  data?: {};
  onChange?: ({}) => {};
  deleteTag?: ({}) => {};
}

const MultiTabs: React.FC<TreeTransferProps> = ({ data, onChange, deleteTag }) => {
  const [yearFormat] = useState(() => 'YYYY年');
  const [dateFormat] = useState(() => 'YYYY/MM/DD');

  const [addFlag, setAddFlag] = useState(false);
  const disabledDate = (current: Moment) => {
    const tooLate = current.isAfter(new Date());
    return !!tooLate;
  };

  const handPickerChange = (date, type) => {
    const { colName } = data || {};
    if (type === 'range') {
      const startYear = moment(date[0]).format('YYYYMMDD');
      const endYear = moment(date[1]).format('YYYYMMDD');
      const yearString =
        moment(date[0]).format('YY/MM/DD') + '-' + moment(date[1]).format('YY/MM/DD');
      return {
        startYear,
        endYear,
        yearString,
        colName,
      };
    } else {
      const startYear = moment(date).startOf('year').format('YYYYMMDD');
      const endYear = moment(date).endOf('year').format('YYYYMMDD');
      const yearString = moment(date).endOf('year').format('YYYY年');
      return {
        startYear,
        endYear,
        yearString,
        colName,
      };
    }
  };

  const add = (date, type) => {
    const { colName, extInfo = {} } = data || {};
    const { valueList = [] } = extInfo;
    const { startYear, endYear, yearString } = handPickerChange(date, type);
    if (onChange) {
      onChange({
        ...data,
        extInfo: {
          ...extInfo,
          valueList: [
            ...valueList,
            {
              startYear,
              endYear,
              yearString,
              colName,
            },
          ],
        },
      });
    }
    setAddFlag(false);
  };

  const update = (date, type, i) => {
    const { colName, extInfo = {} } = data || {};
    const { valueList = [] } = extInfo;
    const { startYear, endYear, yearString } = handPickerChange(date, type);
    valueList[i] = {
      startYear,
      endYear,
      yearString,
      colName,
    };
    if (onChange) {
      onChange({
        ...data,
        extInfo: {
          ...extInfo,
          valueList: [...valueList],
        },
      });
    }
    setAddFlag(false);
  };

  const deleteWeb = (webData) => {
    const { extInfo = {} } = data || {};
    const { valueList = [] } = extInfo;
    _pull(valueList, webData);
    if (onChange) {
      onChange({
        ...data,
        extInfo: {
          ...extInfo,
          valueList: [...valueList],
        },
      });
    }
    setAddFlag(false);
  };

  const renderTag = () => {
    const { colDesc, selfType, extInfo = {} } = data || {};
    const { valueList = [] } = extInfo;
    return (
      <div className={styles['multi-tag-container']}>
        <Tag className={styles['tag']}>{colDesc}</Tag>{' '}
        <span
          className={styles['delete-icon']}
          onClick={() => {
            if (deleteTag) {
              deleteTag(data);
            }
          }}
        >
          <CloseCircleOutlined />
        </span>
        {valueList.map((webData, index) => (
          <div className={styles['picker-outer']}>
            <span>
              {selfType === 1 ? (
                <DatePicker
                  key={`${index}-${webData?.startYear}`}
                  disabledDate={disabledDate}
                  value={moment(webData?.startYear, yearFormat)}
                  picker="year"
                  allowClear={false}
                  onChange={(date) => update(date, 'picker', index)}
                  format={yearFormat}
                  style={{ height: '22px', width: '110px', marginRight: '10px' }}
                />
              ) : (
                <RangePicker
                  key={`${index}-${webData?.startYear}`}
                  disabledDate={disabledDate}
                  value={[
                    moment(webData?.startYear, dateFormat),
                    moment(webData?.endYear, dateFormat),
                  ]}
                  allowClear={false}
                  onChange={(date) => update(date, 'range', index)}
                  format={'YY/MM/DD'}
                  style={{ height: '22px', width: '200px', marginRight: '10px' }}
                />
              )}
            </span>
            <span
              className={styles['delete-icon']}
              onClick={() => {
                deleteWeb(webData);
              }}
            >
              <CloseCircleOutlined />
            </span>
          </div>
        ))}
        {!!addFlag ? (
          <div className={styles['picker-outer']}>
            <span>
              {selfType === 1 ? (
                <DatePicker
                  disabledDate={disabledDate}
                  picker="year"
                  allowClear={false}
                  onChange={(date) => add(date, 'picker')}
                  format={dateFormat}
                  style={{ height: '22px', width: '110px', marginRight: '10px' }}
                />
              ) : (
                <RangePicker
                  disabledDate={disabledDate}
                  allowClear={false}
                  onChange={(date) => add(date, 'range')}
                  format={'YY/MM/DD'}
                  style={{ height: '22px', width: '200px', marginRight: '10px' }}
                />
              )}
            </span>
            <span
              className={styles['delete-icon']}
              onClick={() => {
                // deleteColItem(data);
              }}
            >
              <a
                onClick={() => {
                  setAddFlag(false);
                }}
              ></a>
            </span>
          </div>
        ) : null}
        <Button
          type="dashed"
          disabled={!!addFlag}
          onClick={() => {
            setAddFlag(true);
          }}
          style={{ width: '110px', height: '20px' }}
        ></Button>
      </div>
    );
  };

  return renderTag();
};

export default memo(MultiTabs);
