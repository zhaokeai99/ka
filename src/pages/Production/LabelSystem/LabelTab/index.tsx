import React, { useRef, useState } from 'react';
import ProCard from '@ant-design/pro-card';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { Button, message, Space } from 'antd';
import { Link } from 'umi';
import {
  allTransInProducts,
  batchAllMarkBlackList,
  batchMarkBlackList,
  batchTransInProducts,
  batchTransOutProducts,
  LabelPoolIndex,
  NotContainIndex,
  queryFundMarkNotContainProductData,
  queryFundMarkProductData,
} from '../service';
import styles from './index.less';

type PropsType = {
  params: {
    markId: number;
    markType: string;
  };
  actionEdit: boolean;
};

const LabelTab = (props: PropsType) => {
  const { params, actionEdit } = props;
  const tableRef = useRef<any>();
  const [pagination] = useState({
    current: 1,
    pageSize: 10,
  });
  const [activeKey, setActiveKey] = useState('label');
  const [searchValue, setSearchValue] = useState('');
  const [keyword, setKeyword] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [orderByParam, setOrderByParam] = useState({});
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleSelectedOpt = (data: any) => {
    if (Array.isArray(data) && data.length > 0) {
      return data.map((i: any) => ({ code: i.code, name: i.name }));
    }
    return [];
  };

  // 排序
  const handleTableChange = (__: any, _: any, sorter: any) => {
    const { column, order } = sorter || {};
    const { key } = column || {};
    const orderBy = order
      ? {
          orderType: key,
          orderSorter: order === 'descend' ? 'DESC' : 'ASC',
        }
      : null;
    setOrderByParam({ ...orderBy });
  };

  // 调出/批量调出
  const batchTransOut = async (val: any) => {
    setLoading(true);
    const transInProducts = handleSelectedOpt(val);
    const { success } = await batchTransOutProducts({ ...params, transInProducts });
    setLoading(false);

    if (success) {
      message.success('调出成功！');
      tableRef.current.reload();
      setSelectedOptions([]);
      setSelectedRowKeys([]);
    }
  };

  // 调入/批量调入
  const batchTransIn = async (val: any) => {
    setLoading(true);
    const transInProducts = handleSelectedOpt(val);
    const { success } = await batchTransInProducts({ ...params, transInProducts });
    setLoading(false);

    if (success) {
      message.success('调入成功！');
      tableRef.current.reload();
      setSelectedOptions([]);
      setSelectedRowKeys([]);
    }
  };

  // 拉黑
  const batchToBlackList = async (val: any) => {
    // 后端接口支持多个、现阶段仅可单独拉黑
    setLoading(true);
    const ids = val?.map((i: any) => i.id) || [];
    const { success } = await batchMarkBlackList({ ...params, ids });
    setLoading(false);

    if (success) {
      message.success('标签对象已拉黑！');
      tableRef.current.reload();
      setSelectedOptions([]);
      setSelectedRowKeys([]);
    }
  };

  // 全部调入
  const allIn = async () => {
    setLoading(true);
    const { success } = await allTransInProducts({ ...params });
    setLoading(false);

    if (success) {
      message.success('全部调入成功！');
      tableRef.current.reload();
    }
  };

  // 全部删除
  const deleteAll = async () => {
    // isBlack： 0：是，1：否；担心标签对象池因为某些原因全部删除，所以增加此参数，由前端写死传入
    setLoading(true);
    const res = await batchAllMarkBlackList({ markId: params.markId, isBlack: 0 });
    setLoading(false);

    if (res?.success) {
      message.success('全部删除成功！');
      tableRef.current.reload();
    }
  };

  // 跳转判断
  const checkJump = (_: any, v: any) => {
    let path = '';
    switch (params.markType) {
      case 'FUND':
        path = '/production/index/newDetail';
        break;
      case 'MANAGER':
        path = '/production/fundManager';
        break;
      case 'COMPANY':
        path = '/production/fundCompany';
        break;
    }
    return v?.code ? <Link to={`${path}/${v.code}`}>{_}</Link> : <span>{_}</span>;
  };

  const columnsMap: Record<string, ProColumns<LabelPoolIndex | NotContainIndex>[]> = {
    label: [
      {
        title: '对象代码',
        dataIndex: 'code',
        key: 'code',
        sorter: true,
        render: checkJump,
      },
      {
        title: '对象名称',
        dataIndex: 'name',
        key: 'name',
        sorter: true,
        render: checkJump,
      },
      {
        title: '调入时间',
        dataIndex: 'foldTime',
        sorter: true,
        key: 'create_time',
      },
      {
        title: '调入人',
        dataIndex: 'foldUser',
        sorter: true,
        key: 'fold_user',
      },
      {
        title: '操作',
        render: (_, record) => (
          <Space>
            <Button
              type="link"
              style={{ padding: '0' }}
              disabled={!actionEdit}
              onClick={() => batchTransOut([record])}
            >
              调出
            </Button>
            <Button
              type="link"
              style={{ padding: '0' }}
              disabled={!actionEdit}
              onClick={() => batchToBlackList([record])}
            >
              拉黑
            </Button>
          </Space>
        ),
      },
    ],
    notContain: [
      {
        title: '对象代码',
        dataIndex: 'code',
        key: 'code',
        render: checkJump,
      },
      {
        title: '对象名称',
        dataIndex: 'name',
        key: 'name',
        render: checkJump,
      },
      {
        title: '操作',
        render: (_, record) => (
          <Button
            type="link"
            style={{ padding: '0' }}
            disabled={!actionEdit}
            onClick={() => batchTransIn([record])}
          >
            调入
          </Button>
        ),
      },
    ],
    blackList: [
      {
        title: '对象代码',
        dataIndex: 'code',
        key: 'code',
        sorter: true,
        render: checkJump,
      },
      {
        title: '对象名称',
        dataIndex: 'name',
        key: 'name',
        sorter: true,
        render: checkJump,
      },
      {
        title: '拉黑时间',
        dataIndex: 'foldTime',
        key: 'create_time',
        sorter: true,
      },
      {
        title: '拉黑人',
        dataIndex: 'foldUser',
        key: 'foldUser',
        sorter: true,
      },
      {
        title: '操作',
        render: (_, record) => (
          <Button
            type="link"
            style={{ padding: '0' }}
            disabled={!actionEdit}
            onClick={() => batchTransOut([record])}
          >
            删除
          </Button>
        ),
      },
    ],
  };

  // 查询列表数据
  const queryTableList = async (p: any) => {
    let result: any = {};

    switch (activeKey) {
      case 'label':
      case 'blackList':
        result = await queryFundMarkProductData({
          ...p,
          pageNo: p.current,
          pageSize: p.pageSize,
          isBlack: activeKey === 'label' ? 1 : 0, // 黑名单：0；标签对象：1
        });
        break;
      case 'notContain':
        result = await queryFundMarkNotContainProductData({
          ...p,
          pageNo: p.current,
          pageSize: p.pageSize,
        });
        break;
    }
    setTotal(result?.total || 0);

    return result;
  };

  const renderActions = () => {
    switch (activeKey) {
      case 'label':
        return [
          <Button
            disabled={!actionEdit || selectedRowKeys?.length <= 0}
            type="primary"
            size="small"
            onClick={() => batchTransOut(selectedOptions)} // 批量调出
            loading={loading}
          >
            批量调出
          </Button>,
          <Button
            disabled={!actionEdit || selectedRowKeys?.length <= 0}
            type="primary"
            size="small"
            onClick={() => batchToBlackList(selectedOptions)} // 批量拉黑
            loading={loading}
          >
            批量拉黑
          </Button>,
        ];
      case 'notContain':
        return [
          <Button
            disabled={!actionEdit || selectedRowKeys?.length <= 0}
            type="primary"
            size="small"
            onClick={() => batchTransIn(selectedOptions)} // 批量调入
            loading={loading}
          >
            批量调入
          </Button>,
          <Button
            disabled={!actionEdit || total <= 0}
            type="primary"
            size="small"
            onClick={allIn}
            loading={loading}
          >
            全部调入
          </Button>,
        ];
      case 'blackList':
        return [
          <Button
            disabled={!actionEdit || selectedRowKeys?.length <= 0}
            type="primary"
            size="small"
            onClick={() => batchTransOut(selectedOptions)} // 批量调入
            loading={loading}
          >
            批量删除
          </Button>,
          <Button
            disabled={!actionEdit || total <= 0}
            type="primary"
            size="small"
            onClick={deleteAll}
            loading={loading}
          >
            全部删除
          </Button>,
        ];
    }
    return [];
  };

  return (
    <ProCard ghost title="手工打标" style={{ background: '#fff' }}>
      <ProTable
        columns={columnsMap[activeKey]}
        className={styles['tab-style']}
        style={{ height: '100%' }}
        actionRef={tableRef}
        params={{ ...params, activeKey, keyword, ...orderByParam }}
        request={queryTableList}
        pagination={pagination}
        rowSelection={
          actionEdit
            ? {
                selectedRowKeys,
                preserveSelectedRowKeys: true,
                onChange: (values: any, options: any) => {
                  setSelectedRowKeys(values);
                  setSelectedOptions(options);
                },
              }
            : false
        }
        toolbar={{
          multipleLine: true,
          menu: {
            type: 'tab',
            activeKey: activeKey,
            items: [
              { key: 'label', label: '标签对象池' },
              { key: 'notContain', label: '未包含对象' },
              { key: 'blackList', label: '黑名单对象' },
            ],
            onChange: (key: any) => {
              setKeyword('');
              setSearchValue('');
              setSelectedOptions([]);
              setSelectedRowKeys([]);
              setActiveKey(key);
            },
          },
          search: {
            placeholder: '代码名称模糊搜索',
            size: 'small',
            value: searchValue,
            onChange: (val: any) => setSearchValue(val.target.value),
            onSearch: (value: string) => setKeyword(value),
          },
          actions: renderActions(),
        }}
        rowKey="code"
        search={false}
        options={false}
        onChange={handleTableChange}
        size="small"
      />
    </ProCard>
  );
};

LabelTab.isProCard = true;

export default LabelTab;
