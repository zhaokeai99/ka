import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { contentPadding } from '@/themes';
import ProCardPlus from '@/components/ProCardPlus';
import SearchTreeView from './SearchTree';
import SearchIndexView from './SearchIndex';
import IndexChangeView from './IndexChange';
import DataView from './DataView';
import SearchBar from './SearchBar';
import { Layout, message, Modal, Spin } from 'antd';
import _ from 'lodash';
import {
  IndexDataInfoFacadeQueryMasterData,
  IndustryTemplateInfoFacadeGetTemplateInfo,
  IndustryTemplateInfoFacadeDeleteTemplateInfo,
} from './service';
import SaveModel from './model/tempSave';
import MultiCalculateModel from './model/multiCalculate';
import SingleCalculateModel from './model/singleCalculate';
import moment from 'moment';

const { Content, Sider } = Layout;
const { confirm } = Modal;

const dataHandle = (indexs: any, datas: any) => {
  //整理datas
  const targetData: any = {};
  if (!(indexs?.length > 0)) {
    return [];
  }
  Object.keys(datas).forEach((indexCode) => {
    datas[indexCode].map((data: any) => {
      const indexKey = data.indexKey;
      if (targetData[indexKey] === undefined) {
        const obj: any = {};
        obj.date = indexKey;
        obj[indexCode] = data.indexValue;
        targetData[indexKey] = obj;
      } else {
        targetData[indexKey][indexCode] = data.indexValue;
      }
    });
  });

  const result: any[] = [];
  Object.keys(targetData).forEach((key) => {
    result.push(targetData[key]);
  });
  return _.sortBy(result, 'date');
};
const chartStyleDefault = { unit: true };

