import { DownOutlined } from '@ant-design/icons';
import { Empty, Spin, Tree } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { queryModelIntroTree, transOptions } from '../service';
import styles from './index.less';

interface propsType {
  modelName: string;
  onSelect: (modelInfo: any) => void;
}

// 数据书名文档左侧
const LeftContent = (props: propsType) => {
  const [treeData, setTreeData] = useState<any>([]);
  const [selectedKey, setSelectedKey] = useState<string>(''); // 选中的treeNode值
  const [loading, setLoading] = useState<boolean>(false);

  // 查找数组中的某个元素
  const findModelName = (modelName: string, data: any) => {
    for (const item of data) {
      if (item?.modelName === modelName) return item;

      if (item?.children?.length) {
        const _item: any = findModelName(modelName, item.children);

        if (_item) return _item;
      }
    }
  };

  // 获取树形结构数据,然后默认选中第一个节点
  const getChainModelName = async () => {
    setLoading(true);

    const result = await queryModelIntroTree();
    // 对数据进行递归循环
    const res = transOptions(result || [], 'modelName', 'modelName', 'title', 'key');

    setTreeData(res);
    setLoading(false);

    const hasKey = findModelName(props?.modelName, res);

    if (hasKey) {
      setSelectedKey(props?.modelName);

      return {
        modelName: props.modelName,
        key: props.modelName,
        title: props.modelName,
      };
    } else {
      setSelectedKey(res[0]?.key);

      return res[0];
    }
  };

  // 初始化页面
  useEffect(() => {
    (async () => {
      const modelInfo = await getChainModelName();

      props.onSelect(modelInfo);
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

  return (
    <div className={styles['left-tree']}>
      {treeData?.length ? (
        <Spin spinning={loading}>
          <Tree
            key="modelName"
            defaultExpandAll
            style={{ minHeight: 100 }}
            switcherIcon={<DownOutlined />}
            selectedKeys={[selectedKey]}
            onSelect={onSelect}
            treeData={treeData}
          />
        </Spin>
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
    </div>
  );
};

LeftContent.isProCard = true;

export default LeftContent;
