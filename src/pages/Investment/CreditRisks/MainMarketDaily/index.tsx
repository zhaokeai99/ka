import ProCardPlus from '@/components/ProCardPlus';
import { cardGutter, contentPadding } from '@/themes';
import ProCard from '@ant-design/pro-card';
import React, { useCallback, useEffect, useState } from 'react';
import { Empty, Spin, Tooltip } from 'antd';
import TabTable from '../TabTable';
import '../index.less';
import { Link } from 'umi';
import RightHeader from '../rightHeader';
import { queryLastWkDayByNow, queryReport } from '../service';
import moment from 'moment';

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
    title: '同上期变化',
    dataIndex: 'change',
    key: 'change',
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
    title: '较上期变动',
    dataIndex: 'change',
    key: 'change',
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

// 主体市场
const MainMarketDaily = () => {
  const [visible, setVisible] = useState<boolean>(false);
  const [date, setDate] = useState(moment(new Date()).subtract(1, 'days').format('YYYY-MM-DD'));
  const [list, setList] = useState<any>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await queryLastWkDayByNow({});
      setDate(res);
      const { data }: any = await queryReport({
        modelId: 1,
        modelProcessorMode: 'FIX',
        paramJson: [
          {
            tableName: '',
            paramName: 'queryDate',
            dataType: 'STRING',
            dataValue: res,
          },
        ],
      });
      setList(data);
    })();
  }, []);

  // 查询日期
  const onDateChange = (value: any, dateString: any) => {
    setDate(moment(dateString).format('YYYYMMDD'));
  };

  const [focusOn, setFocusOn] = useState<any[]>([]);
  const [bondFocus, setBondFocus] = useState<any[]>([]);

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
        {
          title: '触发规则',
          dataIndex: 'rule',
          key: 'rule',
        },
        {
          title: '新增',
          dataIndex: 'change',
          key: 'change',
          render: (name: number) => {
            return <Tooltip title={name}>{name === 0 ? '否' : '是'}</Tooltip>;
          },
        },
      ]);
      setBondFocus([
        {
          title: '组合名称',
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
        {
          title: '触发规则',
          dataIndex: 'rule',
          key: 'rule',
        },
      ]);
    }
  }, [date]);

  // 查询内容
  const queryScreen = useCallback(async () => {
    setLoading(true);
    const { data }: any = await queryReport({
      modelId: 1,
      modelProcessorMode: 'FIX',
      paramJson: [
        {
          tableName: '',
          paramName: 'queryDate',
          dataType: 'STRING',
          dataValue: date,
        },
      ],
    });
    setLoading(false);
    setList(data);
  }, [date]);

  return (
    <ProCard ghost size="small" gutter={[cardGutter, 0]} style={{ padding: contentPadding }}>
      <ProCard ghost direction="column">
        <ProCard style={{ marginBottom: '10px' }}>
          {date ? (
            <RightHeader
              visible={visible}
              queryScreen={queryScreen}
              getVisible={setVisible}
              date={date}
              onDateChange={onDateChange}
              modelProcessorMode={'FIX'}
            />
          ) : (
            ''
          )}
        </ProCard>
        <ProCard direction="column" ghost>
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
                  {hldingAccountResultColums.map((cur) => {
                    return (
                      <ProCard style={{ padding: '0', margin: '0 5px' }}>
                        <TabTable
                          columns={cur.columns}
                          bordered={true}
                          noPage={true}
                          data={list ? list[cur.key] : []}
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
              {/* {
              data ? focusOnResult.map(item => {
                return 
              }) : ''
            } */}
            </Spin>
          </div>
        </ProCard>
      </ProCard>
    </ProCard>
  );
};
export default MainMarketDaily;
