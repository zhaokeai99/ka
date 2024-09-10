import ProCardPlus from '@/components/ProCardPlus';
import { cardGutter, contentPadding } from '@/themes';
import ProCard from '@ant-design/pro-card';
import React, { useCallback, useEffect, useState } from 'react';
import LabelTree from './LabelTree';
import { Tooltip, Collapse, message, Empty, Spin } from 'antd';
import TabTable from './TabTable';
import './index.less';
import { Link } from 'umi';
import { CaretRightOutlined } from '@ant-design/icons';
import Screen from './Components/AdvancedScreen';
import RightHeader from './rightHeader';
import {
  familyTree,
  flatTree,
  queryLastWkDayByNow,
  // familyTree,
  queryModelTagList,
  queryReport,
  saveTemplate,
  setParamJson,
  TransformParams,
  transOptions,
  unique,
} from './service';
import { findIndex as _findIndex } from 'lodash';
// import SelectedLabel from './SelectedLabel';
import TemplateTree from './TemplateTree';
import moment from 'moment';

const { Panel } = Collapse;

const config = [
  {
    key: 'RULE_FEATURE',
    tab: '规则特征',
  },
  {
    key: 'BUSINESS_TEMPLATE',
    tab: '业务模板',
  },
  {
    key: 'MY_TEMPLATE',
    tab: '我的模板',
  },
];
const exRatingColumns = [
  {
    title: '外部主体评级',
    dataIndex: 'rating',
    key: 'rating',
  },
  {
    title: '数量',
    dataIndex: 'number',
    key: 'number',
    align: 'right',
  },
  {
    title: '在库个数',
    dataIndex: 'inpool',
    key: 'inpool',
    align: 'right',
  },
  {
    title: '转债持仓',
    dataIndex: 'convertible',
    key: 'convertible',
    align: 'right',
  },
  {
    title: '信用持仓',
    dataIndex: 'credit',
    key: 'credit',
    align: 'right',
  },
];
const ratingColumns = [
  {
    title: '内部主体评级',
    dataIndex: 'rating',
    key: 'rating',
  },
  {
    title: '数量',
    dataIndex: 'number',
    key: 'number',
    align: 'right',
  },
  {
    title: '转债持仓',
    dataIndex: 'convertible',
    key: 'convertible',
    align: 'right',
  },
  {
    title: '信用持仓',
    dataIndex: 'credit',
    key: 'credit',
    align: 'right',
  },
];
const holdPositionColumns = [
  {
    title: '风险主体持仓账户分布',
    dataIndex: 'fundType',
    key: 'fundType',
  },
  {
    title: '账户分布',
    dataIndex: 'number',
    key: 'number',
    align: 'right',
  },
  {
    title: '信披口径持仓债券只数',
    dataIndex: 'credit',
    key: 'credit',
    align: 'right',
  },
  {
    title: '重仓债券只数（超5%）',
    dataIndex: 'heavily',
    key: 'heavily',
    align: 'right',
  },
];

const overallMarketPlayers = [
  {
    title: '外部主体',
    key: 'exRatingResult',
    columns: exRatingColumns,
  },
  {
    title: '内部主体',
    key: 'ratingResult',
    columns: ratingColumns,
  },
];
const hldingAccountResultColums = [
  {
    title: '持仓账户结果',
    key: 'hldingAccountResult',
    columns: holdPositionColumns,
  },
];

