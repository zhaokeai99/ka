import { useCallback, useContext, useEffect, useState } from 'react';
import { cardGutter, contentPadding } from '@/themes';
import ProCard from '@ant-design/pro-card';
import { TabLayoutContext } from '@/components/thfund-front-component/src';
import { SelectKeyProvider } from './service';
import ChainImg from '@/pages/IndustrialChain/components/ChainImg';
import LeftContent from './LeftContent';
import RightContent from './RightContent';
import styles from './index.less';

// 产业链详情
const ChainDetail = (props: any) => {
  const { key: tabTitleKey, setTabTitle } = useContext(TabLayoutContext);
  const { name, id } = props?.match?.params || {};
  const [selectKey, setSelectKey] = useState<any>({}); // 选中的treeNode

  const onSelect = useCallback((key: any) => {
    setSelectKey(key);
  }, []);

  useEffect(() => {
    setTabTitle(tabTitleKey, `${name}`);
  }, []);

  return (
    <ProCard
      ghost
      size="small"
      direction="column"
      style={{ padding: contentPadding }}
      gutter={[0, cardGutter]}
    >
      <ProCard
        bordered={false}
        className={styles['chain-detail']}
        bodyStyle={{ padding: contentPadding }}
      >
        <ChainImg industryCode={id} resourcesType="chain_atlas" />
      </ProCard>

      <ProCard split="vertical" bordered={false} gutter={[cardGutter, 0]}>
        <ProCard
          bordered={false}
          colSpan={5}
          className={styles['chain-tree']}
          title="产业链产品节点树"
        >
          <LeftContent nodeId={id} onSelect={onSelect} />
        </ProCard>
        <ProCard bordered={false} colSpan={19} bodyStyle={{ paddingTop: 4 }}>
          <SelectKeyProvider.Provider value={{ selectKey }}>
            <RightContent />
          </SelectKeyProvider.Provider>
        </ProCard>
      </ProCard>
    </ProCard>
  );
};

ChainDetail.isProCard = true;

export default ChainDetail;
