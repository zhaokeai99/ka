import React, { useRef, useContext, useCallback, useState } from 'react';
import { history } from 'umi';
import ProTable, { ProColumns, ColumnsState } from '@ant-design/pro-table';
import { Checkbox, Select } from 'antd';
import {
  ProFormInstance,
  ProFormDigitRange,
  ProFormSelect,
  ProFormDateRangePicker,
} from '@ant-design/pro-form';
import {
  ratingSelectOption,
  afterTabsKeys,
  BondTabsContext,
  InputNumberPrecision,
  sorterOpition,
  getOffsetValColor,
  commonColumnState,
} from '../data.d';
import {
  IValuationMoveTableItem,
  getYestDayValChange,
  likeBondName,
  likeCompanyName,
} from './service';
import moment from 'moment';
import cls from 'classnames';
import styles from '../index.less';

interface IValuationMove {
  title: string;
  value: afterTabsKeys.VALUATION;
}

const intDate = [moment().subtract(1, 'days'), moment().subtract(1, 'days')];
/**
 * 估值异动
 */
const ValuationMove: React.FC<IValuationMove> = () => {
  const formRef = useRef<ProFormInstance>();

  const { bondType } = useContext(BondTabsContext);
  const [columnsState, setColumnsState] = useState<Record<string, ColumnsState>>(commonColumnState);

  const onNavigateClick = (bondCode: any) => () => {
    history.push(`/information/priceChanges/couponAfter/${bondCode}`);
  };

  // 解构请求参数
  const reloadDataSource = useCallback(async (params, sort) => {
    const requestParams: Partial<IValuationMoveTableItem & { current: number }> = {};
    Object.keys(params).forEach((item) => {
      switch (item) {
        case 'amount': // 成交金额
          requestParams['maxTurnover'] = params?.amount?.[1];
          requestParams['minTurnover'] = params?.amount?.[0];
          break;
        case 'dateTime': // 时间
          requestParams['endTime'] = moment(params?.dateTime?.[1])?.format('yyyyyMMDD');
          requestParams['startTime'] = moment(params?.dateTime?.[0])?.format('yyyyMMDD');
          break;
        case 'offsetPCT': //偏离百分比
          requestParams['maxOffsetPCT'] = params?.offsetPCT?.[1];
          requestParams['minOffsetPCT'] = params?.offsetPCT?.[0];
          break;
        case 'offsetVal': //绝对值偏离
          requestParams['maxOffsetVal'] = params?.offsetVal?.[1];
          requestParams['minOffsetVal'] = params?.offsetVal?.[0];
          break;
        case 'secPrice': // 昨日估值 //TODO
          requestParams['maxSecPrice'] = params?.secPrice?.[1];
          requestParams['minSecPrice'] = params?.secPrice?.[0];
          break;
        case 'firPrice': // 中债估值 //TODO
          requestParams['maxFirPrice'] = params?.firPrice?.[1];
          requestParams['minFirPrice'] = params?.firPrice?.[0];
          break;
        case 'bondType': // 债券类型
          if (params?.bondType?.length) {
            requestParams['bondType'] = params?.bondType?.join(',');
          }
          break;
        case 'current': // 成交量
          requestParams['pageNum'] = params?.current;
          break;
        default:
          requestParams[item] = params[item];
          break;
      }
    });

    if (Object.keys(sort)?.length > 0) {
      const [[key, value]] = Object.entries(sort as any);
      requestParams['orderName'] = sorterOpition?.[key];
      if (value === 'descend') {
        requestParams['order'] = 'desc';
      } else if (value === 'ascend') {
        requestParams['order'] = 'asc';
      }
    }

    delete requestParams?.current;

    const { data } = await getYestDayValChange(requestParams);

    return {
      ...data,
    };
  }, []);

  const disabledDate = useCallback((current: any) => {
    return current && (current < moment('2020-01-01') || current > moment().subtract(1, 'days'));
  }, []);

  const bondTypeInitValue = bondType?.map((v) => v?.value);

  const searchColumns: ProColumns<IValuationMoveTableItem>[] = [
    {
      title: '日期',
      align: 'center',
      dataIndex: 'dateTime',
      hideInTable: true,
      initialValue: intDate,
      renderFormItem: () => {
        return (
          <ProFormDateRangePicker
            placeholder={['开始时间', '结束时间']}
            formItemProps={{
              style: {
                marginBottom: 0,
              },
            }}
            fieldProps={{
              suffixIcon: null,
              picker: 'date',
              disabledDate: disabledDate,
            }}
          />
        );
      },
    },
    {
      title: '偏离百分比(%)',
      align: 'center',
      dataIndex: 'offsetPCT',
      hideInTable: true,
      renderFormItem: () => {
        return (
          <ProFormDigitRange
            placeholder={['最小值', '最大值']}
            fieldProps={{
              precision: InputNumberPrecision,
            }}
            formItemProps={{
              style: {
                marginBottom: 0,
              },
            }}
          />
        );
      },
    },
    {
      title: '中债估值(元)',
      align: 'center',
      dataIndex: 'firPrice',
      hideInTable: true,
      renderFormItem: () => {
        return (
          <ProFormDigitRange
            placeholder={['最小值', '最大值']}
            name={'firPrice'}
            fieldProps={{
              precision: InputNumberPrecision,
            }}
            formItemProps={{
              style: {
                marginBottom: 0,
              },
            }}
          />
        );
      },
    },
    {
      title: '昨日估值(元)',
      align: 'center',
      dataIndex: 'secPrice',
      hideInTable: true,
      renderFormItem: () => {
        return (
          <ProFormDigitRange
            placeholder={['最小值', '最大值']}
            name={'secPrice'}
            fieldProps={{
              precision: InputNumberPrecision,
            }}
            formItemProps={{
              style: {
                marginBottom: 0,
              },
            }}
          />
        );
      },
    },
    {
      title: '债券搜索',
      align: 'center',
      dataIndex: 'bondName',
      hideInTable: true,
      renderFormItem: () => {
        return (
          <ProFormSelect
            showSearch
            allowClear
            debounceTime={300}
            request={async ({ keyWords }) => {
              if (!keyWords) {
                return [];
              }
              const { data } = await likeBondName({
                bondName: keyWords,
              });
              return (data || []).map((item: any) => {
                return {
                  label: `${item?.name}--${item?.id}`,
                  value: item?.name,
                };
              });
            }}
            placeholder="请选择债券代码、简称"
            formItemProps={{
              style: {
                marginBottom: 0,
              },
            }}
          />
        );
      },
    },
    {
      title: '绝对值偏离',
      align: 'center',
      dataIndex: 'offsetVal',
      hideInTable: true,
      renderFormItem: () => {
        return (
          <ProFormDigitRange
            placeholder={['最小值', '最大值']}
            name={'offsetVal'}
            fieldProps={{
              precision: InputNumberPrecision,
            }}
            formItemProps={{
              style: {
                marginBottom: 0,
              },
            }}
          />
        );
      },
    },
    {
      title: '成交金额(万元)',
      align: 'center',
      dataIndex: 'amount',
      hideInTable: true,
      renderFormItem: () => {
        return (
          <ProFormDigitRange
            placeholder={['最小值', '最大值']}
            name={'amount'}
            fieldProps={{
              precision: InputNumberPrecision,
            }}
            formItemProps={{
              style: {
                marginBottom: 0,
              },
            }}
          />
        );
      },
    },
    {
      title: '主体',
      align: 'center',
      dataIndex: 'companyName',
      hideInTable: true,
      renderFormItem: () => {
        return (
          <ProFormSelect
            showSearch
            debounceTime={300}
            allowClear
            request={async ({ keyWords }) => {
              if (!keyWords) {
                return [];
              }
              const { data } = await likeCompanyName({
                companyName: keyWords,
              });
              return (data || []).map((item: any) => {
                return {
                  label: item?.name,
                  value: item?.name,
                };
              });
            }}
            placeholder="请选择主体"
            formItemProps={{
              style: {
                marginBottom: 0,
              },
            }}
          />
        );
      },
    },
    {
      title: '债券类型',
      align: 'center',
      dataIndex: 'bondType',
      hideInTable: true,
      initialValue: bondTypeInitValue,
      renderFormItem: () => {
        return (
          <Select
            options={bondType}
            placeholder={'请选择债券类型'}
            allowClear
            maxTagCount="responsive"
            mode="multiple"
          />
        );
      },
    },
    // {
    //   title: '行业', //TODO 后续加上筛选项
    //   align: 'center',
    //   dataIndex: 'industryName',
    //   hideInTable: true,
    //   renderFormItem: () => {
    //     return <Select placeholder={'请选择行业'} options={industry} allowClear />;
    //   },
    // },
    // {
    //   title: '区域选择',  //TODO 后续加上筛选项
    //   align: 'center',
    //   dataIndex: 'province',
    //   hideInTable: true,
    //   renderFormItem: () => {
    //     return (
    //       <Select
    //         placeholder={'请选择区域选择'}
    //         options={[
    //           {
    //             label: '2',
    //             value: '2',
    //           },
    //         ]}
    //       />
    //     );
    //   },
    // },
    {
      title: '债项评级',
      align: 'center',
      dataIndex: 'bondRating',
      hideInTable: true,
      renderFormItem: () => {
        return <Select options={ratingSelectOption} placeholder={'请选择债项评级'} allowClear />;
      },
    },
    {
      title: '主体评级',
      align: 'center',
      dataIndex: 'companyRating',
      hideInTable: true,
      renderFormItem: () => {
        return <Select options={ratingSelectOption} placeholder={'请选择主体评级'} allowClear />;
      },
    },
    {
      title: '持仓债券',
      align: 'center',
      dataIndex: 'holdOn',
      hideInTable: true,
      formItemProps: {
        valuePropName: 'checked',
      },
      initialValue: false,
      renderFormItem: () => {
        return <Checkbox />;
      },
    },
    {
      title: '城投债',
      align: 'center',
      dataIndex: 'urbanInvest',
      hideInTable: true,
      formItemProps: {
        valuePropName: 'checked',
      },
      initialValue: false,
      renderFormItem: () => {
        return <Checkbox />;
      },
    },
  ];

  const columns: ProColumns<IValuationMoveTableItem>[] = [
    {
      title: '时间',
      align: 'left',
      dataIndex: 'dateTime',
      hideInSearch: true,
      hideInForm: true,
      width: 100,
      sorter: true,
      fixed: 'left',
    },
    {
      title: '债券简称',
      align: 'left',
      dataIndex: 'bondShortName',
      hideInSearch: true,
      hideInForm: true,
      width: 80,
      ellipsis: true,
      fixed: 'left',
      render: (text, record) => {
        const isMark = record?.priceChangeMark;
        return (
          <div
            className={cls({
              [styles['normal-point']]: !isMark,
              [styles['abnormal-point']]: isMark,
            })}
            onClick={onNavigateClick(record?.bondCode)}
          >
            {text}
          </div>
        );
      },
    },
    {
      title: '债券代码',
      align: 'left',
      dataIndex: 'bondCode',
      hideInSearch: true,
      hideInForm: true,
      ellipsis: true,
      width: 100,
      fixed: 'left',
    },
    {
      title: '主体',
      align: 'left',
      dataIndex: 'companyName',
      hideInSearch: true,
      hideInForm: true,
      width: 150,
      ellipsis: true,
      fixed: 'left',
      render: (text) => {
        return (
          <div title={text as string} style={{ textAlign: 'left' }}>
            {text}
          </div>
        );
      },
    },
    {
      title: '中债估值（元）',
      align: 'right',
      dataIndex: 'firstPrice',
      hideInSearch: true,
      hideInForm: true,
      width: 135,
    },
    {
      title: '昨日估值（元）',
      align: 'right',
      dataIndex: 'secondPrice',
      hideInSearch: true,
      hideInForm: true,
      width: 135,
    },
    {
      title: '估值收益率',
      align: 'right',
      dataIndex: 'valYields',
      hideInSearch: true,
      hideInForm: true,
      width: 100,
    },
    {
      title: <span style={{ color: '#ff4a4f' }}>偏离百分比（%）</span>,
      align: 'right',
      dataIndex: 'offsetPCT',
      hideInForm: true,
      hideInSearch: true,
      width: 150,
      sorter: true,
      render: (text) => {
        return <span style={{ color: getOffsetValColor(text) }}>{text}</span>;
      },
    },
    {
      title: <span style={{ color: '#ff4a4f' }}>绝对值偏离</span>,
      align: 'right',
      dataIndex: 'offsetVal',
      hideInSearch: true,
      hideInForm: true,
      width: 135,
      sorter: true,
      render: (text) => {
        return <span style={{ color: getOffsetValColor(text) }}>{text}</span>;
      },
    },
    {
      title: '成交量（手）',
      align: 'right',
      dataIndex: 'volume',
      hideInSearch: true,
      hideInForm: true,
      width: 135,
      sorter: true,
    },
    {
      title: '成交金额（万元）',
      align: 'right',
      dataIndex: 'amount',
      hideInSearch: true,
      hideInForm: true,
      width: 150,
      sorter: true,
    },
    {
      title: '债项/主体评级',
      align: 'right',
      dataIndex: 'bondCompany',
      hideInSearch: true,
      hideInForm: true,
      width: 135,
      renderText: (_, record) => {
        return (
          <span>
            {record?.bondRating ?? '--'}/{record?.companyRating ?? '--'}
          </span>
        );
      },
    },
    {
      title: '剩余期限（年）',
      align: 'right',
      dataIndex: 'remainingMaturity',
      hideInSearch: true,
      hideInForm: true,
      width: 135,
    },
    {
      title: '票面利率(%)',
      align: 'right',
      dataIndex: 'couponRate',
      hideInSearch: true,
      hideInForm: true,
      width: 120,
    },
    // {
    //   title: '行业',
    //   align: 'left',
    //   dataIndex: 'industryName',
    //   hideInSearch: true,
    //   hideInForm: true,
    //   width: 135,
    //   ellipsis: true
    // },
    {
      title: '债券类型',
      align: 'left',
      dataIndex: 'bondType',
      hideInSearch: true,
      hideInForm: true,
      width: 135,
      ellipsis: true,
    },
  ];

  return (
    <ProTable<IValuationMoveTableItem>
      size="small"
      columns={[...searchColumns, ...columns]}
      formRef={formRef}
      options={{
        density: false,
      }}
      search={{
        labelWidth: 90,
        style: {
          marginBottom: 0,
        },
      }}
      form={{
        name: 'yesterdayForm',
        ignoreRules: false,
      }}
      scroll={{ x: 'max-content', y: 500 }}
      rowKey={(record: any) => `${record?.dateTime}${record?.bondCode}`}
      request={async (params, sort) => {
        const { data, total } = await reloadDataSource(params, sort);
        return {
          data: data,
          total: total,
        };
      }}
      pagination={{ defaultPageSize: 10 }}
      columnsState={{
        value: columnsState,
        onChange: setColumnsState,
      }}
    />
  );
};

export default ValuationMove;
