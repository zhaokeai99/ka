import React, { useMemo, memo, useState, useEffect } from 'react';
import ProCardPlus from '@/components/ProCardPlus';
import { Table, Radio, Space } from 'antd';
import { CaretDownFilled, CaretUpOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import { ExportExcelComponent } from '@/components/thfund-front-component/src';
import { GUTTER_SIZE, capitalLeave } from '@/utils/utils';
import type { AllMarketCapitalType } from '../../data';
import { queryIndexFundAllMarketCapital } from '../../service';
import {
  nameColor,
  iconColor,
  industryName,
  exportExcelIndustryColumns,
  exportExcelMyComponyColumns,
} from '../../config';
import styles from '../../index.less';
// 更多收起状态
let showMore = false;

const AllMarketCapital: React.FC<{ fundType?: any }> = () => {
  const [dataSource, setData] = useState<{
    allData: AllMarketCapitalType[];
    showData: AllMarketCapitalType[];
  }>({
    allData: [],
    showData: [],
  });
  const { dateInfo } = useModel('useIndexFundMainPageModal'); // 全局dateInfo
  const [loading, setLoading] = useState<boolean>(false);
  const [flowType, setFlowType] = useState<number>(0);

  // tabel Columns
  const allMarketCapitalColumns: any = useMemo(() => {
    let topColumns = [];
    if (flowType === 0) {
      topColumns = [
        {
          title: '行业名称',
          dataIndex: 'industryName',
          align: 'left',
          ellipsis: true,
          width: 110,
          onCell: () => ({
            style: {
              backgroundColor: nameColor,
              fontWeight: 'bold',
            },
          }),
        },
      ];
    } else {
      topColumns = [
        {
          title: '基金名称',
          dataIndex: 'fundName',
          align: 'left',
          ellipsis: true,
          width: 120,
          render: (text: any, record: any) => (
            <a rel="noopener noreferrer" href={`#/production/index/newDetail/${record.fundCode}`}>
              {text}
            </a>
          ),
          onCell: () => ({
            style: {
              backgroundColor: nameColor,
              fontWeight: 'bold',
            },
          }),
        },
        {
          title: '基金代码',
          dataIndex: 'fundCode',
          width: 90,
          align: 'left',
          ellipsis: true,
          render: (text: any, record: any) => (
            <a rel="noopener noreferrer" href={`#/production/index/newDetail/${record.fundCode}`}>
              {text}
            </a>
          ),
          onCell: () => ({
            style: {
              backgroundColor: nameColor,
              fontWeight: 'bold',
            },
          }),
        },
      ];
    }
    return [
      ...topColumns,
      {
        title: '最新规模',
        dataIndex: 'newScale',
        align: 'right',
        onCell: (record: any) => capitalLeave(record?.newScale),
      },
      {
        title: '区间份额变化（亿份）',
        children: [
          {
            title: '近1日',
            dataIndex: 'oneIntervalShare',
            align: 'right',
            onCell: (record: any) => capitalLeave(record?.oneIntervalShare),
          },
          {
            title: '近5日',
            dataIndex: 'fiveIntervalShare',
            align: 'right',
            onCell: (record: any) => capitalLeave(record?.fiveIntervalShare),
          },
          {
            title: '近20日',
            dataIndex: 'twentyIntervalShare',
            align: 'right',
            onCell: (record: any) => capitalLeave(record?.twentyIntervalShare),
          },
          {
            title: '近60日',
            dataIndex: 'sixtyIntervalShare',
            align: 'right',
            onCell: (record: any) => capitalLeave(record?.sixtyIntervalShare),
          },
          {
            title: '今年以来',
            dataIndex: 'thisYearIntervalShare',
            align: 'right',
            onCell: (record: any) => capitalLeave(record?.thisYearIntervalShare),
          },
        ],
      },
      {
        title: '净流入（亿）',
        children: [
          {
            title: '近1日',
            dataIndex: 'oneInflowAmount',
            align: 'right',
            onCell: (record: any) => capitalLeave(record?.oneInflowAmount),
          },
          {
            title: '近5日',
            dataIndex: 'fiveInflowAmount',
            align: 'right',
            onCell: (record: any) => capitalLeave(record?.fiveInflowAmount),
          },
          {
            title: '近20日',
            dataIndex: 'twentyInflowAmount',
            align: 'right',
            onCell: (record: any) => capitalLeave(record?.twentyInflowAmount),
          },
          {
            title: '近60日',
            dataIndex: 'sixtyInflowAmount',
            align: 'right',
            onCell: (record: any) => capitalLeave(record?.sixtyInflowAmount),
          },
          {
            title: '今年以来',
            dataIndex: 'thisYearInflowAmount',
            align: 'right',
            onCell: (record: any) => capitalLeave(record?.thisYearInflowAmount),
          },
        ],
      },
      {
        title: '日均成交额（亿）',
        children: [
          {
            title: '近1日',
            dataIndex: 'oneAverageDealAmount',
            align: 'right',
            onCell: (record: any) => capitalLeave(record?.oneAverageDealAmount),
          },
          {
            title: '近5日',
            dataIndex: 'fiveAverageDealAmount',
            align: 'right',
            onCell: (record: any) => capitalLeave(record?.fiveAverageDealAmount),
          },
          {
            title: '近20日',
            dataIndex: 'twentyAverageDealAmount',
            align: 'right',
            onCell: (record: any) => capitalLeave(record?.twentyAverageDealAmount),
          },
          {
            title: '近60日',
            dataIndex: 'sixtyAverageDealAmount',
            align: 'right',
            onCell: (record: any) => capitalLeave(record?.sixtyAverageDealAmount),
          },
          {
            title: '今年以来',
            dataIndex: 'thisYearAverageDealAmount',
            align: 'right',
            onCell: (record: any) => capitalLeave(record?.thisYearAverageDealAmount),
          },
        ],
      },
    ];
  }, [flowType]);

  // 切换展开收起
  const handleClick = (): void => {
    showMore = !showMore;
    if (showMore) {
      setData({ ...dataSource, showData: dataSource?.allData });
    } else {
      setData({ ...dataSource, showData: dataSource?.allData?.slice(0, 6) });
    }
  };

  // 切换全市场ETF资金流向
  const changeFlowType = ({ target: { value } }: any) => {
    setFlowType(value);
    showMore = false;
  };

  useEffect(() => {
    // 请求全市场ETF资金流向数据
    const getData = async () => {
      setLoading(true);
      const data = await queryIndexFundAllMarketCapital({
        businessDate: dateInfo?.changeDate,
        industryName,
        indexType: flowType,
      });
      setData({ allData: data, showData: data?.slice(0, 6) });
      setLoading(false);
    };
    getData();
  }, [dateInfo?.changeDate, flowType]);

  return (
    <ProCardPlus
      style={{ margin: '12px 0', padding: '0 4px 4px', backgroundColor: '#fff' }}
      ghost
      direction="column"
      gutter={[0, GUTTER_SIZE]}
      size="small"
      title="全市场ETF资金流向"
      extra={
        <Space>
          <Radio.Group
            buttonStyle="solid"
            onChange={changeFlowType}
            key="type"
            size="small"
            defaultValue={flowType}
            className={styles.flowTypeBtn}
          >
            <Radio.Button value={0}>行业分类</Radio.Button>
            <Radio.Button value={1}>我司产品</Radio.Button>
          </Radio.Group>
          <ExportExcelComponent
            key="export"
            exportName="导出报表"
            data={dataSource?.allData}
            columns={flowType === 0 ? exportExcelIndustryColumns : exportExcelMyComponyColumns}
            className={styles['exportbtn']}
            tableId={'allMarketCapitalTable'}
            onlyColumns={true}
          />
        </Space>
      }
    >
      <Table
        id="allMarketCapitalTable"
        columns={allMarketCapitalColumns}
        size="small"
        className={styles['allMarketCapitalTable']}
        dataSource={dataSource?.showData}
        rowKey="outUserNo"
        pagination={false}
        loading={loading}
        bordered
        summary={() => (
          <Table.Summary fixed>
            <Table.Summary.Row>
              {showMore ? (
                <Table.Summary.Cell index={0} colSpan={16}>
                  <CaretUpOutlined style={{ color: iconColor }} />
                  <a className={styles['more']} onClick={handleClick}>
                    收起
                  </a>
                </Table.Summary.Cell>
              ) : (
                <Table.Summary.Cell index={0} colSpan={16}>
                  <CaretDownFilled style={{ color: iconColor }} />
                  <a className={styles['more']} onClick={handleClick}>
                    展开查看更多
                  </a>
                </Table.Summary.Cell>
              )}
            </Table.Summary.Row>
          </Table.Summary>
        )}
      />
    </ProCardPlus>
  );
};

export default memo(AllMarketCapital);
