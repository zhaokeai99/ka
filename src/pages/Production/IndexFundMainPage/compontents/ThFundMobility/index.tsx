import React, { memo, useState, useEffect } from 'react';
import ProCardPlus from '@/components/ProCardPlus';
import { Table, Modal } from 'antd';
import { CaretDownFilled, CaretUpOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import { ExportExcelComponent } from '@/components/thfund-front-component/src';
import { GUTTER_SIZE } from '@/utils/utils';
import { ThFundMobilityType } from '../../data';
import { querythFundMobility, querySampleData, queryLinkFund } from '../../service';
import { iconColor, industryName } from '../../config';
import styles from '../../index.less';
// 更多 收起状态
let showMore = false;

const ThFundMobility: React.FC<{ fundType?: any }> = () => {
  const [dataSource, setData] = useState<{
    allData: ThFundMobilityType[];
    showData: ThFundMobilityType[];
  }>({
    allData: [], // 全数据
    showData: [], // 展示数据
  });
  const { dateInfo } = useModel('useIndexFundMainPageModal'); // 全局dateInfo
  const [loading, setLoading] = useState<boolean>(false);
  const [sampleDetailLoading, setSampleDetailLoading] = useState<boolean>(false);
  const [linkFundDetailLoading, setLinkFundDetailLoading] = useState<boolean>(false);
  const [showSampleDetail, setShowSampleDetail] = useState<boolean>(false);
  const [showLinkFundDetail, setShowLinkFundDetail] = useState<boolean>(false);
  const [sampleData, setSampleData] = useState([]);
  const [linkFundData, setLinkFundData] = useState([]);

  // 获取样本详情
  const fetchSampleDetail = async (record: any) => {
    setShowSampleDetail(true);
    setSampleDetailLoading(true);
    const result = await querySampleData({
      businessDate: dateInfo?.date,
      fundCode: record?.fundCode,
    });
    setSampleData(result);
    setSampleDetailLoading(false);
  };

  // 获取链接基金详情
  const fetchLinkFundDetail = async (record: any) => {
    setShowLinkFundDetail(true);
    setLinkFundDetailLoading(true);
    const result = await queryLinkFund({
      businessDate: dateInfo?.date,
      fundCode: record?.fundCode,
    });
    setLinkFundData(result);
    setLinkFundDetailLoading(false);
  };

  const thFundMobilityColumns = [
    {
      title: '基金代码',
      dataIndex: 'fundCode',
      align: 'left',
      render: (text: any, record: any) => (
        <a rel="noopener noreferrer" href={`#/production/index/newDetail/${record.fundCode}`}>
          {text}
        </a>
      ),
    },
    {
      title: '基金名称',
      dataIndex: 'fundName',
      align: 'left',
      render: (text: any, record: any) => (
        <a rel="noopener noreferrer" href={`#/production/index/newDetail/${record.fundCode}`}>
          {text}
        </a>
      ),
    },
    {
      title: '样本数量',
      dataIndex: 'sampleNum',
      align: 'right',
      render: (text: any, record: any) => <a onClick={() => fetchSampleDetail(record)}>{text}</a>,
    },
    {
      title: '最新规模',
      dataIndex: 'newScale',
      align: 'right',
    },
    {
      title: '联接基金规模',
      dataIndex: 'linkFundScale',
      align: 'right',
      render: (text: any, record: any) =>
        text ? <a onClick={() => fetchLinkFundDetail(record)}>{text}</a> : '-',
    },
    {
      title: '最新规模排名',
      dataIndex: 'scaleRank',
      align: 'right',
    },
    {
      title: '近5日日均成交量',
      dataIndex: 'fiveAverageDealAmount',
      align: 'right',
    },
    {
      title: '近5日成交量排名',
      dataIndex: 'fiveDealRank',
      align: 'right',
    },
    {
      title: '近3月日均成交量',
      dataIndex: 'threeMonthsAverageDealAmount',
      align: 'right',
    },
    {
      title: '近3月成交量排名',
      dataIndex: 'threeMonthsDealRank',
      align: 'right',
    },
    {
      title: '换手率',
      dataIndex: 'turnoverRate',
      align: 'right',
      render: (text: string) => `${text}%`,
    },
    {
      title: '上市日期',
      dataIndex: 'upMarketDate',
      align: 'right',
    },
    {
      title: '上市时长',
      dataIndex: 'upMarketDuration',
      align: 'right',
      render: (text: string) => `${text}天`,
    },
    {
      title: '流动性所处分为',
      dataIndex: 'mobilityPosition',
      align: 'right',
      render: (text: string) => `${text}%`,
    },
  ];

  // 样本数据详情表格配置
  const sampleColumns = [
    {
      title: '基金公司',
      dataIndex: 'fundCompany',
      render: (text: any, record: any) => (
        <a rel="noopener noreferrer" href={`#/production/fundCompany/${record.fundCompanyId}`}>
          {text}
        </a>
      ),
    },
    {
      title: '基金名称',
      dataIndex: 'fundName',
      render: (text: any, record: any) => (
        <a rel="noopener noreferrer" href={`#/production/index/newDetail/${record.fundCode}`}>
          {text}
        </a>
      ),
    },
    {
      title: '最新规模',
      dataIndex: 'newScale',
    },
    {
      title: '规模排名',
      dataIndex: 'scaleRank',
    },
    {
      title: '近5日成交量排名',
      dataIndex: 'fiveDealRank',
    },
    {
      title: '近3月成交量排名',
      dataIndex: 'threeMonthsDealRank',
    },
    {
      title: '近5日日均成交量',
      dataIndex: 'fiveAverageDealAmount',
    },
    {
      title: '近3月日均成交量',
      dataIndex: 'threeMonthsAverageDealAmount',
    },
    {
      title: '换手率',
      dataIndex: 'turnoverRate',
      render: (text: string) => `${text}%`,
    },
    {
      title: '上市日期',
      dataIndex: 'upMarketDate',
    },
  ];

  // 链接基金详情表格配置
  const linkFundColumns = [
    {
      title: '基金代码',
      dataIndex: 'fundCode',
      render: (text: any, record: any) => (
        <a rel="noopener noreferrer" href={`#/production/index/newDetail/${record.fundCode}`}>
          {text}
        </a>
      ),
    },
    {
      title: '基金名称',
      dataIndex: 'fundName',
      render: (text: any, record: any) => (
        <a rel="noopener noreferrer" href={`#/production/index/newDetail/${record.fundCode}`}>
          {text}
        </a>
      ),
    },
    {
      title: '基金规模',
      dataIndex: 'newScale',
    },
    {
      title: '昨日涨跌',
      dataIndex: 'oneQuotation',
    },
    {
      title: '昨日份额变动（万份）',
      dataIndex: 'oneIntervalShare',
    },
    {
      title: '近一周基金涨跌',
      dataIndex: 'fiveQuotation',
    },
    {
      title: '近一周份额变动（万份）',
      dataIndex: 'fiveIntervalShare',
    },
  ];

  // 展开收起切换
  const handleClick = (): void => {
    showMore = !showMore;
    if (showMore) {
      setData({ ...dataSource, showData: dataSource?.allData });
    } else {
      setData({ ...dataSource, showData: dataSource?.allData?.slice(0, 6) });
    }
  };

  // 关闭
  const onCloseLinkFundDetail = () => setShowLinkFundDetail(false);
  const onCloseSampleDetail = () => setShowSampleDetail(false);

  // 我司要标红 由于后端没有其他标识可以标记天弘基金 跟后端沟通后用中文判断
  const rowClassName = (record: any, index: number) => {
    return sampleData.length - 1 === index ? styles['selected-row'] : '';
  };

  useEffect(() => {
    // 获取我司ETF基金流动性数据
    const getData = async () => {
      setLoading(true);
      const data = await querythFundMobility({ businessDate: dateInfo?.changeDate, industryName });
      setData({
        allData: data,
        showData: showMore ? data : data?.slice(0, 6),
      });
      setLoading(false);
    };
    getData();
  }, [dateInfo?.changeDate]);

  return (
    <ProCardPlus
      style={{ margin: '12px 0', padding: '0 4px 4px', backgroundColor: '#fff' }}
      ghost
      direction="column"
      gutter={[0, GUTTER_SIZE]}
      size="small"
      title="我司ETF基金流动性"
      extra={
        <ExportExcelComponent
          exportName="导出报表"
          data={dataSource?.allData}
          columns={thFundMobilityColumns}
          className={styles['exportbtn']}
          tableId={'thFundMobilityTable'}
        />
      }
    >
      <Table
        columns={thFundMobilityColumns}
        id="thFundMobilityTable"
        size="small"
        className={styles['thFundMobilityTable']}
        dataSource={dataSource?.showData}
        rowKey="outUserNo"
        pagination={false}
        loading={loading}
        summary={() => (
          <Table.Summary fixed>
            <Table.Summary.Row>
              {showMore ? (
                <Table.Summary.Cell index={0} colSpan={13}>
                  <CaretUpOutlined style={{ color: iconColor }} />
                  <a className={styles['more']} onClick={handleClick}>
                    收起
                  </a>
                </Table.Summary.Cell>
              ) : (
                <Table.Summary.Cell index={0} colSpan={13}>
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
      <Modal
        width="85%"
        title="样本数据详情"
        open={showSampleDetail}
        onCancel={onCloseSampleDetail}
        footer={null}
      >
        <Table
          id="thFundMobilitySampleDetailTable"
          loading={sampleDetailLoading}
          columns={sampleColumns}
          dataSource={sampleData}
          size="small"
          pagination={false}
          className={styles['thFundMobilitySampleDetailTable']}
          rowClassName={rowClassName}
        />
      </Modal>
      <Modal
        width="85%"
        title="链接基金详情"
        open={showLinkFundDetail}
        onCancel={onCloseLinkFundDetail}
        footer={null}
      >
        <Table
          loading={linkFundDetailLoading}
          columns={linkFundColumns}
          dataSource={linkFundData}
          size="small"
          pagination={false}
        />
      </Modal>
    </ProCardPlus>
  );
};

export default memo(ThFundMobility);
