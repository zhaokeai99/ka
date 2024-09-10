import ProCardPlus from '@/components/ProCardPlus';
import { cardGutter, contentPadding } from '@/themes/index';
import React, { useContext, useEffect } from 'react';
// import Header from './Header';
import { TabLayoutContext } from '@/components/thfund-front-component/src';
import LeftContent from './LeftContent';
import RightContent from './RightContent';
import { IndustryProvider } from './service';

/** 行业中心 */
const IndustryCenter: React.FC = (props: any) => {
  const { id, name, chain } = props?.match?.params || {};
  const { key: tabTitleKey, setTabTitle } = useContext(TabLayoutContext);

  useEffect(() => {
    setTabTitle(tabTitleKey, `${name}`);
  }, []);

  return (
    <IndustryProvider.Provider value={{ industryName: name, industryId: id, chain }}>
      <ProCardPlus ghost style={{ padding: contentPadding }} gutter={[cardGutter, 0]} size="small">
        <LeftContent colSpan={17} />
        <RightContent colSpan={7} />
        {/* <Header /> */}
        {/* <ProCardPlus direction="row" ghost gutter={[cardGutter, 0]}></ProCardPlus> */}
      </ProCardPlus>
    </IndustryProvider.Provider>
  );
};

export default IndustryCenter;
