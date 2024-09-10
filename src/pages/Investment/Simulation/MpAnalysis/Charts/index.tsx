import React, { memo, useEffect, useState } from 'react';
import type { RadioChangeEvent } from 'antd';
import { Empty, Radio, Spin } from 'antd';
import '../index.less';
import { CHARTS_OPTIONS_TYPE_DIC, MpPortfolioAnalyseFacadeQueryCharts } from '../service';
import { Column } from '@ant-design/plots';
import moment from 'moment';
import { filter as _filter, orderBy as _orderBy } from 'lodash';
import ProCardPlus from '@/components/ProCardPlus';

interface FormProps {
  formValue: any;
  domainDic: any;
}

const Charts = (props: FormProps) => {
  const { formValue } = props;

  const [data, setData] = useState<any>([]);
  const [config, setConfig] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [targetValue, setTargetValue] = useState<string>(CHARTS_OPTIONS_TYPE_DIC[8].value);

  const queryChartsData = async (p?: any) => {
    setLoading(true);
    const result = await MpPortfolioAnalyseFacadeQueryCharts({
      domains: formValue?.domains,
      tradeDate: moment(formValue?.tradeDate).format('YYYYMMDD'),
      circles: [p?.circles],
    });
    const filterList = _filter(result, function (o) {
      return o.valueDec;
    });
    const newList = filterList?.map((itm: any) => ({
      ...itm,
      circle: p?.circles,
    }));
    const arr = _orderBy(newList, ['valueDec'], ['desc']);
    setData(arr);
    setLoading(false);
  };

  const handleConfig = (chartData: any) => {
    setConfig({
      data: chartData,
      isGroup: true,
      xField: 'mpName', // x轴
      yField: 'valueDec', //y轴
      padding: [10, 30, 120, 50],
      style: { width: '100%' },
      autoFit: true,
      annotations: [
        // 低于0颜色变化
        {
          type: 'regionFilter',
          start: [-1, 'max'],
          end: [999, 0],
          color: '#FF0000',
        },
        {
          type: 'regionFilter',
          start: [-1, 0],
          end: [999, 'min'],
          color: '#56a73f',
        },
      ],
      xAxis: {
        nice: true,
        label: {
          autoRotate: true,
          autoHide: false,
        },
      },
      meta: {
        valueDec: {
          nice: true,
          formatter: (val: number) => (+val * 100).toFixed(2) + '%',
        },
      },
      tooltip: {
        fields: ['circle', 'valueDec'],
        formatter: ({ circle, valueDec }: any) => {
          return {
            name: _filter(CHARTS_OPTIONS_TYPE_DIC, ['value', circle])[0]?.label,
            value: (+valueDec * 100).toFixed(2) + '%',
          };
        },
      },
    });
  };

  useEffect(() => {
    queryChartsData({ circles: targetValue });
  }, [formValue]);

  useEffect(() => {
    handleConfig(data);
  }, [data]);

  const onChange = (e: RadioChangeEvent) => {
    setTargetValue(e.target.value);
    queryChartsData({ circles: e.target.value });
  };

  return (
    <ProCardPlus
      title={'累计收益'}
      extra={
        <Radio.Group
          onChange={onChange}
          defaultValue={CHARTS_OPTIONS_TYPE_DIC[8].value}
          buttonStyle="solid"
        >
          {CHARTS_OPTIONS_TYPE_DIC.map((itm: any) => (
            <Radio.Button key={itm.value} value={itm.value}>
              {itm.label}
            </Radio.Button>
          ))}
        </Radio.Group>
      }
    >
      <Spin tip="Loading..." spinning={loading}>
        <div className="charts-empty-style">
          {data?.length ? <Column {...config} /> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
        </div>
      </Spin>
    </ProCardPlus>
  );
};

export default memo(Charts);
