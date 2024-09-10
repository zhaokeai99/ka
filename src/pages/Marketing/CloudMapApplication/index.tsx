import ProCard from '@ant-design/pro-card';
import { Button, Cascader, Col, Empty, Form, message, Row, Select, Spin } from 'antd';
import { get as _get } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { history } from 'umi';
import CloudChart from './CloudChart';
import './index.less';
import { queryChartData, queryPageSearchConfig } from './service';

const paging = [
  {
    label: '前100条',
    value: 100,
  },
  {
    label: '前200条',
    value: 200,
  },
  {
    label: '前500条',
    value: 500,
  },
  {
    label: '前1000条',
    value: 1000,
  },
  {
    label: '全部',
    value: 'all',
  },
];

const setCascadepageselectsonfig = (
  configData: Record<string, any>,
  item: string,
  arr: Record<string, any>[],
  cascadePageSelectConfig: any,
) => {
  const configDataOptions = _get(configData, `${item}.selectOptions`, []);
  if (!configDataOptions.length) {
    return configData;
  }
  const selectOptions = configDataOptions.map(
    (cur: { label: any; value: any; cascadePageSelectConfig: any }) => {
      return {
        label: cur.label,
        value: cur.value,
        cascadepageselectsonfig: cur.cascadePageSelectConfig,
      };
    },
  );
  arr.push({
    [item]: {
      ...configData[item],
      selectOptions,
    },
  });
  arr.forEach((ite) => {
    Object.keys(ite).forEach((v) => {
      cascadePageSelectConfig[v] = ite[v];
    });
  });

  return cascadePageSelectConfig;
};

