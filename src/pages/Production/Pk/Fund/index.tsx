import { useState, useEffect, useContext } from 'react';
import Anchor from '@/components/Anchor';
import ProCardPlus from '@/components/ProCardPlus';
import { cardGutter, contentPadding } from '@/themes/index';
import { GUTTER_SIZE } from '@/utils/utils';
import { TabLayoutContext } from '@/components/thfund-front-component/src';
import EditHeader from '../Components/EditHeader';
import TitleExtra from '../Components/TitleExtra';
import AnnualizedReturn from './AnnualizedReturn';
import AssetAmt from './AssetAmt';
import FundCompany from './FundCompany';
import FundHold from './FundHold';
import FundInterval from './FundInterval';
import FundManager from './FundManager';
import FundMarketRate from './FundMarketRate';
import FundQuota from './FundQuota';
import FundShare from './FundShare';
import HistoryAssetAmt from './HistoryAssetAmt';
import IncomeRate from './IncomeRate';
import './index.less';
import MarketFundInfo from './MarketFundInfo';
import NavRegCl from './NavRegCl';
import NavRegff from './NavRegff';
import NavRegIndus from './NavRegIndus';
import NavRegStockPos from './NavRegStockPos';
import Retracement from './Retracement';
import { queryAllFundNameInfos, searchFundInfo } from './service';
import UnitNavAmt from './UnitNavAmt';
import IntervalIncome from './IntervalIncome';
import VernacularArticle from './VernacularArticle';
import CustomItem from './CustomItem';
import SelectExtra from '../Components/selectExtra';
import CustomItemFilter from '../Components/CustomItemFilter';

const SEARCHER_TYPE = 'FUND';
const LOCAL_ITEM_NAME = 'fund_result_tag_fund';
const LISTEN_ITEM_NAME = 'FUND_RESULT_TAG_FUND';

