import React, { memo, useCallback, useEffect, useRef, useState, useContext } from 'react';
import { Button, Col, Form, message, Space, Tag, Tooltip } from 'antd';
import ProCard from '@ant-design/pro-card';
import { history } from 'umi';
import {
  exportAllFundInfos,
  queryFundMarkData,
  queryParams,
  exportFundInfosById,
} from '../../service';
import IndexDetailForm from '../IndexDetailForm';
import PopTreeTransfer from '@/components/PopTreeTransfer';
import SearchScheme from '../SearchScheme';
import TagLabelModal from '../TagLabelModal';
import DataManagementModal from '../DataManagement';
import { keys as _keys, find as _find } from 'lodash';
import useAuth from '@/components/Hooks/useAuth';
import { TabLayoutContext } from '@/components/thfund-front-component/src';

import styles from './index.less';

// path 后期会有调整
const pkUrlMap = {
  FUND: '/production/summary/fundPk/_single_/',
  FUND_MANAGER: '/production/summary/managerPk/_single_/',
  FUND_CORP: '/production/summary/companyPk/_single_/',
};
const pkKeyMap = {
  FUND: 'fund_result_tag_fund',
  FUND_MANAGER: 'fund_result_tag_manger',
  FUND_CORP: 'fund_result_tag_corp',
};
export type SearchFormProps = {
  onFinish: any | {};
  onlyResultTagChange: any | {};
  searcherType: string;
  fundPkList?: any[];
  initSchemeId?: string;
};

let exportDataTimer: NodeJS.Timeout;

