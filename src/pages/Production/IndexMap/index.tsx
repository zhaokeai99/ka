import React, { useState, useEffect, useCallback } from 'react';
import { Input, Radio, Select, Slider, Divider, Row, Col, Statistic } from 'antd';
import ProCard from '@ant-design/pro-card';
import _map from 'lodash/map';
import ProCardPlus from '@/components/ProCardPlus';
import Compare from '@/components/Compare';
import { IndexMapContext } from './context';
import Topic from './Topic';
import IndexRadar from './IndexRadar';
import IndexLine from './IndexLine';

import {
  queryIndexLabel,
  queryIndexRadarDispatch,
  indexChangeRate,
  indexCompanyDynamic,
  indexProductDynamic,
  fetchIndexSortSys,
  querySearchIndexInfo,
  queryIndexInfo,
} from './service';
import './index.less';
import CubeContainer from './CubeContainer';

const { Search } = Input;
const { Option } = Select;

const IndexMap: React.FC = () => {
  const [cubeData, setCubeData] = useState<any>([]);
  const [cubeOrginData, setCubeOriginData] = useState([]);
  const [companyInfos, setCompanyInfos] = useState([]);
  const [productInfos, setProductInfos] = useState([]);
  const [cubeSelected, setCubeSelected] = useState({
    indexName: null,
    indexCode: null,
  });
  const [radarData, setRadarData] = useState([]);
  const [panelData, setPanelData] = useState({
    thScaleRanking: '-',
    floorMarketSharePercent: '-',
    otcMarketSharePercent: '-',
  });
  const [objType, setObjType] = useState('COMPANY');
  const [objName, setObjName] = useState('');
  const [queryType, setQueryType] = useState('');
  const [lineData, setLineData] = useState([]);
  const [showType, setShowType] = useState<any>('brt');
  const [cubesLoading, setCubesLoading] = useState(false);
  const [sortSys, setSortSys] = useState([{ id: '', name: '' }]);
  const [sysId, setSysId] = useState('');
  const [compareIndexCodes, setCompareIndexCodes] = useState<[]>([]);

  // 初始化新闻
  useEffect(() => {
    (async () => {
      const [c, p] = await Promise.all([indexCompanyDynamic(), indexProductDynamic()]);

      setCompanyInfos(c);
      setProductInfos(p);
    })();
  }, []);

  // 指数行业分类
  useEffect(() => {
    (async () => {
      const data = await fetchIndexSortSys();

      if (data && data.length) {
        setSysId(data[0].id);
        setSortSys(data);
      }
    })();
  }, []);

  // 切换筛选条件
  useEffect(() => {
    (async () => {
      if (!sysId) return;
      setCubesLoading(true);
      const cData = await queryIndexLabel({
        objType,
        objName,
        queryType,
        securitiesSortSysId: sysId,
      });
      setCubeData(cData);
      setCubeOriginData(cData);
      setCubesLoading(false);
      setLineData([]);
      setRadarData([]);
      setCubeSelected({
        indexName: null,
        indexCode: null,
      });
    })();
  }, [queryType, sysId]);

  // 右侧雷达
  useEffect(() => {
    (async () => {
      if (cubeSelected.indexCode) {
        const { radarList, thScaleRanking, floorMarketSharePercent, otcMarketSharePercent } =
          await queryIndexRadarDispatch({
            indexCode: cubeSelected.indexCode,
          });

        const rd = radarList.map((item: { name: string; value: string; quantile: string }) => {
          return {
            ...item,
            rate: item.quantile,
            name: item.name + ' \n' + item.value,
          };
        });

        setRadarData(rd);
        setPanelData({
          thScaleRanking,
          floorMarketSharePercent,
          otcMarketSharePercent,
        });
      }
    })();
  }, [cubeSelected.indexCode]);

  // 右侧趋势
  useEffect(() => {
    (async () => {
      if (cubeSelected.indexCode) {
        const data = await indexChangeRate({
          indexCode: cubeSelected.indexCode,
          showType,
        });

        setLineData(data);
      }
    })();
  }, [cubeSelected.indexCode, showType]);

  // 过滤
  const onFilter = useCallback(
    (value) => {
      setCubeData(
        cubeOrginData.map(({ indexSimpleInfo, indexTrackType }: any) => ({
          indexTrackType,
          indexSimpleInfo: indexSimpleInfo.filter(
            ({ thermalValue }: any) =>
              thermalValue * 100 >= value[0] && thermalValue * 100 <= value[1],
          ),
        })),
      );
    },
    [cubeOrginData],
  );

  return (
    <IndexMapContext.Provider
      value={{
        compareIndexCodes,
        setCompareIndexCodes,
      }}
    >
      <ProCard ghost gutter={[8, 8]} style={{ padding: '12px' }} direction="column" size="small">
        <ProCard ghost gutter={[8, 8]} direction="column" size="small">
          <ProCard ghost>
            <ProCard>
              <Row gutter={[8, 8]} align="middle">
                <Col span={12}>
                  <Topic topics={companyInfos} title="指数公司动态" href="" />
                </Col>
                <Col span={12}>
                  <Topic topics={productInfos} title="指数产品动态" href="" />
                </Col>
              </Row>
              <Divider style={{ margin: '12px 0' }} />
              <Row gutter={[8, 8]} align="middle">
                <Col>
                  <Search
                    placeholder="公司/个股/指数/基金"
                    onSearch={async (str) => {
                      setObjName(str);
                      const cData = await queryIndexLabel({
                        objType,
                        objName: str,
                        queryType,
                      });

                      setCubeData(cData);
                      setCubeOriginData(cData);
                    }}
                    enterButton="搜索"
                    allowClear
                    size="small"
                    addonBefore={
                      <Select
                        defaultValue="COMPANY"
                        className="select-before"
                        onChange={(type) => setObjType(type)}
                      >
                        <Option value="COMPANY">公司</Option>
                        <Option value="STOCK">个股</Option>
                        <Option value="INDEX">指数</Option>
                        <Option value="FUND">基金</Option>
                      </Select>
                    }
                  />
                </Col>
                <Col>
                  <Radio.Group
                    defaultValue=""
                    buttonStyle="solid"
                    size="small"
                    style={{ marginLeft: 20 }}
                    onChange={async (e) => {
                      setQueryType(e.target.value);
                    }}
                  >
                    <Radio.Button value="">全部</Radio.Button>
                    <Radio.Button value="0">天弘已发</Radio.Button>
                    <Radio.Button value="1">全市场已发</Radio.Button>
                    <Radio.Button value="2">可发指数</Radio.Button>
                    <Radio.Button value="3">新指数</Radio.Button>
                  </Radio.Group>
                </Col>
                <Col style={{ margin: 'auto 10px' }}>
                  <IndexMapContext.Consumer>
                    {({ compareIndexCodes: cIndexCodes, setCompareIndexCodes: setCIndexCodes }) => (
                      <Compare
                        request={async () => {
                          if (cIndexCodes.length > 0) {
                            const { data } = await queryIndexInfo(cIndexCodes.join(','));
                            return data;
                          }
                          return {};
                        }}
                        searchInfo={querySearchIndexInfo}
                        openUrl="/production/indexStock/compare/_single_/"
                        labelName="indexName"
                        keyName="indexCode"
                        size="small"
                        callback={(newValues: any) => setCIndexCodes(_map(newValues, 'key'))}
                      />
                    )}
                  </IndexMapContext.Consumer>
                </Col>
                <Col style={{ display: 'flex', alignItems: 'center' }}>
                  <label>指数行业分类： </label>
                  <Select
                    key={sortSys[0]?.id}
                    defaultValue={sortSys[0]?.id}
                    style={{ width: '200px' }}
                    onChange={(id) => setSysId(id)}
                    size="small"
                  >
                    {sortSys.map(({ id, name }) => {
                      return (
                        <Option key={id} value={id}>
                          {name}
                        </Option>
                      );
                    })}
                  </Select>
                </Col>
                <Col
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '400px',
                    marginLeft: '20px',
                  }}
                >
                  <label>热力值范围:</label>
                  <Slider
                    style={{ width: 'calc(100% - 100px)', marginLeft: '10px' }}
                    min={0}
                    max={100}
                    range
                    defaultValue={[0, 100]}
                    onChange={onFilter}
                  />
                </Col>
              </Row>
            </ProCard>
          </ProCard>
          <ProCard gutter={[8, 8]} ghost>
            <ProCard colSpan={18}>
              <CubeContainer
                loading={cubesLoading}
                data={cubeData}
                indexCode={cubeSelected.indexCode}
                setCubeSelected={setCubeSelected}
              />
            </ProCard>
            <ProCard ghost direction="column" gutter={[8, 8]}>
              <ProCardPlus
                style={{ height: '263px' }}
                colSpan={24}
                title={
                  <>
                    <span style={{ marginRight: '5px' }}> 热力图 </span>
                    {cubeSelected.indexName ? (
                      <a href={`#/production/indexStock/detail/${cubeSelected.indexCode}`}>
                        {cubeSelected.indexName}
                      </a>
                    ) : (
                      ''
                    )}
                  </>
                }
              >
                <IndexRadar data={radarData} />
              </ProCardPlus>
              <ProCardPlus colSpan={24} title="指数走势" style={{ height: '320px' }}>
                <IndexLine
                  data={lineData}
                  beforeContent={
                    <Radio.Group
                      defaultValue="brt"
                      buttonStyle="solid"
                      size="small"
                      style={{ margin: '0 auto 25px' }}
                      onChange={(e) => {
                        setShowType(e.target.value);
                      }}
                    >
                      <Radio.Button value="brt">今日实时</Radio.Button>
                      <Radio.Button value="b5d">5日</Radio.Button>
                      <Radio.Button value="b1m">1月</Radio.Button>
                      <Radio.Button value="b3m">1季度</Radio.Button>
                      <Radio.Button value="b6m">半年</Radio.Button>
                      <Radio.Button value="bty">今年以来</Radio.Button>
                      {/* TODO  后端没有处理成立以来的情况暂时注释掉 */}
                      {/* <Radio.Button value="b6m">成立以来</Radio.Button> */}
                    </Radio.Group>
                  }
                />
              </ProCardPlus>
              <ProCardPlus
                colSpan={24}
                title={
                  <>
                    <span style={{ marginRight: '5px' }}> 同一指数 </span>
                    {cubeSelected.indexName ? (
                      <a href={`#/production/indexStock/detail/${cubeSelected.indexCode}`}>
                        {cubeSelected.indexName}
                      </a>
                    ) : (
                      ''
                    )}
                  </>
                }
              >
                <Row gutter={4} className="our-company">
                  <Col span={8}>
                    <Statistic
                      valueStyle={{ fontSize: '22px', textAlign: 'center' }}
                      title="我司规模排名"
                      value={panelData.thScaleRanking}
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic
                      valueStyle={{ fontSize: '22px', textAlign: 'center' }}
                      title="我司场内市占率"
                      value={panelData.floorMarketSharePercent}
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic
                      valueStyle={{ fontSize: '22px', textAlign: 'center' }}
                      title="我司场外市占率"
                      value={panelData.otcMarketSharePercent}
                    />
                  </Col>
                </Row>
              </ProCardPlus>
            </ProCard>
          </ProCard>
        </ProCard>
      </ProCard>
    </IndexMapContext.Provider>
  );
};

export default IndexMap;