const DataCenterView = () => {
  const [selectTreeParams, setSelectTreeParams] = useState<any>({
    level: undefined,
    children: undefined,
    bizType: undefined,
    indexHierName: undefined,
    indexHierCode: undefined,
  }); // 选中树参数
  const [clientHeight, setClientHeight] = useState<number>(
    document.body.clientHeight - 38 - 48 - 12 * 2,
  );
  //选择指数
  const [checkIndexData, setCheckIndexData] = useState<any>([]);
  //表格数据
  const [chartsIndexData, setChartsIndexData] = useState<any>([]);
  const [showType, setShowType] = useState<string>('edit');
  const [saveVisible, setSaveVisible] = useState<boolean>(false);
  const [tamplateSaveData, setTamplateSaveData] = useState<any>({});
  const [loadSelectRowKey, setLoadSelectRowKey] = useState<any>([]);
  const [formSearch, setFormSearch] = useState<any>([]);
  const [chartLoading, setChartLoading] = useState<boolean>(false);
  const [dataLoading, setDataLoading] = useState<boolean>(false);

  const [tableListInfo, setTableListInfo] = useState<any>([]);
  const [chartsData, setChartsData] = useState<any>([]);
  const [dataShowType, setDataShowType] = useState<any>('data');
  const [chartStyle, setChartStyle] = useState<any>(chartStyleDefault);

  const [multiVisible, setMultiVisible] = useState<boolean>(false);
  const [singeVisible, setSingeVisible] = useState<boolean>(false);

  const [singelDataInfo, setSingelDataInfo] = useState<any>({});
  //选择模版
  const [editTemplateInfo, setEditTemplateInfo] = useState<any>(undefined);

  const SearchIndexFormRef = useRef();
  const IndexChangeFormRef = useRef();
  const ChartFormRef = useRef();
  const SearchBarFormRef = useRef();
  const SearchTreeFormRef = useRef();
  const ref = useRef<any>(null);
  // 监听resize
  useEffect(() => {
    function onResize() {
      const h = document.body.clientHeight;
      setClientHeight(h - 38 - 48 - 12 * 2);
    }

    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const onSelect = useCallback((val: any) => {
    const { options } = val;
    const { indexHierCode, indexHierName, level, children } = options?.node;
    setSelectTreeParams({ indexHierCode, indexHierName, level, children });
  }, []);

  const setDefaultChart = () => {
    setCheckIndexData([]);
    setLoadSelectRowKey([]);
    setDataShowType('data');
    setChartsIndexData([]);
    setChartsData([]);
    setTableListInfo([]);
    // @ts-ignore
    SearchBarFormRef?.current?.setDataType('data');
    setEditTemplateInfo(undefined);
  };

  const onIndexTableSelect = (select: boolean, record: any) => {
    if (select) {
      //新增
      if (checkIndexData.some((item: any) => item?.indexCode === record.indexCode)) {
        return;
      }
      setCheckIndexData([...checkIndexData, record]);
    } else {
      //删除
      _.remove(checkIndexData, (n: any) => {
        return n.indexCode === record.indexCode;
      });
      setCheckIndexData([...checkIndexData]);
    }
  };

  //查询数据
  const queryViewList = async (params: any, datas: any) => {
    setFormSearch(params);
    setChartLoading(true);
    const resultData = await IndexDataInfoFacadeQueryMasterData(params);

    const tmpTableList = dataHandle(datas, resultData);

    setTableListInfo(tmpTableList);
    setChartsData({ data: tmpTableList, attrData: datas });
    setChartLoading(false);
  };

  //搜索
  const onChartSearch = (form: any) => {
    //查询数据
    const params: any = form;
    const indexCodes = chartsIndexData.map((n: any) => n.indexCode);
    params.indexCodeList = indexCodes;
    queryViewList(params, chartsIndexData);
  };

  //提取数据
  const onChartsShow = (datas: any) => {
    setChartsIndexData(datas);
    //设置bar
    const searchData = [];
    const params: any = {};
    if (datas.length === 0) {
      searchData.push(undefined);
      searchData.push(undefined);
    } else {
      searchData.push(datas[0].beginDate);
      searchData.push(datas[0].endDate);
      if (datas[0].beginDate) {
        params.startDate = moment(datas[0].beginDate).format('YYYY-MM-DD');
      }
      if (datas[0].endDate) {
        params.endDate = moment(datas[0].endDate).format('YYYY-MM-DD');
      }
    }
    // @ts-ignore
    SearchBarFormRef?.current?.setFormDate(searchData);
    //查询数据
    const indexCodes = datas.map((n: any) => n.indexCode);
    params.indexCodeList = indexCodes;
    if (indexCodes === undefined || indexCodes.length === 0) {
      setChartsData([]);
      setTableListInfo([]);
      return;
    }
    queryViewList(params, datas);
  };

  //移除
  const onIndexRemove = (record: any) => {
    _.remove(checkIndexData, (n: any) => {
      return n.indexCode === record.indexCode;
    });
    // @ts-ignore
    SearchIndexFormRef?.current?.removeKey(record);
    setCheckIndexData([...checkIndexData]);
  };

  //保存
  const onHandleSave = () => {
    if (chartsIndexData === undefined || chartsIndexData.length === 0) {
      message.warn('请选择指标');
      return;
    }
    //指标
    // @ts-ignore
    const indexDatas = IndexChangeFormRef?.current?.getDataList();
    //保存数据
    const saveData = {
      dataType: dataShowType,
      formSearch: formSearch,
      indexDatas,
      chartStyle: chartStyle,
    };
    setTamplateSaveData(saveData);
    setSaveVisible(true);
  };

  //加载图表
  const loadView = async (id: any) => {
    const params = { id };
    setDataLoading(true);
    const data = await IndustryTemplateInfoFacadeGetTemplateInfo(params);
    if (data === undefined || data === null) {
      setDataLoading(false);
      return;
    }
    const json = JSON.parse(data.dataJson);
    console.log('loadView.json', json);
    setEditTemplateInfo(data);
    setCheckIndexData(json.indexDatas);
    setLoadSelectRowKey(json.formSearch.indexCodeList);
    let tmpChartsData = [];
    if (json?.formSearch?.indexCodeList) {
      tmpChartsData = json.formSearch.indexCodeList.map((key: any) => {
        return _.find(json.indexDatas, { indexCode: key });
      });
    }
    setDataShowType(json.dataType);
    // @ts-ignore
    SearchBarFormRef?.current?.setDataType(json.dataType);
    onChartsShow(tmpChartsData);
    const datas = [json?.formSearch?.startDate, json?.formSearch?.endDate];
    // @ts-ignore
    SearchBarFormRef?.current?.setFormDate(datas);
    setDataLoading(false);
    const cstyle = json.chartStyle ? json.chartStyle : chartStyleDefault;
    setChartStyle(cstyle);
    ChartFormRef?.current?.chartStyleChange(cstyle);
  };

  //显示类型变更
  const onShowTypeChange = (type: string) => {
    setShowType(type);
  };

  //方案选择
  const onTempCheckId = (id: any) => {
    loadView(id);
  };

  //保存关闭
  const onSaveClose = (value: string) => {
    if (value === 'saved') {
      //保存成功. 更新模板数据
      SearchTreeFormRef?.current?.dataRefresh();
    }
    setSaveVisible(false);
  };

  //显示数据类型
  const onDataShowTypeChange = (type: string) => {
    setDataShowType(type);
  };

  const onTabsClick = () => {
    setDefaultChart();
  };

  //多指数事件
  const onMultiCalcClick = () => {
    setMultiVisible(true);
  };

  const onMultiCalcCloseClick = (value: string) => {
    if (value === 'save') {
    }
    setMultiVisible(false);
  };

  const onSingleCalcClick = (row: string) => {
    setSingeVisible(true);
    setSingelDataInfo(row);
  };

  const onSingleCalcCloseClick = (value: string) => {
    if (value === 'saved') {
      SearchIndexFormRef?.current?.refresh();
    }
    setSingeVisible(false);
  };

  const onExportExcel = () => {
    // @ts-ignore
    ChartFormRef?.current?.exportExcel();
  };

  const onExportPic = () => {
    // @ts-ignore
    ChartFormRef?.current?.exportPic();
  };

  const onChartStyleChange = (style: any) => {
    // @ts-ignore
    ChartFormRef?.current?.chartStyleChange(style);
    setChartStyle(style);
  };

  const deleteTemp = async () => {
    const params = { id: editTemplateInfo.id };
    const data = await IndustryTemplateInfoFacadeDeleteTemplateInfo(params);
    if (data > 0) {
      message.success('删除成功');
    } else {
      message.success('删除失败');
    }
    //更新数据
    // @ts-ignore
    SearchTreeFormRef?.current?.dataRefresh();
  };

  const onDeleteInfo = () => {
    confirm({
      title: '确认删除该模板吗?',
      onOk() {
        deleteTemp();
      },
    });
  };

  return (
    <div ref={ref}>
      <ProCardPlus
        ghost
        style={{
          paddingLeft: contentPadding,
          paddingTop: contentPadding,
          paddingRight: contentPadding,
        }}
        split={'horizontal'}
        size="small"
      >
        <Spin spinning={dataLoading}>
          <Layout
            style={{
              minHeight: clientHeight,
              maxHeight: clientHeight,
            }}
          >
            <Sider
              style={{ margin: '0 12px 0 0' }}
              theme="light"
              collapsible
              trigger={null}
              collapsedWidth={0}
              width={234}
            >
              <SearchTreeView
                colSpan="15%"
                onTabsClick={onTabsClick}
                onSelect={onSelect}
                clientHeight={clientHeight + 400}
                onShowTypeChange={onShowTypeChange}
                onCheckRow={onTempCheckId}
                cRef={SearchTreeFormRef}
              />
            </Sider>
            {showType === 'edit' ? (
              <Sider
                style={{ margin: '0 12px 0 0' }}
                theme="light"
                collapsible
                trigger={null}
                collapsedWidth={0}
                width={234}
              >
                <SearchIndexView
                  code={selectTreeParams}
                  onSelect={onIndexTableSelect}
                  clientHeight={clientHeight + 400}
                  checkData={checkIndexData}
                  cRef={SearchIndexFormRef}
                />
              </Sider>
            ) : (
              ''
            )}
            <Layout className="site-layout">
              <Content>
                <ProCardPlus style={{ height: clientHeight + 400 }}>
                  <div
                    style={{
                      height: parseInt(String((clientHeight - 12) / 2)) - 12 + 200,
                      width: '100%',
                    }}
                  >
                    <SearchBar
                      cRef={SearchBarFormRef}
                      onSearch={onChartSearch}
                      onTypeChange={onDataShowTypeChange}
                      onTemplateSave={onHandleSave}
                      onExportExcel={onExportExcel}
                      onExportPic={onExportPic}
                      onChartStyleChange={onChartStyleChange}
                      chartStyle={chartStyle}
                      onDelete={onDeleteInfo}
                      showDelete={editTemplateInfo?.id}
                    />
                    <DataView
                      clientHeight={parseInt(String((clientHeight - 12) / 2)) + 200}
                      chartsIndexData={chartsIndexData}
                      chartsData={chartsData}
                      tableList={tableListInfo}
                      dataType={dataShowType}
                      loading={chartLoading}
                      cRef={ChartFormRef}
                    />
                  </div>
                  <div
                    style={{
                      height: clientHeight - 12 - parseInt(String((clientHeight - 12) / 2)) + 200,
                      width: '100%',
                      marginTop: 12,
                    }}
                  >
                    <IndexChangeView
                      onChartsShow={onChartsShow}
                      onMultiCalcClick={onMultiCalcClick}
                      onSingleCalcClick={onSingleCalcClick}
                      onRemove={onIndexRemove}
                      checkData={checkIndexData}
                      clientHeight={
                        clientHeight - 12 - parseInt(String((clientHeight - 12) / 2)) + 200
                      }
                      cRef={IndexChangeFormRef}
                      loadSelectRowKey={loadSelectRowKey}
                    />
                  </div>
                </ProCardPlus>
              </Content>
            </Layout>
          </Layout>
        </Spin>
      </ProCardPlus>
      <SaveModel
        visible={saveVisible}
        saveData={tamplateSaveData}
        onClose={onSaveClose}
        templateInfo={editTemplateInfo}
      />
      <MultiCalculateModel
        indexCodeList={checkIndexData}
        visible={multiVisible}
        onClose={onMultiCalcCloseClick}
      />
      <SingleCalculateModel
        indexData={singelDataInfo}
        visible={singeVisible}
        onClose={onSingleCalcCloseClick}
      />
    </div>
  );
};
export default memo(DataCenterView);
