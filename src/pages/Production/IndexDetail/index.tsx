import ProCardPlus from '@/components/ProCardPlus';
import { cardGutter, contentPadding } from '@/themes/index';
import TabLeft from '@/components/ProTabLeft';
import { TabLayoutContext } from '@/components/thfund-front-component/src';
import { Empty, Steps } from 'antd';
import { findIndex as _findIndex } from 'lodash';
import moment from 'moment';
import { memo, useContext, useEffect, useState } from 'react';
import { history } from 'umi';
import styles from './index.less';
import ProductHeader from './ProductionHeader';
import InternalData from './internalData';
import ExternalData from './externalData';
import PublicityData from './publicityData';
import { getPanoramaFundInfo, getPanoramaFundLifeCycle, queryFundCodeToFundId } from './service';
import useAuth from '@/components/Hooks/useAuth';
const { Step } = Steps;

function IndexDetail({ match }: any) {
  const authPromote = useAuth({ sn: '_production_IndexDetail__Menu___Promote' });
  const { key: tabKey, setTabTitle } = useContext(TabLayoutContext);
  const newRoute = history.location.pathname.indexOf('newDetail') > 0;
  const [menuConfig, setMenuConfig] = useState([]);
  const [fundCode, setFundCode] = useState('');
  const [fundId, setFundId] = useState('');
  const [windFundCode, setWindFundCode] = useState('');
  const [isPromote, setIsPromote] = useState(false);
  const [fundInfo, setFundInfo] = useState({
    stageDesc: '',
    fundShortName: '',
    fundCode: '',
    productTypeDesc: '',
    productTypeOnedesc: '',
    riskLevelDesc: '',
    contentItem: [],
    isEtf: false,
  });
  const [fundLifeCycle, setFundLifeCycle] = useState<any>({
    stage: -1,
    list: [],
  });

  const menuMap = {
    inner: {
      key: '1',
      name: '我司自有数据',
      component: <InternalData fundId={fundId} fundCode={fundCode} isEtf={fundInfo?.isEtf} />,
    },
    outer: {
      key: '2',
      name: '市场公开数据',
      component: <ExternalData fundCode={fundCode} />,
    },
    promote: {
      key: '3',
      name: '宣推数据',
      component: <PublicityData fundCode={fundCode} />,
    },
  };

  // 查询头部基本信息
  const queryBasicInfo = async (id: any, code?: any) => {
    const fundInfoResult = await getPanoramaFundInfo({
      ...(id ? { fundId: id } : {}),
      fundCode: code,
    });
    if (!newRoute) {
      setFundCode(fundInfoResult?.fundCode);
    }
    setTabTitle(tabKey, fundInfoResult.fundName);
    setFundInfo({
      ...fundInfoResult,
      contentItem: [
        {
          label: '产品全称',
          value: fundInfoResult.fundName,
        },
        {
          label: '英文名称',
          value: fundInfoResult.fundEnName,
        },
        {
          label: '合同生效日',
          value: fundInfoResult.contractBeginDate,
        },
        {
          label: '合同终止日',
          value: fundInfoResult.contractEndDate,
        },
        {
          label: '产品经理',
          value: fundInfoResult.productManager,
        },
        {
          label: '基金经理&投资经理',
          value: fundInfoResult.fundManager,
        },
        {
          label: '管理人',
          value: fundInfoResult.assetManager,
        },
        {
          label: '托管人',
          value: fundInfoResult.custodianName,
        },
      ],
    });
  };

  // 查询生命周期
  const queryLifeCycle = async (id: any, code?: any) => {
    const fundLifeCycleResult = await getPanoramaFundLifeCycle({
      ...(id ? { fundId: id } : {}),
      fundCode: code,
    });
    setFundLifeCycle({
      list: fundLifeCycleResult?.list || [],
      stage: _findIndex(
        fundLifeCycleResult?.list,
        (i: any) => i.stage === fundLifeCycleResult.currentStage,
      ),
    });
  };

  useEffect(() => {
    // 判断页面路由
    (async () => {
      if (newRoute) {
        // 新路由
        const { fundCode: fCode } = match.params;
        const result = await queryFundCodeToFundId({ fundCode: fCode });
        setFundCode(fCode);
        setFundId(result?.fundId);
        setWindFundCode(result?.windFundCode);
        setIsPromote(result?.promote);
        queryBasicInfo(result?.fundId, fCode);
        queryLifeCycle(result?.fundId, fCode);
      } else {
        // 老路由
        const { fundId: fId } = match.params;
        setFundId(fId);
        queryBasicInfo(fId);
        queryLifeCycle(fId);
      }
    })();
  }, []);

  useEffect(() => {
    // 判断页面路由
    (async () => {
      const menuData: any = [];
      if (fundId) menuData.push(menuMap['inner']);
      if (fundCode) menuData.push(menuMap['outer']);
      if (isPromote && authPromote) menuData.push(menuMap['promote']);
      setMenuConfig(menuData);
    })();
  }, [fundId, fundCode, isPromote, fundInfo]);

  const checkDesc = (i: any, k: number) => {
    if (k <= fundLifeCycle.stage) {
      switch (k) {
        case 0:
          return i.endDate ? moment(i.endDate).format('YYYY-MM-DD HH:mm:ss') : '';
        case fundLifeCycle.list?.length - 1:
          return i.beginDate ? moment(i.beginDate).format('YYYY-MM-DD') : '';
        default:
          if (i.stage == 'CONTRACT' || i.stage == 'STOP')
            return i.beginDate ? moment(i.beginDate).format('YYYY-MM-DD') : '';
          return `${i.beginDate ? moment(i.beginDate).format('YYYY-MM-DD') : '--'} ~ ${
            i.endDate ? moment(i.endDate).format('YYYY-MM-DD') : '--'
          }`;
      }
    } else {
      return '';
    }
  };

  return (
    <ProCardPlus
      gutter={[0, cardGutter]}
      style={{ padding: contentPadding }}
      ghost
      direction="column"
    >
      <ProductHeader {...fundInfo} fundId={fundId} windFundCode={windFundCode} desColumn={2} />
      <ProCardPlus title="产品生命周期">
        {!fundLifeCycle.list || fundLifeCycle.list?.length === 0 ? (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        ) : (
          <Steps current={fundLifeCycle.stage} className={styles['step-wrap']}>
            {fundLifeCycle.list?.map((i: any, k: number) => (
              <Step key={k} title={i.stageDesc} description={checkDesc(i, k)} />
            ))}
          </Steps>
        )}
      </ProCardPlus>
      <TabLeft title="产品分析" config={menuConfig} />
    </ProCardPlus>
  );
}

export default memo(IndexDetail);