const SearchForm: React.FC<SearchFormProps> = ({
  onFinish,
  searcherType,
  fundPkList,
  initSchemeId,
  onlyResultTagChange,
}) => {
  const [collapsed, setCollapsed] = useState(true);
  const [exportLoading, setExportLoading] = useState(false);

  // 筛选标签库
  const [allParams, setAllParams] = useState([]);
  const [defaultParams, setDefaultParams] = useState([]);
  const [useDefaultParams, setUseDefaultParams] = useState(false);
  const [paramTags, setParamTags] = useState([]);
  // 高级搜索表单列表
  const [paramValues, setParamValues] = useState({});

  // 列展示标签库
  const [allResults, setAllResults] = useState([]);
  const [resultTags, setResultTags] = useState([]);
  const [defaultResults, setDefaultResults] = useState();
  const [useDefaultResult, setUseDefaultResult] = useState(false);

  // 配置管理修改
  const [allParamsChange, setAllParamsChange] = useState(false);
  const [allResultsChange, setAllResultsChange] = useState(false);

  // 标签库--表单项数据
  const [markTree, setMarkTree] = useState([]);
  const [isSchemeChange, setIsSchemeChange] = useState(true);

  const [tagModal, setTagModal] = useState(null);
  const [tagManageVisible, setTagManageVisible] = useState(false);
  const [checkedScheme, setCheckedScheme] = useState(false);
  const formRef = useRef();
  const operateShow = useAuth({ sn: '__production_hotFundIndex__tagManage___editButton' });

  const { trigger } = useContext(TabLayoutContext);

  // localStorage用于基金pk
  const setPkLocal = useCallback(
    (tags) => {
      localStorage.setItem(pkKeyMap[searcherType], JSON.stringify(tags));
    },
    [searcherType],
  );

  const rangeParamTags = (paramsList: []) => {
    const noRemoveList = paramsList.filter(({ noRemove }) => !!noRemove);
    const removeList = paramsList.filter(({ noRemove }) => !noRemove);
    setParamTags([...noRemoveList, ...removeList]);
  };
  const rangeResultTags = (resultList: []) => {
    const noRemoveList = resultList.filter(({ supportResult: { disabled } }) => !!disabled);
    const removeList = resultList.filter(({ supportResult: { disabled } }) => !disabled);
    setResultTags([].concat(noRemoveList, removeList));
  };

  // 查询所有列项
  const queryParamsInfo = async () => {
    const data = await queryParams({ searcherType });

    // 初始化筛选项
    const allParamsList = data
      .filter((i) => !!i.supportQuery)
      .map((i) => {
        const { supportQuery } = i;
        return { ...i, desc: supportQuery.desc, noRemove: !!supportQuery?.disabled };
      });
    setAllParams(allParamsList);
    const initParamsList = allParamsList.filter((d) => d?.supportQuery?.isChecked);
    const initParamsValues = {};
    initParamsList?.forEach(({ colName, value }) => {
      if (!!colName && (!!value || value === 0)) {
        initParamsValues[colName] = value;
      }
    });
    setParamValues(initParamsValues);
    setDefaultParams(initParamsList);
    rangeParamTags(initParamsList);

    // 初始化展示列项
    const allResultList = data
      .filter((d) => !!d.supportResult)
      .map((i) => {
        const { supportResult } = i;
        return { ...i, desc: supportResult.desc, noRemove: !!supportResult?.disabled };
      });
    const initResultList = allResultList.filter((d) => d?.supportResult?.isChecked);
    setAllResults(allResultList);
    rangeResultTags(initResultList);
    setDefaultResults(initResultList);

    // 获取初始化列表
    onFinish({
      params: [...initParamsList],
      results: initResultList,
    });
    setPkLocal(initResultList);
  };

  // 查询所有列项
  const queryAllTags = async () => {
    // 没有选中查询方案时 需要初始化所有
    if (!checkedScheme) {
      queryParamsInfo();
    } else {
      // 选中查询方案时 仅仅更新所有列项与筛选项对显示
      const data = await queryParams({ searcherType });

      // 初始化筛选项
      const allParamsList = data
        .filter((i) => !!i.supportQuery)
        .map((i) => {
          const { supportQuery } = i;
          return { ...i, desc: supportQuery.desc, noRemove: !!supportQuery?.disabled };
        });
      setAllParams(allParamsList);

      // 初始化展示列项
      const allResultList = data
        .filter((d) => !!d.supportResult)
        .map((i) => {
          const { supportResult } = i;
          return { ...i, desc: supportResult.desc, noRemove: !!supportResult?.disabled };
        });
      setAllResults(allResultList);
    }
  };

  // 查询基金标签树 用于标签池表单项
  const queryFundMarkInfo = async () => {
    const data = await queryFundMarkData();
    setMarkTree(data);
  };

  useEffect(() => {
    queryParamsInfo();
    queryFundMarkInfo();
    return () => {
      localStorage.removeItem(pkKeyMap[searcherType]);
      clearTimeout(exportDataTimer);
    };
  }, []);

  // 保存方案 或者 查询时 处理params数据
  const getParamsList = () => {
    return paramTags.map((item) => {
      if (item?.selfType === 1 || item?.selfType === 2) {
        _keys(paramValues).map((paramKey) => {
          const [paramName, index] = paramKey.split('--');
          if (paramName === item.colName) {
            const { extInfo = {} } = item;
            const { valueList = [] } = extInfo;
            valueList[index - 0] = valueList[index - 0] || {};
            valueList[index - 0].value = paramValues[paramKey];
            return {
              ...item,
              extInfo: { ...extInfo },
            };
          }
        });
      }
      return {
        ...item,
        value: paramValues[item.colName],
      };
    });
  };

  // 点击查询
  const handleFormFinish = useCallback(() => {
    onFinish({
      params: getParamsList(),
      results: resultTags,
    });
    setPkLocal(resultTags);
  }, [paramTags, paramValues, resultTags]);

  // 高级表单变化
  const handleFormChange = (values) => {
    setParamValues({ ...paramValues, ...values });
    setIsSchemeChange(false);
  };
  // 逻辑标签库改变
  const handleResultTagsChange = (tags) => {
    rangeResultTags(tags);
    setIsSchemeChange(false);
  };
  // 筛选标签库改变
  const handleFilterChange = (tags) => {
    formRef?.current?.resetFields();
    rangeParamTags(tags);
    setIsSchemeChange(false);
  };

  // 选择已保存方案 或 清除已选择方案
  const handleSchemeChange = ({ params, results }, schemeFlag) => {
    formRef?.current?.resetFields();

    const paramList = params?.length >= 1 ? params : defaultParams;
    const paramsValues = {};

    paramList.map((param) => {
      paramsValues[param.colName] = param.value;
    });

    setParamValues(paramsValues);
    rangeParamTags(paramList);

    setUseDefaultResult(results?.length >= 1 ? false : true);
    setUseDefaultParams(params?.length >= 1 ? false : true);
    rangeResultTags(results?.length >= 1 ? results : defaultResults);
    setIsSchemeChange(true);
    setCheckedScheme(schemeFlag);
    // 切换方案时刷新列表
    onFinish({
      params: paramList.map((item) => {
        return {
          ...item,
          value: paramsValues[item.colName] || item.value,
        };
      }),
      results: results?.length >= 1 ? results : defaultResults,
    });
    setPkLocal(results?.length >= 1 ? results : defaultResults);
  };

  const exportData = async (fileId: string) => {
    const { success, data, errorMsg } = await exportFundInfosById({ fileId });
    const { desc, total, index, url } = data || {};
    if (success) {
      if (total === index) {
        if (url) {
          message.success('下载成功');
          window.location.href = url;
        } else {
          message.error(desc || '系统错误请稍后重试');
        }
        setExportLoading(false);
      } else {
        exportDataTimer = setTimeout(() => {
          exportData(fileId);
        }, 1500);
      }
    } else {
      setExportLoading(false);
      message.error(errorMsg || '系统错误请稍后重试');
    }
  };
  const handleExport = async () => {
    setExportLoading(true);
    const { success, data, errorMsg } = await exportAllFundInfos({
      searchModel: {
        searcherType,
        results: resultTags,
        params: getParamsList(),
      },
    });
    if (success) {
      exportData(data);
    } else {
      message.error(errorMsg || '系统错误请稍后重试');
    }
  };

  const handleToPk = () => {
    const pkurl = pkUrlMap[searcherType];
    if (!pkurl) {
      message.error('不存在该pk类型，请联系管理员');
    } else {
      history.push(`${pkurl}${fundPkList ? fundPkList.map((i) => i.code).join(',') : ''}`);
      trigger(pkKeyMap[searcherType].toUpperCase());
    }
  };

  const renderFormItems = () => {
    const noRemoveList = getParamsList().filter((i) => !!i.noRemove);
    const removeList = getParamsList().filter((i) => !i.noRemove);

    return (
      <div className={styles['filter-outer']}>
        {/* // 筛选项分为两部分 第一部分不允许去除的 */}
        <div style={{ display: 'flex' }}>
          <div style={{ display: 'flex', width: '100%', flexWrap: 'wrap', background: '#fff' }}>
            <IndexDetailForm
              itemList={noRemoveList}
              onFormChange={handleFormChange}
              markTree={markTree}
            />
          </div>
          <div onClick={() => setCollapsed(!collapsed)} style={{ paddingTop: 5 }}>
            {collapsed ? (
              111
            ) : (
222
            )}
          </div>
        </div>
        {collapsed ? (
          // 筛选项分为两部分 第二部分可以去除在下面
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              background: '#f5f5f5',
              padding: '16px 0',
            }}
          >
            <IndexDetailForm
              itemList={removeList}
              onFormChange={handleFormChange}
              markTree={markTree}
            />
            {allParams?.length >= 1 ? (
              <Col
                {...{ xs: { span: 22 }, sm: { span: 10 }, md: { span: 10 }, lg: { span: 7 } }}
                style={{ margin: '6px 10px 16px' }}
              >
                <PopTreeTransfer
                  dataSource={allParams}
                  selectTags={paramTags}
                  schemeEmpty={useDefaultParams}
                  onChange={handleFilterChange}
                >
                  <a style={{ whiteSpace: 'nowrap' }}>
                    <Space>
                      <span id="fund_index_filter_btn">筛选</span>
                    </Space>
                  </a>
                </PopTreeTransfer>
              </Col>
            ) : null}
          </div>
        ) : null}
      </div>
    );
  };

  const renderTableBar = useCallback(() => {
    return (
      <div style={{ marginTop: 16, background: '#fff', padding: '16px 16px 0' }}>
        <div className={styles['table-bar']}>
          <div>
            对比列表：
            {fundPkList.map((i) => {
              return (
                <Tooltip title={i.name}>
                  <Tag>{(i.name || '').substring(0, 5)}</Tag>
                </Tooltip>
              );
            })}
          </div>
          <Space size={24}>
            <span
              onClick={() => {
                handleToPk();
              }}
            >
              <span className={styles['table-tip-text']}>去对比</span>
            </span>
            <span onClick={() => setTagModal({ params: getParamsList(), searcherType })}>
              <span className={styles['table-tip-text']}>一键打标</span>
            </span>
            <span
              onClick={() => {
                history.push('/data_browser/index');
                // if (REACT_APP_ENV === 'dev' || REACT_APP_ENV === 'test') {
                //   window.open('http://databrowser-test.thfund.com.cn/#/index');
                // } else {
                //   window.open('http://databrowser.thfund.com.cn/#/index');
                // }
              }}
            >
              <span className={styles['table-tip-text']}>数据浏览器</span>
            </span>
            {allResults?.length >= 1 ? (
              <PopTreeTransfer
                dataSource={allResults}
                selectTags={resultTags}
                schemeEmpty={useDefaultResult}
                onChange={handleResultTagsChange}
                onClose={handleFormFinish}
              >
                <a id="fund_index_add_column_show">
                </a>

                <span className={styles['table-tip-text']}>增加列展示</span>
              </PopTreeTransfer>
            ) : null}
            {operateShow ? (
              <span>
                <a
                  // style={{ fontSize: '20px' }}
                  onClick={() => {
                    setTagManageVisible(true);
                  }}
                ></a>
                <span className={styles['table-tip-text']}>配置管理</span>
              </span>
            ) : null}
          </Space>
        </div>
      </div>
    );
  }, [fundPkList, allResults, resultTags]);

  const handleClosesetTagManageModal = (isChanged: boolean) => {
    if (isChanged) {
      queryAllTags();
      setAllParamsChange(true);
      setAllResultsChange(true);
    }
    setTagManageVisible(false);
  };

  useEffect(() => {
    // 只有当配置管理修改列项时触发
    if (allParamsChange) {
      const tagList = paramTags
        ?.map((tag) => {
          const cTag = _find(allParams, ({ colName }) => colName === tag.colName);
          if (!!cTag) {
            return {
              ...tag,
              colDesc: cTag.colDesc,
            };
          } else {
            return null;
          }
        })
        .filter((t) => !!t);
      rangeParamTags(tagList);
      setAllParamsChange(false);
    }
  }, [allParams]);

  useEffect(() => {
    // 只有当配置管理修改列项时触发
    if (allResultsChange) {
      const tagList = resultTags
        ?.map((tag) => {
          const cTag = _find(allResults, ({ colName }) => colName === tag.colName);
          if (!!cTag) {
            return {
              ...tag,
              colDesc: cTag.colDesc,
            };
          } else {
            return null;
          }
        })
        .filter((t) => !!t);
      rangeResultTags(tagList);
      onlyResultTagChange(tagList);
      setAllResultsChange(false);
    }
  }, [allResults]);

  return (
    <>
      <ProCard
        className={styles['search-form-title-container']}
        style={{ marginBottom: 12 }}
        headerBordered
        bodyStyle={{ position: 'relative', padding: '16px' }}
        collapsed={false}
      >
        <Form ref={formRef} layout="horizontal" labelWrap onFinish={handleFormFinish}>
          <div className={styles['form-header']}>
            <div className={styles['scheme-container']}>
              {allParams?.length >= 1 ? (
                <SearchScheme
                  callback={handleSchemeChange}
                  allFilterData={allParams}
                  allShowData={allResults}
                  searcherType={searcherType}
                  params={getParamsList()}
                  results={resultTags}
                  isEidt={!isSchemeChange}
                  initSchemeId={initSchemeId}
                />
              ) : null}
            </div>
            <Space>
              <Button id="fund_index_search_btn" type="primary" htmlType="submit">
                查询
              </Button>
              <Button
                type="link"
                loading={exportLoading}
                style={{ border: '1px solid' }}
                onClick={() => {
                  if (!exportLoading) {
                    handleExport();
                  }
                }}
              >
                下载
              </Button>
            </Space>
          </div>
          <div className={styles['fliter-container']}>
            <span className={styles['fliter-name']}>筛选项目</span>
            {renderFormItems()}
          </div>
        </Form>
      </ProCard>
      {renderTableBar()}
      {/* 一键打标 Modal */}
      <TagLabelModal
        searchModel={tagModal}
        searcherType={searcherType}
        closeModal={() => setTagModal(null)}
      />
      {/* 列项管理 */}
      <DataManagementModal
        type={searcherType}
        isModalOpen={tagManageVisible}
        handleClose={handleClosesetTagManageModal}
      />
    </>
  );
};

export default memo(SearchForm);
