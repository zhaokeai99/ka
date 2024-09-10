import { primaryColor } from '@/themes/index';
import { transOptions } from '@/utils/utils';
import { Col, DatePicker, Form, Input, Tooltip, TreeSelect } from 'antd';
import moment from 'moment';
import React, { memo, useCallback, useState } from 'react';
import { history } from 'umi';
import styles from './index.less';
import NumberPlus from './NumberPlus';
import SearchSelect from './SearchSelect';
import SelectPlus from './SelectPlus';
import SortForm from './SortForm';

const { RangePicker } = DatePicker;

const typeIdMap = {
  FUND: 1,
  FUND_MANAGER: 2,
  FUND_CORP: 3,
};

const formItemLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 16 },
  labelAlign: 'left',
};

const colSpan = {
  xs: { span: 23 },
  lg: { span: 11 },
  xl: { span: 7 },
};

const IndexDetailForm: React.FC<any> = ({ itemList, markTree, onFormChange }) => {
  const [formValues, setFormValues] = useState({});
  const getOptions = (typeNum: number) => {
    const currentT = markTree?.filter((i: any) => i.id === typeNum);
    return transOptions(currentT, 'titleName', 'id', false);
  };

  const hanleChange = (key, value) => {
    const newValues = {
      ...formValues,
      [key]: value,
    };
    setFormValues(newValues);
    onFormChange(newValues);
  };
  const formatDate = (date) => moment(date).format('YYYYMMDD');

  const getFormItem = (data) => {
    const type = data.colWebType;
    switch (type) {
      case 'ENUM':
        return (
          <SelectPlus
            defaultValue={data.value || []}
            onChange={(val) => hanleChange(data.colName, val)}
            options={data.colRange}
          />
        );
      case 'NUMBER':
        return (
          <NumberPlus
            defaultValue={data.value || []}
            unitList={data?.supportQuery?.numberUnitList || []}
            onChange={(val: any) => hanleChange(data.colName, val)}
          />
        );
      case 'INPUT':
        return (
          <Input
            defaultValue={data.value || null}
            onChange={(ev) => hanleChange(data.colName, ev.currentTarget.value)}
          />
        );
      case 'DATE':
        return (
          <DatePicker
            defaultValue={data.value ? moment(data.value) : null}
            onChange={(val) => hanleChange(data.colName, formatDate(val))}
          />
        );
      case 'PERIOD':
        return (
          <RangePicker
            defaultValue={data.value ? [moment(data.value[0]), moment(data.value[1])] : []}
            onChange={(val) => {
              if (val) {
                const [startDate, endDate] = val;
                hanleChange(data.colName, [formatDate(startDate), formatDate(endDate)]);
              } else {
                hanleChange(data.colName, val);
              }
            }}
          />
        );
      case 'IMAGE':
        return (
          <Input
            defaultValue={data.value || null}
            onChange={(val) => hanleChange(data.colName, val)}
          />
        );
      case 'MARK':
        return (
          <>
            <TreeSelect
              multiple
              defaultValue={data.value ? [...data.value] : []}
              treeDefaultExpandAll
              onChange={(val) => hanleChange(data.colName, val)}
              treeData={getOptions(typeIdMap[data.searcherType])}
            />
            <span
              style={{ color: primaryColor, cursor: 'pointer' }}
              onClick={() => history.push('/production/setting/labelSystem')}
            >
              去管理我的标签
            </span>
          </>
        );
      case 'SORT':
        return <SortForm {...data} onChange={(val: any) => hanleChange(data.colName, val)} />;
      case 'PERCENT':
        return (
          // <InputNumber
          //   addonAfter="%"
          //   defaultValue={data.value ? data.value : ''}
          //   onChange={(val) => hanleChange(data.colName, val)}
          // />
          <NumberPlus
            type="percent"
            defaultValue={data.value || []}
            onChange={(val: any) => hanleChange(data.colName, val)}
          />
        );
      case 'INPUT_FUND':
        return (
          <SearchSelect
            defaultValue={data.value || ''}
            type="FUND"
            onChange={(val) => hanleChange(data.colName, val)}
            options={data.colRange}
          />
        );
      case 'INPUT_FUND_MANAGER':
        return (
          <SearchSelect
            defaultValue={data.value || ''}
            type="FUND_MANAGER"
            onChange={(val) => hanleChange(data.colName, val)}
            options={data.colRange}
          />
        );
      case 'INPUT_FUND_CORP':
        return (
          <SearchSelect
            defaultValue={data.value || ''}
            type="FUND_CORP"
            onChange={(val) => hanleChange(data.colName, val)}
            options={data.colRange}
          />
        );
      default:
        return <Input {...data} onChange={(val) => hanleChange(data.colName, val)} />;
    }
  };

  const renderLabel = useCallback((text) => {
    return (
      <Tooltip title={text}>
        <span className={styles['form-label']}>{text}</span>
      </Tooltip>
    );
  }, []);

  const renderCol = (colData, index) => {
    const { colName, colDesc, selfType, extInfo = {}, colWebType } = colData;
    if (selfType === 1 || selfType === 2) {
      const { valueList = [] } = extInfo;
      // {colWebType, value}
      return valueList?.map((valueData, i) => {
        const { yearString, value } = valueData || {};

        return (
          <Col
            {...colSpan}
            key={`${colName}-${index}-${i}`}
            style={{ marginBottom: '-12px', marginLeft: '10px' }}
          >
            <Form.Item
              {...formItemLayout}
              name={colName}
              label={renderLabel(`${colDesc}(${yearString})`)}
            >
              {getFormItem({
                colWebType,
                value,
                colName: `${colName}--${i}`,
              })}
            </Form.Item>
          </Col>
        );
      });
    } else {
      return (
        <Col
          {...colSpan}
          key={`${colName}-${index}`}
          style={{ marginBottom: '-12px', marginLeft: '10px' }}
        >
          <Form.Item {...formItemLayout} name={colName} label={renderLabel(colDesc)}>
            {getFormItem(colData)}
          </Form.Item>
        </Col>
      );
    }
  };

  // ?
  return <>{itemList.map((item: any, index: number) => renderCol(item, index))}</>;
};

export default memo(IndexDetailForm);