const Fund = ({ history }: any) => {
  const { listen, unListen } = useContext(TabLayoutContext);
  const [fundCodes, setFundCodes] = useState(() => {
    const pathname = history.location.pathname;
    const paths = pathname.split('/_single_/');
    const fundCodesStr = paths[1] || '';
    if (!fundCodesStr || fundCodesStr === ':fundCodes') return [];
    return fundCodesStr.split(',').map((str: string, i: number) => ({
      index: i,
      code: str,
    }));
  });
  // 区间收益同类排名 分类标准 下拉选项
  const [classifyValue, setClassifyValue] = useState('');
  // 自定义筛选项
  const [paramTags, setParamTags] = useState(() => {
    const itemStr = localStorage.getItem(LOCAL_ITEM_NAME);
    if (itemStr === null || itemStr === 'null' || itemStr === 'undefined') return [];
    try {
      return JSON.parse(itemStr);
    } catch (error) {
      return [];
    }
  });

  // 区间收益同类排名切换
  const handleChange = (value: string) => {
    setClassifyValue(value);
  };

  // 自定义筛选项切换
  const handleFilterChange = (tags: any) => {
    setParamTags(tags);
  };

  // 更新自定义指标
  const refreshParamTags = () => {
    let tempParamTags = [];
    const itemStr = localStorage.getItem(LOCAL_ITEM_NAME);
    if (itemStr === null || itemStr === 'null' || itemStr === 'undefined') tempParamTags = [];
    else {
      try {
        tempParamTags = JSON.parse(itemStr);
      } catch (error) {
        tempParamTags = [];
      }
    }
    setParamTags(tempParamTags);
  };

  useEffect(() => {
    listen(LISTEN_ITEM_NAME, refreshParamTags);

    return () => {
      unListen(LISTEN_ITEM_NAME, refreshParamTags);
    };
  }, []);

  return (
    <ProCardPlus
      gutter={[0, cardGutter]}
      style={{ padding: contentPadding }}
      ghost
      direction="column"
    >
      <EditHeader
        title="基金PK"
        data={fundCodes}
        setData={setFundCodes}
        fetchInfo={queryAllFundNameInfos}
        searchInfo={searchFundInfo}
        replacePath="#/production/summary/fundPk/_single_/"
        detailPath="#/production/index/newDetail/"
      />
      <ProCardPlus
        title="自定义对比项"
        extra={
          <CustomItemFilter
            handleFilterChange={handleFilterChange}
            paramTags={paramTags}
            anchorId="fundCustomItem"
            searcherType={SEARCHER_TYPE}
          />
        }
        ghost
      >
        <CustomItem fundCodes={fundCodes} paramTags={paramTags} searcherType={SEARCHER_TYPE} />
      </ProCardPlus>
      <ProCardPlus title="基金特征AI白话文" extra={<TitleExtra id="vernacularArticle" />} ghost>
        <VernacularArticle fundCodes={fundCodes} />
      </ProCardPlus>
      <ProCardPlus
        title="区间收益同类排名"
        extra={<SelectExtra handleChange={handleChange} />}
        ghost
      >
        <FundInterval fundCodes={fundCodes} classify={classifyValue} />
      </ProCardPlus>
      <ProCardPlus title="区间收益" extra={<TitleExtra id="intervalIncome" />} ghost>
        <IntervalIncome fundCodes={fundCodes} />
      </ProCardPlus>
      <ProCardPlus ghost gutter={[GUTTER_SIZE, 0]}>
        <ProCardPlus title="规模" extra={<TitleExtra id="assetAmt" />}>
          <AssetAmt fundCodes={fundCodes} />
        </ProCardPlus>
        <ProCardPlus title="规模变动" extra={<TitleExtra id="historyAssetAmt" />}>
          <HistoryAssetAmt fundCodes={fundCodes} />
        </ProCardPlus>
      </ProCardPlus>
      {/* 加div把 TitleExtra 拿出来 为了解决 规模变动 slider 拖不动问题 尝试过加空标签以及纯div 不把TitleExtra 提出来都无效 */}
      <div>
        <FundMarketRate
          title="大盘胜率"
          fundCodes={fundCodes}
          // extra={<TitleExtra id="fundMarketRate" />}
        />
        <TitleExtra id="fundMarketRate" />
      </div>
      <ProCardPlus title="年化回报" extra={<TitleExtra id="annualizedReturn" />}>
        <AnnualizedReturn fundCodes={fundCodes} />
      </ProCardPlus>
      <ProCardPlus title="投资收益走势" extra={<TitleExtra id="incomeRate" />}>
        <IncomeRate fundCodes={fundCodes} />
      </ProCardPlus>
      <ProCardPlus title="净值走势" extra={<TitleExtra id="unitNavAmt" />}>
        <UnitNavAmt fundCodes={fundCodes} />
      </ProCardPlus>
      <ProCardPlus title="回撤" extra={<TitleExtra id="pullBack" />}>
        <Retracement fundCodes={fundCodes} />
      </ProCardPlus>
      <ProCardPlus title="风险评估" extra={<TitleExtra id="fundQuota" />}>
        <FundQuota fundCodes={fundCodes} />
      </ProCardPlus>
      <ProCardPlus title="比率信息" extra={<TitleExtra id="marketFundInfo" />} ghost>
        <MarketFundInfo fundCodes={fundCodes} />
      </ProCardPlus>
      <ProCardPlus title="持仓分析 - 季报" extra={<TitleExtra id="fundShare" />}>
        <FundShare fundCodes={fundCodes} />
      </ProCardPlus>
      <ProCardPlus title="三因子模型" extra={<TitleExtra id="navRegff" />}>
        <NavRegff fundCodes={fundCodes} />
      </ProCardPlus>
      <ProCardPlus title="行业分析模型" extra={<TitleExtra id="navRegIndus" />}>
        <NavRegIndus fundCodes={fundCodes} />
      </ProCardPlus>
      <ProCardPlus title="基金仓位预测" extra={<TitleExtra id="navRegStockPos" />}>
        <NavRegStockPos fundCodes={fundCodes} />
      </ProCardPlus>
      <ProCardPlus ghost gutter={[GUTTER_SIZE, 0]}>
        <ProCardPlus title="择时模型" extra={<TitleExtra id="navRegC" />}>
          <NavRegCl fundCodes={fundCodes} title="择时模型" yField="timingValue" />
        </ProCardPlus>
        <ProCardPlus title="选股模型" extra={<TitleExtra id="navRegL" />}>
          <NavRegCl fundCodes={fundCodes} title="选股模型" yField="selectionValue" />
        </ProCardPlus>
      </ProCardPlus>
      <ProCardPlus title="持有人结构" extra={<TitleExtra id="fundHold" />}>
        <FundHold fundCodes={fundCodes} />
      </ProCardPlus>
      <ProCardPlus title="基金经理" extra={<TitleExtra id="fundManager" />} ghost>
        <FundManager fundCodes={fundCodes} />
      </ProCardPlus>
      <ProCardPlus title="管理人" extra={<TitleExtra id="fundCompany" />} ghost>
        <FundCompany fundCodes={fundCodes} />
      </ProCardPlus>
      <Anchor
        data={[
          {
            id: 'fundCustomItem',
            title: '自定义对比项',
          },
          {
            id: 'vernacularArticle',
            title: '基金白话文',
          },
          {
            id: 'fundInterval',
            title: '区间收益同类排名',
          },
          {
            id: 'intervalIncome',
            title: '区间收益',
          },
          {
            id: 'assetAmt',
            title: '规模',
          },
          {
            id: 'historyAssetAmt',
            title: '规模变动',
          },
          {
            id: 'fundMarketRate',
            title: '大盘胜率',
          },
          {
            id: 'annualizedReturn',
            title: '年华回报',
          },
          {
            id: 'incomeRate',
            title: '投资收益走势',
          },
          {
            id: 'unitNavAmt',
            title: '净值走势',
          },
          {
            id: 'pullBack',
            title: '回撤',
          },
          {
            id: 'fundQuota',
            title: '风险评估',
          },
          {
            id: 'marketFundInfo',
            title: '比率信息',
          },
          {
            id: 'fundShare',
            title: '持仓分析季报',
          },
          {
            id: 'navRegff',
            title: '三因子模型',
          },
          {
            id: 'navRegIndus',
            title: '行业分析模型-L模型',
          },
          {
            id: 'navRegStockPos',
            title: '基金仓位预测-L模型',
          },
          {
            id: 'navRegC',
            title: '择时模型',
          },
          {
            id: 'navRegL',
            title: '选股模型',
          },
          {
            id: 'fundHold',
            title: '持有人结构',
          },
          {
            id: 'fundManager',
            title: '基金经理',
          },
          {
            id: 'fundCompany',
            title: '管理人',
          },
        ]}
      />
    </ProCardPlus>
  );
};

export default Fund;
