import ProCard from '@ant-design/pro-card';
import {
  DatePicker,
  Empty,
  Form,
  List,
  Select,
  Radio,
  Modal,
  Button,
  Spin,
  Divider,
  Switch,
} from 'antd';
import moment from 'moment';
import React, { memo, useCallback, useEffect, useImperativeHandle, useState } from 'react';
import styles from './index.less';
import {
  irReportFacadeQueryByPage,
  IrReportFacadeQueryIrReportInfoGroupByPage,
  irReportFacadeQuerySysConfigCode,
  MpRsSysBaseInfoFacadeGetPrevTrade,
} from './service';
import HistoryView from '@/pages/Investment/StockResearch/AlphaView/ResearchTrends/historyRecord';
import ListItemForm from './form/listItemForm';
import AbbrItemForm from './form/abbrItemForm';
import lodash from 'lodash';
import style from '@/pages/Investment/StockResearch/AlphaView/SearchTree/index.less';
import { MenuUnfoldOutlined, FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;
const { Option } = Select;

type PropsType = {
  showCollapsed: boolean;
  setCollapsend: (value: any) => void;
  params: {
    stockCode: any;
    stockName: any;
    level: string;
    children: any;
    bizType: any;
  };
  userAccount: string | undefined;
  cRef: any;
  onChangeBeginDate: (value: any) => void;
  showMode: (value: any) => void;
  onHandleTreeAll?: (val: boolean) => void;
};

function getFullscreenElement() {
  return (
    document.fullscreenElement ||
    document.mozFullScreenElement ||
    document.msFullScreenElement ||
    document.webkitFullscreenElement ||
    null
  );
}

function fullscreen(element: any) {
  if (document?.mozFullScreenEnabled) {
    return Promise.reject(new Error('全屏模式被禁用'));
  }
  let result = null;
  if (element.requestFullscreen) {
    result = element.requestFullscreen();
  } else if (element.mozRequestFullScreen) {
    result = element.mozRequestFullScreen();
  } else if (element.msRequestFullscreen) {
    result = element.msRequestFullscreen();
  } else if (element.webkitRequestFullscreen) {
    result = element.webkitRequestFullScreen();
  }
  return result || Promise.reject(new Error('不支持全屏'));
}

function cancelFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
}

