import { useState, useEffect } from 'react';
import Pie from './pie';
import Area from './Area';
import ProCard from '@ant-design/pro-card';
import { Tabs, Tooltip, Switch } from 'antd';
import { Link } from 'umi';
import moment from 'moment';
import ProCardPlus from '@/components/ProCardPlus';
import { cardGutter } from '@/themes/index';
import TabTable from '../TabTable';
import './index.less';
import { queryLastQuaryDay, queryCompanyScaleData } from './service';

const { TabPane } = Tabs;

const nameMap = {
  mfFundAmt: '货币基金',
  activeEquityAmt: '主动权益基金',
  unactiveEquityAmt: '被动权益基金',
  fixedIncomePlusAmt: '固收＋基金',
  fixedIncomeAmt: '固收基金',
  fofAmt: 'fof基金',
  otherAmt: '其他',
};
const countMap = {
  mfFundCount: '货币基金',
  activeEquityCount: '主动权益基金',
  unactiveEquityCount: '被动权益基金',
  fixedIncomePlusCount: '固收＋基金',
  fixedIncomeCount: '固收基金',
  fofCount: 'fof基金',
  otherCnt: '其他',
};

export default function (props: any) {
  const formatData = (val: any) => {
    return val ? moment(val).format('YYYY-MM-DD') : '-';
  };
  const columns1 = [
    {
      title: '产品代码',
      dataIndex: 'fundCode',
      key: 'fundCode',
      render: (name: string, item: any) => (
        <Tooltip title={name}>
          <Link to={`/production/index/newDetail/${item.fundCode}`} className="text-ellipsis">
            {name}
          </Link>
        </Tooltip>
      ),
    },
    {
      title: '产品名称',
      dataIndex: 'fundName',
      key: 'fundName',
      render: (name: string, item: any) => (
        <Tooltip title={name}>
          <Link to={`/production/index/newDetail/${item.fundCode}`} className="text-ellipsis">
            {name}
          </Link>
        </Tooltip>
      ),
    },
    {
      title: '募集开始日',
      dataIndex: 'raiseStartDate',
      key: 'raiseStartDate',
      render: formatData,
    },
    {
      title: '募集结束日',
      dataIndex: 'raiseEndDate',
      key: 'raiseEndDate',
      render: formatData,
    },
    {
      title: '产品经理',
      dataIndex: 'productManagerName',
      key: 'productManagerName',
    },
    {
      title: '产品大类',
      dataIndex: 'fundRaiseType',
      key: 'fundRaiseType',
    },
    {
      title: '基金经理&投资经理',
      dataIndex: 'fundManagerNames',
      key: 'fundManagerNames',
      render: (name: string[], item: any) => {
        return name.map((cur: string, i: number) => {
          return (
            <Tooltip style={{ display: 'flex' }} title={item.fundManagerCodes[i]}>
              <Link
                to={`/production/fundManager/${item.fundManagerCodes[i]}`}
                className="text-ellipsis"
              >
                {cur}
              </Link>
            </Tooltip>
          );
        });
      },
    },
    {
      title: '最新规模',
      dataIndex: 'currAMT',
      key: 'currAMT',
    },
    // {
    //   title: '加入关注',
    //   dataIndex: 'releaseReport',
    //   fixed: 'right',
    //   hideInSearch: true,
    //   render: (_: any, record: { attention: any }) => {
    //     return record?.attention ? (
    //       <HeartFilled style={{ color: 'red' }} onClick={attentionClick} />
    //     ) : (
    //       <HeartOutlined onClick={attentionClick} />
    //     );
    //   },
    // },
  ];
  const columns2 = [
    {
      title: '产品代码',
      dataIndex: 'fundCode',
      key: 'fundCode',
      render: (name: string, item: any) => (
        <Tooltip title={name}>
          <Link to={`/production/index/newDetail/${item.fundCode}`} className="text-ellipsis">
            {name}
          </Link>
        </Tooltip>
      ),
    },
    {
      title: '产品名称',
      dataIndex: 'fundName',
      key: 'fundName',
      render: (name: string, item: any) => (
        <Tooltip title={name}>
          <Link to={`/production/index/newDetail/${item.fundCode}`} className="text-ellipsis">
            {name}
          </Link>
        </Tooltip>
      ),
    },
    {
      title: '成立日期',
      dataIndex: 'setupDate',
      key: 'setupDate',
      render: formatData,
    },
    {
      title: '产品状态',
      dataIndex: 'fundStatus',
      key: 'fundStatus',
    },
    // {
    //   title: '产品经理',
    //   dataIndex: 'productManagerName',
    //   key: 'productManagerName',
    // },
    {
      title: '二级分类',
      dataIndex: 'fundSubType',
      key: 'fundSubType',
    },
    {
      title: '管理费',
      dataIndex: 'manageRate',
      key: 'manageRate',
    },
    {
      title: '托管费',
      dataIndex: 'escrowRate',
      key: 'escrowRate',
    },
    {
      title: '基金经理&投资经理',
      dataIndex: 'fundManagerNames',
      key: 'fundManagerNames',
      render: (name: string[], item: any) => {
        return name.map((cur: string, i: number) => {
          return (
            <Tooltip style={{ display: 'flex' }} title={item.fundManagerCodes[i]}>
              <Link
                to={`/production/fundManager/${item.fundManagerCodes[i]}`}
                className="text-ellipsis"
              >
                {cur}
              </Link>
            </Tooltip>
          );
        });
      },
    },
    {
      title: '公司业务线',
      dataIndex: 'compBusinessType',
      key: 'compBusinessType',
    },
    // {
    //   title: '加入关注',
    //   fixed: 'right',
    //   dataIndex: 'releaseReport',
    //   hideInSearch: true,
    //   render: (_: any, record: { attention: any }) => {
    //     return record?.attention ? (
    //       <HeartFilled style={{ color: 'red' }} onClick={attentionClick} />
    //     ) : (
    //       <HeartOutlined onClick={attentionClick} />
    //     );
    //   },
    // },
  ];
  const config = [
    {
      key: '全部',
      name: '全部',
    },
    {
      key: '货币市场型基金',
      name: '货币市场型基金',
    },
    {
      key: '债券型基金',
      name: '债券型基金',
    },
    {
      key: '混合型基金',
      name: '混合型基金',
    },
    {
      key: '股票型基金',
      name: '股票型基金',
    },
    {
      key: 'FOF基金',
      name: 'FOF基金',
    },
    {
      key: '国际(QDII)基金',
      name: '国际(QDII)基金',
    },
    {
      key: '另类投资基金',
      name: '另类投资基金',
    },
    {
      key: 'REITs',
      name: 'REITs',
      columns: columns1,
    },
  ];
  const Config = [
    {
      key: 'tab1',
      name: '规模一览',
    },
    {
      key: 'tab2',
      name: '准备中',
      config: config,
      columns: columns1,
    },
    {
      key: 'tab3',
      name: '已报未批',
      config: config,
      columns: columns1,
    },
    {
      key: 'tab4',
      name: '已批未募',
      config: config,
      columns: columns1,
    },
    {
      key: 'tab5',
      name: '募集中',
      config: config,
      columns: columns1,
    },
    {
      key: 'tab6',
      name: '存续产品',
      config: config,
      columns: columns2,
    },
  ];
  const [baseDates, setBaseDates] = useState({ lastQuaryDay: null });
  const [isReject, setIsReject] = useState(false);
  const [fundActiveTab] = useState('ALL');
  const [activeTabKey, setActiveTabKey] = useState('tab1');
  const [amtPieData, setAmtPieData] = useState({ total: 0, list: [] });
  const [countPieData, setCountPieData] = useState({ total: 0, list: [] });

  useEffect(() => {
    (async () => {
      const quaryDay = await queryLastQuaryDay();
      setBaseDates(quaryDay);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (!baseDates) return;
      const res = await queryCompanyScaleData({
        endDate: moment(baseDates?.lastQuaryDay).format('YYYYMMDD'),
        code: props.code,
        isReject: isReject,
      });
      setAmtPieData({
        // @ts-ignore
        total: (res.totalPublicFundAmt * 0.00000001).toFixed(2),
        list: res.list.map((item: any) => {
          return {
            ...item,
            scaleItem: item?.decimal * 0.00000001,
            name: nameMap[item.type],
          };
        }),
      });
      setCountPieData({
        total: res.totalFundCount,
        list: res.countList.map((item: any) => {
          return {
            ...item,
            scaleItem: item.count,
            name: countMap[item.type],
          };
        }),
      });
    })();
  }, [baseDates, isReject]);

  return (
    <ProCard
      ghost
      tabs={{
        type: 'card',
        tabPosition: 'top',
        activeKey: activeTabKey,
        onChange: (key) => setActiveTabKey(key),
      }}
    >
      {Config.map((item) => {
        return (
          <ProCard.TabPane key={item.key} tab={item.name}>
            {item.config ? (
              <Tabs defaultActiveKey={fundActiveTab}>
                {item.config.map(({ key, name }) => {
                  return (
                    <TabPane key={key} tab={name}>
                      <TabTable
                        columns={item.columns}
                        code={props.code}
                        fundKey={item.key}
                        fundName={item.name}
                        fundState={key === '全部' ? '' : key}
                      />
                    </TabPane>
                  );
                })}
              </Tabs>
            ) : (
              <ProCard gutter={[cardGutter, 0]} ghost>
                <ProCard
                  colSpan={14}
                  style={{ height: '400px' }}
                  bodyStyle={{ padding: 0 }}
                  bordered
                >
                  <Area code={props.code} baseDates={baseDates} />
                </ProCard>
                <ProCardPlus
                  colSpan={5}
                  title="规模分布"
                  style={{ height: '400px' }}
                  bodyStyle={{ padding: 0 }}
                  bordered
                  extra={
                    <div
                      style={{
                        width: '156px',
                        height: '20px',
                        position: 'absolute',
                        top: 0,
                        right: -40,
                        fontSize: '12px',
                      }}
                    >
                      <div style={{ transform: 'scale(0.8)', position: 'relative' }}>
                        <span>剔除联接基金重复投资</span>
                        <div
                          style={{
                            position: 'absolute',
                            top: '18px',
                            right: 50,
                          }}
                        >
                          <Switch
                            size="small"
                            defaultChecked={false}
                            onChange={(checked: boolean) => {
                              setIsReject(checked);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  }
                >
                  <Pie
                    data={amtPieData}
                    per="亿"
                    title="基金总规模"
                    lastQuaryDay={baseDates?.lastQuaryDay}
                  />
                </ProCardPlus>
                <ProCardPlus
                  colSpan={5}
                  title="存续数量分布"
                  style={{ height: '400px' }}
                  bodyStyle={{ padding: 0 }}
                  bordered
                >
                  <Pie data={countPieData} title="总数量" lastQuaryDay={baseDates?.lastQuaryDay} />
                </ProCardPlus>
              </ProCard>
            )}
          </ProCard.TabPane>
        );
      })}
    </ProCard>
  );
}
