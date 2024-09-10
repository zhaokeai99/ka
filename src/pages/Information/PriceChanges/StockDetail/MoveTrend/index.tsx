import React, { useState, useCallback, useContext, useMemo, useEffect } from 'react';
import ProCard from '@ant-design/pro-card';
import { StockDetailContext, StockDetailTabsKeys } from '../data.d';
import MoveEventTable from './MoveEventTable';
import MoveDualChart from './MoveDualChart';
import MoveColumnChart from './MoveColumnChart';
import { cardGutter, contentPadding } from '@/themes';
import { Form, Select } from 'antd';

interface IValuationPrice {
  title: string;
  value: StockDetailTabsKeys.MOVE;
}

const ASharesOpitions = [
  {
    label: '收盘价相对中证500异动',
    value: '收盘价相对中证500异动',
  },
  {
    label: '收盘价相对沪深300异动',
    value: '收盘价相对沪深300异动',
  },
  {
    label: '收盘价相对创业板异动',
    value: '收盘价相对创业板异动',
  },
  {
    label: '收盘价相对中信一级行业异动',
    value: '收盘价相对中信一级行业异动',
  },
  {
    label: '收盘价异动',
    value: '收盘价异动',
  },
  {
    label: '收盘价涨跌幅异动',
    value: '收盘价涨跌幅异动',
  },
];

const HKSharesOpitions = [
  {
    label: '收盘价相对恒生科技异动',
    value: '收盘价相对恒生科技异动',
  },
  {
    label: '收盘价相对恒生指数异动',
    value: '收盘价相对恒生指数异动',
  },
  {
    label: '收盘价相对中信一级行业异动',
    value: '收盘价相对中信一级行业异动',
  },
  {
    label: '收盘价异动',
    value: '收盘价异动',
  },
  {
    label: '收盘价涨跌幅异动',
    value: '收盘价涨跌幅异动',
  },
];
/**
 * 异动趋势
 */
const MoveTrend: React.FC<IValuationPrice> = () => {
  const [publicParams, setPublicParams] = useState<string>('');
  const { stockType } = useContext(StockDetailContext);
  const [moveType, setMoveType] = useState<string[]>([]);
  const [form] = Form.useForm();

  const onChangeParams = useCallback(
    (e) => {
      setPublicParams(e);
    },
    [publicParams],
  );

  const ExtraSelectOpitions = useMemo(() => {
    switch (stockType) {
      case 'A股':
        return ASharesOpitions;
      case '港股':
        return HKSharesOpitions;
      default:
        return [];
    }
  }, [stockType]);

  useEffect(() => {
    const intValue = ExtraSelectOpitions?.map((v) => v?.value);
    form?.setFieldValue('moveType', intValue);
    setMoveType(intValue);
  }, [ExtraSelectOpitions]);

  const onFormValuesChange = (_: any, allValues: any) => {
    setMoveType(allValues?.moveType);
  };

  const ExtraEle = (
    <Form onValuesChange={onFormValuesChange} form={form}>
      <Form.Item label={'异动点类型'} style={{ marginBottom: 0 }} name={'moveType'}>
        <Select
          placeholder={'请选择异动点类型'}
          size={'small'}
          options={ExtraSelectOpitions}
          style={{ width: 250 }}
          maxTagCount="responsive"
          mode="multiple"
          allowClear
        />
      </Form.Item>
    </Form>
  );

  return (
    <ProCard
      size="small"
      ghost
      direction="column"
      gutter={[cardGutter, cardGutter]}
      extra={ExtraEle}
    >
      <ProCard size="small" ghost style={{ padding: contentPadding }}>
        <MoveDualChart params={publicParams} onChangeParams={onChangeParams} moveType={moveType} />
      </ProCard>
      <ProCard size="small" ghost style={{ padding: 0 }}>
        <MoveColumnChart params={publicParams} />
      </ProCard>
      <ProCard size="small" ghost style={{ padding: contentPadding }}>
        <MoveEventTable params={publicParams} />
      </ProCard>
    </ProCard>
  );
};
export default MoveTrend;
