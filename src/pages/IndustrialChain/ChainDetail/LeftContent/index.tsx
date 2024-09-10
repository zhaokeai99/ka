import React, { useState, useEffect, useCallback } from 'react';
import { Tree, Radio, Empty, Spin } from 'antd';
import { DownOutlined, WarningFilled } from '@ant-design/icons';
import { queryChainNodeTree, transOptions } from '../service';
import { COLORENUM } from '@/pages/IndustrialChain/data.d';
import styles from './index.less';

interface propsType {
  nodeId: string;
  onSelect: (nodeId: string) => void;
}

// 全景产业链树状图
const LeftContent = (props: propsType) => {
  const [treeData, setTreeData] = useState<any>([]);
  const [selectedKey, setSelectedKey] = useState<string>(''); // 选中的treeNode值
  const [chainType, setChainType] = useState<string>('上游');
  const [loading, setLoading] = useState<boolean>(false);

  // 获取树形结构数据,然后默认选中第一个节点
  const getChainNodeId = async (type = '上游') => {
    setLoading(true);

    const result = await queryChainNodeTree({
      chainId: props?.nodeId,
      chainType: type,
    });

    // 对数据进行递归循环
    const res = transOptions(result || [], 'nodeName', 'nodeId', 'title', 'key');

    setSelectedKey(res[0]?.key);
    setTreeData(res);
    setLoading(false);

    return res[0];
  };

  // 初始化页面
  useEffect(() => {
    (async () => {
      const nodeId = await getChainNodeId();

      props.onSelect(nodeId);
    })();
  }, []);

  // 树形选择
  const onSelect = useCallback(
    (keys: any, { node }: any) => {
      // 如果是已经选中的，则不可点击
      if (selectedKey === node?.key) return;

      setSelectedKey(keys[0]);
      props?.onSelect(node);
    },
    [selectedKey],
  );

  // 上中下游切换
  const onChange = useCallback(async (e: any) => {
    const nodeId = await getChainNodeId(e?.target?.value);

    setChainType(e?.target?.value);
    props.onSelect(nodeId);
  }, []);

  // 自定义title
  const rendertitle = (nodeData: any) => {
    return (
      <div className={styles['left-tree-render']}>
        {nodeData?.title}
        {nodeData?.abnormalSignal ? (
          <>
            &nbsp;&nbsp;
            <WarningFilled title="异动" style={{ color: COLORENUM?.red6 }} />
          </>
        ) : null}
      </div>
    );
  };

  return (
    <div className={styles['left-tree']}>
      <Radio.Group
        value={chainType}
        buttonStyle="solid"
        size="small"
        style={{ marginBottom: 12 }}
        onChange={onChange}
      >
        <Radio.Button value="上游">上游</Radio.Button>
        <Radio.Button value="中游">中游</Radio.Button>
        <Radio.Button value="下游">下游</Radio.Button>
      </Radio.Group>
      <Spin spinning={loading}>
        {treeData?.length ? (
          <Tree
            key="nodeId"
            switcherIcon={<DownOutlined />}
            selectedKeys={[selectedKey]}
            defaultExpandAll
            titleRender={rendertitle}
            onSelect={onSelect}
            treeData={treeData}
          />
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
      </Spin>
    </div>
  );
};

export default LeftContent;
