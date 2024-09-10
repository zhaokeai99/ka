import ProCardPlus from '@/components/ProCardPlus';
import { cardGutter, contentPadding } from '@/themes';
import { tableEmptyCellRender } from '@/utils/utils';
import ProCard from '@ant-design/pro-card';
import { Empty, Spin, Tabs, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link } from 'umi';
import Circle from './Circle';
import HotGroup from './HotGroup';
import TopicList from './List';
import { fetchPageData, checkJumpUrl } from './service';
import SurvivalTable from './SurvivalTabTable';
import TabTable from './TabTable';

const { TabPane } = Tabs;

let survivalColumns = [
  {
    title: '产品名称',
    dataIndex: 'fundShortName',
    key: 'fundShortName',
    fixed: 'left',
    width: 340,
    render: (name: string, item: any) => (
      <Tooltip title={name}>
        <Link
          // to={`/production/index/detail/${item.fundId}`}
          to={checkJumpUrl(item)}
          className="text-ellipsis"
          style={{ width: '320px' }}
        >
          {name}
        </Link>
      </Tooltip>
    ),
  },
  {
    title: '产品代码',
    dataIndex: 'fundCode',
    key: 'fundCode',
  },
  {
    title: '成立日期',
    dataIndex: 'collectBeginDate',
    key: 'collectBeginDate',
  },
  {
    title: '产品经理',
    dataIndex: 'productManager',
    key: 'productManager',
  },
  {
    title: '二级分类',
    dataIndex: 'productTypeTwoDesc',
    key: 'productTypeTwoDesc',
  },
  {
    title: '基金经理',
    dataIndex: 'fundManager',
    key: 'fundManager',
  },
  {
    title: '管理费',
    dataIndex: 'manageFee',
    key: 'manageFee',
  },
  {
    title: '托管费',
    dataIndex: 'custodyFee',
    key: 'custodyFee',
  },
  {
    title: '销售服务费',
    dataIndex: 'saleServiceFee',
    key: 'saleServiceFee',
  },
  {
    title: '主要策略',
    dataIndex: 'mainStrategy',
    key: 'mainStrategy',
  },
  {
    title: '公司业务线',
    dataIndex: 'corpBusinessLine',
    key: 'corpBusinessLine',
  },
];

// 公募变动产品
const pdFundTabConfig = [
  {
    key: 'NEW',
    name: '新发进度',
    columns: [
      {
        title: '产品名称',
        dataIndex: 'fundName',
        key: 'fundName',
        width: 340,
        render: (name: string, item: any) => (
          <Tooltip title={name}>
            <Link
              // to={`/production/index/detail/${item.fundId}`}
              to={checkJumpUrl(item)}
              className="text-ellipsis"
              style={{ width: '320px' }}
            >
              {name}
            </Link>
          </Tooltip>
        ),
      },
      {
        title: '产品类型',
        dataIndex: 'fundTypeLevel2',
        key: 'fundTypeLevel2',
      },
      {
        title: '发起背景',
        dataIndex: 'launchBackground',
        key: 'launchBackground',
      },
      {
        title: '产品经理',
        dataIndex: 'productManager',
        key: 'productManager',
      },
      {
        title: '方案评估',
        dataIndex: 'programmeEvaluate',
        key: 'programmeEvaluate',
      },
      {
        title: '评估结果',
        dataIndex: 'evaluateResult',
        key: 'evaluateResult',
      },
      {
        title: '准备报备',
        dataIndex: 'planReport',
        key: 'planReport',
      },
      {
        title: '上报受理',
        dataIndex: 'reportDeal',
        key: 'reportDeal',
      },
      {
        title: '产品评审会',
        dataIndex: 'productEvaluateMeet',
        key: 'productEvaluateMeet',
      },
      {
        title: '一次反馈',
        dataIndex: 'feedback',
        key: 'feedback',
      },
      {
        title: '定稿待批',
        dataIndex: 'finalizeApprove',
        key: 'finalizeApprove',
      },
      {
        title: '批复待发',
        dataIndex: 'approveRelease',
        key: 'approveRelease',
      },
      {
        title: '发行档期',
        dataIndex: 'releaseSchedule',
        key: 'releaseSchedule',
      },
    ],
  },
  {
    key: 'CHANGE',
    name: '改造进度',
    columns: [
      {
        title: '产品名称',
        dataIndex: 'fundName',
        key: 'fundName',
      },
      {
        title: '产品类型',
        dataIndex: 'fundTypeLevel2',
        key: 'fundTypeLevel2',
      },
      {
        title: '发起背景',
        dataIndex: 'launchBackground',
        key: 'launchBackground',
      },
      {
        title: '产品经理',
        dataIndex: 'productManager',
        key: 'productManager',
      },
      {
        title: '方案评估',
        dataIndex: 'programmeEvaluate',
        key: 'programmeEvaluate',
      },
      {
        title: '评估结果',
        dataIndex: 'evaluateResult',
        key: 'evaluateResult',
      },
      {
        title: '准备报备',
        dataIndex: 'planReport',
        key: 'planReport',
      },
      {
        title: '上报受理',
        dataIndex: 'reportDeal',
        key: 'reportDeal',
      },
      {
        title: '一次反馈',
        dataIndex: 'feedback',
        key: 'feedback',
      },
      {
        title: '定稿待批',
        dataIndex: 'finalizeApprove',
        key: 'finalizeApprove',
      },
      {
        title: '批复',
        dataIndex: 'approved',
        key: 'approved',
      },
      {
        title: '召开持有人大会',
        dataIndex: 'conveneHolderMeet',
        key: 'conveneHolderMeet',
      },
    ],
  },
  {
    key: 'CLEAR',
    name: '清盘进度',
    columns: [
      {
        title: '产品名称',
        dataIndex: 'fundName',
        key: 'fundName',
      },
      {
        title: '托管行',
        dataIndex: 'trusteeBank',
        key: 'trusteeBank',
      },
      {
        title: '发起背景',
        dataIndex: 'launchBackground',
        key: 'launchBackground',
      },
      {
        title: '产品经理',
        dataIndex: 'productManager',
        key: 'productManager',
      },
      {
        title: '发起部门',
        dataIndex: 'launchDepartment',
        key: 'launchDepartment',
      },
      {
        title: '清盘触发',
        dataIndex: 'clearTriggerDate',
        key: 'clearTriggerDate',
      },
      {
        title: '事前报备',
        dataIndex: 'priorReport',
        key: 'priorReport',
      },
      {
        title: '基金清盘流程',
        dataIndex: 'fundClearProcess',
        key: 'fundClearProcess',
      },
      {
        title: '清盘完成报备',
        dataIndex: 'clearDoneReport',
        key: 'clearDoneReport',
      },
      {
        title: '披露清算公告',
        dataIndex: 'publishClearNotice',
        key: 'publishClearNotice',
      },
    ],
  },
];

