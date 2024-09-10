import {
  Button,
  Col,
  Divider,
  Form,
  message,
  notification,
  Popover,
  Row,
  Space,
  Table,
  Tag,
} from 'antd';
import React, { memo, useEffect, useMemo, useState } from 'react';
import { filter as _filter, find as _find } from 'lodash';
import {
  BENCHMARKNETGROWTHRATIO_CHARTS_COLUMNS,
  EXCESSRETURNS_CHARTS_COLUMNS,
  MpPortfolioAnalyseFacadeExportData,
  MpPortfolioAnalyseFacadeQuery,
  MpBenchmarkQuery,
  NETGROWTHRATIO_CHARTS_COLUMNS,
} from '../service';
import moment from 'moment';
import '../index.less';
import {
  CompressOutlined,
  ExportOutlined,
  MinusCircleOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import { MpRsHoldItemFacadeQueryByPage } from '@/pages/Investment/Simulation/PortfolioManagement/service';
import { dealNumThousandsAndFloat } from '@/utils/utils';
import ProCardPlus from '@/components/ProCardPlus';
import { history, useModel } from 'umi';

interface FormProps {
  formValue: any;
  domainDic: any;
}

const GroupTable = (props: FormProps) => {
  const { formValue, domainDic } = props;

  const { initialState } = useModel('@@initialState'); // 用户信息
  const [tableData, setTableData] = useState<any>([]);
  const [dicMap, setDicMap] = useState<any>({ benchmark: [] });
  const [pageInfo, setPageInfo] = useState<any>({ current: 1, pageSize: 100, total: 0 });
  const [expandedRowKeys, setExpandedRowKeys] = useState<any>(['']);
  const [childTable, setChildTable] = useState({});
  const [loading, setLoading] = useState<boolean>(false);
  // const [childLoading, setChildLoading] = useState<boolean>(false);

  const queryTableData = async (p: any) => {
    setLoading(true);
    const { data, current, pageSize, total } = await MpPortfolioAnalyseFacadeQuery({
      ...formValue,
      tradeDate: moment(formValue?.tradeDate)?.format('YYYYMMDD'),
      ...p,
    });
    const fomtData = data?.map((enty: any) => {
      const bm = _find(dicMap.benchmark, { value: enty?.bmCode, domain: enty?.domain });
      if (bm !== undefined) {
        enty.bmComment = bm?.comment;
      }
      return enty;
    });
    setTableData(fomtData);
    setPageInfo({ current, pageSize, total });
    setLoading(false);
  };

  // 加载字典
  const dicLoad = async () => {
    const dic: any = { benchmark: [] };
    // 基准
    const bmResult = await MpBenchmarkQuery({});
    if (bmResult) {
      dic.benchmark = bmResult;
    }
    setDicMap(dic);
  };

  useEffect(() => {
    // 加截数据
    dicLoad();
  }, []);

  useEffect(() => {
    if (formValue.circles.length > 0 && !formValue?.circles.includes('C')) {
      const p = {
        current: pageInfo.current,
        pageSize: pageInfo.pageSize,
      };
      queryTableData(p);
    } else if (formValue?.circles.includes('C')) {
      const p = {
        current: pageInfo.current,
        pageSize: pageInfo.pageSize,
        sortField: 'bExcessReturnsCValueDec',
        sortOrder: 'desc',
      };
      queryTableData(p);
    }
  }, [formValue]);

  const pageChange = (tablePagParm: any, _: any, sorter: any) => {
    const { field, order } = sorter;
    const { current, pageSize } = tablePagParm;
    setPageInfo({ ...pageInfo, current: current, pageSize: pageSize });

    let changeParm = {
      ...pageInfo,
      current: current,
      pageSize: pageSize,
    };

    if (order) {
      changeParm = {
        ...changeParm,
        sortField: field,
        sortOrder: order === 'ascend' ? 'asc' : 'desc',
      };
    } else if (formValue?.circles.includes('C')) {
      changeParm = {
        ...changeParm,
        sortField: 'bExcessReturnsCValueDec',
        sortOrder: 'desc',
      };
    }

    queryTableData(changeParm);
  };

  // 获取子表单数据
  const getChildProductInfoList = async (parm: any) => {
    // setChildLoading(true);
    const result = await await MpRsHoldItemFacadeQueryByPage({
      tradeDate: parm.tradeDate,
      current: 1,
      pageSize: 10,
      mpCode: parm.mpCode,
      domain: parm.domain,
    });

    const { data = [] } = result || {};
    childTable[parm.domain + '_' + parm.mpCode] = data;
    const tmp = [...expandedRowKeys];
    tmp.push(parm?.domain + '_' + parm?.mpCode);
    setExpandedRowKeys(tmp);
    setChildTable(childTable);
    // setChildLoading(false);
  };

  // 点击查看参数表按钮
  const handleClick = async (record: any) => {
    // 如果是当前以打开的，则关闭。否则关闭其他打开当前
    if (expandedRowKeys?.includes(record?.domain + '_' + record?.mpCode)) {
      setExpandedRowKeys(
        expandedRowKeys.filter((item: string) => item !== record?.domain + '_' + record?.mpCode),
      );
      return;
    }

    // 请求二级table的内容，获取版本列表
    if (record?.bmCode) {
      await getChildProductInfoList({
        mpCode: record?.mpCode,
        domain: record?.domain,
        bmCode: record?.bmCode,
        bmType: record?.bmType,
        tradeDate: record?.tradeDate,
      });
    }
  };

  const handleToPm = (record: any) => {
    const Pmurl = '/investment/portfolio/portfolioManagement/_single_/';
    const {
      id,
      domain,
      domainName,
      mpCode,
      mpName,
      bmCode,
      bmName,
      createTime,
      userId,
      investPool,
      investPoolName,
    } = record;
    const { userNo }: any = initialState;
    const key = userNo === userId ? `mp_${mpCode}` : `${domain}_${mpCode}`;
    history.push(
      `${Pmurl}${key},${id},${domain},${domainName},${mpCode},${mpName},${bmCode},${bmName},${
        createTime ? moment(createTime).format('YYYYMMDD') : moment().format('YYYYMMDD')
      },(${investPool ? investPool?.replace(',', '&') : ''}),(${
        investPoolName ? investPoolName?.replace(',', '&') : ''
      })`,
    );
  };
  const columns: any = useMemo(() => {
    const arr1: any[] = [];
    const arr2: any[] = [];
    const arr3: any[] = [];
    const domainCol =
      domainDic?.length > 1
        ? [
            {
              title: '业务域',
              dataIndex: 'domainName',
            },
          ]
        : [];
    formValue?.circles?.forEach((cur: any) => {
      arr1.push(..._filter(NETGROWTHRATIO_CHARTS_COLUMNS, ['circle', cur]));
    });
    formValue?.circles?.forEach((cur: any) => {
      arr2.push(..._filter(BENCHMARKNETGROWTHRATIO_CHARTS_COLUMNS, ['circle', cur]));
    });
    formValue?.circles?.forEach((cur: any) => {
      arr3.push(..._filter(EXCESSRETURNS_CHARTS_COLUMNS, ['circle', cur]));
    });
    return [
      {
        title: '组合名称',
        dataIndex: 'mpName',
        className: 'text-left head-center',
        fixed: 'left',
        render: (_: any, record: any) => {
          return (
            <Space size={10}>
              {expandedRowKeys?.includes(record.domain + '_' + record.mpCode) ? (
                <MinusCircleOutlined onClick={() => handleClick(record)} />
              ) : (
                <PlusCircleOutlined onClick={() => handleClick(record)} />
              )}
              <a
                onClick={() => {
                  handleToPm(record);
                }}
              >
                {record?.mpName}
              </a>
            </Space>
          );
        },
      },
      {
        title: (
          <Form className={'title_form'}>
            <Row align={'middle'} wrap={false}>
              <Col span={6}>基准代码</Col>
              <Col span={1}>
                <Divider className={'divider'} type="vertical" />
              </Col>
              <Col span={12} className={'col'}>
                基准名称
              </Col>
              <Col span={1}>
                <Divider className={'divider'} type="vertical" />
              </Col>
              <Col span={5} className={'col'}>
                基准权重
              </Col>
            </Row>
          </Form>
        ),
        width: 360,
        dataIndex: 'bmName',
        render: (text: any, record: any) => {
          const list = record?.bmInfoList;
          if (record?.bmType === 2 && list !== undefined) {
            return (
              <Form className={'render_formOne'}>
                {list.map((item: any, index: number) => (
                  <span>
                    {index === 0 ? null : <Divider className={'divider'} type="horizontal" />}
                    <Row
                      align={'middle'}
                      wrap={false}
                      // style={{
                      //   paddingTop: index === 0 ? 0 : 8,
                      //   paddingBottom: index === list.length - 1 ? 0 : 8,
                      // }}
                    >
                      <Col span={7} className={'col1'}>
                        {item.stockCode}
                      </Col>
                      <Col span={12} className={'col2'}>
                        {item.stockName}
                      </Col>
                      <Col span={5} className={'col3'}>
                        {item.weight + '%'}
                      </Col>
                    </Row>
                  </span>
                ))}
              </Form>
            );
          } else if (record?.bmType === 3) {
            return (
              <Form className={'render_formTwo'}>
                <Row align={'middle'} wrap={false}>
                  <Col span={7} className={'col1'}>
                    {record?.bmCode}
                  </Col>
                  <Col span={12} className={'col2'}>
                    <Popover
                      title={
                        <span>
                          {record.bmName}&nbsp;&nbsp;<Tag>{record.bmCode}</Tag>
                        </span>
                      }
                      content={record.bmComment ? record.bmComment : '暂无说明'}
                    >
                      <a>{record?.bmName}</a>
                    </Popover>
                  </Col>
                  <Col span={5} className={'col3'}>
                    100%
                  </Col>
                </Row>
              </Form>
            );
          } else {
            return (
              <Form className={'render_formTwo'}>
                <Row align={'middle'} wrap={false}>
                  <Col span={7} className={'col1'}>
                    {record?.bmCode}
                  </Col>
                  <Col span={12} className={'col2'}>
                    {record?.bmName}
                  </Col>
                  <Col span={5} className={'col3'}>
                    100%
                  </Col>
                </Row>
              </Form>
            );
          }
        },
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        render: (text: any) => (text != undefined ? moment(text).format('YYYY-MM-DD') : text),
      },
      {
        title: '持仓日期',
        dataIndex: 'tradeDate',
        render: (text: any) => (text != undefined ? moment(text).format('YYYY-MM-DD') : text),
      },
      {
        title: '组合超额',
        align: 'center',
        className: 'column_right',
        children: arr3,
      },
      {
        title: '组合收益',
        align: 'center',
        className: 'column_right',
        children: arr1,
      },
      {
        title: '基准收益',
        align: 'center',
        className: 'column_right',
        children: [...arr2],
      },
      {
        title: '创建人',
        dataIndex: 'userId',
        width: 80,
      },
      ...domainCol,
    ];
  }, [formValue.circles, tableData, expandedRowKeys, formValue.domainDic]);

  // 二级table的表头
  const childColumn: any = [
    {
      title: '持仓日期',
      dataIndex: 'tradeDate',
      align: 'center',
    },
    {
      title: '证券代码',
      dataIndex: 'stkCode',
      align: 'center',
    },
    {
      title: '证券名称',
      dataIndex: 'stkName',
      align: 'center',
    },
    {
      title: '最新权重',
      dataIndex: 'weight',
      align: 'center',
      render: (text: any, record: any) => {
        const val = record?.weight;
        if (val === undefined || val === null) {
          return '-';
        }
        return (val * 100).toFixed(2) + '%';
      },
    },
    {
      title: '价格(收盘价)',
      dataIndex: 'price',
      align: 'center',
      render: (text: any, record: any) => {
        const val = record?.price;
        if (val === undefined || val === null) {
          return '-';
        }
        return dealNumThousandsAndFloat(val, 2);
      },
    },
    {
      title: '成本价',
      dataIndex: 'costPrice',
      align: 'center',
      render: (text: any, record: any) => {
        const val = record?.costPrice;
        if (val === undefined || val === null) {
          return '-';
        }
        return dealNumThousandsAndFloat(val.toFixed(4), 4);
      },
    },
  ];

  // 二级table
  const expandedRowRender = (record: any) => {
    return (
      <Table
        className={'MpAnalysis_Child_Table'}
        size="small"
        rowKey="stkCode"
        pagination={false}
        columns={childColumn}
        dataSource={childTable[record.domain + '_' + record?.mpCode]}
        // loading={childLoading}
      />
    );
  };

  const exportData = async () => {
    const { tradeDate, domains } = formValue;
    if (tradeDate) {
      const fomTradeDate = moment(tradeDate)?.format('YYYYMMDD');
      const { success, data, errorMsg } = await MpPortfolioAnalyseFacadeExportData({
        tradeDate: fomTradeDate,
        domains: domains,
      });
      if (success) {
        window.location.href = data;
      } else {
        message.error(errorMsg || '系统错误请稍后重试');
      }
    } else {
      notification['warning']({
        message: '收益详情导出',
        description: '导出失败！请选择日期',
      });
    }
  };

  return (
    <div className={tableData?.length ? '' : 'notHover'}>
      <ProCardPlus
        title={'收益详情'}
        className="box"
        extra={
          <div>
            <Button
              onClick={() => {
                setExpandedRowKeys([]);
              }}
              icon={<CompressOutlined />}
              style={{ marginRight: 5 }}
            >
              全部收缩
            </Button>
            <Button type="primary" onClick={exportData} icon={<ExportOutlined />}>
              导出
            </Button>
          </div>
        }
      >
        <Table
          className={'MpAnalysis_Table'}
          id={'returns'}
          rowKey={(r: any) => r.domain + '_' + r.mpCode}
          size="small"
          columns={columns}
          dataSource={tableData}
          onChange={pageChange}
          sticky
          scroll={{ x: 'max-content' }}
          // bordered
          expandIconColumnIndex={-1} // 去除表格body里的+号
          expandable={{
            expandedRowRender, // 子表格dom部分
            expandedRowKeys, // 展开的行，控制属性State的变量
          }}
          loading={loading}
          pagination={{
            ...pageInfo,
            defaultPageSize: pageInfo.pageSize,
            showSizeChanger: true,
            showQuickJumper: true,
            pageSizeOptions: ['50', '100', '200', '300'],
            showTotal: (total, range) => `第 ${range[0]} 到 ${range[1]} 条 | 共 ${total} 条`,
          }}
        />
      </ProCardPlus>
    </div>
  );
};

export default memo(GroupTable);
