import { useState, useEffect, useContext } from 'react';
import Anchor from '@/components/Anchor';
import ProCardPlus from '@/components/ProCardPlus';
import { cardGutter, contentPadding } from '@/themes';
import { TabLayoutContext } from '@/components/thfund-front-component/src';
import { history } from 'umi';
import EditHeader from '../Components/EditHeader';
import TitleExtra from '../Components/TitleExtra';
import { searchFundInfo } from '../Fund/service';
import BasicInfo from './BasicInfo';
import CustomerPreferences from './CustomerPreferences';
import ManagerExperience from './ManagerExperience';
import ScaleTrend from './ScaleTrend';
import CustomItem from './CustomItem';
import CustomItemFilter from '../Components/CustomItemFilter';
import { queryAllManagerInfos } from './service';

const SEARCHER_TYPE = 'FUND_MANAGER';
const LOCAL_ITEM_NAME = 'fund_result_tag_manger';
const LISTEN_ITEM_NAME = 'FUND_RESULT_TAG_MANGER';

// 基金经理PK
const ManagerPK = () => {
  const { listen, unListen } = useContext(TabLayoutContext);
  const [codes, setCodes] = useState(() => {
    const pathname = history.location.pathname;
    const paths = pathname.split('/_single_/');
    const managerCodesStr = paths[1] || '';
    if (!managerCodesStr || managerCodesStr === ':managerCodes') return [];
    return managerCodesStr.split(',').map((str: string, i: number) => ({
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
      ghost
      direction="column"
      gutter={[0, cardGutter]}
      style={{ padding: contentPadding }}
    >
      <EditHeader
        title="基金经理PK"
        data={codes}
        setData={setCodes}
        fetchInfo={queryAllManagerInfos}
        searchInfo={searchFundInfo}
        replacePath="#/production/summary/managerPk/_single_/"
        detailPath="#/production/fundManager/"
        searcherType="FUND_MANAGER"
      />
      <ProCardPlus
        title="自定义对比项"
        extra={
          <CustomItemFilter
            handleFilterChange={handleFilterChange}
            paramTags={paramTags}
            anchorId="fundManagerCustomItem"
            searcherType={SEARCHER_TYPE}
          />
        }
        ghost
      >
        <CustomItem codes={codes} paramTags={paramTags} searcherType={SEARCHER_TYPE} />
      </ProCardPlus>
      <ProCardPlus title="基本信息" extra={<TitleExtra id="basicInfo" />} ghost>
        <BasicInfo codes={codes} />
      </ProCardPlus>
      <ProCardPlus title="管理经验" extra={<TitleExtra id="manageExperience" />} ghost>
        <ManagerExperience codes={codes} />
      </ProCardPlus>
      <ScaleTrend codes={codes} />
      <CustomerPreferences codes={codes} />
      <Anchor
        data={[
          {
            id: 'fundManagerCustomItem',
            title: '自定义对比项',
          },
          {
            id: 'basicInfo',
            title: '基本信息',
          },
          {
            id: 'manageExperience',
            title: '管理经验',
          },
          {
            id: 'manageScale',
            title: '管理规模走势',
          },
          {
            id: 'hobbies',
            title: '客户喜好',
          },
        ]}
      />
    </ProCardPlus>
  );
};

export default ManagerPK;
