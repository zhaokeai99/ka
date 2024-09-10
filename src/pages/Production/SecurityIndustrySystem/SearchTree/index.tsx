import React, { useState, useEffect, useCallback, memo } from 'react';
import { Input, message, Tooltip, Tree, Modal } from 'antd';
import ProCard from '@ant-design/pro-card';
import {
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import styles from './index.less';
import TreeModal from '../TreeModal';
import {
  addSecuritiesSortNode,
  delSecuritiesNode,
  queryItemNodeInfo,
  updateSecuritiesSortNode,
} from '../service';

const { DirectoryTree } = Tree;
const { confirm } = Modal;

const SearchTree: React.FC<any> = ({
  id,
  isCustom,
  treeList,
  onSelect = () => {},
  defaultSelectedKeys = '',
  onRefresh = () => {},
}) => {
  const [expandedKeys, setExpandedKeys] = useState<any[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [searchValue, setSearchValue] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState('');
  const [currentNodeId, setCurrentNodeId] = useState('');
  const [editInfo, setEditInfo] = useState({});
  const [dataList] = useState<any[]>([]);

  const renderTreeData: any = useCallback(
    (data: any) => {
      return (
        <div className={styles['node-item-container']}>
          <Tooltip title={data.title}>
            <span className={styles['text-ellipsis']}>{data.title}</span>
          </Tooltip>
          {data.key !== 'unSorted' && isCustom && (
            <span className={styles['node-right-actions']}>
              {data.level < 4 && (
                <PlusOutlined
                  type="add"
                  style={{ marginRight: '10px' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setModalType('ADD');
                    setModalVisible(true);
                    setCurrentNodeId(data.key);
                  }}
                />
              )}
              {data.key !== 'sorted' && (
                <>
                  <EditOutlined
                    type="edit"
                    style={{ marginRight: '10px' }}
                    onClick={async (e) => {
                      e.stopPropagation();
                      setModalType('UPDATE');
                      setModalVisible(true);
                      setCurrentNodeId(data.key);
                      const result = await queryItemNodeInfo({ id, nodeId: data.key });
                      setEditInfo(result);
                    }}
                  />
                  <DeleteOutlined
                    type="edit"
                    onClick={(e) => {
                      e.stopPropagation();
                      confirm({
                        title: '删除后不可恢复，确定删除吗？',
                        onOk: async () => {
                          const result = await delSecuritiesNode({ id, nodeId: data.key });
                          if (result) {
                            message.success('删除成功！');
                            onRefresh();
                          } else {
                            message.error('删除失败！');
                          }
                        },
                      });
                    }}
                  />
                </>
              )}
            </span>
          )}
        </div>
      );
    },
    [treeList],
  );

  const generateList = (data: any) => {
    for (let i = 0; i < data.length; i++) {
      const node = data[i];
      const { key, title } = node;
      dataList.push({ key, title });
      if (node.children) {
        generateList(node.children);
      }
    }
  };

  useEffect(() => {
    generateList(treeList);
  }, [treeList]);

  const getParentKey: any = (key: any, tree: any) => {
    let parentKey;
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      if (node.children) {
        if (node.children.some((item: any) => item.key === key)) {
          parentKey = node.key;
        } else if (getParentKey(key, node.children)) {
          parentKey = getParentKey(key, node.children);
        }
      }
    }
    return parentKey;
  };

  const treeSearch = (e: any) => {
    const { value } = e.target;
    if (!value) {
      setExpandedKeys([]);
      setSearchValue('');
      setAutoExpandParent(false);
      return;
    }
    const keys = dataList
      .map((item: any) => {
        if (item.title.indexOf(value) > -1) {
          return getParentKey(item.key, treeList);
        }
        return null;
      })
      .filter((item: any, i: any, self: any) => item && self.indexOf(item) === i);
    setExpandedKeys(keys);
    setSearchValue(value);
    setAutoExpandParent(true);
  };

  const loop = (data: any) => {
    return data.map((item: any) => {
      const index = item.title.indexOf(searchValue);
      const beforeStr = item.title.substr(0, index);
      const afterStr = item.title.substr(index + searchValue.length);
      const title =
        index > -1 ? (
          <span>
            {beforeStr}
            <span style={{ color: '#f50' }}>{searchValue}</span>
            {afterStr}
          </span>
        ) : (
          <span>{item.title}</span>
        );
      if (item.children) {
        return {
          title,
          key: item.key,
          level: item.level,
          itemTitle: item.title,
          children: loop(item.children),
        };
      }
      return {
        title,
        key: item.key,
        level: item.level,
        itemTitle: item.title,
      };
    });
  };

  const onExpand = (keys: any) => {
    setExpandedKeys(keys);
    setAutoExpandParent(false);
  };

  // TODO 新增修改 后端还有问题 待测试
  const onFinish = async (values: any) => {
    if (modalType === 'ADD') {
      const data = await addSecuritiesSortNode({
        ...values,
        id,
        ...(currentNodeId !== 'sorted' ? { parentNodeId: currentNodeId } : {}),
      });
      if (data) {
        message.success('添加成功！');
        setModalVisible(false);
        onRefresh();
      }
    } else {
      const data = await updateSecuritiesSortNode({
        ...values,
        id,
        nodeId: currentNodeId,
      });
      if (data) {
        message.success('修改成功！');
        setModalVisible(false);
        onRefresh();
      }
    }
  };

  return (
    <ProCard ghost>
      <Input
        style={{ marginBottom: 12 }}
        onChange={treeSearch}
        value={searchValue}
        prefix={<SearchOutlined />}
        allowClear
      />
      <DirectoryTree
        className={styles['tree-style']}
        blockNode
        showIcon={false}
        switcherIcon={<DownOutlined />}
        showLine={{ showLeafIcon: false }}
        treeData={loop(treeList)}
        titleRender={renderTreeData}
        expandedKeys={expandedKeys}
        autoExpandParent={autoExpandParent}
        onExpand={onExpand}
        onSelect={onSelect}
        defaultSelectedKeys={[defaultSelectedKeys]}
        height={620}
      />
      <TreeModal
        id={id}
        showModal={modalVisible}
        type={modalType}
        onClose={() => setModalVisible(false)}
        onFinish={onFinish}
        editInfo={editInfo}
      />
    </ProCard>
  );
};

export default memo(SearchTree);
