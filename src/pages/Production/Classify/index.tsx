import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Drawer, Transfer, Button, Space, Input, Divider, message, Modal, Select } from 'antd';
import ProCard from '@ant-design/pro-card';
import { CloseCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import NodeTree from './NodeTree';
import Filter from './Filter';
import {
  queryTreeStructure,
  queryTreeFundInfos,
  saveFundInfoAndTreeLabels,
  queryTreeStructureLabels,
  deleteTreeFundLabel,
  queryUserGroupRoles,
} from './service';

const { confirm } = Modal;
const { Option } = Select;

const Classify: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [editDisable, setEditDisable] = useState(true);
  const [showFilter, setShowFilter] = useState(false);
  const [totalFunds, setTotalFunds] = useState<any>([]);
  const [targetKeys, setTargetKeys] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState<any>([]);
  const [nodeData, setNodeData] = useState([]);
  const [roleData, setRoleData] = useState([]);
  const [tagData, setTagData] = useState([]);
  const [classifyName, setClassifyName] = useState('');
  const [showWarn, setShowWarn] = useState(false);
  const [selectedNode, setSelectedNode] = useState<any>({
    id: '',
    parentId: '',
    title: '',
  });
  const [role, setRole] = useState(null);

  const fetchFundInfo = useCallback(async (nodeId?: any, parentNodeId?: any) => {
    const result = await queryTreeFundInfos({
      ...(nodeId && { nodeId }),
      ...(parentNodeId && { parentNodeId }),
    });
    setTotalFunds(result);
    setTargetKeys(result.filter((fund: any) => fund.target).map(({ key }: any) => key));
  }, []);

  const onChange = (nextTargetKeys: any) => {
    setTargetKeys(nextTargetKeys);
  };

  const onSelectChange = (sourceSelectedKeys: any, targetSelectedKeys: any) => {
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
  };

  const onSave = useCallback(async () => {
    const { id, parentId } = selectedNode || {};

    if (!classifyName) {
      message.warning('类型名称必填！');
      setShowWarn(true);
      return;
    } else {
      setShowWarn(false);
    }

    const isSuccess = await saveFundInfoAndTreeLabels({
      nodeId: id,
      parentNodeId: parentId,
      title: classifyName,
      fundIds: targetKeys.join(','),
      roleName: role,
    });

    if (isSuccess) {
      setVisible(false);
      const result = await queryTreeStructure();
      setNodeData(result);
    }
  }, [selectedNode, classifyName, targetKeys, role]);

  const clearDrawerData = () => {
    setSelectedKeys([]);
    setClassifyName('');
    setTargetKeys([]);
  };

  // 点击添加节点
  const onClickAddNode = useCallback(
    (graph, model) => {
      clearDrawerData();
      setSelectedNode({
        id: '',
        parentId: model?.id,
        title: `为"${model?.title}"添加子类型`,
      });
      setEditDisable(false);
      setVisible(true);
      fetchFundInfo(null, model?.id);
    },
    [fetchFundInfo],
  );

  // 删除节点
  const onClickRemove = useCallback((graph, model) => {
    confirm({
      title: `您确认删除${model?.title}类型么？`,
      icon: <ExclamationCircleOutlined />,
      content: '您是否清楚删除造成的影响可控？操作请慎重！',
      okText: '确定删除',
      okType: 'danger',
      cancelText: '放弃',
      onOk: async () => {
        await deleteTreeFundLabel({
          treeId: model.id,
        });
        const result = await queryTreeStructure();
        setNodeData(result);
      },
    });
  }, []);

  // 点击节点
  const onClickNode = useCallback(
    (graph, model) => {
      clearDrawerData();
      setSelectedNode({
        id: model?.id,
        parentId: '',
        title: `${model.editType === 4 ? '查看' : '编辑'}"${model?.title}"类型`,
      });
      setEditDisable(model.editType === 4);
      setClassifyName(model.title);
      setVisible(true);
      fetchFundInfo(model?.id, model?.parentId);
    },
    [fetchFundInfo],
  );

  const onFilterSearch = useCallback(
    (params) => {
      const { categories = [] } = params || {};
      const filterSelectedKeys = new Set();
      totalFunds.forEach((fund: any) => {
        const {
          productCompany,
          productType,
          productTypeOne,
          productTypeTwo,
          // labels = [],
        } = fund || {};
        const fundCategories = [
          '产品树',
          productCompany,
          productType,
          productTypeOne,
          productTypeTwo,
        ];

        // 这里如果不选，是否全部
        if (categories.length === 0) filterSelectedKeys.add(fund);

        categories.forEach((categorie: any) => {
          const categorieArray = categorie.split('-');

          let flag = true;
          categorieArray.some((categorieItem: any, index: number) => {
            if (categorieItem !== fundCategories[index]) {
              flag = false;
              return true;
            }

            return false;
          });

          if (flag) {
            filterSelectedKeys.add(fund);
          }
        });
      });

      // 过滤大类后的过滤
      filterSelectedKeys.forEach((node: any) => {
        const { labels = [] } = node || {};

        labels.some(({ labelCode, isSelect }: any) => {
          if (
            params[labelCode] !== isSelect &&
            isSelect !== 2 &&
            typeof params[labelCode] !== 'undefined'
          ) {
            filterSelectedKeys.delete(node);
            return true;
          }
          return false;
        });
      });

      setSelectedKeys([...filterSelectedKeys].map((node: any) => node.key));
    },
    [totalFunds],
  );

  const treeDataOrigin = useMemo(() => {
    if (Array.isArray(nodeData) && nodeData.length > 0) {
      const { children = [] } = nodeData[0] || {};
      return children.filter((n: any) => n.editType === 0);
    }
    return [];
  }, [nodeData]);

  // 初始化
  useEffect(() => {
    (async () => {
      const result = await queryTreeStructure();
      setNodeData(result);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const result = await queryTreeStructureLabels();
      setTagData(result);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const { data = [] } = await queryUserGroupRoles({
        nodeId: selectedNode.parentId || selectedNode.id,
      });

      setRoleData(data || []);
      if (data.length > 0) {
        setRole(data[0]['sn']);
      }
    })();
  }, [selectedNode]);

  return (
    <ProCard style={{ padding: '12px 12px' }} direction="column" ghost gutter={[0, 8]}>
      <NodeTree
        data={nodeData[0]}
        onClickAdd={onClickAddNode}
        onClickRemove={onClickRemove}
        onClickNode={onClickNode}
      />
      <Drawer
        title={selectedNode.title}
        placement="right"
        width="50%"
        closable={false}
        onClose={() => setVisible(false)}
        visible={visible}
        footer={
          <Space style={{ float: 'right' }}>
            <Button onClick={() => setVisible(false)}>关闭</Button>
            <Button type="primary" onClick={onSave} disabled={editDisable}>
              保存
            </Button>
          </Space>
        }
      >
        <Space>
          <label>类型名称：</label>
          <Input
            suffix={showWarn ? <CloseCircleOutlined /> : null}
            placeholder="请输入类型名称"
            value={classifyName}
            disabled={!!selectedNode.id}
            onChange={(e) => {
              setClassifyName(e.target.value);
            }}
          />
          {roleData.length > 0 ? (
            <>
              <label style={{ marginLeft: '20px' }}>用户角色：</label>
              <Select
                disabled={!!selectedNode.id}
                value={role || roleData[0]['sn']}
                onChange={(v) => {
                  setRole(v);
                }}
              >
                {roleData.map((d: any) => (
                  <Option value={d.sn}>{d.name}</Option>
                ))}
              </Select>
            </>
          ) : null}
          <Button onClick={() => setShowFilter(true)} type="primary" disabled={editDisable}>
            筛选基金
          </Button>
        </Space>
        <Divider />
        <Transfer
          dataSource={totalFunds}
          showSearch
          titles={['目标池', '结果集']}
          targetKeys={targetKeys}
          selectedKeys={selectedKeys}
          onChange={onChange}
          onSelectChange={onSelectChange}
          listStyle={{
            width: '50%',
            height: 'calc(100vh - 240px)',
          }}
          render={(item: any) => `${item.fundCode} - ${item.fundName}`}
          pagination={{
            pageSize: 20,
          }}
        />
        <Filter
          visible={showFilter}
          onFilterSearch={onFilterSearch}
          treeDataOrigin={treeDataOrigin}
          tagData={tagData}
          onClose={() => setShowFilter(false)}
          roleData={roleData}
        />
      </Drawer>
    </ProCard>
  );
};

export default Classify;
