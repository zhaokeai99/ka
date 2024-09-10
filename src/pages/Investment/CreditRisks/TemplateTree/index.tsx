import { FileMarkdownOutlined } from '@ant-design/icons';
import { message, Modal } from 'antd';
import DirectoryTree from 'antd/lib/tree/DirectoryTree';
import React, { useCallback, useEffect, useState } from 'react';
import {
  queryModelTemplateList,
  transOptions,
  queryTemplateDetail,
  deleteTemplate,
} from '../service';
import CollectTreePopver from './CollectTreePopver';
import styles from './index.less';

interface leftTreeProps {
  tab: string;
  onAddOrdinaryField: (obj: any, newNodeData: any) => void;
  getFilterJson: (filterJson: any, tableInfoJson: any, data: any, fieldJson: any) => void;
  ifSuccess: boolean;
}

const TemplateTree = ({ tab, onAddOrdinaryField, getFilterJson, ifSuccess }: leftTreeProps) => {
  const [treeData, setTreeData] = useState<any[]>([]);

  const getTreeData = useCallback(async () => {
    if (tab === '业务模板') {
      const result = await queryModelTemplateList({ ifSystemFlag: 'Y' });
      setTreeData(
        transOptions(
          result || [],
          'modelName',
          'modelId',
          'title',
          'key',
          'templateBriefList',
          'templateBriefList',
          'templateName',
          'templateId',
        ),
      );
    } else if (tab === '我的模板') {
      const result = await queryModelTemplateList({ ifSystemFlag: 'N' });
      setTreeData(
        transOptions(
          result || [],
          'modelName',
          'modelId',
          'title',
          'key',
          'templateBriefList',
          'templateBriefList',
          'templateName',
          'templateId',
        ),
      );
    }
  }, []);

  // 业务模板/我的模板
  useEffect(() => {
    getTreeData();
  }, []);

  useEffect(() => {
    if (ifSuccess) {
      getTreeData();
    }
  }, [ifSuccess]);

  // 获取filterJson
  const detailFilterJson = useCallback(async (nodeData) => {
    const data: any = await queryTemplateDetail({ templateId: nodeData?.templateId });
    const { filterJson = '', tableInfoJson = '', fieldJson = '' } = data;
    getFilterJson(filterJson, tableInfoJson, data, fieldJson);
  }, []);

  // 删除模板
  const handleDelTemplate = useCallback(
    async (templateId: any) => {
      const { success, msg }: any = await deleteTemplate({ templateId });
      if (success) {
        message.success('删除成功');
        getTreeData();
      } else {
        message.error(msg || '删除失败');
      }
    },
    [getTreeData],
  );

  const handleDelClick = useCallback(
    (key: any) => {
      Modal.confirm({
        title: '删除后不可恢复，确定要删除该模板吗?',
        onOk() {
          handleDelTemplate(key);
        },
      });
    },
    [handleDelTemplate],
  );

  const treeDoubleClick = (e: any, nodeData: any, newNodeData: any) => {
    e?.stopPropagation();
    onAddOrdinaryField(nodeData, newNodeData);
    detailFilterJson(newNodeData);
  };

  const titleRender: any = useCallback((nodeData: any) => {
    const { title, templateId } = nodeData || {};
    const currTitle = (
      <span
        className={styles['tree-title']}
        onDoubleClick={(e) => {
          const nodeDatas = {
            primaryArr: [],
          };
          const newNodeData = {
            ...nodeData,
            primaryArr: [],
          };
          return treeDoubleClick(e, nodeDatas, newNodeData);
        }}
      >
        {title}
      </span>
    );

    if (tab === '我的模板') {
      return (
        <CollectTreePopver
          title={currTitle}
          onDel={() => {
            handleDelClick(templateId);
          }}
          onInfo={(e) => {
            const nodeDatas = {
              primaryArr: [],
            };
            const newNodeData = {
              ...nodeData,
              primaryArr: [],
            };
            return treeDoubleClick(e, nodeDatas, newNodeData);
          }}
        />
      );
    } else {
      return currTitle;
    }
  }, []);

  // 图标 渲染
  const iconRender = useCallback((nodeObj) => {
    const { expanded, data } = nodeObj;
    if (data.templateId) {
      return <FileMarkdownOutlined style={{ color: '#0288d1' }} />;
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
      // showIcon={false}
      multiple
      icon={iconRender}
      titleRender={titleRender}
      defaultExpandedKeys={['0-0-0']}
      defaultCheckedKeys={['0-0-0']}
      treeData={treeData}
    />
  );
};

export default TemplateTree;
