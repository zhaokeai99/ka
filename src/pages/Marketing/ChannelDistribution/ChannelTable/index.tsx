import ProCardPlus from '@/components/ProCardPlus';
import ProTable from '@ant-design/pro-table';
import type { ProColumns } from '@ant-design/pro-table';
import { Button } from 'antd';
import React, { useMemo, useState } from 'react';
import PickerComponent from '../PickerComponent';
import { queryAgencyListForExcel, queryChannelList } from '../service';

type PropsType = {
  dateInfo: any;
  fundType: string;
};

const ChannelTable = (props: PropsType) => {
  const { dateInfo, fundType } = props;
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [orderByParam, setOrderByParam] = useState({
    orderColumn: 'purchaseAmt',
    orderType: 'desc',
  });
  const [dateParams, setDateParams] = useState({
    dateDimension: '1',
    dateDur: '',
  });

  const pickerOnChange = (value: any) => {
    setDateParams({ ...value });
  };

  const columns: ProColumns<any, 'BIFundColor'>[] = useMemo(
    () => [
      {
        title: '渠道名称',
        dataIndex: 'agencyName',
        width: 160,
        fixed: 'left',
        search: false,
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
        sorter: true,
        search: false,
        valueType: 'BIFundColor',
      },
      {
        title: '赎回金额（万）',
        dataIndex: 'redeemAmt',
        sorter: true,
        search: false,
        valueType: 'BIFundColor',
      },
      {
        title: '净申购（万）',
        dataIndex: 'netAmt',
        sorter: true,
        search: false,
        valueType: 'BIFundColor',
      },
      {
        title: '申购笔数（万）',
        dataIndex: 'purchaseCnt',
        sorter: true,
        search: false,
        valueType: 'BIFundColor',
      },
      {
        title: '赎回笔数（万）',
        dataIndex: 'redeemCnt',
        sorter: true,
        search: false,
        valueType: 'BIFundColor',
      },
      {
        title: '申购客户数（万）',
        dataIndex: 'purchaseCumCnt',
        sorter: true,
        search: false,
        valueType: 'BIFundColor',
      },
      {
        title: '赎回客户数（万）',
        dataIndex: 'redeemCumCnt',
        sorter: true,
        search: false,
        valueType: 'BIFundColor',
      },
      {
        title: '定投金额（万）',
        dataIndex: 'fixPurchaseAmt',
        sorter: true,
        search: false,
        valueType: 'BIFundColor',
      },
      {
        title: '定投笔数（万）',
        dataIndex: 'fixPurchaseCnt',
        sorter: true,
        search: false,
        valueType: 'BIFundColor',
      },
      {
        title: '定投客户数（万）',
        dataIndex: 'fixPurchaseCumCnt',
        sorter: true,
        search: false,
        valueType: 'BIFundColor',
      },
      {
        title: '新增交易客户数',
        dataIndex: 'newPurchaseCumCnt',
        sorter: true,
        search: false,
        valueType: 'BIFundColor',
      },
      {
        title: '存量规模（亿）',
        dataIndex: 'stockAmt',
        sorter: true,
        search: false,
        valueType: 'BIFundColor',
      },
      {
        title: '年初规模（亿）',
        dataIndex: 'yearHeadStockAmt',
        sorter: true,
        search: false,
        valueType: 'BIFundColor',
      },
      {
        title: '年度保有净增（亿）',
        dataIndex: 'holdNetAmt',
        sorter: true,
        search: false,
        valueType: 'BIFundColor',
      },
      {
        title: '渠道分类',
        dataIndex: 'agencyType',
        hideInTable: true,
        valueEnum: {
          '': '全部',
          '0': '银行渠道',
          '1': '券商渠道',
          '3': '直销渠道',
          '4': '三方渠道',
          '5': '期货渠道',
          '9': '其他渠道',
        },
        initialValue: '',
      },
      {
        dataIndex: 'pickerValues',
        hideInTable: true,
        renderFormItem: (_, fieldConfig, form) => {
          if (fieldConfig.type === 'form') {
            return null;
          }
          const status = form.getFieldValue('status');
          if (status !== open) {
            return (
              <PickerComponent
                onChange={pickerOnChange}
                initialDate={dateInfo?.dLastT1Day}
                initialType="1"
              />
            );
          }
          return fieldConfig.defaultRender(_);
        },
      },
    ],
    [dateInfo],
  );

  // 排序
  const handleTableChange = (__: any, _: any, sorter: any) => {
    const { column, order } = sorter || {};
    const { key } = column || {};
    setOrderByParam({
      orderColumn: key || 'purchaseAmt',
      orderType: order === 'ascend' ? 'asc' : 'desc',
    });
  };

  const proTableRequest = async (params: any) => {
    const {
      pageSize,
      current,
      agencyType,
      dateDur,
      fundType: ft,
      ...others
    } = {
      ...params,
      ...dateParams,
    } as any;
    const { success, data } = await queryChannelList({
      ...others,
      page: current,
      pageSize,
      dateDur: dateDur || dateInfo.dLastT1Day,
      ...(agencyType ? { agencyType } : {}),
      ...(ft ? { fundType: ft } : {}),
    });
    if (success) {
      setPagination({ current: data.page, pageSize: data.pageSize });
    }
    return data;
  };

  // 下载
  const downloadFile = async (params: any) => {
    const {
      pickerValues: _,
      agencyType,
      dateDur,
      ...others
    } = { ...params, ...dateParams, ...orderByParam } as any;
    console.log('others==>', others);
    const { data } = await queryAgencyListForExcel({
      ...others,
      dateDur: dateDur || dateInfo.dLastT1Day,
      ...(agencyType ? { agencyType } : {}),
      ...(fundType ? { fundType } : {}),
    });

    if (!data) {
      return;
    }

    window.open(data);
  };

  return (
    <ProCardPlus title="渠道列表" ghost style={{ backgroundColor: '#fff' }}>
      <ProTable
        size="middle"
        options={false}
        columns={columns}
        rowKey="agencyCode"
        pagination={{ ...pagination, pageSizeOptions: ['10', '20', '30', '40'] }}
        onReset={() => {
          setDateParams({
            dateDimension: '1',
            dateDur: '',
          });
        }}
        search={{
          span: 8,
          labelWidth: 'auto',
          optionRender: (_, formProps, dom) => [
            ...dom,
            <Button
              type="primary"
              key="out"
              onClick={() => downloadFile(formProps.form?.getFieldsValue())}
            >
              下载
            </Button>,
          ],
        }}
        request={proTableRequest}
        scroll={{ x: 'max-content' }}
        params={{ ...orderByParam, fundType }}
        onChange={handleTableChange}
      />
    </ProCardPlus>
  );
};

ChannelTable.isProCard = true;

export default ChannelTable;
