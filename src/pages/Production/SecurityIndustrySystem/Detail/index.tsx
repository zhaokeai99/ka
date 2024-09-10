import React, { useState, useMemo, useCallback, useEffect, useRef, useContext } from 'react';
import { Button, message, Space, Tooltip, Modal } from 'antd';
import ProCard from '@ant-design/pro-card';
import ProCardPlus from '@/components/ProCardPlus';
import ProTable from '@ant-design/pro-table';
import SearchTree from '../SearchTree';
import { cardGutter, contentPadding } from '@/themes';
import TransferModal from '../TransferModal';
import {
  queryIndustryList,
  querySecuritiesSortList,
  querySysNodeList,
  saveSecuritiesAlgo,
  deleteSecuritiesItem,
  triggerSortBySysId,
  getSecuritiesAlgoConfig,
  moveIntoTargetNode,
  moveIntoCurrentNode,
  adjustSecuritiesSort,
} from '../service';
import { useInterval, TabLayoutContext } from '@/components/thfund-front-component/src';

const { confirm } = Modal;

const ConfigurationDetail: React.FC<{ match: any }> = (props) => {
  const { id, name, isCustom } = props.match.params;
  const { key: tabKey, setTabTitle } = useContext(TabLayoutContext);
  const initTreeData = useMemo(
    () => [
      {
        title: '未分行业证券',
        key: 'unSorted',
        level: 0,
      },
      {
        title: name,
        key: 'sorted',
        onlyShowAdd: true,
        level: 0,
        children: [],
      },
    ],
    [name],
  );
  const tableRef = useRef<any>();
  const [treeData, setTreeData] = useState(initTreeData);
  const [sortType, setSortType] = useState('UNSORTED');
  const [nodeId, setNodeId] = useState('');
  const [nodeTitle, setNodeTitle] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalType, setModalType] = useState('');
  const [haveData, setHaveData] = useState(false);
  const [loading, setLoading] = useState(false);
  const [algoName, setAlgoName] = useState('');
  const [adjId, setAdjId] = useState(''); // 保存行业调整列表id
  const [startInterval, stopInterval] = useInterval();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const handleTree = (tree: any, level = 1) => {
    if (!tree && !tree.length) return;
    return tree.map((node: any) => {
      node.level = level;
      if (node.children) {
        return {
          ...node,
          level,
          children: handleTree(node.children, level + 1),
        };
      }
      return { ...node, level };
    });
  };

  // 查询当前体系的算法
  const queryAlgoName = useCallback(async () => {
    const result = await getSecuritiesAlgoConfig({ id });
    setAlgoName(result?.value || '');
  }, [id]);

  const getTreeData = useCallback(async () => {
    const result = await querySysNodeList({ id });
    const newData = handleTree(result);
    setTreeData((origin) => {
      return origin.map((node: any) => {
        if (node.key === 'sorted') {
          return {
            ...node,
            children: newData,
          };
        }
        return node;
      });
    });
  }, [id]);

  // 查询分类状态
  const checkPerformStatus = useCallback(
    async (checkTriggerSortStatus = true) => {
      setLoading(true);
      const { data } = await triggerSortBySysId({ id, checkTriggerSortStatus });
      // checkTriggerSortStatus 且 data 不为 1 时, 结束轮询
      if (checkTriggerSortStatus && data !== 1) {
        tableRef?.current?.reloadAndRest();
        setLoading(false);
        stopInterval(() => {
          checkPerformStatus();
        });
      }
    },
    [id],
  );

  useEffect(() => {
    setTabTitle(tabKey, `${name}`);
    getTreeData();
    queryAlgoName();
    return () => {
      stopInterval(() => {
        checkPerformStatus();
      });
    };
  }, []);

  // 行业证券信息-删除
  const deleteSecItem = useCallback(async (item: any) => {
    const result = await deleteSecuritiesItem({ resultIds: [item.id] });
    if (result) {
      message.success('删除成功');
      tableRef?.current?.reloadAndRest();
    }
  }, []);

  const showDelConfirm = useCallback(
    (item: any) => {
      confirm({
        title: '删除后不可恢复，确定删除吗？',
        onOk: () => {
          deleteSecItem(item);
        },
      });
    },
    [deleteSecItem],
  );

  const btnClickCheck = useCallback((type: any) => {
    switch (type) {
      case 'CALL_IN_INDUSTRY':
        setModalTitle('调入行业');
        break;
      case 'ALGORITHM':
        setModalTitle('证券自动化分类参数');
        break;
      case 'SECURITIES':
        setModalTitle('调入证券');
        break;
      case 'INDUSTRY_ADJUSTMENT':
        setModalTitle('行业调整');
        break;
      // 未分类列表-行业调整
      case 'CALL_IN_INDUSTRY_UNSORTED':
        setModalTitle('调入行业');
        break;
      // 分类列表-行业调整
      case 'INDUSTRY_ADJUSTMENT_SORTED':
        setModalTitle('行业调整');
        break;
    }
    setModalType(type);
    setModalVisible(true);
  }, []);

  const column: any = useMemo(
    () => [
      {
        title: '证券代码',
        key: 'securitiesCode',
        dataIndex: 'securitiesCode',
      },
      {
        title: '证券名称',
        key: 'securitiesName',
        dataIndex: 'securitiesName',
        // width: 400,
        render: (text: string) => (
          <Tooltip title={text}>
            <span className="text-ellipsis" style={{ width: '99%' }}>
              {text}
            </span>
          </Tooltip>
        ),
      },
      {
        title: '证券类别',
        key: 'typeName',
        dataIndex: 'typeName',
      },
      {
        title: '行业名称',
        key: 'securitiesSortName',
        dataIndex: 'securitiesSortName',
        hideInTable: sortType === 'UNSORTED',
      },
      {
        title: '操作',
        key: 'action',
        hideInTable: !JSON.parse(isCustom),
        render: (_: any, item: any) => (
          <Space>
            {sortType === 'SORTED' ? <a onClick={() => showDelConfirm(item)}>删除</a> : null}
            <a
              onClick={() => {
                if (sortType === 'UNSORTED') {
                  // 未分类-调入行业
                  btnClickCheck('CALL_IN_INDUSTRY_UNSORTED');
                } else {
                  // 分类-行业调整
                  btnClickCheck('INDUSTRY_ADJUSTMENT_SORTED');
                }
                setAdjId(item.id);
              }}
            >
              行业调整
            </a>
          </Space>
        ),
      },
    ],
    [sortType],
  );

  const onSelect = useCallback((selectedKeys: any, nodeInfo: any) => {
    const { node } = nodeInfo;
    setPagination({ current: 1, pageSize: 10 });
    // 判断是否分类
    if (selectedKeys.length && selectedKeys[0] === 'unSorted') {
      setSortType('UNSORTED');
      setNodeId('');
    } else {
      // 判断分类下的节点
      setSortType('SORTED');
      if (selectedKeys[0] !== 'sorted') {
        setNodeId(selectedKeys[0]);
        setNodeTitle(node.itemTitle);
      } else {
        setNodeId('');
      }
    }
  }, []);

  // 列表数据
  const requestTableList = useCallback(
    async (params) => {
      const queryFun = params.nodeId ? queryIndustryList : querySecuritiesSortList;
      const result = await queryFun({
        id,
        pageNo: params.current,
        pageSize: params.pageSize,
        ...(params.nodeId ? { nodeId: params.nodeId } : { sortType: params.sortType }),
      });
      setHaveData(result.data.length !== 0);
      if (result.success) {
        setPagination({
          current: result.pageNum,
          pageSize: result.pageSize,
        });
      }
      return result;
    },
    [id],
  );

  const renderOptionsBtn = useCallback(() => {
    if (JSON.parse(isCustom)) {
      return sortType === 'SORTED' ? (
        <>
          {nodeId ? (
            <Button
              size="small"
              type="primary"
              style={{ marginRight: '12px' }}
              onClick={() => btnClickCheck('SECURITIES')}
            >
              调入证券
            </Button>
          ) : null}
          <Button
            size="small"
            type="primary"
            onClick={() => btnClickCheck('INDUSTRY_ADJUSTMENT')}
            disabled={selectedRowKeys.length === 0}
          >
            批量行业调整
          </Button>
        </>
      ) : (
        <>
          <Button
            size="small"
            type="primary"
            style={{ marginRight: '12px' }}
            onClick={() => btnClickCheck('CALL_IN_INDUSTRY')}
            disabled={selectedRowKeys.length === 0}
          >
            调入行业
          </Button>
          <Button
            size="small"
            type="primary"
            style={{ marginRight: '12px' }}
            onClick={() => btnClickCheck('ALGORITHM')}
            // disabled={!haveData}
          >
            证券自动化分类参数
          </Button>
          {algoName && (
            <Tooltip title={algoName}>
              <span
                style={{
                  marginRight: '12px',
                  width: '200px',
                  display: 'inline-block',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                }}
              >
                {algoName}
              </span>
            </Tooltip>
          )}
          <Button
            size="small"
            type="primary"
            onClick={() => {
              checkPerformStatus(false);
              startInterval(() => {
                checkPerformStatus();
              }, 10 * 1000);
            }}
            // disabled={!algoName || !haveData}
            loading={loading}
          >
            导入并执行
          </Button>
        </>
      );
    }
  }, [sortType, haveData, selectedRowKeys, nodeId, algoName, loading]);

  // 弹窗成功处理
  const handleSuccess = useCallback(() => {
    message.success('保存成功！');
    setModalVisible(false);
    tableRef?.current?.reloadAndRest();
  }, []);

  // 未分类-行业调整/调入行业
  const moveTargetNode = useCallback(async (values) => {
    const result = await moveIntoTargetNode(values);
    if (result) {
      handleSuccess();
    }
  }, []);

  // 行业证券信息-批量行业调整/行业调整
  const adjustIndustry = useCallback(async (values: any) => {
    const result = await adjustSecuritiesSort(values);
    if (result) {
      handleSuccess();
    }
  }, []);

  // 行业证券信息-调入证券
  const moveCurrentNode = useCallback(async (values) => {
    const result = await moveIntoCurrentNode(values);
    if (result) {
      handleSuccess();
    }
  }, []);

  const onSubmit = useCallback(
    async (values: any, type: any) => {
      switch (type) {
        // 未分类-批量调入行业
        case 'CALL_IN_INDUSTRY':
          moveTargetNode({ resultIds: selectedRowKeys, nodeId: values.nodeId });
          break;
        // 算法
        case 'ALGORITHM':
          const result = await saveSecuritiesAlgo({ id, ...values });
          if (result) {
            message.success('保存成功！');
            setModalVisible(false);
            queryAlgoName();
          }
          break;
        // 调入行业
        case 'SECURITIES':
          moveCurrentNode({ resultIds: values.resultIds, nodeId: nodeId });
          break;
        // 分类-批量行业调整
        case 'INDUSTRY_ADJUSTMENT':
          adjustIndustry({ resultIds: selectedRowKeys, nodeId: values.nodeId });
          break;
        // 未分类列表-行业调整
        case 'CALL_IN_INDUSTRY_UNSORTED':
          moveTargetNode({ resultIds: [adjId], nodeId: values.nodeId });
          break;
        // 分类列表-行业调整
        case 'INDUSTRY_ADJUSTMENT_SORTED':
          adjustIndustry({ resultIds: [adjId], nodeId: values.nodeId });
          break;
      }
    },
    [id, adjId, selectedRowKeys, nodeId],
  );

  return (
    <ProCard
      style={{ padding: contentPadding, height: 740 }}
      ghost
      gutter={[cardGutter, 0]}
      size="small"
    >
      <ProCard colSpan="27%" style={{ height: '100%' }} bordered size="small">
        <SearchTree
          id={id}
          isCustom={JSON.parse(isCustom)}
          treeList={treeData}
          onSelect={onSelect}
          defaultSelectedKeys={treeData[0].key}
          onRefresh={getTreeData}
        />
      </ProCard>
      <ProCardPlus
        title={sortType === 'SORTED' ? '行业证券信息' : '未分行业证券'}
        colSpan="73%"
        style={{ height: '100%' }}
        bordered
        size="small"
        isTable={true}
      >
        <ProTable
          actionRef={tableRef}
          style={{ height: '100%' }}
          columns={column}
          search={false}
          options={{ density: false }}
          rowKey="id"
          params={{ sortType, nodeId }}
          request={requestTableList}
          rowSelection={{
            selectedRowKeys,
            preserveSelectedRowKeys: true,
            onChange: (values) => setSelectedRowKeys(values),
          }}
          toolbar={{
            search: renderOptionsBtn(),
          }}
          scroll={{ y: 480 }}
          tableAlertRender={false}
          pagination={pagination}
        />
        <TransferModal
          id={id}
          showModal={modalVisible}
          title={modalTitle}
          type={modalType}
          onClose={() => setModalVisible(false)}
          onFinish={onSubmit}
          originIndustry={nodeTitle}
        />
      </ProCardPlus>
    </ProCard>
  );
};

export default ConfigurationDetail;