const ResearchTrends = (props: PropsType) => {
  const {
    params,
    userAccount,
    cRef,
    showCollapsed,
    setCollapsend,
    onChangeBeginDate,
    showMode,
    onHandleTreeAll,
  } = props;

  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [dataList, setDataList] = useState<any[]>([]);
  const [pageInfo, setPageInfo] = useState<any>({
    current: 1,
    pageSize: 20,
    total: 0,
  });
  const [listParams, setListParams] = useState<any>({});
  const [formParams, setFormParams] = useState<any>({});
  const [formDateParams, setFormDateParams] = useState<any>({
    beginDateStr: moment().subtract(7, 'days').format('YYYY-MM-DD'),
    endDateStr: moment().add(1, 'days').format('YYYY-MM-DD'),
  });
  const [irReportTypeDic, setIrReportTypeDic] = useState<any>([]);
  const [showFormTime, setShowFormTime] = useState<boolean>(false);
  const [randomId, setRandomId] = useState<any>(1);
  const [historyShow, setHistoryShow] = useState<boolean>(false);
  const [historyData, setHistoryData] = useState<any>(undefined);
  const [clientHeight, setClientHeight] = useState<number>(document.body.clientHeight);
  const [itemShowType, setItemShowType] = useState<boolean>(false);
  const [fullScreen, setFullScreen] = useState<boolean>(false);
  //内容类型，报告类型查询变更全部
  const [searchAll, setSearchAll] = useState<boolean>(false);

  // 监听resize
  useEffect(() => {
    function onResize() {
      const h = document.body.clientHeight;
      setClientHeight(h);
    }

    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, [itemShowType]);

  //全屏
  useEffect(() => {
    function fullChange() {
      if (getFullscreenElement()) {
        setFullScreen(true);
      } else {
        setFullScreen(false);
      }
    }

    window.addEventListener('fullscreenchange', fullChange);
    return () => {
      window.removeEventListener('fullscreenchange', fullChange);
    };
  });

  //查看聊天上下文
  const historyViewShow = useCallback((d: any) => {
    setHistoryShow(true);
    setHistoryData(d);
  }, []);

  const getTradeDate = useCallback(async (date: string) => {
    const dataParam = { date };
    const dataResult = await MpRsSysBaseInfoFacadeGetPrevTrade(dataParam);

    return moment(dataResult.prevTradeDate, 'YYYYMMDD').add(1, 'day').format('YYYY-MM-DD');
  }, []);

  //标签颜色处理 - 样式
  const handleLabelColor = (list: any, current: number) => {
    if (!list) {
      return;
    }
    let i = (current - 1) * pageInfo.pageSize,
      tmpLabel: string | undefined = undefined,
      change = false;

    for (let iii = 0; iii < list.length; iii++) {
      // list.map((item: any) => {
      const item = list[iii];
      let labelNo = 0;
      item.classType = '';
      if (item.labelModelList) {
        for (const itemModel of item.labelModelList) {
          if (labelNo === 0 && itemModel.labelType === 4) {
            if (tmpLabel === undefined) {
              item.rowno = i;
              tmpLabel = itemModel.labelContent1;
            } else if (tmpLabel === itemModel.labelContent1) {
              item.rowno = i;
            } else {
              i++;
              change = true;
              item.rowno = i;
              tmpLabel = itemModel.labelContent1;
            }
            labelNo++;
            break;
          } else if (itemModel.labelType === 4) {
            labelNo++;
          }
        }
      }
      //第一个
      if (params.bizType === 3) {
        if (iii === 0) {
          item.classType += ' list-item-top';
        }
        if (change) {
          if (iii - 1 >= 0) {
            list[iii - 1].classType += ' list-item-bottom';
          }
          change = false;
        }
      }

      item.labelNo = labelNo;
    }
    if (list.length > 0) {
      list[list.length - 1].classType += ' list-item-bottom';
    }
  };

  const handleLabelColorGroup = (list: any, current: number) => {
    let i = 0;
    if (!list) {
      return;
    }
    list.map((item: any) => {
      let labelNo = 0;
      if (item.labelModelList) {
        for (const itemModel of item.labelModelList) {
          if (itemModel.labelType === 4) {
            labelNo++;
          }
        }
      }
      item.labelNo = labelNo;

      item.rowno = (current - 1) * pageInfo.pageSize + i;
      item.classType = 'list-item-top list-item-bottom';
      i++;
    });
  };

  const queryById = useCallback(
    async (obj: any) => {
      setLoading(true);
      //irMsgId, recommendDate, stockCode
      let param = {};
      if (obj === undefined) {
        param = listParams;
      } else {
        const recommendDate = moment(obj.recommendDate).format('YYYY-MM-DD');
        param = {
          stockCodes: [obj.stockCode],
          stockCode: undefined,
          beginDateStr: await getTradeDate(recommendDate),
          endDateStr: moment(obj.recommendDate).add(1, 'day').format('YYYY-MM-DD'),
          //receiveDate: moment(obj.recommendDate).format("YYYY-MM-DD"),
          pageSize: pageInfo.pageSize,
          sortField: 'id',
          sortOrder: 'asc',
          current: 1,
        };
        if (obj.stockCode.indexOf('.SI') > 0) {
          param.searchType = '2';
        }
      }
      const resultData = await IrReportFacadeQueryIrReportInfoGroupByPage(param);
      const { data, current, total } = resultData;

      setRandomId(lodash.random(0, 999999));
      handleLabelColorGroup(data, current);
      setDataList(data);
      setPageInfo({ current, pageSize: pageInfo.pageSize, total });
      setLoading(false);
    },
    [pageInfo],
  );

  const anchorToDivTop = () => {
    //翻页
    const div = document.querySelector('#div_ir_top');
    if (div != undefined) {
      div.scrollIntoView({ behavior: 'smooth' });

      const body = div.querySelector('.ant-pro-card-body');
      if (body !== null) {
        body.scrollTop = 0;
      }
    }
  };

  const querySysConfigCode = useCallback(async (p?: any) => {
    const resultData = await irReportFacadeQuerySysConfigCode(p);
    setIrReportTypeDic(resultData);
  }, []);

  useEffect(() => {
    const pam = { typeCode: 'IR_REPORT_TYPE' };
    querySysConfigCode(pam);
  }, []);

  //明细查询
  const IrReportFacadeQuery = useCallback(
    async (currParams: any) => {
      setLoading(true);

      const uAccount = userAccount === 'all' ? undefined : userAccount;
      const param = {
        ...currParams,
        ...formDateParams,
        userAccount: uAccount,
        wechatGroupId: '19702231307@chatroom',
        current: 1,
        pageSize: pageInfo.pageSize,
        sortField: 'receiveTime',
        sortOrder: 'asc',
      };
      if (params.bizType === 3 && params.stockCode === 'Label') {
        param.haveLabel = '1';
        param.sortField = 'label_order asc, receive_time ';
        param.sortOrder = 'asc';
      } else if (params.bizType === 3 && params.stockCode === 'noClass') {
        param.haveNoClass = '1';
        param.sortField = 'label_order asc, receive_time ';
        param.sortOrder = 'asc';
      }
      setListParams(param);
      setDataList([]);
      const resultData = await irReportFacadeQueryByPage(param);
      const { data, current, total } = resultData;

      setRandomId(lodash.random(0, 999999));

      handleLabelColor(data, current);
      setDataList(data);
      setPageInfo({ current, pageSize: pageInfo.pageSize, total });
      setLoading(false);
      // anchorToDivTop();
    },
    [userAccount, pageInfo, params, formDateParams],
  );

  //分组查询
  const IrReportFacadeQueryGroup = useCallback(
    async (currParams: any) => {
      setLoading(true);
      //查询子节点
      const stockCodes: any[] = [];
      let investLevel: any = undefined;
      let paramType: string | undefined = undefined;
      if (params.bizType === 0) {
        //全部
        paramType = undefined;
      } else if (params.bizType === 1) {
        //行业
        stockCodes.push(params.stockCode);
        paramType = '2';
      } else if (params.bizType === 2) {
        //个股
        stockCodes.push(params.stockCode);
        paramType = '1';
      } else if (params.bizType === 3) {
        //分类
        investLevel = params.stockCode;
        paramType = '1';
      } else if (params.bizType === 4) {
        //标签
        stockCodes.push(params.stockCode);
        paramType = '3';
      }

      if (params.stockCode === 'noClass' || params.stockCode === 'Label') {
        setDataList([]);
        setPageInfo({ current: 1, pageSize: pageInfo.pageSize, total: 0 });
        setLoading(false);
        return;
      }

      const uAccount = userAccount === 'all' ? undefined : userAccount;
      const param = {
        stockCodes,
        investLevel,
        ...currParams,
        ...formDateParams,
        userAccount: uAccount,
        wechatGroupId: '19702231307@chatroom',
        current: 1,
        pageSize: pageInfo.pageSize,
        sortField: 'toporder asc, receive_time',
        sortOrder: 'asc',
        // dataType: paramType,
        searchType: paramType,
      };
      setListParams(param);
      setDataList([]);
      const resultData = await IrReportFacadeQueryIrReportInfoGroupByPage(param);
      const { data, current, total } = resultData;

      setRandomId(lodash.random(0, 999999));
      handleLabelColorGroup(data, current);
      setDataList(data);
      setPageInfo({ current, pageSize: pageInfo.pageSize, total });
      setLoading(false);
      // anchorToDivTop();
    },
    [params, userAccount, pageInfo, formDateParams],
  );

  useEffect(() => {
    if (
      params.bizType === 0 ||
      (params.bizType === 3 && params.stockCode === 'Label') ||
      (params.bizType === 3 && params.stockCode === 'noClass')
    ) {
      //全部、标签
      IrReportFacadeQuery(formParams);
    } else {
      // 研究动态数据分页查询
      IrReportFacadeQueryGroup(formParams);
    }
  }, [params, formParams]);

  const onBtnCollcapsedClick = () => {
    setCollapsend(!showCollapsed);
  };

  // 标题
  const autoTitle = (title: any) => (
    <div style={{ display: 'flex' }}>
      {showCollapsed ? (
        <>
          <Button
            style={{ marginTop: 2 }}
            onClick={onBtnCollcapsedClick}
            className={style['search-button']}
            icon={<MenuUnfoldOutlined />}
          />
          <Divider type={'vertical'} style={{ height: 18, marginTop: 10 }} />
        </>
      ) : (
        ''
      )}
      <span className={styles['research_trends_title']}>{title}</span>
    </div>
  );

  const showTypeHandle = useCallback(
    (displayType: boolean) => {
      //样式
      if (itemShowType) {
        if (!displayType) {
          setItemShowType(false);
          showMode(false);
        }
      } else {
        if (displayType) {
          setItemShowType(true);
          showMode(true);
        }
      }
    },
    [itemShowType],
  );

  const handleTreeAll = () => {
    onHandleTreeAll(true);
  };

  const onValuesChange = useCallback(
    async (allVal: any) => {
      const { timeType, time, reportType, msgType, displayType } = allVal;
      const formPam: any = {},
        formDatePam: any = {};
      let beginDateStr = undefined;
      if (timeType === 'custom') {
        if (time) {
          formDatePam.beginDateStr = time[0].format('YYYY-MM-DD');
          formDatePam.endDateStr = time[1].add(1, 'days').format('YYYY-MM-DD');
        } else {
          onChangeBeginDate(undefined);
        }
      } else {
        formDatePam.endDateStr = moment().add(1, 'days').format('YYYY-MM-DD');
        if (timeType === 'day') {
          formDatePam.beginDateStr = moment().format('YYYY-MM-DD');
        } else if (timeType === 'week') {
          formDatePam.beginDateStr = moment().subtract(7, 'days').format('YYYY-MM-DD');
        } else if (timeType === 'month') {
          formDatePam.beginDateStr = moment().subtract(1, 'months').format('YYYY-MM-DD');
        } else if (timeType === 'quarter') {
          formDatePam.beginDateStr = moment().subtract(3, 'months').format('YYYY-MM-DD');
        } else if (timeType === 'year') {
          formDatePam.beginDateStr = moment().subtract(1, 'years').format('YYYY-MM-DD');
        }
      }

      beginDateStr = formDatePam.beginDateStr;
      setFormDateParams({ ...formDatePam });
      if (beginDateStr) {
        onChangeBeginDate(beginDateStr);
      }
      if (reportType) {
        formPam.reportType = reportType;
      }
      if (msgType) {
        formPam.msgType = msgType;
      }

      if (searchAll) {
        setSearchAll(reportType || msgType);
      } else {
        setSearchAll(reportType || msgType);
        if (reportType || msgType) {
          handleTreeAll();
        }
      }

      if (JSON.stringify(formPam) !== JSON.stringify(formParams)) {
        setFormParams({ ...formPam });
      }
      showTypeHandle(displayType);
    },
    [itemShowType, formParams],
  );

  const timeTypeChange = (e: any) => {
    if (e.target.value === 'custom') {
      setShowFormTime(true);
    } else {
      setShowFormTime(false);
    }
  };

  const fullScreenBtn = useCallback(() => {
    if (getFullscreenElement()) {
      cancelFullscreen();
      setFullScreen(false);
    } else {
      const element = document.getElementById('div_ir_top');
      setFullScreen(true);
      fullscreen(element);
    }
  }, []);

  //翻页
  const onChange = useCallback(
    async (page: number, pSize: number) => {
      listParams.current = page;
      listParams.pageSize = pSize;
      setListParams({ ...listParams });
      setLoading(true);
      let resultData = undefined;
      if (
        params.bizType === 0 ||
        (params.bizType === 3 && params.stockCode === 'noClass') ||
        (params.bizType === 3 && params.stockCode === 'Label')
      ) {
        //全部、标签
        resultData = await irReportFacadeQueryByPage(listParams);
      } else {
        // 研究动态数据分页查询
        resultData = await IrReportFacadeQueryIrReportInfoGroupByPage(listParams);
      }

      const { data, current, total } = resultData || {};

      handleLabelColor(data, current);
      setDataList(data);
      setRandomId(lodash.random(0, 999999));
      setPageInfo({ current, pageSize: pSize, total });
      setLoading(false);
      anchorToDivTop();
    },
    [listParams, params],
  );

  //指定查询
  useImperativeHandle(cRef, () => ({
    searchById: (obj: any) => {
      queryById(obj);
    },
  }));

  return (
    <>
      <div className={styles['research-trends-content']}>
        <ProCard
          title={autoTitle('研究动态')}
          extra={
            <Form
              layout="inline"
              form={form}
              onValuesChange={(_, allValues) => onValuesChange(allValues)}
              style={{ float: 'right' }}
              initialValues={{ timeType: 'week' }}
            >
              <Form.Item name="timeType">
                <Radio.Group onChange={(e) => timeTypeChange(e)}>
                  <Radio.Button value="day">今日</Radio.Button>
                  <Radio.Button value="week">近一周</Radio.Button>
                  <Radio.Button value="month">近一月</Radio.Button>
                  <Radio.Button value="quarter">近一季</Radio.Button>
                  <Radio.Button value="year">近一年</Radio.Button>
                  <Radio.Button value="custom">自定义</Radio.Button>
                </Radio.Group>
              </Form.Item>
              {showFormTime ? (
                <Form.Item name="time">
                  <RangePicker />
                </Form.Item>
              ) : (
                ''
              )}
              <Form.Item name="msgType">
                <Select
                  showSearch
                  allowClear
                  style={{ width: '100px' }}
                  placeholder="内容类型"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option!.children as unknown as string)
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                >
                  <Option value={'文本'}>{'文本'}</Option>
                  <Option value={'图片'}>{'图片'}</Option>
                  <Option value={'文件'}>{'文件'}</Option>
                  <Option value={'链接'}>{'链接'}</Option>
                </Select>
              </Form.Item>
              <Form.Item name="reportType">
                <Select
                  showSearch
                  allowClear
                  style={{ width: '100px' }}
                  placeholder="报告类型"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option!.children as unknown as string)
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                >
                  {irReportTypeDic.length &&
                    irReportTypeDic.map((item: any) => (
                      <Option value={item.name}>{item.name}</Option>
                    ))}
                </Select>
              </Form.Item>
              <Form.Item name="displayType" label={'样式'} valuePropName={'checked'}>
                <Switch defaultChecked={false} />
              </Form.Item>
              <Button
                className={style['search-button']}
                onClick={fullScreenBtn}
                icon={fullScreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
              />
            </Form>
          }
          id={'div_ir_top'}
          bodyStyle={
            dataList?.length > 0
              ? params?.bizType === 1 || params?.bizType === 2
                ? {}
                : {
                    overflow: 'auto',
                    height: itemShowType ? clientHeight - 319 : clientHeight - 263,
                  }
              : {
                  background: '#fff',
                  overflow: 'auto',
                  height: itemShowType ? clientHeight - 319 : clientHeight - 263,
                }
          }
        >
          {dataList?.length > 0 ? (
            <div className={'research_trends_time_line'}>
              <List
                loading={loading}
                dataSource={dataList}
                itemLayout="vertical"
                pagination={{
                  ...pageInfo,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  onChange: onChange,
                  pageSizeOptions: ['10', '20', '50', '100'],
                  showTotal: (total, range) => `第 ${range[0]} 到 ${range[1]} 条 | 共 ${total} 条`,
                }}
                renderItem={(item) => {
                  return itemShowType ? (
                    <ListItemForm
                      key={item.id + '_' + randomId}
                      itemData={item}
                      listParams={listParams}
                      onHistoryViewShow={historyViewShow}
                      showHistory={true}
                      rowno={item.rowno}
                    />
                  ) : (
                    <AbbrItemForm
                      key={item.id + '_' + randomId}
                      itemData={item}
                      listParams={listParams}
                      onHistoryViewShow={historyViewShow}
                      showHistory={true}
                      rowno={item.rowno}
                      fullScreen={fullScreen}
                    />
                  );
                }}
              />
            </div>
          ) : (
            <Spin spinning={loading}>
              <Empty
                style={{ marginTop: 60 }}
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="暂无数据"
              />
            </Spin>
          )}
        </ProCard>
      </div>
      <Modal
        title={'历史记录'}
        visible={historyShow}
        onOk={() => setHistoryShow(false)}
        onCancel={() => setHistoryShow(false)}
        width={1200}
        destroyOnClose={true}
        footer={[
          <Button key="back" onClick={() => setHistoryShow(false)}>
            关闭
          </Button>,
        ]}
      >
        <HistoryView data={historyData} fullMode={itemShowType} />
      </Modal>
    </>
  );
};

export default memo(ResearchTrends);
