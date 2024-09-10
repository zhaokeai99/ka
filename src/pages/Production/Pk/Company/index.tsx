import { useState, useEffect, useContext } from 'react';
import Anchor from '@/components/Anchor';
import ProCardPlus from '@/components/ProCardPlus';
import { cardGutter, contentPadding } from '@/themes/index';
import { TabLayoutContext } from '@/components/thfund-front-component/src';
import { history } from 'umi';
import EditHeader from '../Components/EditHeader';
import TitleExtra from '../Components/TitleExtra';
import '../Fund/index.less';
import BasicInfo from './BasicInfo';
import BusinessAnalysis from './BusinessAnalysis';
import ProductDistribution from './ProductDistribution';
import Ranking from './Ranking';
import CustomItem from './CustomItem';
import CustomItemFilter from '../Components/CustomItemFilter';
import { queryFundCompanyPKListByCompCodes, searchFundInfo } from './service';

const SEARCHER_TYPE = 'FUND_CORP';
const LOCAL_ITEM_NAME = 'fund_result_tag_corp';
const LISTEN_ITEM_NAME = 'FUND_RESULT_TAG_CORP';

const CompanyPK = () => {
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
        title="基金公司PK"
        data={fundCodes}
        newKey={'compNameKey'}
        setData={setFundCodes}
        fetchInfo={queryFundCompanyPKListByCompCodes}
        searchInfo={searchFundInfo}
        keyName="fundCompCode"
        replacePath="#/production/summary/companyPk/_single_/"
        detailPath="#/production/fundCompany/"
        labelName="label"
      />
      <ProCardPlus
        title="自定义对比项"
        extra={
          <CustomItemFilter
            handleFilterChange={handleFilterChange}
            paramTags={paramTags}
            anchorId="fundCorpCustomItem"
            searcherType={SEARCHER_TYPE}
          />
        }
        ghost
      >
        <CustomItem fundCodes={fundCodes} paramTags={paramTags} searcherType={SEARCHER_TYPE} />
      </ProCardPlus>
      <ProCardPlus title="基本信息" extra={<TitleExtra id="companyBasicInfo" />} ghost>
        <BasicInfo fundCodes={fundCodes} />
      </ProCardPlus>
      <ProCardPlus title="产品分布" extra={<TitleExtra id="productDistribution" />} ghost>
        <ProductDistribution fundCodes={fundCodes} />
      </ProCardPlus>
      <ProCardPlus title="排名" extra={<TitleExtra id="ranking" />} ghost>
        <Ranking fundCodes={fundCodes} />
      </ProCardPlus>
      <ProCardPlus title="业务分析" extra={<TitleExtra id="businessAnalysis" />} ghost>
        <BusinessAnalysis fundCodes={fundCodes} />
      </ProCardPlus>
      <Anchor
        data={[
          {
            id: 'fundCorpCustomItem',
            title: '自定义对比项',
          },
          {
            id: 'companyBasicInfo',
            title: '基本信息',
          },
          {
            id: 'productDistribution',
            title: '产品分布',
          },
          {
            id: 'ranking',
            title: '排名',
          },
          {
            id: 'businessAnalysis',
            title: '业务分析',
          },
        ]}
      />
    </ProCardPlus>
  );
};

export default CompanyPK;
