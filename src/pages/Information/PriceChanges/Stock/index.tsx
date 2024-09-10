import React, { useRef, useState, useMemo, useCallback } from 'react';
import ProTable, { ProColumns, ColumnsState } from '@ant-design/pro-table';
import { ProFormInstance, ProFormDigitRange, ProFormSelect } from '@ant-design/pro-form';
import ProCard from '@ant-design/pro-card';
import { Select } from 'antd';
import { cardGutter, contentPadding } from '@/themes';
import cls from 'classnames';
import { history } from 'umi';
import {
  fundTypeOpitions,
  getColorText,
  productTypeOpitions,
  riseAndFallPctOption,
  changeTypeOpitions,
  commonColumnState,
  ChangeTypeKeys,
  stockTypeNameOpitions,
  StockTypeNameKeys,
} from './data.d';
import {
  getCiticIndustryList,
  IAFColumnsType,
  ITableColumnsType,
  likeStockName,
  getStockReport,
} from './service';
import moment from 'moment';
import styles from './index.less';
import DateTimeItem from './components/DateTimeItem';

// 基准指数默认值
const riseAndFallPctInitValue = [
  'oppositeHs300IncomeRate',
  'oppositeZz500IncomeRate',
  'oppositeCybIncomeRate',
  'oppositeHsIncomeRate',
  'oppositeHskjIncomeRate',
  'oppositeCiticsOneWeekIncomeRate',
];

// 市场类型选择A股时,基准指数默认值
const riseAndFallPctASInitVale = [
  'oppositeHs300IncomeRate',
  'oppositeZz500IncomeRate',
  'oppositeCybIncomeRate',
  'oppositeCiticsOneWeekIncomeRate',
];

// 市场类型选择港股股时,基准指数默认值
const riseAndFallPctHKSInitVale = [
  'oppositeHsIncomeRate',
  'oppositeHskjIncomeRate',
  'oppositeCiticsOneWeekIncomeRate',
];

const changeTypeInitValue = ChangeTypeKeys.DAY;

function getPreviousWorkday() {
  const workday = moment();
  const day = workday.day();
  let diff = 1;
  if (day == 0 || day == 1) {
    diff = day + 2;
  }
  return workday.subtract(diff, 'days');
}

export const sorterOpition = {
  incomeRate: 'incomeRate',
  oppositeCiticsOneWeekIncomeRate: 'oppositeCiticsOneWeekIncomeRate',
};

// 联动的涨跌幅是否可以进行排序
const riseAndFallSorter = ['oppositeCiticsOneWeekIncomeRate'];

const getRFColumns = (value: string[], prefix?: string): ProColumns<IAFColumnsType>[] => {
  if (!value) {
    return [];
  }
  if (value?.length == 0) {
    return [];
  }
  return value?.map((item) => {
    const target = riseAndFallPctOption?.find((v) => v?.value === item);
    let width = 0;
    let title = '';
    if (target) {
      title = target?.title(prefix);
      if (title) {
        width = title?.length * 14 + 40;
      }
    }
    let sorter = false;
    if (target?.value && riseAndFallSorter?.includes(target?.value)) {
      sorter = true;
    }
    return {
      title: <span>{title}</span>,
      align: 'right',
      dataIndex: target?.value,
      hideInForm: true,
      hideInSearch: true,
      ellipsis: true,
      width: width,
      sorter,
      renderText: (text) => {
        return <span style={{ color: getColorText(text) }}>{text ?? '--'}</span>;
      },
    };
  });
};

/**
 * 估值偏离
 */
