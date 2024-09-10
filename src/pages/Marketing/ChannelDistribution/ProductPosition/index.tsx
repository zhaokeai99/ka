import ProCard from '@ant-design/pro-card';
import ProTable from '@ant-design/pro-table';
import { Button, Tooltip } from 'antd';
import { useMemo, useState } from 'react';
import { Link, useModel } from 'umi';
import { ProductPositionIndex } from '../data';
import PickerComponent from '../PickerComponent';
import { queryAgencyFundList, queryAgencyFundTradeInfoForExcel } from '../service';

const valueEnumArray: any = [
  ['', { text: '全部' }],
  ['0', { text: '股票型基金' }],
  ['1', { text: '混合型基金' }],
  ['2', { text: '债券型基金' }],
  // ['3', { text: '货币型基金' }],
  ['4', { text: '指数型基金' }],
  ['6', { text: 'FOF型基金' }],
  ['7', { text: 'ETF型基金' }],
];

// 产品分布
export default function (props: any) {
  const { agencyCode } = props.match.params;
  const [{ dateInfo }] = useModel('useMarketingModel');
  const [pickerValues, setPickerValues] = useState({});
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [orderByParam, setOrderByParam] = useState({
    orderColumn: 'purchaseAmt',
    orderType: 'desc',
  });
  const initialValue = {
    initialDate: dateInfo.dLastT1Day,
    initialType: '1',
  };

  const pickerOnChange = (value: any) => {
    setPickerValues(value);
  };

  const columns: any[] = useMemo(
    () => [
      {
        title: '产品名称',
        dataIndex: 'fundName',
        key: 'fundName',
        fixed: 'left',
        width: 200,
        search: false,
        render: (name: any, item: any) => (
          <Tooltip title={name}>
            <Link
              to={`/production/index/newDetail/${item.fundCode}`}
              className="text-ellipsis"
              style={{ width: '320px' }}
            >
              {name}
            </Link>
          </Tooltip>
        ),
      },
      {
        title: '产品类型',
        fixed: 'left',
        dataIndex: 'fundTypeName',
        key: 'fundTypeName',
        width: 100,
        search: false,
      },
      {
        title: '申购（万）',
        dataIndex: 'purchaseAmt',
        key: 'purchaseAmt',
        search: false,
        sorter: true,
        valueType: 'BIFundColor',
      },
      {
        title: '赎回（万）',
        dataIndex: 'redeemAmt',
        key: 'redeemAmt',
        search: false,
        sorter: true,
        valueType: 'BIFundColor',
      },
      {
        title: '净申购（万）',
        dataIndex: 'netAmt',
        key: 'netAmt',
        search: false,
        sorter: true,
        valueType: 'BIFundColor',
      },
      {
        title: '申购笔数（万）',
        dataIndex: 'purchaseCnt',
        key: 'purchaseCnt',
        search: false,
        sorter: true,
        valueType: 'BIFundColor',
      },
      {
        title: '赎回笔数（万）',
        dataIndex: 'redeemCnt',
        key: 'redeemCnt',
        search: false,
        sorter: true,
        valueType: 'BIFundColor',
      },
      {
        title: '存量（亿）',
        dataIndex: 'stockAmt',
        key: 'stockAmt',
        search: false,
        sorter: true,
        valueType: 'BIFundColor',
      },
      {
        title: '最新收益（万）',
        dataIndex: 'profitAmt',
        key: 'profitAmt',
        search: false,
        sorter: true,
        valueType: 'BIFundColor',
      },
      {
        title: '累计收益（亿）',
        dataIndex: 'accumProfitAmt',
        key: 'accumProfitAmt',
        search: false,
        sorter: true,
        valueType: 'BIFundColor',
      },
      {
        title: '新增客户（人）',
        dataIndex: 'newPurchaseCumCnt',
        key: 'newPurchaseCumCnt',
        search: false,
        sorter: true,
        valueType: 'BIFundColor',
      },
      {
        title: '产品类型',
        dataIndex: 'fundType',
        hideInTable: true,
        colSize: 3,
        valueType: 'radioButton',
        valueEnum: new Map(valueEnumArray),
        fieldProps: {
          defaultValue: '',
          buttonStyle: 'solid',
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
            return <PickerComponent labelWidth={120} onChange={pickerOnChange} {...initialValue} />;
          }
          return fieldConfig.defaultRender(_);
        },
      },
    ],
    [],
  );

  const queryTableList = async (params: any) => {
    const { dateDimension, dateDur, current, pageSize, fundType, orderType, orderColumn } = {
      ...params,
      ...pickerValues,
    } as any;
    const { success, data } = await queryAgencyFundList({
      agencyCode,
      dateDimension: dateDimension || initialValue.initialType,
      dateDur: dateDur || initialValue.initialDate,
      page: current,
      pageSize,
      orderType,
      orderColumn,
      ...(fundType ? { fundType } : {}),
    });
    if (success) {
      setPagination({
        current: data.page,
        pageSize: data.pageSize,
      });
    }
    return data;
  };

  // 排序
  const handleTableChange = (__: any, _: any, sorter: any) => {
    const { column, order } = sorter || {};
    const { key } = column || {};
    setOrderByParam({
      orderColumn: key || 'purchaseAmt',
      orderType: order === 'ascend' ? 'asc' : 'desc',
    });
  };

  // 下载
  const downloadFile = async (params: any) => {
    const { dateDimension, dateDur, fundType, orderType, orderColumn } = {
      ...params,
      ...pickerValues,
      ...orderByParam,
    } as any;

    const { data } = await queryAgencyFundTradeInfoForExcel({
      agencyCode,
      dateDimension: dateDimension || initialValue.initialType,
      dateDur: dateDur || initialValue.initialDate,
      orderType,
      orderColumn,
      ...(fundType ? { fundType } : {}),
    });

    if (!data) {
      return;
    }

    window.open(data);
  };

  return (
    <ProCard ghost>
      <ProTable<ProductPositionIndex>
        columns={columns}
        scroll={{ x: 'max-content' }}
        rowKey="fundCode"
        options={false}
        params={{ ...orderByParam }}
        search={{
          labelWidth: 120,
          defaultCollapsed: false,
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
        pagination={{ ...pagination, pageSizeOptions: ['10', '20', '30', '40'] }}
        request={queryTableList}
        onReset={() => {
          setPickerValues({});
        }}
        tableStyle={{ padding: '0px' }}
        form={{ span: 8 }}
        onChange={handleTableChange}
      />
    </ProCard>
  );
}
