import ProCard from '@ant-design/pro-card';
import { Empty, List } from 'antd';
import { memo, useCallback, useImperativeHandle, useState } from 'react';
import ConferenceForm from './form/conferenceForm';

import { EsIndexDataInfoFacadeQuerySimpleEsDataByPage } from '@/pages/Investment/investmentInfoManagement/MarketResearchReport/service';

interface ModalProps {
  cRef: any;
  attData: any[];
}

const ES_INDEX_NAME = 'index_selm_wechat_message';

/**
 * 数据列表
 * @param props
 * @constructor
 */
const SearchHistory = (props: ModalProps) => {
  const { cRef, attData } = props;
  const [pSize, setPSize] = useState<number>(50);
  const [curr, setCurr] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [listData, setListData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchParams, setSearchParams] = useState<any>({});
  const [randomId, setRandomId] = useState<number>(Math.random());

  //跳到开头
  const anchorToDivTop = () => {
    const div = document.querySelector('#div_top');
    if (div != undefined) {
      div.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  //处理搜索条件
  const handleSearchWord = (values: any, filters: any) => {
    if (values.dateStart !== undefined) {
      filters.push({ type: 'range', name: 'receiveTime', gte: values.dateStart?.format('x') });
    }
    if (values.dateEnd !== undefined) {
      filters.push({ type: 'range', name: 'receiveTime', lte: values.dateEnd?.format('x') });
    }
    if (values.showLevel !== undefined) {
      filters.push({ type: 'term', name: 'conferenceType', text: values.showLevel, boost: 1 });
    }
    if (values.seller !== undefined) {
      filters.push({ type: 'term', name: 'brokerName', text: values.seller, boost: 1 });
    }
    if (values.company !== undefined) {
      filters.push({ type: 'match', name: 'label.stock', text: values.company, boost: 1 });
    }
    if (values.industry !== undefined) {
      if (values.industry === -2 || values.industry === '个人关注') {
        //查询个人关注
        const shoulds: any[] = [];
        attData.map((item: any) => {
          //followContent: '300076.SZ', followDesc: 'GQY视讯', followRemark: null, followType: 2
          if (item.followType === 2) {
            //公司
            shoulds.push({
              type: 'match',
              name: 'label.stock',
              text: item.followContent,
              boost: 1,
            });
          } else if (item.followType === 1) {
            //行业
            shoulds.push({
              type: 'term',
              name: 'industryName',
              text: item.followContent,
              boost: 1,
            });
          }
        });
        filters.push({ bool: { shoulds } });
      } else {
        filters.push({ type: 'term', name: 'industryName', text: values.industry, boost: 1 });
      }
    }
    if (values.classes !== undefined) {
      filters.push({ type: 'term', name: 'showType', text: values.classes, boost: 1 });
    }
  };

  //处理搜索关键字
  const handleSearchKey = (values: any, query: any) => {
    const shoulds = [];
    if (values.keyword) {
      shoulds.push({
        type: 'match_phrase',
        name: 'showContent',
        text: `${values.keyword}`,
        boost: 10,
      });
      shoulds.push({
        type: 'match_phrase',
        name: 'showTitle',
        text: `${values.keyword}`,
        boost: 10,
      });
    }
    query.push({ bool: { shoulds } });
  };

  //数据查询
  const loadListData = useCallback(
    async (values: any) => {
      setLoading(true);
      const filters: any = [],
        shoulds: any = [],
        query: any = [];
      handleSearchWord(values, filters);
      handleSearchKey(values, query);
      const params = {
        from: 0,
        size: pSize,
        index: ES_INDEX_NAME,
        filters,
        shoulds,
        query,
        sorts: [
          // { name: '_score', order: 'desc' },
          { name: 'receiveTime', order: 'desc' },
          { name: 'unqiueId', order: 'desc' },
        ],
        matchAll: '0',
      };
      const data = await EsIndexDataInfoFacadeQuerySimpleEsDataByPage(params);
      setSearchParams(params);
      setLoading(false);
      if (data.status === 'ok') {
        setListData(data.data);
        setRandomId(Math.random());
        setTotal(data.total);
        setCurr(1);
      }
    },
    [pSize, attData],
  );

  const pageChange = useCallback(
    async (page: number, size: number) => {
      setLoading(true);
      const params: any = searchParams;
      params.from = size * (page - 1);
      params.size = size;
      const data = await EsIndexDataInfoFacadeQuerySimpleEsDataByPage(params);
      setLoading(false);
      setSearchParams({ ...params });
      if (data.status === 'ok') {
        setRandomId(Math.random());
        setListData(data.data);
        setCurr(page);
        setTotal(data.total);
        setPSize(size);
      }
      anchorToDivTop();
    },
    [searchParams],
  );

  //更新
  useImperativeHandle(cRef, () => ({
    // 更新树
    onSearch: (values: any) => {
      loadListData(values);
    },
  }));

  return (
    <div style={{ padding: '16px 0px 0px 16px' }} id="div_top">
      <ProCard bodyStyle={{ padding: '0px 24px' }}>
        {listData?.length > 0 ? (
          <List
            className={'broker-info-list broker-content-unselect'}
            itemLayout="vertical"
            loading={loading}
            pagination={{
              onChange: pageChange,
              pageSize: pSize,
              current: curr,
              total: total,
            }}
            dataSource={listData}
            renderItem={(item: any) => (
              <ConferenceForm key={item.unqiueId + randomId} itemData={item} />
            )}
          />
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
      </ProCard>
    </div>
  );
};

export default memo(SearchHistory);
