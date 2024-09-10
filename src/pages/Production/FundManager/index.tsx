import ProCard from '@ant-design/pro-card';
import { TabLayoutContext } from '@/components/thfund-front-component/src';
import React, { useEffect, useState, useContext } from 'react';
// import { HeartOutlined, HeartFilled } from '@ant-design/icons';
import ProCardPlus from '@/components/ProCardPlus';
import { cardGutter, contentPadding } from '@/themes';
import { Empty, Tabs, Tooltip } from 'antd';
import { Link } from 'umi';
import ManageList from './ManageList';
import { getByCode } from './service';
import Statistics from './Statistics';
import TabTable from './TabTable';

const { TabPane } = Tabs;

const FundManager: React.FC = ({ match }: any) => {
  const { key: tabKey, setTabTitle } = useContext(TabLayoutContext);
  const { code } = match.params;
  const [hotFundActiveTab] = useState('InTheTube');
  const [listData, setListData] = useState<any>([]);
  const [statisticsData, setStatisticsData] = useState<any>({});

  // const attentionClick = () => {
  //   // TODO
  // };

  useEffect(() => {
    (async () => {
      const result = await getByCode({
        code,
      });
      const data = [];
      setTabTitle(tabKey, result.name);
      data.push(result);
      setListData(data);
      setStatisticsData(result);
    })();
  }, []);

  const columnsConfig = [
    {
      key: 'fundCode',
      title: '产品代码',
      dataIndex: 'fundCode',
      width: '80px',
      search: false,
      fixed: 'left',
      render: (name: string, item: any) => (
        <Tooltip title={name}>
          {item.fundCode ? (
            <Link to={`/production/index/newDetail/${item.fundCode}`} className="text-ellipsis">
              {name}
            </Link>
          ) : (
            name
          )}
        </Tooltip>
      ),
    },
    {
      key: 'fundName',
      title: '产品名称',
      dataIndex: 'fundName',
      hideInSearch: true,
      fixed: 'left',
      render: (name: string, item: any) => (
        <div style={{ width: 120 }}>
          <Tooltip title={name}>
            {item.fundCode ? (
              <Link to={`/production/index/newDetail/${item.fundCode}`}>{name}</Link>
            ) : (
              name
            )}
          </Tooltip>
        </div>
      ),
    },
    {
      key: 'contractEffectTime',
      title: '成立日期',
      dataIndex: 'contractEffectTime',
      hideInSearch: true,
    },
    {
      key: 'shareAddDate',
      title: '份额新增日期',
      dataIndex: 'shareAddDate',
      hideInSearch: true,
    },
    {
      key: 'transitionDate',
      title: '转型日期',
      dataIndex: 'transitionDate',
      hideInSearch: true,
    },
    {
      key: 'fundStatus',
      title: '产品状态',
      dataIndex: 'fundStatus',
    },
    {
      key: 'productTypeOne',
      title: '我司产品类型',
      dataIndex: 'productTypeOne',
    },
    {
      key: 'thFundClass',
      title: 'wind产品类型',
      dataIndex: 'thFundClass',
    },
    {
      key: 'curFundManagerList',
      title: '基金经理',
      dataIndex: 'curFundManagerList',
      render: (name: any) => {
        return name.map((cur: { code: string; name: string }) => {
          return (
            <Tooltip style={{ display: 'flex' }} title={cur.code}>
              <Link to={`/production/fundManager/${cur.code}`} className="text-ellipsis">
                {cur.name}
              </Link>
            </Tooltip>
          );
        });
      },
    },
    {
      key: 'productTypeOne',
      title: '一级分类',
      dataIndex: 'productTypeOne',
    },
    {
      key: 'workStartDate',
      title: '任职开始时间',
      dataIndex: 'workStartDate',
      valueType: 'select',
      hideInSearch: true,
    },
    {
      key: 'workEndDate',
      title: '任职结束时间',
      dataIndex: 'workEndDate',
      valueType: 'select',
      hideInSearch: true,
    },
    {
      key: 'awardinfo',
      title: '奖项',
      width: 180,
      dataIndex: 'awardinfo',
    },
    {
      key: 'workPeriodReturn',
      title: '任期回报',
      dataIndex: 'workPeriodReturn',
      valueType: 'select',
      hideInSearch: true,
    },
    {
      key: 'officeFundDayCnt',
      title: '任职天数',
      dataIndex: 'officeFundDayCnt',
    },
    {
      key: 'workIncomeRate',
      title: '累计收益',
      dataIndex: 'workIncomeRate',
    },
    {
      key: 'workAnnualIncomeRate',
      title: '年化收益',
      dataIndex: 'workAnnualIncomeRate',
    },
    {
      key: 'workAddIncomeRate',
      title: '超额收益',
      dataIndex: 'workAddIncomeRate',
    },
    {
      key: 'yearsIncome',
      title: '会计年度产品及比较基准业绩',
      dataIndex: 'yearsIncome',
      width: 200,
    },

    // {
    //   title: '加入关注',
    //   dataIndex: 'releaseReport',
    //   hideInSearch: true,
    //   render: (_, record) => {
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
      title: '在管产品',
      key: 'InTheTube',
      type: 0,
      columns: columnsConfig,
      role: 1,
    },
    {
      title: '基助在管产品',
      key: 'BaseToHelpInTheTube',
      type: 0,
      columns: columnsConfig,
      role: 4,
    },
    {
      title: '拟任产品',
      key: 'DesignatedProduct',
      type: 1,
      columns: columnsConfig,
    },
    {
      title: '历任产品',
      key: 'AnyProduct',
      type: 2,
      columns: columnsConfig,
    },
  ];
  return (
    <ProCard ghost direction="column">
      <ProCard style={{ padding: contentPadding }} ghost gutter={[0, cardGutter]} size="small">
        <ProCardPlus>
          {listData.length ? (
            <ManageList listData={listData} code={code} />
          ) : (
            <Empty
              style={{
                width: '100%',
                height: '100%',
                padding: '0',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          )}
          <div className="statistics" style={{ padding: '20px 0' }}>
            <Statistics statisticsData={statisticsData} />
          </div>
        </ProCardPlus>
      </ProCard>
      <ProCard style={{ padding: contentPadding }} ghost gutter={[0, cardGutter]} size="small">
        <ProCardPlus>
          <Tabs defaultActiveKey={hotFundActiveTab}>
            {config.length ? (
              config.map(({ key, title, columns, type, role }) => (
                <TabPane key={key} tab={title}>
                  <TabTable
                    rowKey={key}
                    columns={columns || []}
                    type={type}
                    code={code || ''}
                    role={role}
                  />
                </TabPane>
              ))
            ) : (
              <Empty
                style={{
                  width: '100%',
                  height: '100%',
                  padding: '0',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            )}
          </Tabs>
        </ProCardPlus>
      </ProCard>
    </ProCard>
  );
};

export default FundManager;
