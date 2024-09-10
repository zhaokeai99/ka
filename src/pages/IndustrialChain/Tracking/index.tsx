import ProCardPlus from '@/components/ProCardPlus';
import { cardGutter, contentPadding } from '@/themes';
import ProCard from '@ant-design/pro-card';
import { useState } from 'react';
import LeftContent from './LeftContent';
import RightContent from './RightContent';
import FilterCom from './RightContent/components/FilterCom';
import { ModelInfoProvider } from './service';
import styles from './index.less';

// 异动跟踪
const Tracking = (props: any) => {
  const { name = '光伏', id = 'S004955673发电量:太阳能:当月值' } = props?.match?.params || {};

  const [modelInfo, setModelInfo] = useState<any>({});
  const [search, setSearch] = useState<any>();

  const onSelect = (model: any = {}) => {
    setModelInfo(model);
  };

  return (
    <ProCard
      ghost
      size="small"
      gutter={[cardGutter, 0]}
      className={styles['tracking']}
      style={{ padding: contentPadding, overflowY: 'hidden' }}
    >
      <ProCard split="vertical" bordered={false} gutter={[cardGutter, 0]} title="行业异动追踪">
        <ProCardPlus split="horizontal" bordered={false} colSpan={5} size="small">
          <FilterCom
            industryChainName={name}
            searchHandle={(val) => {
              setSearch(val);
            }}
          />
          <LeftContent
            search={{
              id,
              abnormalDate: search?.abnormalDate,
              industryCode: search?.industry?.code,
              industryName: search?.industry?.name,
              industryChain: search?.industry?.chain,
            }}
            onSelect={onSelect}
          />
        </ProCardPlus>
        <ProCardPlus size="small" colSpan={19} bordered={false}>
          <ModelInfoProvider.Provider
            value={{
              modelInfo,
              search: {
                abnormalDate: search?.abnormalDate,
                industryCode: search?.industry?.code,
              },
            }}
          >
            <RightContent />
          </ModelInfoProvider.Provider>
        </ProCardPlus>
      </ProCard>
    </ProCard>
  );
};

Tracking.isProCard = true;

export default Tracking;
