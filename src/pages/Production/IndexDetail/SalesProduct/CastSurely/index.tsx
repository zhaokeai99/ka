import useProState from '@/components/Hooks/useProState';
import ProCardPlus from '@/components/ProCardPlus';
import { Line } from '@ant-design/charts';
import ProCard from '@ant-design/pro-card';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { DatePicker, Empty, Select, Space, Spin } from 'antd';
import { debounce as _debounce } from 'lodash';
import moment from 'moment';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useModel } from 'umi';
import PickerComponent from '../../../../Marketing/ChannelDistribution/PickerComponent';
import { CastSurelyIndex } from '../../../../Marketing/Product/data';
import {
  queryCastSurelyLineInfo,
  queryCastSurelyTableList,
  queryChannelByCode,
} from '../../../../Marketing/Product/service';

const { Option } = Select;
const { RangePicker } = DatePicker;

type PropsType = {
  fundCode: string;
};

// 定投
const CastSurely = (props: PropsType) => {
  const { fundCode } = props;
  const [{ dateInfo }] = useModel('useMarketingModel');
  const [dateParams, setDateParams] = useState({});
  const [lineParams, setLineParams] = useProState<any>({
    rangeDate: [moment().startOf('month'), moment().subtract(1, 'days')],
    customType: '',
    dataType: '1',
  });
  const [lineData, setLineData] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [selectValue, setSelectValue] = useState('');
  const [optionsData, setOptionsData] = useState([]);
  const initialValue = {
    initialDate: dateInfo.dLastT1Day,
    initialType: '1',
  };
  const lineList = [
    {
      title: '定投笔数变化趋势',
      yField: 'fixInvestTradeCnt',
    },
    {
      title: '定投客户数变化趋势',
      yField: 'fixInvestAcoCnt',
    },
    {
      title: '定投金额变化趋势',
      yField: 'fixInvestAmt',
    },
  ];

  const disabledDate = (current: any) => {
    return current && (current < moment('2020-01-01') || current > moment().subtract(1, 'days'));
  };

  // 定投客户变化趋势
  useEffect(() => {
    (async () => {
      const { dataType, customType, rangeDate } = lineParams;
      const { data } = await queryCastSurelyLineInfo({
        fundCode,
        dataType,
        ...(customType ? { acoType: customType } : {}),
        startDate: rangeDate && rangeDate[0].format('YYYY-MM-DD'),
        endDate: rangeDate && rangeDate[1].format('YYYY-MM-DD'),
      });
      setLineData(data || []);
    })();
  }, [lineParams, fundCode]);

  const lineConfig = (yField: any) => {
    let unit = '';
    let key = '';
    switch (yField) {
      case 'fixInvestTradeCnt':
        unit = '笔';
        key = '定投笔数';
        break;
      case 'fixInvestAcoCnt':
        unit = '人';
        key = '定投客户';
        break;
      case 'fixInvestAmt':
        unit = '万';
        key = '定投金额';
        break;
    }
    return {
      data: lineData,
      xField: 'natureDate',
      yField: yField,
      appendPadding: [0, 10],
      slider: {
        start: 0,
        end: 1,
      },
      xAxis: {
        label: {
          autoRotate: true,
        },
      },
      meta: {
        fixInvestTradeCnt: { alias: '定投笔数' },
        fixInvestAcoCnt: { alias: '定投客户' },
        fixInvestAmt: { alias: '定投金额' },
      },
      yAxis: {
        title: {
          text: `单位:${unit}`,
          position: 'end',
        },
      },
      color: lineParams.dataType === '1' ? 'rgb(91, 143, 249)' : 'rgb(246, 189, 22)',
      tooltip: {
        formatter: (value: any) => {
          return { name: key, value: `${value[yField]}${unit}` };
        },
      },
    };
  };

  const agencySearch = useMemo(() => {
    return _debounce((val: any) => {
      setFetching(true);
      queryChannelByCode({ agencyName: val }).then((res: any) => {
        const newData = res?.map((r: any) => ({
          key: r.agencyCode,
          value: r.agencyCode,
          label: r.agencyName,
        }));
        setOptionsData(newData);
        setFetching(false);
      });
    }, 800);
  }, [queryChannelByCode]);

  useEffect(() => {
    agencySearch('');
  }, []);

  const columns: ProColumns<CastSurelyIndex, 'BIFundColor'>[] = useMemo(
    () => [
      {
        title: '渠道',
        dataIndex: 'agencyName',
        key: 'agencyName',
        align: 'center',
        width: 150,
        search: false,
        render: (text, item) =>
          item.agencyCode !== 'total' ? (
            <a
              rel="noopener noreferrer"
              href={`#/marketing/sellconfig/channelDistribution/detail/${item.agencyCode}`}
            >
              {text}
            </a>
          ) : (
            text
          ),
      },
      {
        title: '定投笔数（笔）',
        dataIndex: 'investTrade',
        key: 'investTrade',
        align: 'center',
        search: false,
        children: [
          {
            title: '发生渠道额',
            dataIndex: 'accumFixInvestAcoCnt',
            key: 'accumFixInvestAcoCnt',
            align: 'center',
            valueType: 'BIFundColor',
          },
          {
            title: '新增',
            dataIndex: 'fixInvestTradeCnt',
            key: 'fixInvestTradeCnt',
            align: 'center',
            valueType: 'BIFundColor',
          },
          {
            title: '发生额环比新增',
            dataIndex: 'fixInvestTradeCntInr',
            key: 'fixInvestTradeCntInr',
            align: 'center',
            valueType: 'BIFundColor',
          },
        ],
      },
      {
        title: '定投户数（人）',
        dataIndex: 'investAco',
        key: 'investAco',
        align: 'center',
        search: false,
        children: [
          {
            title: '交易户数',
            dataIndex: 'accumFixInvestAcoCnt',
            key: 'accumFixInvestAcoCnt',
            align: 'center',
            valueType: 'BIFundColor',
          },
          {
            title: '新客户',
            dataIndex: 'fixInvestAcoCnt',
            key: 'fixInvestAcoCnt',
            align: 'center',
            valueType: 'BIFundColor',
          },
          {
            title: '发生额环比新增',
            dataIndex: 'fixInvestAcoCntInr',
            key: 'fixInvestAcoCntInr',
            align: 'center',
            valueType: 'BIFundColor',
          },
        ],
      },
      {
        title: '定投金额（万）',
        dataIndex: 'investAmt',
        key: 'investAmt',
        align: 'center',
        search: false,
        children: [
          {
            title: '发生额',
            dataIndex: 'accumFixInvestAmt',
            key: 'accumFixInvestAmt',
            align: 'center',
            valueType: 'BIFundColor',
          },
          {
            title: '新增',
            dataIndex: 'fixInvestAmt',
            key: 'fixInvestAmt',
            align: 'center',
            valueType: 'BIFundColor',
          },
          {
            title: '发生额环比新增',
            dataIndex: 'fixInvestAmtInr',
            key: 'fixInvestAmtInr',
            align: 'center',
            valueType: 'BIFundColor',
          },
        ],
      },
      {
        title: '销售渠道',
        dataIndex: 'agencyCode',
        hideInTable: true,
        renderFormItem: (_: any, fieldConfig: any, form: any) => {
          if (fieldConfig.type === 'form') {
            return null;
          }
          const status = form.getFieldValue('status');
          if (status !== open) {
            return (
              <Select
                allowClear
                value={selectValue}
                showSearch
                defaultValue=""
                onSearch={agencySearch}
                notFoundContent={fetching ? <Spin size="small" /> : null}
                filterOption={false}
                options={optionsData}
                onClear={() => agencySearch('')}
                onChange={(val: any) => {
                  setSelectValue(val);
                }}
              />
            );
          }
          return fieldConfig.defaultRender(_);
        },
      },
      {
        dataIndex: 'pickerValues',
        hideInTable: true,
        renderFormItem: (_: any, fieldConfig: any, form: any) => {
          if (fieldConfig.type === 'form') {
            return null;
          }
          const status = form.getFieldValue('status');
          if (status !== open) {
            return (
              <PickerComponent onChange={(value: any) => setDateParams(value)} {...initialValue} />
            );
          }
          return fieldConfig.defaultRender(_);
        },
      },
    ],
    [selectValue, optionsData, fetching],
  );

  const renderLine = useMemo(() => {
    return lineList?.map((item) => (
      <ProCard key={item.yField} title={item.title}>
        {!lineData || lineData.length === 0 ? (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        ) : (
          <Line {...lineConfig(item.yField)} style={{ height: '300px' }} />
        )}
      </ProCard>
    ));
  }, [lineData]);

  const queryTableList = useCallback(
    async (params: any) => {
      const { dateDimension, dateDur } = { ...params, ...dateParams } as any;
      const { data } = await queryCastSurelyTableList({
        fundCode,
        agencyCode: selectValue,
        dateDimension: dateDimension || initialValue.initialType,
        dateDur: dateDur || initialValue.initialDate,
      });
      return { data };
    },
    [selectValue, dateParams, fundCode],
  );

  return (
    <ProCard size="small" ghost direction="column">
      <ProCardPlus ghost title="定投客户变化趋势" direction="column" headerBordered>
        <Space style={{ padding: '12px 0', marginLeft: 'auto' }}>
          <label>客户类型：</label>
          <Select
            onChange={(val: any) => setLineParams({ customType: val })}
            defaultValue=""
            style={{ width: '200px' }}
          >
            <Option value="">全部客户</Option>
            <Option value="0">机构客户</Option>
            <Option value="1">个人客户</Option>
            <Option value="2">产品户</Option>
          </Select>
          <label>数据类型：</label>
          <Select
            onChange={(val: any) => setLineParams({ dataType: val })}
            defaultValue="1"
            style={{ width: '200px' }}
          >
            <Option value="1">增量数据</Option>
            <Option value="2">全量数据</Option>
          </Select>
          <label>日期：</label>
          <RangePicker
            value={lineParams.rangeDate}
            disabledDate={disabledDate}
            onChange={(val: any) => setLineParams({ rangeDate: val })}
          />
        </Space>
        <ProCard bordered ghost split="vertical">
          {renderLine}
        </ProCard>
      </ProCardPlus>
      <ProCardPlus style={{ marginTop: '12px' }} title="定投详情" ghost>
        <ProTable<CastSurelyIndex>
          size="middle"
          bordered
          columns={columns}
          pagination={false}
          rowKey="agencyCode"
          options={{ reload: false }}
          request={queryTableList}
          onReset={() => {
            setDateParams({});
            setSelectValue('');
          }}
        />
      </ProCardPlus>
    </ProCard>
  );
};

export default CastSurely;
