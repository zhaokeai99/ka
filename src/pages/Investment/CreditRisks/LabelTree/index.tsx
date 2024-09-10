import DirectoryTree from 'antd/lib/tree/DirectoryTree';
import React, { useCallback, useEffect, useState } from 'react';
import styles from './index.less';
import { FieldBinaryOutlined, FieldStringOutlined, FieldTimeOutlined } from '@ant-design/icons';
import { familyTree, queryModelTagList, transOptions } from '../service';
interface leftTreeProps {
  tab: string;
  onAddOrdinaryField: (obj: any, newNodeData: any) => void;
}

const LabelTree = ({ onAddOrdinaryField }: leftTreeProps) => {
  const [treeData, setTreeData] = useState<any[]>([]);
  useEffect(() => {
    (async () => {
      const result = await queryModelTagList({});
      setTreeData(transOptions(result || [], 'modelName', 'modelId', 'title', 'key'));
    })();
  }, []);

  const treeDoubleClick = (e: any, nodeData: any, newNodeData: any) => {
    e?.stopPropagation();
    onAddOrdinaryField(nodeData, newNodeData);
  };

  // 图标 渲染
  const iconRender = useCallback((nodeObj) => {
    const { expanded, data } = nodeObj;
    if (data?.ifPartition === 'Y') {
      // return <KeyOutlined style={{ color: "#ff0033" }} />;
      return (
        <img
          style={{ marginTop: -3 }}
          src={'https://cdnprod.tianhongjijin.com.cn/thfile/keys1658975737735.png'}
          className={styles['tree-icon']}
        />
      );
    }
    if (data?.columnAttributeType === 'STRING') {
      return <FieldStringOutlined style={{ color: '#0288d1' }} />;
    }
    if (data?.columnAttributeType === 'DATE') {
      return <FieldTimeOutlined style={{ color: '#0288d1' }} />;
    }
    if (data?.columnAttributeType === 'DECIMAL') {
      return <FieldBinaryOutlined style={{ color: '#0288d1' }} />;
    }
    if (expanded) {
      return (
        <img
          src={'https://cdnprod.tianhongjijin.com.cn/thfile/file_open1658975737744.png'}
          className={styles['tree-icon']}
        />
      );
    }
    return (
      <img
        src={'https://cdnprod.tianhongjijin.com.cn/thfile/file_close1658975737732.png'}
        className={styles['tree-icon']}
      />
    );
  }, []);

  return (
    <DirectoryTree
      icon={iconRender}
      // showIcon={false}
      multiple
      titleRender={(nodeData) => {
        if (!nodeData?.children) {
          return (
            <span
              onDoubleClick={(e) => {
                const value: any = familyTree(treeData, nodeData?.tagId);
                const primaryArr = value?.children?.filter((item: any) => {
                  return item.ifPartition === 'Y';
                });
                const nodeDatas = {
                  primaryArr,
                };
                const newNodeData = {
                  ...nodeData,
                  primaryArr,
                };
                return treeDoubleClick(e, nodeDatas, newNodeData);
              }}
            >
              {nodeData.title}
            </span>
          );
        } else {
          return <span>{nodeData.title}</span>;
        }
      }}
      defaultExpandedKeys={['0-0-0']}
      defaultCheckedKeys={['0-0-0']}
      treeData={treeData}
    />
  );
};

export default LabelTree;
