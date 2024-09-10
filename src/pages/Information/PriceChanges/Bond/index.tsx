import React, { useState, useEffect } from 'react';
import ProCard from '@ant-design/pro-card';
import { cardGutter, contentPadding } from '@/themes';
import { headerTabsCardKeys, BondTabsContext, IBondContextType } from './data.d';
import styles from './index.less';
import BondTabLayout from './components/BondTabLayout';
import IntradayPrice from './IntradayPrice';
import AfterPrice from './AfterPrice';
import {
  //TODO
  getBondType,
  getIndustry,
  ICommonSearch,
} from './service';

const headerTabsOption = {
  [headerTabsCardKeys.INTRADAY]: '盘中价格异动',
  [headerTabsCardKeys.AFTER]: '盘后价格异动',
};

interface IModifyType<T, k> {
  (arr: k[], key?: string): T[];
}

// TODO
const modify: IModifyType<
  {
    value: string;
    label: string;
  },
  ICommonSearch
> = (arr, key) => {
  if (arr?.length <= 0) {
    return [];
  }

  return arr.map((item) => {
    if (key) {
      return {
        label: item?.name,
        value: item?.[key],
      };
    } else {
      return {
        label: item?.name,
        value: item?.id,
      };
    }
  });
};

const Bond: React.FC = () => {
  const [searchData, setSearchData] = useState<IBondContextType>({
    bondType: [],
    industry: [],
  });

  //TODO
  useEffect(() => {
    (async () => {
      const [bondData, industryData] = await Promise.all([getBondType(), getIndustry()]);

      const bondType = modify(bondData?.data ?? []);
      const industry = modify(industryData?.data ?? [], 'name');

      setSearchData({
        bondType: bondType,
        industry: industry,
      });
    })();
  }, []);

  return (
    <BondTabsContext.Provider
      value={{
        ...searchData,
      }}
    >
      <ProCard
        size="small"
        ghost
        style={{ padding: contentPadding }}
        className={styles['bond-container']}
        direction="column"
        gutter={[0, cardGutter]}
      >
        <BondTabLayout
          options={{
            defaultActiveKey: headerTabsCardKeys.INTRADAY,
            type: 'card',
            className: styles['bond-tab'],
          }}
        >
          <IntradayPrice value={headerTabsCardKeys.INTRADAY} title={headerTabsOption.intraday} />
          <AfterPrice value={headerTabsCardKeys.AFTER} title={headerTabsOption.after} />
        </BondTabLayout>
      </ProCard>
    </BondTabsContext.Provider>
  );
};

export default Bond;
