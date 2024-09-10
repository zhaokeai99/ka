import { DownOutlined } from '@ant-design/icons';
import { message, Modal, Tree } from 'antd';
import React, { useEffect, useState } from 'react';
import { batchTransInByKeys, batchTransInProducts, queryFundMarkData } from '../../service';
import styles from './index.less';

type RadioTagSelectProps = {
  // 单个打标
  data: { code: string; name: string };
  // 一键打标
  searchModel: { params: []; searcherType: string };
  closeModal: () => {};
  searcherType: string;
};
const typeIdMap = {
  FUND: 1,
  FUND_MANAGER: 2,
  FUND_CORP: 3,
};

const { DirectoryTree } = Tree;

const TagLabelModal: React.FC<RadioTagSelectProps> = ({
  data,
  searchModel,
  closeModal,
  searcherType,
}) => {
  const [treeList, setTreeList] = useState<any[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<any[]>([]);
  const [selectData, setSelectData] = useState({});

  // 基金标签列表树
  const queryTreeList = async () => {
    const treeData = await queryFundMarkData();
    const currentTree = treeData?.filter((i: any) => i.id === typeIdMap[searcherType]);
    setTreeList(currentTree || []);
  };

  useEffect(() => {
    if ((data && !!data.code) || (searchModel && searchModel.searcherType)) {
      queryTreeList();
    }
  }, [data, searchModel]);

  const onClose = () => {
    closeModal();
    setSelectedKeys([]);
    setSelectData({});
  };

  // 打标/批量打标
  const batchTransIn = async () => {
    if (data && !!data.code) {
      const { success } = await batchTransInProducts({ ...selectData, transInProducts: [data] });
      if (success) {
        onClose();
      }
    } else {
      const { success } = await batchTransInByKeys({ ...selectData, searchModel });
      if (success) {
        onClose();
      }
    }
  };

  const onConfirm = () => {
    if (selectData && selectData.markId && selectData.markType && selectData.itemTitle) {
      Modal.confirm({
        title: '',
        icon: null,
        content: `确定将“${data && data.name ? data.name : '符合条件的产品'}”调入“${
          selectData.itemTitle
        }”标签？`,
        okText: '确认',
        cancelText: '取消',
        onOk: () => batchTransIn(),
      });
    } else {
      message.error('请先选择标签');
    }
  };

  const loop = (treeData: any) => {
    return treeData?.map((item: any) => {
      const title = <span>{item.titleName}</span>;
      if (item.children) {
        return {
          title,
          key: item.id,
          itemTitle: item.titleName,
          parentTitleName: item.parentTitleName,
          markType: item.markType,
          selectable: item?.userCanEdit === 0,
          disabled: item?.userCanEdit !== 0,
          children: loop(item.children),
        };
      }
      return {
        title,
        key: item.id,
        parentTitleName: item.parentTitleName,
        selectable: item?.userCanEdit === 0,
        disabled: item?.userCanEdit !== 0,
        markType: item.markType,
        itemTitle: item.titleName,
      };
    });
  };

  return (
    <Modal
      visible={(data && !!data.code) || (searchModel && searchModel.searcherType)}
      onCancel={onClose}
      bodyStyle={{ height: '400px', overflow: 'auto' }}
      onOk={() => onConfirm()}
    >
      <DirectoryTree
        className={styles['tree-style']}
        showIcon={false}
        multiple={false}
        showLine={{ showLeafIcon: false }}
        treeData={loop(treeList)}
        selectedKeys={selectedKeys}
        switcherIcon={<DownOutlined />}
        defaultExpandAll
        onSelect={(id: any, options: any) => {
          const {
            node: { markType, itemTitle },
          } = options;
          setSelectData({ markId: id[0], markType, itemTitle });
          setSelectedKeys([...id]);
        }}
        // height={620}
      />
    </Modal>
  );
};

export default TagLabelModal;