const CloudMapApplication = () => {
  const solution = _get(history, 'location.query.solution', '');
  const search = _get(history, 'location.query.searcherType', 'FUND');
  const [plan, setPlan] = useState(''); // 查询方案value
  const [scale, setScale] = useState(''); // 面积
  const [colors, setColors] = useState(''); // 颜色, setColors
  const [count, setCount] = useState(''); // 数值, setCount
  const [searchFieldConfig, setSearchFieldConfig] = useState<any>(); //查询方案
  const [queryCondition, setQueryCondition] = useState<any>(); // 查询方案对应条件
  const [cloudChartData, setCloudChartData] = useState([]); // 云图数据
  const [pageSize, setPageSize] = useState<string | number>(100); // 页面显示数量
  const [loading, setLoading] = useState(false); //加载
  const [searchType, setSearchType] = useState('FUND'); //类型
  const [defaultValue, setDefaultValue] = useState(''); //默认value；
  const [min, setMin] = useState({ value: -4, showValue: '-4' }); //最小
  const [max, setMax] = useState({ value: 4, showValue: '4' }); //最大

  useEffect(() => {
    if (search && solution) {
      setSearchType(search);
      setPlan(solution);
    }
  }, [search, solution]);

  const searcherType = [
    {
      label: '基金产品',
      value: 'FUND',
      isLeaf: false,
      children: _get(searchFieldConfig, 'querySolutions.selectOptions', []),
    },
    {
      label: '基金经理',
      value: 'FUND_MANAGER',
      isLeaf: false,
      children: _get(searchFieldConfig, 'querySolutions.selectOptions', []),
    },
    {
      label: '基金公司',
      value: 'FUND_CORP',
      isLeaf: false,
      children: _get(searchFieldConfig, 'querySolutions.selectOptions', []),
    },
  ];

  // 查询方案数据获取
  useEffect(() => {
    (async () => {
      const data = await queryPageSearchConfig({
        searchExecutorName: 'saleInfo',
        searchFieldConfigParams: { searcherType: searchType },
      });
      let searchFieldConfigData = {};
      const searchArr: Record<string, any>[] = [];

      if (Object.keys(data).length) {
        const fieldConfig = _get(data, 'searchFieldConfig', {});
        Object.keys(fieldConfig).forEach((item) => {
          const options = _get(data, `searchFieldConfig[${item}].selectOptions`, []);
          if (options.length) {
            searchFieldConfigData = setCascadepageselectsonfig(
              data.searchFieldConfig,
              item,
              searchArr,
              searchFieldConfigData,
            );
          }
        });

        setSearchFieldConfig(searchFieldConfigData);
      } else {
        message.warning('没有查询方案');
      }
    })();
  }, [searchType]);

  // 获取云图数据点击查询
  const cloudImageQuery = useCallback(
    (pageSizes: number | string) => {
      if (scale && colors && count) {
        (async () => {
          setLoading(true);
          const res = await queryChartData({
            businessParams: {
              solution: plan,
              area: scale,
              color: colors,
              numValue: count,
            },
            searchExecutorName: 'saleInfo',
          });
          if (pageSizes === 'all') {
            setCloudChartData(res);
          } else {
            const newRes = res.map(
              (item: { children: any; fieldLabelConfig: any; title: any; code: any }) => {
                const listChildren = item.children.slice(0, pageSizes);
                return {
                  fieldLabelConfig: item.fieldLabelConfig,
                  name: item.title,
                  code: item.code,
                  children: listChildren,
                };
              },
            );
            setCloudChartData(newRes);
          }
          setLoading(false);
        })();
      } else {
        message.warning('当前条件不满足');
        setCloudChartData([]);
      }
    },
    [plan, scale, colors, count],
  );

  useEffect(() => {
    if (scale && colors && count) {
      cloudImageQuery(pageSize);
    }
  }, [defaultValue]);

  // 条件选项数据
  const queryConditionFun = (value: any) => {
    const selectOptions = _get(searchFieldConfig, 'querySolutions.selectOptions', []);
    const queryConditionData = selectOptions.find((item: { value: any }) => {
      return item.value === value;
    });

    let cascadePageSelectConfig = {};
    const arr: Record<string, any>[] = [];
    if (queryConditionData) {
      if (Object.keys(queryConditionData).length) {
        const cascadepageselectsonfig = _get(queryConditionData, 'cascadepageselectsonfig', {});
        Object.keys(cascadepageselectsonfig).forEach((item) => {
          const selectoptions = _get(
            queryConditionData,
            `cascadepageselectsonfig[${item}].selectOptions`,
            [],
          );

          if (search && solution) {
            setDefaultValue(selectoptions[0]?.value);
            setScale(selectoptions[0]?.value);
            setColors(selectoptions[0]?.value);
            setCount(selectoptions[0]?.value);
          }

          if (selectoptions.length) {
            cascadePageSelectConfig = setCascadepageselectsonfig(
              queryConditionData.cascadepageselectsonfig,
              item,
              arr,
              cascadePageSelectConfig,
            );
          } else {
            setScale('');
            setColors('');
            setCount('');
          }
        });
        setQueryCondition(cascadePageSelectConfig);
      }
    }
  };

  const getNum = useCallback((small: number, large: number) => {
    setMin(small);
    setMax(large);
  }, []);

  useEffect(() => {
    queryConditionFun(solution);
  }, [search, solution, searchFieldConfig]);

  const onChange = (value: string[] = []) => {
    setQueryCondition([]);
    setSearchType(value[0] || 'FUND');
    queryConditionFun(value[1] || '');
    setPlan(value[1] || '');
    setCloudChartData([]);
  };

  // select Change方法
  const selectOptionChange = (key: string, value: React.SetStateAction<string>) => {
    if (key === 'area') {
      setScale(value);
    } else if (key === 'color') {
      setColors(value);
    } else if (key === 'numValue') {
      setCount(value);
    }
  };

  return (
    <ProCard ghost gutter={[8, 8]} style={{ padding: '12px' }} direction="column" size="small">
      <ProCard ghost direction="column">
        <ProCard bordered>
          <div className="header">
            <div className="select_criteria">
              <Row gutter={[8, 8]} align="middle" style={{ display: 'flex', paddingTop: '10px' }}>
                {searchFieldConfig ? (
                  <Col style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}>
                    <Form.Item
                      label={_get(searchFieldConfig, `querySolutions.fieldName`, '查询方案')}
                    >
                      {searchType && plan ? (
                        <Cascader
                          style={{ minWidth: 150 }}
                          value={[searchType, plan]}
                          options={searcherType}
                          onChange={onChange}
                          changeOnSelect
                        ></Cascader>
                      ) : (
                        <Cascader
                          style={{ minWidth: 150 }}
                          options={searcherType}
                          onChange={onChange}
                          changeOnSelect
                        ></Cascader>
                      )}
                    </Form.Item>
                  </Col>
                ) : null}
                {queryCondition
                  ? Object.keys(queryCondition).map((v) => {
                      if (!queryCondition[v]?.selectOptions.length) {
                        message.warning('当前没有查询方案');
                      }
                      return (
                        <Col
                          key={v}
                          style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}
                        >
                          <Form.Item
                            tooltip={
                              _get(queryCondition, `[${v}].fieldCode`, '') === 'color'
                                ? '当前指标会显示在下方色块上'
                                : ''
                            }
                            label={_get(queryCondition, `[${v}].fieldName`, '')}
                          >
                            <Select
                              onChange={(value) => {
                                selectOptionChange(v, value);
                              }}
                              key={defaultValue}
                              defaultValue={defaultValue}
                              style={{ width: 150 }}
                              options={_get(queryCondition, `[${v}].selectOptions`, [])}
                            />
                          </Form.Item>
                        </Col>
                      );
                    })
                  : null}
                <Col style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}>
                  <Form.Item label="页面展示数量">
                    <Select
                      defaultValue={paging[0].value}
                      onChange={(value) => {
                        setPageSize(value);
                      }}
                      style={{ width: 150 }}
                      options={paging}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </div>
            <div className="searchButton">
              <Button
                onClick={() => {
                  cloudImageQuery(pageSize);
                }}
                style={{ marginLeft: '20px' }}
                type="primary"
              >
                查询
              </Button>
            </div>
          </div>
        </ProCard>
        <Spin
          spinning={loading}
          delay={300}
          style={{ width: '100%', height: 'calc( 100vh - 150px)' }}
        >
          <ProCard
            style={{
              width: '100%',
              height: 'calc( 100vh - 150px)',
            }}
          >
            {cloudChartData.length ? (
              <>
                <CloudChart
                  planType={searchType}
                  getNum={getNum}
                  cloudChartData={cloudChartData}
                ></CloudChart>
                <div className="legend">
                  <div>{max.value < 0 ? 'max' : '+' + max.showValue}</div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div>0</div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div>{min.value > 0 ? 'min' : min.showValue}</div>
                </div>
              </>
            ) : (
              <Empty
                style={{
                  width: '100%',
                  height: 'calc(100% - 100px)',
                  padding: '0',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            )}
          </ProCard>
        </Spin>
      </ProCard>
    </ProCard>
  );
};

export default CloudMapApplication;
