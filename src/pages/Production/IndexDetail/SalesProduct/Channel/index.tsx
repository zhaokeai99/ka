import ProCard from '@ant-design/pro-card';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Select, Spin } from 'antd';
import { debounce as _debounce } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { useModel } from 'umi';
import PickerComponent from '../../../../Marketing/ChannelDistribution/PickerComponent';
import { ChannelIndex } from '../../../../Marketing/Product/data';
import { queryChannelByCode, queryChannelTableList } from '../../../../Marketing/Product/service';

type PropsType = {
  fundCode: string;
};

const Channel = (props: PropsType) => {
  const { fundCode } = props;
  const [{ dateInfo }] = useModel('useMarketingModel');
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [dateParams, setDateParams] = useState<any>({ dateDimension: '1' });
  const [optionsData, setOptionsData] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [selectValue, setSelectValue] = useState('');
  const initialValue = {
    initialDate: dateInfo.dLastT1Day,
    initialType: '1',
  };

  const channelSelectChange = useMemo(() => {
    return _debounce((agencyName) => {
      setFetching(true);
      queryChannelByCode({ agencyName }).then((res) => {
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
    channelSelectChange('');
  }, []);

  const columns: ProColumns<ChannelIndex, 'BIFundColor'>[] = useMemo(
    () => [
      {
        title: '渠道名称',
        dataIndex: 'agencyName',
        key: 'agencyName',
        width: 150,
        search: false,
        fixed: 'left',
        render: (_, item) => (
          <a
            rel="noopener noreferrer"
            href={`#/marketing/sellconfig/channelDistribution/detail/${item.agencyCode}`}
          >
            {_}
          </a>
        ),
      },
      {
        title: '申购金额（万）',
        dataIndex: 'purchaseAmt',
        key: 'purchaseAmt',
        sorter: true,
        search: false,
        valueType: 'BIFundColor',
      },
      {
        title: '赎回金额（万）',
        dataIndex: 'redeemAmt',
        key: 'redeemAmt',
        sorter: true,
        search: false,
        valueType: 'BIFundColor',
      },
      {
        title: '净申购（万）',
        dataIndex: 'netAmt',
        key: 'netAmt',
        sorter: true,
        search: false,
        valueType: 'BIFundColor',
      },
      {
        title: '申购笔数',
        dataIndex: 'purchaseCnt',
        key: 'purchaseCnt',
        sorter: true,
        search: false,
        valueType: 'BIFundColor',
      },
      {
        title: '赎回笔数',
        dataIndex: 'redeemCnt',
        key: 'redeemCnt',
        sorter: true,
        search: false,
        valueType: 'BIFundColor',
      },
      {
        title: '存量规模（亿）',
        dataIndex: 'stockAmt',
        key: 'stockAmt',
        sorter: true,
        search: false,
        hideInTable: dateParams.dateDimension !== '1',
        valueType: 'BIFundColor',
      },
      {
        title: '存量占比',
        dataIndex: 'stockAmtProportion',
        key: 'stockAmtProportion',
        search: false,
        hideInTable: dateParams.dateDimension !== '1',
        valueType: 'BIFundColor',
      },
      {
        title: '年度保有净增（亿）',
        dataIndex: 'holdNetAmt',
        key: 'holdNetAmt',
        sorter: true,
        search: false,
        hideInTable: dateParams.dateDimension !== '1',
        valueType: 'BIFundColor',
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
                onSearch={channelSelectChange}
                notFoundContent={fetching ? <Spin size="small" /> : null}
                filterOption={false}
                options={optionsData}
                onChange={(val: any) => {
                  if (!val) {
                    channelSelectChange('');
                  }
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
    [dateParams, optionsData, selectValue, fetching],
  );

  const queryTableList = async (params: any, sorter: any) => {
    const { current, pageSize, dateDimension, dateDur } = {
      ...params,
      ...dateParams,
    } as any;
    const { success, data } = await queryChannelTableList({
      fundCode,
      page: current,
      pageSize,
      agencyCode: selectValue,
      dateDimension: dateDimension || initialValue.initialType,
      dateDur: dateDur || initialValue.initialDate,
      orderColumn: Object.keys(sorter)[0] || 'purchaseAmt',
      orderType: Object.values(sorter)[0] === 'ascend' ? 'asc' : 'desc',
    });
    if (success) {
      setPagination({
        current: data.page,
        pageSize: data.pageSize,
      });
    }
    return data;
  };

  return (
    <ProCard ghost>
      <ProTable<ChannelIndex>
        bordered
        columns={columns}
        pagination={{ ...pagination, pageSizeOptions: ['10', '20', '30', '40'] }}
        rowKey="agencyCode"
        options={{ reload: false }}
        request={queryTableList}
        onReset={() => {
          setSelectValue('');
          setDateParams({ dateDimension: '1' });
        }}
      />
    </ProCard>
  );
};

export default Channel;
