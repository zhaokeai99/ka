import ProCardPlus from '@/components/ProCardPlus';
import {
  CopyOutlined,
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import type { ProFormInstance } from '@ant-design/pro-form';
import { ModalForm, ProFormText } from '@ant-design/pro-form';
import { Input, message, Modal, Tooltip, Tree } from 'antd';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import LabelModal from '../LabelModal/LabelModal';
import { deleteFundMarkData, queryFundMarkData, queryMarkEcho, saveFundMarkData } from '../service';
import styles from './index.less';

type PropsType = {
  colSpan: number | string;
  onSelect: (val: any) => void;
};

const { DirectoryTree } = Tree;
const { confirm } = Modal;
// const unCheckedId = [1, 2, 3];

const SearchTree = (props: PropsType) => {
  const { colSpan, onSelect } = props;
  const formRef = useRef<ProFormInstance>();
  const [expandedKeys, setExpandedKeys] = useState<any[]>([]);
  const [treeList, setTreeList] = useState<any[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [searchValue, setSearchValue] = useState('');
  const [visible, setVisible] = useState(false);
  const [copyVisible, setCopyVisible] = useState(false);
  const [modalType, setModalType] = useState('ADD');
  const [dataList] = useState<any[]>([]);
  const [editInfo, setEditInfo] = useState({});
  const [copyKey, setCopyKey] = useState(0);

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

  // 基金标签列表树
  const queryTreeList = async (params?: any) => {
    const data = await queryFundMarkData();
    const newData = handleTree(data);
    setTreeList(newData || []);
    if (data?.length > 0) {
      const mId = params?.markId || data[0]?.id;
      const mType = params?.markType || data[0]?.markType;
      onSelect({ markId: mId, markType: mType });
    }
  };

  useEffect(() => {
    queryTreeList();
  }, []);

  const generateList = (data: any) => {
    for (let i = 0; i < data.length; i++) {
      const node = data[i];
      const { id, titleName } = node;
      dataList.push({ id, titleName });
      if (node.children) {
        generateList(node.children);
      }
    }
  };

  useEffect(() => {
    generateList(treeList);
  }, [treeList]);

  // 查询父节点 Key
  const getParentKey: any = (id: any, tree: any) => {
    let parentKey;
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      if (node.children) {
        if (node.children.some((item: any) => item.id === id)) {
          parentKey = node.id;
        } else if (getParentKey(id, node.children)) {
          parentKey = getParentKey(id, node.children);
        }
      }
    }
    return parentKey;
  };

  // 搜索
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
        if (item.titleName.indexOf(value) > -1) {
          return getParentKey(item.id, treeList);
        }
        return null;
      })
      .filter((item: any, i: any, self: any) => item && self.indexOf(item) === i);
    setExpandedKeys(keys);
    setSearchValue(value);
    setAutoExpandParent(true);
  };

  const loop = (data: any) => {
    return data?.map((item: any) => {
      const index = item?.titleName.indexOf(searchValue);
      const beforeStr = item?.titleName.substr(0, index);
      const afterStr = item?.titleName.substr(index + searchValue.length);
      const title =
        index > -1 ? (
          <span>
            {beforeStr}
            <span style={{ color: '#f50' }}>{searchValue}</span>
            {afterStr}
          </span>
        ) : (
          <span>{item.titleName}</span>
        );
      if (item.children) {
        return {
          ...item,
          title,
          // selectable: !unCheckedId.includes(item.id),
          key: item.id,
          itemTitle: item.titleName,
          userCanEdit: item?.userCanEdit === 0, // 0:可以编辑 1:不可以编辑
          isDelete: item?.isDelete === 0, // 0:可以删除 1:不可以删除
          children: loop(item.children),
          level: item.level, // 层级
        };
      }
      return {
        ...item,
        title,
        // selectable: !unCheckedId.includes(item.id),
        key: item.id,
        userCanEdit: item?.userCanEdit === 0, // 0:可以编辑 1:不可以编辑
        isDelete: item?.isDelete === 0, // 0:可以删除 1:不可以删除
        itemTitle: item.titleName,
        level: item.level, // 层级
      };
    });
  };

  const onExpand = (keys: any) => {
    setExpandedKeys(keys);
    setAutoExpandParent(false);
  };

  // 查询标签信息详情
  const queryItemInfo = async (markId: number) => {
    const { data } = await queryMarkEcho({ markId });
    setEditInfo({
      ...data,
      labelId: data?.id,
      parentId: data?.parentId,
      labelType: data?.parentTitleName,
    });
  };

  // 树 hover 效果
  const renderTreeData: any = useCallback(
    (data: any) => {
      return (
        <div className={styles['node-item-container']} key={data?.key}>
          <Tooltip title={data.title}>
            <span className={styles['text-ellipsis']}>{data.title}</span>
          </Tooltip>
          <span className={styles['node-right-actions']}>
            {data.level <= 5 && (
              <PlusOutlined
                type="add"
                style={{ marginRight: '10px' }}
                onClick={(e) => {
                  e.stopPropagation();
                  setModalType('ADD');
                  setEditInfo({
                    labelType: data?.parentTitleName,
                    parentId: data?.key,
                    markType: data?.markType,
                    canEdit: data?.canEdit,
                    visiable: data?.visiable,
                  });
                  setVisible(true);
                }}
              />
            )}
            {data?.userCanEdit && (
              <>
                <EditOutlined
                  type="edit"
                  style={{ marginRight: '10px' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setModalType('EDIT');
                    queryItemInfo(data?.key);
                    setVisible(true);
                  }}
                />
                <CopyOutlined
                  type="edit"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCopyVisible(true);
                    setCopyKey(data?.key);
                  }}
                />
              </>
            )}
            {data?.isDelete && (
              <DeleteOutlined
                type="edit"
                style={{ marginLeft: '10px' }}
                onClick={(e) => {
                  e.stopPropagation();
                  confirm({
                    title: '删除后不可恢复，确定删除吗？',
                    onOk: async () => {
                      const { success } = await deleteFundMarkData({ markId: data?.key });
                      if (success) {
                        queryTreeList();
                        message.success('删除成功！');
                      } else {
                        message.error('删除失败！');
                      }
                    },
                  });
                }}
              />
            )}
          </span>
        </div>
      );
    },
    [treeList],
  );

  return (
    <ProCardPlus colSpan={colSpan} style={{ minHeight: '720px' }}>
      <Input
        style={{ marginBottom: 12 }}
        onChange={treeSearch}
        value={searchValue}
        prefix={<SearchOutlined />}
        allowClear
      />
      {treeList?.length > 0 && (
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
          onSelect={(id: any, options: any) => {
            const {
              node: { markType, userCanEdit },
            } = options;
            onSelect({ markId: id[0], markType, userCanEdit });
          }}
          // defaultSelectedKeys={[treeList[0].id]}
          height={920}
        />
      )}
      <LabelModal
        visible={visible}
        type={modalType}
        onClose={(type: string, params: any) => {
          if (type === 'RELOAD') {
            queryTreeList(params);
          }
          setVisible(false);
        }}
        editInfo={editInfo}
      />
      <ModalForm
        title="复制标签"
        width="30%"
        formRef={formRef}
        visible={copyVisible}
        onFinish={async (values: any) => {
          const { data: params } = await queryMarkEcho({ markId: copyKey });
          const { success } = await saveFundMarkData({ ...params, ...values, copyMarkId: copyKey });
          if (success) {
            formRef?.current?.resetFields();
            message.success('复制标签成功！');
            setCopyVisible(false);
            queryTreeList();
          }
        }}
        modalProps={{
          onCancel: () => setCopyVisible(false),
          maskClosable: false,
        }}
      >
        <ProFormText
          label="请输入复制标签名称"
          name="titleName"
          rules={[{ required: true }]}
          placeholder="请输入"
        />
      </ModalForm>
    </ProCardPlus>
  );
};

SearchTree.isProCard = true;

export default SearchTree;
