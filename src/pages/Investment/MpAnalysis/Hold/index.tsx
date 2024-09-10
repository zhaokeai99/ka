import React, { useEffect, useMemo, useRef, useState } from 'react';
import ProCard from '@ant-design/pro-card';
import { cardGutter, contentPadding } from '@/themes';
import { Button, message, Radio } from 'antd';
import moment from 'moment';
import { ExportOutlined } from '@ant-design/icons';
import { ProFormInstance, ProTable } from '@ant-design/pro-components';
import {
  getBondExportUrl,
  getStockExportUrl,
  queryBondByPage,
  queryStockByPage,
  querySwClassifyLevelOne,
} from './service';
import { useModel } from '@@/plugin-model/useModel';
import { dealNumThousandsAndFloat } from '@/utils/utils';
import './index.less';
import ProTableHandle from '@/pages/Investment/util/ProTableHandle';
import { IrReportFacadeAuthUserManage } from '@/pages/Investment/StockResearch/irUserManage/service';
import NoPermissionPage from '@/components/NoPermissionPage';

const Hold = () => {
  const actionRef = useRef<any>();
  const formRef = useRef<ProFormInstance>();
  const { initialState } = useModel('@@initialState'); // 用户信息

  const [currentRadioGroupValue, setCurrentRadioGroupValue] = useState<string>('stock');
  const [swLevelOneIndustries, setSwLevelOneIndustries] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [pass, setPass] = useState<boolean | undefined>(undefined);

  const stockColumns: any = useMemo(() => {
    return [
      {
        title: '日期',
        dataIndex: 'tDate',
        valueType: 'date',
        initialValue: moment().subtract(1, 'day').format('YYYY-MM-DD'),
        align: 'center',
        order: 3,
      },
      {
        title: '证券代码',
        dataIndex: 'stockCode',
        hideInSearch: true,
        align: 'center',
      },
      {
        title: '证券名称',
        dataIndex: 'stockName',
        align: 'center',
        hideInSearch: true,
      },
      {
        title: '证券名称',
        dataIndex: 'fromBondName',
        align: 'center',
        order: 0,
        hideInTable: true,
      },
      {
        title: '申万行业',
        dataIndex: 'formSwLevelOne',
        valueType: 'select',
        valueEnum: swLevelOneIndustries?.length
          ? ProTableHandle.toValueEnum(swLevelOneIndustries, 'industriesName', 'industriesName')
          : {},
        fieldProps: { showSearch: true, mode: 'multiple' },
        align: 'center',
        order: 2,
        hideInTable: true,
      },
      {
        title: '申万行业',
        dataIndex: 'swClassifyLevelOne',
        align: 'center',
        hideInSearch: true,
      },
      {
        title: '市值（万元）',
        dataIndex: 'sumMarketValue',
        hideInSearch: true,
        sorter: true,
        className: 'text-right head-center',
        render: (text: any) => {
          if (text >= 0) {
            return dealNumThousandsAndFloat(text, 2);
          }
          return '-';
        },
      },
      {
        title: '占股票总市值比例（%）',
        dataIndex: 'stockMarketRatio',
        hideInSearch: true,
        className: 'text-right head-center',
        render: (text: any) => {
          if (text >= 0) {
            return dealNumThousandsAndFloat(text, 2);
          }
          return '-';
        },
      },
    ];
  }, [swLevelOneIndustries]);

  const bondColumns: any = useMemo(() => {
    return [
      {
        title: '日期',
        dataIndex: 'tDate',
        valueType: 'date',
        initialValue: moment().subtract(1, 'day').format('YYYY-MM-DD'),
        align: 'center',
        order: 3,
      },
      {
        title: '证券代码',
        dataIndex: 'bondCode',
        hideInSearch: true,
        align: 'center',
      },
      {
        title: '证券名称',
        dataIndex: 'bondName',
        align: 'center',
        hideInSearch: true,
      },
      {
        title: '证券名称',
        dataIndex: 'fromBondName',
        align: 'center',
        order: 0,
        hideInTable: true,
      },
      {
        title: '申万行业',
        dataIndex: 'formSwLevelOne',
        valueType: 'select',
        valueEnum: swLevelOneIndustries?.length
          ? ProTableHandle.toValueEnum(swLevelOneIndustries, 'industriesName', 'industriesName')
          : {},
        fieldProps: { showSearch: true, mode: 'multiple' },
        align: 'center',
        order: 2,
        hideInTable: true,
      },
      {
        title: '申万行业',
        dataIndex: 'swLevelOneName',
        align: 'center',
        hideInSearch: true,
      },
      {
        title: '市值（万元）',
        dataIndex: 'sumMarketValue',
        hideInSearch: true,
        sorter: true,
        className: 'text-right head-center',
        render: (text: any) => {
          if (text >= 0) {
            return dealNumThousandsAndFloat(text, 2);
          }
          return '-';
        },
      },
      {
        title: '占转债总余额比例（%）',
        dataIndex: 'stockMarketRatio',
        hideInSearch: true,
        className: 'text-right head-center',
        render: (text: any) => {
          if (text >= 0) {
            return dealNumThousandsAndFloat(text, 2);
          }
          return '-';
        },
      },
    ];
  }, [swLevelOneIndustries]);
  const [columns, setColumns] = useState<any>(stockColumns);

  const initSwLevelOneIndustries = async () => {
    const result = await querySwClassifyLevelOne();
    const { data } = result;
    setSwLevelOneIndustries(data);
  };
  const authUser = async () => {
    setLoading(true);
    const data = await IrReportFacadeAuthUserManage({ menu: 'MP_ANALYSIS_HOLD' });
    setPass(data);
    setLoading(false);
  };
  useEffect(() => {
    authUser();
    // 加载申万行业
    initSwLevelOneIndustries();
  }, []);

  useEffect(() => {
    setColumns(stockColumns);
  }, [swLevelOneIndustries]);

  const request = async (params?: any, sort?: any) => {
    const fmtParams: any = {
      current: params.current,
      pageSize: params.pageSize,
    };
    if (params?.tDate) {
      fmtParams.tDate = moment(params?.tDate).format('YYYYMMDD');
    }
    // 排序
    if (JSON.stringify(sort) != '{}') {
      const [[key, value]] = Object.entries(sort);
      fmtParams.sortField = key;
      if (value === 'descend') {
        fmtParams.sortOrder = 'desc';
      } else if (value === 'ascend') {
        fmtParams.sortOrder = 'asc';
      }
    }
    // 股票
    if (currentRadioGroupValue === 'stock') {
      if (params?.fromBondName) {
        fmtParams.stockName = params?.fromBondName;
      }
      if (params?.formSwLevelOne) {
        fmtParams.swClassifyLevelOnes = params?.formSwLevelOne;
      }
      const resultStock = await queryStockByPage(fmtParams);
      const { success, data } = resultStock;
      if (success) {
        const { current, pageSize, total } = data;
        return {
          current: current,
          pageSize: pageSize,
          total: total,
          data: data.data,
          success: true,
        };
      }
    }

    // 转债
    if (currentRadioGroupValue === 'bond') {
      if (params?.fromBondName) {
        fmtParams.bondName = params?.fromBondName;
      }
      if (params?.formSwLevelOne) {
        fmtParams.swLevelOneNames = params?.formSwLevelOne;
      }
      const resultStock = await queryBondByPage({
        ...fmtParams,
        classTypes: ['可转债', '可交换债'],
      });
      const { success, data } = resultStock;
      if (success) {
        const { current, pageSize, total } = data;
        return {
          current: current,
          pageSize: pageSize,
          total: total,
          data: data.data,
          success: true,
        };
      }
    }
    return {
      data: [],
      success: true,
    };
  };

  const RadioGroupChange = (e: any) => {
    const value = e.target.value;
    if ('stock' === value) {
      setColumns(stockColumns);
    }
    if ('bond' === value) {
      setColumns(bondColumns);
    }
    setCurrentRadioGroupValue(value);
    actionRef?.current?.reload();
  };
  const exportData = async () => {
    const form = formRef.current?.getFieldsValue(true);
    const exportParams: any = {};
    if (form?.tDate) {
      exportParams.tDate = moment(form?.tDate).format('YYYYMMDD');
    }
    let parmUrl = `?accountName=${initialState?.userName}`;

    if (currentRadioGroupValue === 'stock') {
      if (form?.fromBondName) {
        exportParams.stockName = form?.fromBondName;
      }
      if (form?.formSwLevelOne) {
        exportParams.swClassifyLevelOnes = form?.formSwLevelOne;
      }
      for (const itm in exportParams) {
        if (exportParams[itm]) {
          parmUrl = parmUrl.concat(`&${itm}=${exportParams[itm]}`);
        }
      }
      const exportStockUrl = await getStockExportUrl();
      const { data, success } = exportStockUrl;
      if (success && data !== 'fail') {
        const url = `${data}${parmUrl}`;
        window.location.href = url;
      } else {
        message.error('导出失败');
      }
    }
    if (currentRadioGroupValue === 'bond') {
      exportParams.classTypes = ['可转债', '可交换债'];
      if (form?.fromBondName) {
        exportParams.bondName = form?.fromBondName;
      }
      if (form?.formSwLevelOne) {
        exportParams.swLevelOneNames = form?.formSwLevelOne;
      }
      for (const itm in exportParams) {
        if (exportParams[itm]) {
          parmUrl = parmUrl.concat(`&${itm}=${exportParams[itm]}`);
        }
      }

      const exportBondUrl = await getBondExportUrl();
      const { data, success } = exportBondUrl;
      if (success && data !== 'fail') {
        const url = `${data}${parmUrl}`;
        window.location.href = url;
      } else {
        message.error('导出失败');
      }
    }
  };
  const getAuthFail = () => {
    return <NoPermissionPage />;
  };
  return (
    <>
      {pass !== undefined && pass === false ? (
        getAuthFail()
      ) : (
        <ProCard
          style={{ padding: contentPadding }}
          direction="column"
          ghost
          gutter={[0, cardGutter]}
          size="small"
          loading={loading}
        >
          <ProTable
            headerTitle={
              <Radio.Group defaultValue="stock" buttonStyle="solid" onChange={RadioGroupChange}>
                <Radio.Button value="stock">股票</Radio.Button>
                <Radio.Button value="bond">转债</Radio.Button>
              </Radio.Group>
            }
            size="small"
            columns={columns}
            actionRef={actionRef}
            cardBordered
            request={request}
            formRef={formRef}
            rowKey="id"
            search={{ labelWidth: 'auto' }}
            options={{ density: false }}
            pagination={{ defaultPageSize: 50 }}
            toolBarRender={() => [
              <Button key="button" icon={<ExportOutlined />} type="primary" onClick={exportData}>
                导出
              </Button>,
            ]}
          />
        </ProCard>
      )}
    </>
  );
};

export default Hold;