//TODO
const ValuationDeviation: React.FC<any> = () => {
  const formRef = useRef<ProFormInstance>();
  const [riseAndFallPctColumns, setRiseAndFallPctColumns] =
    useState<string[]>(riseAndFallPctInitValue);
  const [riseSelectOpitions, setRiseSelectOpitions] = useState<any[]>(riseAndFallPctOption);
  const [columnsState, setColumnsState] = useState<Record<string, ColumnsState>>(commonColumnState);
  const [changeTypeValue, setChangeTypeValue] = useState<string>(changeTypeInitValue); // 涨跌幅
  const [incomeRatePrefix, setIncomeRatePrefix] = useState<string>(changeTypeInitValue); // 涨跌幅前缀

  const onRiseAndFallPctChange = useCallback(
    (value: any[]) => {
      if (formRef?.current) {
        if (formRef.current?.setFieldValue) {
          formRef.current?.setFieldValue('riseAndFallPct', value);
        }
      }
      setRiseAndFallPctColumns(value);
    },
    [riseAndFallPctColumns],
  );

  const onNavigateClick = (bondCode: any, name: any) => () => {
    history.push(`/information/priceChanges/stockDetail/${name}/${bondCode}`);
  };

  // 解构请求参数
  const reloadDataSource = useCallback(async (params, sort) => {
    const requestParams: Partial<
      ITableColumnsType & { current: number; riseAndFallPct: string[] }
    > = {};
    Object.keys(params).forEach((item) => {
      switch (item) {
        case 'amount': // 成交金额
          requestParams['maxAmount'] = params?.amount?.[1];
          requestParams['minAmount'] = params?.amount?.[0];
          break;
        case 'dateTime': // 时间
          if (Array.isArray(params['dateTime'])) {
            requestParams['endTime'] = moment(params?.dateTime?.[1])?.format('yyyyMMDD');
            requestParams['startTime'] = moment(params?.dateTime?.[0])?.format('yyyyMMDD');
          } else {
            requestParams['startTime'] = moment(params?.dateTime)?.format('yyyyMMDD');
          }
          break;
        case 'current':
          requestParams['pageNum'] = params?.current;
          break;
        case 'stockTypeName':
          const stockTypeName = params?.stockTypeName;
          if (stockTypeName && stockTypeName?.length === 1) {
            requestParams['stockTypeName'] = stockTypeName[0];
          }
          break;
        case 'riseAndFallPct':
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

    const { data } = await getStockReport(requestParams);

    return {
      ...data,
    };
  }, []);

  const getIncomeRatePrefix = useCallback(
    async (type: 'reset' | 'submit') => {
      if (type === 'reset') {
        setIncomeRatePrefix(changeTypeInitValue);
      } else if (type === 'submit') {
        const changeType = await formRef.current?.getFieldValue('changeType');
        setIncomeRatePrefix(changeType);
      }
    },
    [incomeRatePrefix],
  );

  const onChangeTypeChange = useCallback(
    (value: any) => {
      if (formRef?.current) {
        if (formRef.current?.setFieldValue) {
          formRef.current?.setFieldValue('changeType', value);
        }
      }
      setChangeTypeValue(value);
    },
    [changeTypeValue],
  );

  const dataTimeInitValue = useMemo(() => {
    if (changeTypeValue === ChangeTypeKeys.CUSTOM) {
      return [getPreviousWorkday(), getPreviousWorkday()];
    } else {
      return getPreviousWorkday();
    }
  }, [changeTypeValue]);

  const getRiseAndFallPctOpition = (columns: string[]) => {
    const options = riseAndFallPctOption?.reduce((pre: any, cur) => {
      if (columns?.includes(cur?.value)) {
        pre.push(cur);
      }
      return pre;
    }, []);
    setRiseSelectOpitions(options || []);
  };

  const onStockTypeNameChange = useCallback(
    (value: any) => {
      if (formRef?.current) {
        if (formRef.current?.setFieldValue) {
          formRef.current?.setFieldValue('stockTypeName', value);
        }
      }
      if (value && value?.length === 1) {
        const stockTypeName = value[0];
        if (stockTypeName === StockTypeNameKeys.ASHARES) {
          onRiseAndFallPctChange(riseAndFallPctASInitVale);
          getRiseAndFallPctOpition(riseAndFallPctASInitVale);
        } else if (stockTypeName === StockTypeNameKeys.HSHARES) {
          onRiseAndFallPctChange(riseAndFallPctHKSInitVale);
          getRiseAndFallPctOpition(riseAndFallPctHKSInitVale);
        }
      } else {
        onRiseAndFallPctChange(riseAndFallPctInitValue);
        getRiseAndFallPctOpition(riseAndFallPctInitValue);
      }
    },
    [riseAndFallPctColumns],
  );

  const onResetClick = () => {
    onRiseAndFallPctChange(riseAndFallPctInitValue); // 重置基准指数
    getRiseAndFallPctOpition(riseAndFallPctInitValue); // 重置基准指数Opitions
    onChangeTypeChange(changeTypeInitValue); // 重置涨跌幅类型
    getIncomeRatePrefix('reset');

    if (formRef.current) {
      if (formRef?.current?.submit) {
        formRef?.current?.submit();
      }
    }
  };

  const searchColumns: ProColumns<any>[] = [
    {
      title: '涨跌幅类型',
      align: 'center',
      dataIndex: 'changeType',
      hideInTable: true,
      initialValue: changeTypeInitValue,
      renderFormItem: () => {
        return (
          <Select
            options={changeTypeOpitions}
            placeholder={'日/周/月/年/区间'}
            onChange={onChangeTypeChange}
            fieldNames={{
              label: 'title',
            }}
          />
        );
      },
    },
    {
      title: '日期',
      align: 'center',
      dataIndex: 'dateTime',
      hideInTable: true,
      initialValue: dataTimeInitValue,
      renderFormItem: () => <DateTimeItem changeTypeValue={changeTypeValue} />,
    },
    {
      title: '市场类型',
      align: 'center',
      dataIndex: 'stockTypeName',
      hideInTable: true,
      renderFormItem: () => {
        return (
          <Select
            allowClear
            placeholder="A股/港股"
            options={stockTypeNameOpitions}
            mode={'multiple'}
            onChange={onStockTypeNameChange}
            maxTagCount="responsive"
          />
        );
      },
    },
    {
      title: '基准指数',
      align: 'center',
      dataIndex: 'riseAndFallPct',
      hideInTable: true,
      initialValue: riseAndFallPctInitValue,
      renderFormItem: () => {
        return (
          <Select
            options={riseSelectOpitions}
            onChange={onRiseAndFallPctChange}
            mode={'multiple'}
            maxTagCount="responsive"
            placeholder={'无/基准指数'}
            allowClear
          />
        );
      },
    },
    {
      title: '持仓产品类型',
      align: 'center',
      dataIndex: 'productType',
      hideInTable: true,
      renderFormItem: () => {
        return <Select allowClear placeholder="公募/专户" options={productTypeOpitions} />;
      },
    },
    {
      title: '持仓基金类型',
      align: 'center',
      dataIndex: 'fundType',
      hideInTable: true,
      renderFormItem: () => {
        return <Select allowClear placeholder="主动管理型/被动管理型" options={fundTypeOpitions} />;
      },
    },
    {
      title: '股票搜索',
      align: 'center',
      dataIndex: 'windStockCode',
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
              const { data } = await likeStockName({
                stockName: keyWords,
              });
              return (data || []).map((item: any) => {
                return {
                  label: `${item?.name}--${item?.id}`,
                  value: item?.id,
                };
              });
            }}
            placeholder="请选择股票代码，简称"
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
      title: '成交金额(千元)',
      align: 'center',
      dataIndex: 'amount',
      hideInTable: true,
      renderFormItem: () => {
        return (
          <ProFormDigitRange
            placeholder={['最小值', '最大值']}
            name={'amount'}
            fieldProps={{
              precision: 2,
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
      title: '行业',
      align: 'center',
      dataIndex: 'industryName',
      hideInTable: true,
      renderFormItem: () => {
        return (
          <ProFormSelect
            allowClear
            request={async () => {
              const { data } = await getCiticIndustryList();
              return (data || []).map((item: any) => {
                return {
                  label: item?.name,
                  value: item?.name,
                };
              });
            }}
            placeholder="中信一级行业"
            formItemProps={{
              style: {
                marginBottom: 0,
              },
            }}
          />
        );
      },
    },
  ];

  const columns: ProColumns<ITableColumnsType>[] = useMemo(() => {
    const prefix = changeTypeOpitions?.find((v) => v?.value === incomeRatePrefix);
    return [
      {
        title: '时间',
        align: 'left',
        dataIndex: 'pTradeDate',
        hideInSearch: true,
        hideInForm: true,
        width: 100,
        fixed: 'left',
      },
      {
        title: '股票简称',
        align: 'left',
        dataIndex: 'stockName',
        hideInSearch: true,
        hideInForm: true,
        width: 100,
        ellipsis: true,
        fixed: 'left',
        render: (text, record) => {
          return (
            <div
              className={cls({
                [styles['normal-point']]: true,
              })}
              onClick={onNavigateClick(record?.windStockCode, record?.stockName)}
            >
              {text}
            </div>
          );
        },
      },
      {
        title: '股票代码',
        align: 'left',
        dataIndex: 'windStockCode',
        width: 100,
        hideInSearch: true,
        hideInForm: true,
        ellipsis: true,
        fixed: 'left',
      },
      {
        title: '行业',
        align: 'left',
        dataIndex: 'citicClassifyOneTypeName',
        hideInSearch: true,
        hideInForm: true,
        ellipsis: true,
        width: 100,
        fixed: 'left',
      },
      {
        title: '现价（元）',
        align: 'right',
        dataIndex: 'closeAmt',
        width: 100,
        hideInSearch: true,
        hideInForm: true,
        ellipsis: true,
      },
      {
        title: <span style={{ color: '#ff4a4f' }}>{`${prefix?.label ?? ''}涨跌幅（%）`}</span>,
        align: 'right',
        dataIndex: 'incomeRate',
        hideInSearch: true,
        hideInForm: true,
        width: 160,
        sorter: true,
        renderText: (text) => {
          return <span style={{ color: getColorText(text) }}>{text ?? '--'}</span>;
        },
      },
      {
        title: '行业指数涨跌幅（%）',
        align: 'right',
        dataIndex: 'citicsOneIncomeRate',
        hideInForm: true,
        hideInSearch: true,
        ellipsis: true,
        width: 180,
        renderText: (text) => {
          return <span style={{ color: getColorText(text) }}>{text ?? '--'}</span>;
        },
      },
      ...getRFColumns(riseAndFallPctColumns, prefix?.label),
      {
        title: <span>沪深300涨跌幅（%）</span>,
        align: 'right',
        dataIndex: 'hs300IncomeRate',
        hideInForm: true,
        hideInSearch: true,
        ellipsis: true,
        width: 180,
        renderText: (text) => {
          return <span style={{ color: getColorText(text) }}>{text ?? '--'}</span>;
        },
      },
      {
        title: <span>中证500涨跌幅（%）</span>,
        align: 'right',
        dataIndex: 'zz500IncomeRate',
        hideInForm: true,
        hideInSearch: true,
        ellipsis: true,
        width: 180,
        renderText: (text) => {
          return <span style={{ color: getColorText(text) }}>{text ?? '--'}</span>;
        },
      },
      {
        title: <span>创业板指数涨跌幅（%）</span>,
        align: 'right',
        dataIndex: 'cybIncomeRate',
        hideInForm: true,
        hideInSearch: true,
        ellipsis: true,
        width: 190,
        renderText: (text) => {
          return <span style={{ color: getColorText(text) }}>{text ?? '--'}</span>;
        },
      },
      {
        title: <span>恒生指数涨跌幅（%）</span>,
        align: 'right',
        dataIndex: 'hsIncomeRate',
        hideInForm: true,
        hideInSearch: true,
        ellipsis: true,
        width: 180,
        renderText: (text) => {
          return <span style={{ color: getColorText(text) }}>{text ?? '--'}</span>;
        },
      },
      {
        title: <span>恒生科技指数涨跌幅（%）</span>,
        align: 'right',
        dataIndex: 'hskjIncomeRate',
        hideInForm: true,
        hideInSearch: true,
        ellipsis: true,
        width: 200,
        renderText: (text) => {
          return <span style={{ color: getColorText(text) }}>{text ?? '--'}</span>;
        },
      },
      {
        title: '成交量（手）',
        align: 'right',
        dataIndex: 'tradeCnt',
        hideInSearch: true,
        hideInForm: true,
        width: 150,
      },
      {
        title: '成交金额（千元）',
        align: 'right',
        dataIndex: 'tradeAmt',
        hideInSearch: true,
        hideInForm: true,
        width: 150,
      },
      {
        title: '换手率（%）',
        align: 'right',
        dataIndex: 'turnover',
        hideInSearch: true,
        hideInForm: true,
        width: 150,
      },
    ];
  }, [riseAndFallPctColumns, changeTypeValue, incomeRatePrefix]);

  return (
    <ProCard
      size="small"
      ghost
      style={{ padding: contentPadding }}
      direction="column"
      gutter={[0, cardGutter]}
      className={styles['stock']}
    >
      <ProTable<any>
        size="small"
        columns={[...searchColumns, ...columns]}
        formRef={formRef}
        options={{
          density: false,
        }}
        search={{
          labelWidth: 108,
          style: {
            marginBottom: 0,
          },
        }}
        onReset={onResetClick}
        onSubmit={() => {
          getIncomeRatePrefix('submit');
        }}
        scroll={{ x: 'max-content', y: 500 }}
        rowKey={(_, index) => `row-${index}`}
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
    </ProCard>
  );
};

export default ValuationDeviation;