const PrincipalMarket = () => {
  const [tabs, setTabs] = useState('RULE_FEATURE');
  const [activeKey, setActiveKey] = useState<any[]>(['1', '2', '3']);
  const [fieldArr, setField] = useState<any[]>([]); //添加字段集
  const [treeData, setTreeData] = useState<any[]>([]);
  const [tableInfoStr, setTableInfoStr] = useState<any[]>([]); //已选分区字段
  // const [ifRenewal, setIfRenewel] = useState(false);
  const [tableInfo, setTableInfo] = useState<any[]>([]);
  const [datas, setData] = useState<any[]>([]);
  const [dataModelId, setDataModelId] = useState('');
  const [visible, setVisible] = useState<boolean>(false);
  const [newParamsJson, setNewParamsJson] = useState<any[]>([]);
  const [ifSuccess, setIfSuccess] = useState(false);
  const [date, setDate] = useState(moment(new Date()).subtract(1, 'days').format('YYYY-MM-DD')); //查询日期
  const [focusOn, setFocusOn] = useState<any[]>([]); //重点关注主体分析
  const [bondFocus, setBondFocus] = useState<any[]>([]); //风险债券账户持仓情况
  const [list, setList] = useState<any>({}); //查询结果
  const [loading, setLoading] = useState(false);

  const [filterStr, setFilterStr] = useState({
    combinator: 'and',
    not: false,
    rules: [],
  });
  const [field, setFieldArr] = useState<any[]>([
    {
      alias: '业务日期',
      columnAttributeType: 'STRING',
      columnName: 'l_date',
      enumData: null,
      id: 4,
      ifPartition: 'Y',
      ifPrimaryKey: 'N',
      ifRequired: 'N',
      key: 'field4',
      parentKey: null,
      tableName: 't_data_bond_subject',
      tagId: 1,
      title: '业务日期',
    },
  ]); //已选标签

  const [newTableInfo, setNewTableInfo] = useState<any[]>([]);
  const [newData, setNewData] = useState<any[]>(tableInfoStr);

  /* 暂时不展示 已选标签页面 */
  //tableInfoJson
  useEffect(() => {
    setNewTableInfo((prev) => {
      let info: any[] = [];
      info = fieldArr?.map((item) => {
        let tagId = '';
        field.forEach((i) => {
          if (i?.tableName === item?.tableName) {
            tagId = i.tagId;
          }
        });
        const value: any = familyTree(treeData, item?.tagId || tagId);
        return {
          dataColumn: item?.columnName || item?.dataColumn,
          paramName: item?.alias,
          alias: item?.alias,
          dataType: item?.columnAttributeType,
          dataValue: date,
          tableName: value?.tableName || item.tableName,
          tableColumnName: value?.name || item.tableColumnName,
        };
      });
      info?.map((item) => {
        prev?.forEach((cur: { dataColumn: any; tableName: any }) => {
          const i = _findIndex(info, { dataColumn: cur.dataColumn, tableName: cur.tableName });
          if (item.dataColumn === cur.dataColumn && item.tableName === cur.tableName) {
            info[i] = item;
          }
        });
      });
      return info;
    });
    //  inputColumn, inputValue,
  }, [fieldArr, treeData, date, field]);

  useEffect(() => {
    setData(newData);
    setTableInfo(newTableInfo);
  }, [newTableInfo, newData, date]);

  // 标签数据
  useEffect(() => {
    setNewData(unique(newTableInfo));
    // , inputColumn, inputValue
  }, [fieldArr, newTableInfo, date]);

  // 返回分区字段
  useEffect(() => {
    if (newData) {
      if (field?.tableName) {
        const tableinfo = flatTree(
          newData.map((item: { tableName: any; tagId: any }) => {
            let tagId = '';
            field.map((i: { tableName: any; tagId: string }) => {
              if (i?.tableName === item?.tableName) {
                tagId = i.tagId;
              }
            });
            const value: any = familyTree(treeData, item?.tagId || tagId);
            return {
              ...item,
              tableColumnName: value.tableColumnName,
            };
          }) || [],
        );
        setTableInfo(tableinfo);
        setField(tableinfo);
      }
    }
  }, [newData, field, date]);
  /* 暂时不展示 已选标签页面 */

  useEffect(() => {
    (async () => {
      const res = await queryLastWkDayByNow({});
      setDate(res);
    })();
  }, []);

  useEffect(() => {
    if (date) {
      setFocusOn([
        {
          title: '序号',
          dataIndex: 'company_id',
          key: 'company_id',
        },
        {
          title: '主体名称',
          dataIndex: 'companyname',
          key: 'companyname',
          render: (name: string, item: any) => {
            return (
              <Tooltip title={item.company_id}>
                <Link
                  to={`/investment/creditRisks/details/${item.company_id}`}
                  className="text-ellipsis"
                >
                  {name}
                </Link>
              </Tooltip>
            );
          },
        },
        {
          title: '内部评级',
          dataIndex: 'rating',
          key: 'rating',
        },
        {
          title: '外部评级',
          dataIndex: 'ex_rating',
          key: 'ex_rating',
        },
        {
          title: '是否持仓',
          dataIndex: 'has_hold',
          key: 'has_hold',
          render: (name: number) => {
            return <Tooltip title={name}>{name === 0 ? '否' : '是'}</Tooltip>;
          },
        },
      ]);
      setBondFocus([
        {
          title: '基金名称',
          dataIndex: 'fundName',
          key: 'fundName',
          render: (name: string, item: any) => (
            <Tooltip title={item.fundCode}>
              <Link to={`/production/index/newDetail/${item.fundCode}`} className="text-ellipsis">
                {name}
              </Link>
            </Tooltip>
          ),
        },
        {
          title: '主体名称',
          dataIndex: 'companyname',
          key: 'companyname',
          render: (name: string, item: any) => (
            <Tooltip title={item.company_id}>
              <Link
                to={`/investment/creditRisks/details/${item.company_id}`}
                className="text-ellipsis"
              >
                {name}
              </Link>
            </Tooltip>
          ),
        },
        {
          title: '主体评级',
          dataIndex: 'ex_rating',
          key: 'ex_rating',
        },
        {
          title: '内部评级',
          dataIndex: 'rating',
          key: 'rating',
        },
        {
          title: '持仓',
          dataIndex: 'bondName',
          key: 'bondName',
        },
        {
          title: '基金净值百分比',
          dataIndex: 'bondRate',
          key: 'bondRate',
        },
        {
          title: '市值排名',
          dataIndex: 'range',
          key: 'range',
        },
      ]);
    }
  }, [date]);

  useEffect(() => {
    (async () => {
      const result = await queryModelTagList({ modelId: '' });
      setTreeData(transOptions(result || [], 'modelName', 'modelId', 'title', 'key'));
    })();
  }, []);

  // 添加字段
  const handleAddField = useCallback(
    (obj: any, newNodeData: any) => {
      // setIfRenewel(false);
      setField((prev) => {
        let next: any[] = [];
        const prevID = prev?.map((item) => {
          return item.key;
        });

        if (prev.length > 0) {
          if (prevID.indexOf(obj?.primaryArr[0]?.key) === -1) {
            next = prev.concat([...obj.primaryArr]);
          } else {
            next = prev;
          }
        } else {
          next = prev.concat([...obj.primaryArr]);
        }
        return next;
      });

      setFieldArr((prev) => {
        let next: any[] = [];
        const prevID = prev?.map((item) => {
          return item.key;
        });

        if (prev.length > 0) {
          if (prevID.indexOf(newNodeData.key) === -1) {
            next = prev.concat([newNodeData, ...newNodeData.primaryArr]);
          } else {
            next = prev;
            message.warn('该字段已经被选择');
          }
        } else {
          next = prev.concat([newNodeData, ...newNodeData.primaryArr]);
        }
        return next;
      });
    },
    [treeData],
  );

  // 获取filterJson
  const getFilterJson = (filterJson: any, tableInfoJson: any, data: any, fieldJson: any) => {
    if (filterJson) {
      setFilterStr(JSON.parse(filterJson));
    } else {
      setFilterStr({
        combinator: 'and',
        not: false,
        rules: [],
      });
    }
    if (data) {
      setDataModelId(data?.modelId || '');

      if (data?.paramJson) {
        setNewParamsJson(JSON.parse(data?.paramJson));
      }
    }
    setTableInfoStr(tableInfoJson ? JSON.parse(tableInfoJson) : []);
    setFieldArr(fieldJson ? JSON.parse(fieldJson) : []);
  };

  // 一键清空
  // const handleEliminate = useCallback((e: any) => {
  //   e.stopPropagation();
  //   setField([]);
  //   setFilterStr({
  //     combinator: 'and',
  //     not: false,
  //     rules: [],
  //   });
  // }, []);

  useEffect(() => {
    const flatParamJson = setParamJson(filterStr.rules);
    setNewParamsJson(() => {
      const jsonArr = flatParamJson?.map((item) => {
        const k = _findIndex(field, { columnName: item.field });
        const obj = {
          tableName: field[k]?.tableName || '',
          paramName: item.field || '',
          dataType: field[k]?.columnAttributeType || '',
          dataValue:
            field[k]?.columnAttributeType === 'DATE'
              ? moment(item.value).format('YYYYMMDD')
              : item.value || '',
        };
        return obj;
      });
      const i = _findIndex(jsonArr, { tableName: 't_data_company_financial' });
      const j = _findIndex(jsonArr, {
        tableName: 't_data_company_financial',
        paramName: 'report_period',
      });
      if (i !== -1) {
        if (j !== -1) {
          if (!jsonArr[j].dataValue) {
            jsonArr[j].dataValue = moment(moment().add(-1, 'y').format('YYYY'))
              .endOf('year')
              .format('YYYYMMDD');
          }
        } else {
          jsonArr.push({
            tableName: 't_data_company_financial',
            paramName: 'report_period',
            dataType: 'STRING',
            dataValue: moment(moment().add(-1, 'y').format('YYYY'))
              .endOf('year')
              .format('YYYYMMDD'),
          });
        }
      }

      return jsonArr;
    });
  }, [field, filterStr]);

  useEffect(() => {
    setField([
      {
        alias: '业务日期',
        columnAttributeType: 'STRING',
        columnName: 'l_date',
        enumData: null,
        id: 4,
        ifPartition: 'Y',
        ifPrimaryKey: 'N',
        ifRequired: 'N',
        key: 'field4',
        parentKey: null,
        tableName: 't_data_bond_subject',
        tagId: 1,
        title: '业务日期',
        tableColumnName: '债券主体明细',
      },
    ]);
  }, []);

  // 保存模板
  const handleHold = useCallback(
    async (name) => {
      if (name) {
        const { success, msg }: any = await saveTemplate({
          systemFlag: tabs === 'BUSINESS_TEMPLATE' ? 'Y' : 'N',
          filterJson: TransformParams(field, filterStr),
          name: name,
          modelId: dataModelId || '1',
          paramJson: [
            {
              tableName: '',
              paramName: 'queryDate',
              dataType: 'string',
              dataValue: date,
            },
            ...newParamsJson,
          ],
          fieldJson: field,
          tableInfoJson: datas,
          tableRelationJson:
            datas.length > 1
              ? [
                  {
                    mainTableName: 't_data_bond_subject',
                    mainTableColumn: 'l_date',
                    subTableName: 't_data_company_financial',
                    subTableColumn: 'l_date',
                  },
                  {
                    mainTableName: 't_data_bond_subject',
                    mainTableColumn: 'comp_id',
                    subTableName: 't_data_company_financial',
                    subTableColumn: 's_info_compcode',
                  },
                ]
              : [],
        });
        if (success) {
          setVisible(false);
          message.success('模板保存成功');
        } else {
          setVisible(false);
          message.error(msg || '模板保存失败');
        }
        setIfSuccess(success);
      }
    },
    [filterStr, tabs, tableInfo, datas, date, newParamsJson],
  );

  // 查询日期
  const onDateChange = (value: any, dateString: any) => {
    setDate(moment(dateString).format('YYYYMMDD'));
  };
  const queryScreen = useCallback(async () => {
    setLoading(true);
    const { data }: any = await queryReport({
      filterJson: filterStr.rules?.length ? TransformParams(field, filterStr) : {},
      modelProcessorMode: 'DYNAMIC',
      modelId: dataModelId || '1',
      paramJson: [
        {
          tableName: '',
          paramName: 'queryDate',
          dataType: 'STRING',
          dataValue: date,
        },
        ...newParamsJson,
      ],
      tableInfoJson: datas,
      tableRelationJson:
        datas.length > 1
          ? [
              {
                mainTableName: 't_data_bond_subject',
                mainTableColumn: 'l_date',
                subTableName: 't_data_company_financial',
                subTableColumn: 'l_date',
              },
              {
                mainTableName: 't_data_bond_subject',
                mainTableColumn: 'comp_id',
                subTableName: 't_data_company_financial',
                subTableColumn: 's_info_compcode',
              },
            ]
          : [],
    });
    setLoading(false);
    setList(data);
  }, [filterStr, tabs, tableInfo, datas, date, newParamsJson]);

  return (
    <ProCard ghost size="small" gutter={[cardGutter, 0]} style={{ padding: contentPadding }}>
      <ProCard split="vertical" bordered={false} gutter={[cardGutter, 0]}>
        <ProCard
          ghost
          bordered={false}
          style={{ minHeight: '900px' }}
          colSpan={'280px'}
          size="small"
        >
          <ProCard
            ghost
            tabs={{
              activeKey: tabs,
              onChange: (key) => {
                setTabs(key);
              },
            }}
          >
            {config.map(({ tab, key }) => {
              if (tab === '规则特征') {
                return (
                  <ProCard.TabPane tab={tab} key={key} style={{ marginTop: 0 }}>
                    <LabelTree onAddOrdinaryField={handleAddField} tab={tab} />
                  </ProCard.TabPane>
                );
              } else {
                return (
                  <ProCard.TabPane tab={tab} key={key} style={{ marginTop: 0 }}>
                    <TemplateTree
                      getFilterJson={getFilterJson}
                      onAddOrdinaryField={handleAddField}
                      ifSuccess={ifSuccess}
                      tab={tab}
                    />
                  </ProCard.TabPane>
                );
              }
            })}
          </ProCard>
        </ProCard>
        <ProCard
          direction="column"
          colSpan={'calc(100% - 280px)'}
          style={{ minHeight: '900px' }}
          ghost
        >
          {date ? (
            <RightHeader
              field={field}
              visible={visible}
              date={date}
              queryScreen={queryScreen}
              getVisible={setVisible}
              onDateChange={onDateChange}
              handleHold={handleHold}
            />
          ) : (
            ''
          )}
          <Collapse
            expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
            activeKey={activeKey}
            onChange={(activeKeys: any) => setActiveKey(activeKeys)}
            ghost
          >
            <Panel
              header="高级筛查"
              key="1"
              extra={<a>{activeKey.indexOf('1') > -1 ? '收起' : '展开'}</a>}
            >
              <Screen filterStr={filterStr} setFilterStr={setFilterStr} field={field} />
            </Panel>
            {/* <Panel
              header="已选分区字段"
              key="2"
              extra={
                <>
                  <a style={{ marginRight: 8 }} onClick={handleEliminate}>
                    一键清空
                  </a>
                  <a>{activeKey.indexOf('2') > -1 ? '收起' : '展开'}</a>
                </>
              }
            >
              <div className="tag">
            <SelectedLabel
                  fieldArr={fieldArr}
                  field={field}
                  getIfRenewel={setIfRenewel}
                  ifRenewel={ifRenewal}
                  date={date}
                  setField={setField}
                  getTableInfo={setTableInfo}
                  getData={setData}
                  tableInfoJson={tableInfoStr}
                  treeData={treeData}
                /> 
            </div> 
            </Panel> */}
            <Panel
              header="查询结果"
              key="3"
              extra={<a>{activeKey.indexOf('3') > -1 ? '收起' : '展开'}</a>}
            >
              <div className="proCard">
                <Spin spinning={loading}>
                  <ProCardPlus
                    title="全市场主体情况"
                    direction="column"
                    style={{ padding: '0', marginBottom: '10px' }}
                  >
                    <ProCardPlus style={{ padding: '0' }}>
                      {overallMarketPlayers.map((item) => {
                        return (
                          <ProCard colSpan={'50%'} style={{ padding: '0', margin: '0 5px' }}>
                            <TabTable
                              columns={item.columns}
                              bordered={true}
                              noPage={true}
                              data={list ? list[item.key] : []}
                            />
                          </ProCard>
                        );
                      })}
                    </ProCardPlus>
                    <ProCardPlus style={{ padding: '0' }}>
                      {hldingAccountResultColums.map((item) => {
                        return (
                          <ProCard style={{ padding: '0', margin: '0 5px' }}>
                            <TabTable
                              columns={item.columns}
                              bordered={true}
                              noPage={true}
                              data={list ? list[item.key] : []}
                            />
                          </ProCard>
                        );
                      })}
                    </ProCardPlus>
                  </ProCardPlus>
                  <ProCardPlus title="重点关注主体分析" style={{ marginBottom: '10px' }}>
                    {focusOn.length ? (
                      <ProCard>
                        <TabTable columns={focusOn} data={list?.focusOnResult || []} />
                      </ProCard>
                    ) : (
                      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    )}
                  </ProCardPlus>
                  <ProCardPlus title="风险债券账户持仓情况" style={{ marginBottom: '10px' }}>
                    {bondFocus.length ? (
                      <ProCard>
                        <TabTable columns={bondFocus} data={list?.hldingBondResult || []} />
                      </ProCard>
                    ) : (
                      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    )}
                  </ProCardPlus>
                </Spin>
              </div>
            </Panel>
          </Collapse>
        </ProCard>
      </ProCard>
    </ProCard>
  );
};
export default PrincipalMarket;
