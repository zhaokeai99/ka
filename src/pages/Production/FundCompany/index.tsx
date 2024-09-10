import { useContext, useEffect } from 'react';
import { TabLayoutContext } from '@/components/thfund-front-component/src';
import ProCardPlus from '@/components/ProCardPlus';
import { cardGutter, contentPadding } from '@/themes/index';
import ProductHeader from './FundCompanyHeader';
import TabLeft from '@/components/ProTabLeft';
import AdminComponent from './AdminComponent';
import HolderComponent from './HolderComponent';
import RewardComponent from './RewardComponent';
import FundManager from './FundManager';
import useAuth from '@/components/Hooks/useAuth';
import { queryBaseInfo } from './service';

const FundCompany = ({ match }: any) => {
  const { key: tabKey, setTabTitle } = useContext(TabLayoutContext);
  const authHolder = useAuth({ sn: '_production_FundCompany__Menu___Holder' });
  const authAward = useAuth({ sn: '_production_FundCompany__Menu___authAward' });
  const { code } = match.params;
  const menuMap = {
    admin: {
      key: '1',
      name: '管理产品信息',
      component: <AdminComponent code={code} />,
    },
    holder: {
      key: '2',
      name: '持有人信息',
      component: <HolderComponent code={code} />,
    },
    award: {
      key: '3',
      name: '获奖信息',
      component: <RewardComponent code={code} />,
    },
    manager: {
      key: '4',
      name: '基金经理',
      component: <FundManager code={code} />,
    },
  };

  const publicityConfig: any = [];
  publicityConfig.push(menuMap['admin']);
  if (authHolder) publicityConfig.push(menuMap['holder']);
  if (authAward) publicityConfig.push(menuMap['award']);
  publicityConfig.push(menuMap['manager']);

  useEffect(() => {
    (async () => {
      const result = await queryBaseInfo({
        fundCompCode: code,
      });
      setTabTitle(tabKey, result.fundCompName);
    })();
  }, []);

  return (
    <ProCardPlus
      style={{ padding: contentPadding }}
      direction="column"
      ghost
      gutter={[0, cardGutter]}
    >
      <ProductHeader code={code} />
      <TabLeft title="管理人分析" config={publicityConfig}></TabLeft>
    </ProCardPlus>
  );
};

export default FundCompany;
