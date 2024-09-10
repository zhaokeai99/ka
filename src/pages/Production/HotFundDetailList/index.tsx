import React, { useState, useCallback, useMemo, useEffect } from 'react';
import ProCard from '@ant-design/pro-card';
import { queryHotFundList } from './service';
import { Link } from 'umi';
import SearchForm from './SearchForm';
import { Table } from 'antd';
import FocusOn from './FocusOn';

const sorterMap = {
  fundTypeLevel1: 'ONETYPE',
  setupDate: 'DATE',
  stageStr: 'STAGE',
};

const HotFundDetailList: React.FC = () => {
  const initialParams = {
    fundName: '',
    approvalBeginDate: '',
    approvalEndDate: '',
    assetManager: '',
    collectBeginDate: '',
    collectEndDate: '',
    fundManager: '',
    openBeginDate: '',
    openEndDate: '',
    productManager: '',
    productType: '',
    productTypeOne: '',
    treeId: '',
    productStage: '',
    follows: false,
  };
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [formValues, setFormValues] = useState(initialParams);
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortInfo, setSortInfo] = useState<any>({});

  const queryListInfo = useCallback(async (params: any) => {
    setLoading(true);
    const data = await queryHotFundList({
      pageNo: params.current,
      pageSize: params.pageSize,
      ...params,
    });
    setLoading(false);
    setPagination({ current: data.pageNum, pageSize: data.pageSize, total: data.total });
    setDataSource(data.data);
  }, []);

  useEffect(() => {
    queryListInfo({ current: 1, pageSize: 10, ...initialParams });
  }, []);

  const column: any[] = useMemo(
    () => [
      {
        title: '产品名称',
        dataIndex: 'fundName',
        key: 'fundName',
        fixed: 'left',
        render: (_: any, v: any) => <Link to={`/production/index/detail/${v.fundId}`}>{_}</Link>,
      },
      {
        title: '产品代码',
        dataIndex: 'fundCode',
        key: 'fundCode',
      },
      {
        title: '成立日期',
        dataIndex: 'setupDate',
        key: 'setupDate',
        sorter: true,
        sortOrder: sortInfo?.columnKey === 'setupDate' && sortInfo?.order,
      },
      {
        title: '产品状态',
        dataIndex: 'stageStr',
        key: 'stageStr',
        sorter: true,
        sortOrder: sortInfo?.columnKey === 'stageStr' && sortInfo?.order,
      },
      {
        title: '产品经理',
        dataIndex: 'productManager',
        key: 'productManager',
      },
      {
        title: '一级分类',
        dataIndex: 'fundTypeLevel1',
        key: 'fundTypeLevel1',
        sorter: true,
        sortOrder: sortInfo?.columnKey === 'fundTypeLevel1' && sortInfo?.order,
      },
      {
        title: '基金经理',
        dataIndex: 'fundManager',
        key: 'fundManager',
      },
      {
        title: '公司业务线',
        dataIndex: 'companyBusinessLine',
        key: 'companyBusinessLine',
      },
      {
        title: '加入关注',
        dataIndex: 'focusStatus',
        key: 'focusStatus',
        align: 'center',
        render: (_: any, v: any) => (
          <FocusOn
            fundId={v.fundId}
            isFocus={v.focusStatus}
            onRefresh={() => {
              queryListInfo({
                current: pagination.current,
                pageSize: pagination.pageSize,
                ...formValues,
              });
            }}
          />
        ),
      },
    ],
    [pagination, formValues, sortInfo],
  );

  const handleOnChange = useCallback(
    (pageInfo, _, sorter) => {
      setSortInfo(sorter);
      queryListInfo({
        ...pageInfo,
        ...formValues,
        ...(sorter && sorter.order
          ? {
              sortType: sorter.order === 'ascend' ? 'ASC' : 'DESC',
              orderSort: sorterMap[sorter.columnKey],
            }
          : {}),
      });
    },
    [formValues],
  );

  return (
    <ProCard ghost style={{ padding: '12px' }}>
      <SearchForm
        onFinish={(values: any) => {
          setFormValues(values);
          queryListInfo({ ...values, current: 1, pageSize: 10 });
        }}
        onReset={() => {
          setSortInfo({});
          setFormValues(initialParams);
          queryListInfo({ current: 1, pageSize: 10, ...initialParams });
        }}
      />
      <Table
        rowKey="fundId"
        size="small"
        columns={column}
        dataSource={dataSource}
        style={{ backgroundColor: '#fff', padding: 12 }}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showTotal: (totalNum: any) => `共 ${totalNum} 条数据`,
        }}
        scroll={{ x: 'max-content' }}
        onChange={handleOnChange}
        loading={loading}
      />
    </ProCard>
  );
};

export default HotFundDetailList;
