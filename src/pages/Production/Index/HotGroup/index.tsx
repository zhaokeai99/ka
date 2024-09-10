import ProCardPlus from '@/components/ProCardPlus';
import { numberToT } from '@/utils/utils';
import { Line } from '@ant-design/charts';
import ProCard from '@ant-design/pro-card';
import { Empty, Tabs, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import { Link } from 'umi';
import { linearHotProducts, checkJumpUrl } from '../service';
import TabTable from './TabTable';

const { TabPane } = Tabs;

const lineConfig: any = {
  data: [],
  padding: 'auto',
  xField: 'label',
  yField: 'value',
  appendPadding: 2,
  xAxis: {
    label: {
      autoHide: true,
      autoRotate: true,
    },
  },
  yAxis: {
    label: {
      formatter: (v: any) => {
        return numberToT(v);
      },
    },
  },
  style: {
    width: '100%',
    height: '100%',
  },
};

const HotGroup = () => {
  const [hotFundActiveTab, setHotFundActiveTab] = useState('COLLECT');
  const [lineData, setLineData] = useState([]);
  const [selectedFundId, setSelectedFundId] = useState(null);
  const [tabSelectedFundId, setTabSelectedFundId] = useState(null);
  const [selectedFundName, setSelectedFundName] = useState(null);
  const [tabSelectedFundName, setTabSelectedFundName] = useState(null);

  // 热点产品
  const hotFundTabConfig = [
    {
      key: 'COLLECT',
      name: '发行中',
      columns: [
        {
          title: '产品名称',
          dataIndex: 'fundShortName',
          key: 'fundShortName',
          width: 300,
          render: (name: string, item: any) => (
            <Tooltip title={name}>
              <Link
                // to={`/production/index/detail/${item.fundId}`}
                to={checkJumpUrl(item)}
                className="text-ellipsis"
                style={{ width: '99%' }}
              >
                {name}
              </Link>
            </Tooltip>
          ),
        },
        {
          title: '产品大类',
          dataIndex: 'productTypeDesc',
          key: 'productTypeDesc',
        },
        {
          title: '产品类型',
          dataIndex: 'productTypeOneDesc',
          key: 'productTypeOneDesc',
        },
        {
          title: '产品经理',
          dataIndex: 'productManager',
          key: 'productManager',
        },
        {
          title: '基金经理/投资经理',
          dataIndex: 'fundManager',
          key: 'fundManager',
        },
        {
          title: '募集开始日',
          dataIndex: 'collectBeginDate',
          key: 'collectBeginDate',
        },
        {
          title: '募集结束日',
          dataIndex: 'collectEndDate',
          key: 'collectEndDate',
        },
        {
          title: '最新规模(万)',
          dataIndex: 'latestScale',
          key: 'latestScale',
        },
      ],
    },
    {
      key: 'OPEN',
      name: '开放中',
      columns: [
        {
          title: '产品名称',
          dataIndex: 'fundShortName',
          key: 'fundShortName',
          width: 340,
          render: (name: string, item: any) => (
            <Tooltip title={name}>
              <Link
                // to={`/production/index/detail/${item.fundId}`}
                to={checkJumpUrl(item)}
                className="text-ellipsis"
                style={{ width: '330px' }}
              >
                {name}
              </Link>
            </Tooltip>
          ),
        },
        {
          title: '产品大类',
          dataIndex: 'productTypeDesc',
          key: 'productTypeDesc',
        },
        {
          title: '产品类型',
          dataIndex: 'productTypeOneDesc',
          key: 'productTypeOneDesc',
        },
        {
          title: '产品经理',
          dataIndex: 'productManager',
          key: 'productManager',
        },
        {
          title: '基金经理/投资经理',
          dataIndex: 'fundManager',
          key: 'fundManager',
        },
        {
          title: '开放开始日',
          dataIndex: 'openBeginDate',
          key: 'openBeginDate',
        },
        {
          title: '开放结束日',
          dataIndex: 'openEndDate',
          key: 'openEndDate',
        },
        {
          title: '最新规模(万)',
          dataIndex: 'latestScale',
          key: 'latestScale',
        },
      ],
    },
    {
      key: 'LAST_MONTH',
      name: '上月成立大事项',
      columns: [
        {
          title: '产品名称',
          dataIndex: 'fundShortName',
          key: 'fundShortName',
          width: 340,
          render: (name: string, item: any) => (
            <Tooltip title={name}>
              <Link
                // to={`/production/index/detail/${item.fundId}`}
                to={checkJumpUrl(item)}
                className="text-ellipsis"
                style={{ width: '330px' }}
              >
                {name}
              </Link>
            </Tooltip>
          ),
        },
        {
          title: '产品大类',
          dataIndex: 'productType',
          key: 'productType',
        },
        {
          title: '产品经理',
          dataIndex: 'productManager',
          key: 'productManager',
        },
        {
          title: '基金经理/投资经理',
          dataIndex: 'fundInvestManager',
          key: 'fundInvestManager',
        },
        {
          title: '成立日',
          dataIndex: 'setUpDate',
          key: 'setUpDate',
        },
        {
          title: '成立规模(元)',
          dataIndex: 'totalAmount',
          key: 'totalAmount',
        },
      ],
    },
    {
      key: 'CURRENT_MONTH',
      name: '本月成立大事项',
      columns: [
        {
          title: '产品名称',
          dataIndex: 'fundShortName',
          key: 'fundShortName',
          width: 340,
          render: (name: string, item: any) => (
            <Tooltip title={name}>
              <Link
                // to={`/production/index/detail/${item.fundId}`}
                to={checkJumpUrl(item)}
                className="text-ellipsis"
                style={{ width: '330px' }}
              >
                {name}
              </Link>
            </Tooltip>
          ),
        },
        {
          title: '产品大类',
          dataIndex: 'productType',
          key: 'productType',
        },
        {
          title: '产品经理',
          dataIndex: 'productManager',
          key: 'productManager',
        },
        {
          title: '基金经理/投资经理',
          dataIndex: 'fundInvestManager',
          key: 'fundInvestManager',
        },
        {
          title: '成立日',
          dataIndex: 'setUpDate',
          key: 'setUpDate',
        },
        {
          title: '成立规模(元)',
          dataIndex: 'totalAmount',
          key: 'totalAmount',
        },
      ],
    },
  ];

  const tableCallback = (data: any) => {
    setSelectedFundId(data.fundId);
    setSelectedFundName(data.fundShortName);
  };

  useEffect(() => {
    if (selectedFundId) {
      (async () => {
        const result = await linearHotProducts({
          stage: hotFundActiveTab,
          fundId: selectedFundId,
        });

        setLineData(result);
      })();
    }
  }, [selectedFundId, hotFundActiveTab]);

  return (
    <ProCard gutter={[8, 0]} ghost>
      <ProCardPlus
        colSpan={17}
        title="热点产品"
        style={{ height: '400px' }}
        bodyStyle={{ paddingTop: 0 }}
        extra={<Link to="/production/summary/hotFundIndex/_single_">更多</Link>}
      >
        <Tabs
          defaultActiveKey={hotFundActiveTab}
          onChange={(v) => {
            setSelectedFundId(tabSelectedFundId);
            setSelectedFundName(tabSelectedFundName);
            setHotFundActiveTab(v);
            setTabSelectedFundId(selectedFundId);
            setTabSelectedFundName(selectedFundName);
          }}
        >
          {hotFundTabConfig.map(({ key, name, columns }) => (
            <TabPane key={key} tab={name}>
              <TabTable
                columns={columns || []}
                stage={key}
                callback={tableCallback}
                tab={hotFundActiveTab}
              />
            </TabPane>
          ))}
        </Tabs>
      </ProCardPlus>
      <ProCardPlus title="规模变化" layout="center" style={{ height: '400px' }}>
        {!lineData || lineData.length === 0 ? (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        ) : (
          <Line
            {...lineConfig}
            data={lineData}
            xAxis={{ ...lineConfig.xAxis, title: { text: selectedFundName || '' } }}
          />
        )}
      </ProCardPlus>
    </ProCard>
  );
};

HotGroup.isProCard = true;

export default HotGroup;