const ProductionIndex: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [pbFundActiveTab] = useState('NEW');
  const [pdStatusDistData, setPdStatusDistData] = useState([]);
  const [pdAuditPolicyData, setPdAuditPolicyData] = useState([]);
  const [dynamicData, setDynamicData] = useState([]);
  const [mutualData, setMutualData] = useState([]);
  const [survivalType, setSurvivalType] = useState<any[]>([]);
  const [survivalPieData, setSurvivalPieData] = useState([]);

  // 请求
  useEffect(() => {
    // 添加表格空值占位符
    survivalColumns = tableEmptyCellRender(survivalColumns);
    (async () => {
      const result = await fetchPageData();
      setPdStatusDistData(result[0]);
      setDynamicData(result[1]);
      setPdAuditPolicyData(result[2]);
      setMutualData(result[3]);
      setSurvivalType(result[4]);
      setSurvivalPieData(result[5]);
      setLoading(false);
    })();
  }, []);

  return (
    <ProCard
      style={{ padding: contentPadding }}
      direction="column"
      ghost
      gutter={[0, cardGutter]}
      size="small"
    >
      <HotGroup />
      <ProCard gutter={[cardGutter, 0]} ghost>
        <ProCardPlus
          colSpan={17}
          title="公募变动产品"
          style={{ height: '400px' }}
          bodyStyle={{ paddingTop: 0 }}
        >
          <Tabs defaultActiveKey={pbFundActiveTab}>
            {pdFundTabConfig.map(({ key, name, columns }) => (
              <TabPane key={key} tab={name}>
                <TabTable columns={columns} fundState={key} />
              </TabPane>
            ))}
          </Tabs>
        </ProCardPlus>
        <ProCardPlus
          title="产品状态分布"
          layout="center"
          style={{ height: '400px' }}
          loading={loading && <Spin spinning />}
        >
          <Circle data={pdStatusDistData} />
        </ProCardPlus>
      </ProCard>
      <ProCard gutter={[cardGutter, 0]} ghost>
        <ProCardPlus
          colSpan={17}
          title="公募存续产品"
          style={{ height: '400px' }}
          bodyStyle={{ paddingTop: 0 }}
        >
          <Tabs defaultActiveKey={survivalType[0]?.label}>
            {survivalType?.map((item: any) => (
              <TabPane key={item.value} tab={item.label}>
                <SurvivalTable columns={survivalColumns} fundState={item.value} />
              </TabPane>
            ))}
          </Tabs>
        </ProCardPlus>
        <ProCardPlus
          title="产品类型分布"
          layout="center"
          style={{ height: '400px' }}
          loading={loading && <Spin spinning />}
        >
          {survivalPieData && survivalPieData.length === 0 ? (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          ) : (
            <Circle data={survivalPieData} type="pie" />
          )}
        </ProCardPlus>
      </ProCard>
      <ProCard gutter={[cardGutter, 0]} ghost>
        <ProCardPlus
          title="竞品注册动态"
          style={{ height: '400px' }}
          colSpan={8}
          layout="center"
          loading={loading && <Spin spinning />}
          extra={<Link to="/production/report/competitorRegister">更多</Link>}
        >
          {mutualData.length === 0 ? (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          ) : (
            <TopicList data={mutualData} />
          )}
        </ProCardPlus>
        <ProCardPlus
          title="指数动态"
          style={{ height: '400px' }}
          colSpan={8}
          layout="center"
          loading={loading && <Spin spinning />}
          extra={<Link to="/production/report/announcementList">更多</Link>}
        >
          {dynamicData.length === 0 ? (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          ) : (
            <TopicList data={dynamicData} />
          )}
        </ProCardPlus>
        <ProCardPlus
          title="公募产品审核政策"
          style={{ height: '400px' }}
          colSpan={8}
          layout="center"
          loading={loading && <Spin spinning />}
          extra={<Link to="/production/report/pdAuditPolicy">更多</Link>}
        >
          {pdAuditPolicyData.length === 0 ? (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          ) : (
            <TopicList data={pdAuditPolicyData} />
          )}
        </ProCardPlus>
      </ProCard>
    </ProCard>
  );
};

export default ProductionIndex;
