import { Button, Col, Input, List, message, Row } from 'antd';
import lodash from 'lodash';
import { memo, useCallback, useEffect, useState } from 'react';
import {
  IrFollowFacadeDeleteIrFollowList,
  IrFollowFacadeInsertIrFollowList,
  IrFollowFacadeQueryIrFollowList,
} from '../service';
import './../index.css';
import { PlusOutlined } from '@ant-design/icons';
import { DicProps } from '@/pages/Investment/investmentInfoManagement/BrokerInfoManagement';
import debounce from 'lodash/debounce';
import { EsIndexDataInfoFacadeQuerySimpleEsDataByPage } from '@/pages/Investment/investmentInfoManagement/MarketResearchReport/service';

const { Search } = Input;

interface ModalProps {
  dicMap: DicProps;
  type: string;
}

const ES_INDEX_NAME = 'index_wind_ah_stock';

/**
 * 我的关注修改
 * @param props
 * @constructor
 */
const SearchHistory = (props: ModalProps) => {
  const { dicMap, type } = props;
  const [loading, setLoading] = useState<boolean>(false);
  const [dataList, setDataList] = useState<any>([]);
  const [searchTempList, setSearchTempList] = useState<any[]>([]);

  let _versionCompany = 0;

  //处理数据
  const handleData = useCallback(
    (data: any, search: any) => {
      const tmp: any[] = [],
        dataTmp: any[] = [];
      data.map((item: any) => {
        if (item.id) {
          dataTmp.push(item);
        }
      });

      search.map((item: any) => {
        const i = lodash.findIndex(dataTmp, { followContent: item.followContent });
        if (i < 0) {
          tmp.push(item);
        }
      });
      setDataList([...dataTmp, ...tmp]);
    },
    [searchTempList],
  );

  //加载关注
  const loadData = useCallback(
    async (followType: string, runType: number = 0) => {
      const params = { followType: followType === 'industry' ? 1 : followType === 'stock' ? 2 : 0 };
      setLoading(true);
      const data = await IrFollowFacadeQueryIrFollowList(params);
      setLoading(false);
      if (data.success) {
        if (runType === 1) {
          const resultMap: any[] = [];
          dicMap?.industry?.map((item: any) => {
            resultMap.push({ followType: 1, followContent: item.n, followDesc: item.n });
          });
          setSearchTempList(resultMap);
          handleData(data.data, resultMap);
        } else {
          handleData(data.data, searchTempList);
        }
      }
    },
    [searchTempList],
  );

  //处理搜索关键字
  const handleSearchKey = (keyword: any, query: any) => {
    const shoulds = [];
    if (keyword) {
      shoulds.push({
        type: 'wildcard',
        name: 'stockName',
        text: `*${keyword}*`,
      });
      shoulds.push({
        type: 'wildcard',
        name: 'windCode',
        text: `*${keyword}*`,
      });
      shoulds.push({
        type: 'wildcard',
        name: 'pinyin',
        text: `*${keyword}*`,
      });
    }
    query.push({ bool: { shoulds } });
  };

  //相关公司查询
  const companySearch = useCallback(async (v: string, dList: any[]) => {
    if (v) {
      const query: any = [];
      const versionNum = lodash.random(0, 99999999);
      _versionCompany = versionNum;
      handleSearchKey(v, query);
      const params = {
        from: 0,
        size: 20,
        index: ES_INDEX_NAME,
        query,
      };
      setLoading(true);
      const data = await EsIndexDataInfoFacadeQuerySimpleEsDataByPage(params);

      if (data.status === 'ok' && versionNum === _versionCompany) {
        const tmp: any[] = [];
        data.data?.map((item: any) => {
          tmp.push({
            followType: 2,
            followContent: item.windCode,
            followDesc: item.stockName + ' - ' + item.windCode,
          });
        });
        setSearchTempList(tmp);
        handleData(dList, tmp);
      }
    } else {
      handleData(dList, []);
    }
    setLoading(false);
  }, []);

  //行业搜索
  const industrySearch = useCallback((v: string, dList: any[]) => {
    const resultMap: any[] = [];
    setLoading(true);
    dicMap?.industry?.map((item: any) => {
      if (item.n.indexOf(v) >= 0) {
        resultMap.push({ followType: 1, followContent: item.n, followDesc: item.n });
      }
    });
    setSearchTempList(resultMap);
    handleData(dList, resultMap);
    setLoading(false);
  }, []);

  useEffect(() => {
    // loadData();
    if (type === 'industry') {
      loadData(type, 1);
    } else {
      loadData(type);
    }
  }, []);

  const runIndustry = debounce(industrySearch, 500);
  const runStock = debounce(companySearch, 500);

  const onChange = useCallback(
    (e: any) => {
      const value = e.target.value;

      if (type === 'industry') {
        runIndustry(value, dataList);
      } else if (type === 'stock') {
        runStock(value, dataList);
      }
    },
    [type, dataList],
  );

  //搜索事件
  const onSearch = useCallback(
    (value: any) => {
      if (type === 'industry') {
        industrySearch(value, dataList);
      } else if (type === 'stock') {
        companySearch(value, dataList);
      }
    },
    [dataList],
  );

  //行操作
  const rowClick = useCallback(
    async (item: any) => {
      setLoading(true);
      const params = item;
      let data = undefined;
      if (item.id) {
        //取消
        data = await IrFollowFacadeDeleteIrFollowList(params);
      } else {
        //新增
        data = await IrFollowFacadeInsertIrFollowList(params);
      }
      setLoading(false);
      if (data > 0) {
        message.success('操作成功');
        loadData(type);
      }
    },
    [searchTempList],
  );

  return (
    <>
      <Row>
        <Col span={24}>
          <Search
            placeholder={'请输入您需要搜索的' + (type === 'stock' ? '股票' : '行业')}
            allowClear
            onChange={onChange}
            onSearch={onSearch}
            style={{ width: 552 }}
          />
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <div style={{ maxHeight: 500, overflowY: 'auto' }}>
            <List
              dataSource={dataList}
              loading={loading}
              renderItem={(item: any) => (
                <List.Item>
                  <Row style={{ width: '100%' }}>
                    <Col span={16}>{item.followDesc}</Col>
                    <Col span={8} style={{ textAlign: 'right' }}>
                      {item.id ? (
                        <Button size={'small'} style={{ width: 70 }} onClick={() => rowClick(item)}>
                          取消订阅
                        </Button>
                      ) : (
                        <Button
                          size={'small'}
                          style={{ width: 70 }}
                          onClick={() => rowClick(item)}
                          type={'primary'}
                        >
                          <PlusOutlined />
                          订阅
                        </Button>
                      )}
                    </Col>
                  </Row>
                </List.Item>
              )}
            />
          </div>
        </Col>
      </Row>
    </>
  );
};

export default memo(SearchHistory);
