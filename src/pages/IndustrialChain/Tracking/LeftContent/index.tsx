import { useCallback, useEffect, useState } from 'react';
import { DownOutlined, ExportOutlined } from '@ant-design/icons';
import { Empty, Spin, Tree } from 'antd';
import { find as _find } from 'lodash';
import { history } from 'umi';
import { queryAbnormalTrackTree, transOptions, treeToList } from '../service';
import styles from './index.less';

const { DirectoryTree } = Tree;

interface propsType {
  onSelect: (modelInfo: any) => void;
  search: {
    abnormalDate: string;
    industryCode: string;
    industryName: string;
    industryChain: string;
    id: string;
  };
}

//异动指标
const LeftContent = ({
  onSelect,
  search: { id, abnormalDate, industryCode, industryName, industryChain },
}: propsType) => {
  const [treeData, setTreeData] = useState<any[]>([]);
  const [selectedKey, setSelectedKey] = useState<string>(''); // 选中的treeNode值
  const [loading, setLoading] = useState<boolean>(false);

  // 获取树形结构数据,然后默认选中第一个节点
  const getChainModelName = async () => {
    setLoading(true);

    const { data, success } = await queryAbnormalTrackTree({
      abnormalDate,
      industryCode,
    });

    setLoading(false);

    if (success) {
      // 对数据进行递归循环
      const res = transOptions(data || [], 'abnormalName', 'abnormalId', 'title', 'key', true, 0);

      setTreeData(res);

      const result: {
        abnormalId: string;
        preAbnormalName: string;
        abnormalName: string;
        key: string;
      }[] = [];

      const treeList = treeToList(res, result);
      const findNode = _find(treeList, { key: id });

      // 如果查到路由传过来的key则选中key，如果没有，则默认选中第一个
      if (res?.length && res[0]?.children?.length) {
        setSelectedKey(findNode ? id : res[0]?.children[0].key);

        return findNode ?? res[0]?.children[0];
      } else {
        setSelectedKey(findNode ? id : res[0]);

        return findNode ?? res[0];
      }
    }
  };

  // 初始化页面
  useEffect(() => {
    (async () => {
      if (abnormalDate && industryCode && id) {
        const modelInfo = await getChainModelName();

        onSelect(modelInfo);
      }
    })();
  }, [id, abnormalDate, industryCode]);

  // Icon点击跳转
  const jumpHandle = (abnormalId: string, e: any) => {
    e.stopPropagation();

    switch (abnormalId) {
      case 'EDB':
        history.push(`/industrialChain/chainDetail/${industryName}/${industryCode}`);
        break;
      case '因子':
        history.push(
          `/industrialChain/industryCenter/${industryName}/${industryCode}/${industryChain}`,
        );
        break;
      default:
        break;
    }
  };

  const imgUrl = (abnormalId: string) => (
    <ExportOutlined
      title="指标详情"
      style={{
        marginTop: '-4px',
        marginLeft: '5px',
        cursor: 'pointer',
      }}
      onClick={(e: any) => jumpHandle(abnormalId, e)}
    />
  );

  // 自定义节点
  const rendertitle = ({ title, abnormalId }: any) => {
    return (
      <div className={styles['left-tree-render']}>
        <span title={title} style={{ cursor: 'pointer' }}>
          {title}
        </span>
        {(abnormalId === 'EDB' || abnormalId === '因子') && imgUrl(abnormalId)}
      </div>
    );
  };

  // 树形选择
  const onSelectHandle = useCallback(
    (keys: any, { node }: any) => {
      // 如果是已经选中的，则不可点击
      if (selectedKey === node?.key) return;

      setSelectedKey(keys[0]);

      if (node?.level === 1 && node?.children?.length) return;

      onSelect(node);
    },
    [selectedKey],
  );

  return (
    <div className={styles['left-tree']}>
      <Spin spinning={loading}>
        {treeData?.length ? (
          <DirectoryTree
            showIcon={false}
            key="abnormalName"
            height={670}
            defaultExpandAll
            titleRender={rendertitle}
            showLine={{ showLeafIcon: false }}
            style={{ minHeight: 100 }}
            switcherIcon={<DownOutlined />}
            selectedKeys={[selectedKey]}
            onSelect={onSelectHandle}
            treeData={treeData}
          />
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
      </Spin>
    </div>
  );
};

LeftContent.isProCard = true;

export default LeftContent;
