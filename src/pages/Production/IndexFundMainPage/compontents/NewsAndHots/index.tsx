import React, { useState, useEffect } from 'react';

import { GUTTER_SIZE } from '@/utils/utils';
import ProCardPlus from '@/components/ProCardPlus';
import ProCard from '@ant-design/pro-card';
import ProTable from '@ant-design/pro-table';
import type { ProColumns } from '@ant-design/pro-table';
// import { List } from 'antd';
import { queryIndexFundHotPlate } from '../../service';
// 日报部分应后端要求暂时先注释掉后面用的时候在打开注释
// import { queryIndexFundDailyReport, queryIndexFundHotPlate } from '../../service';
import styles from './index.less';

const CardContainer: React.FC<{ fundType?: any }> = ({}) => {
  // const [reportList, setReportList] = useState<any>([]);
  const [hotList, setHotList] = useState<any>([]);
  // 日报部分应后端要求暂时先注释掉后面用的时候在打开注释
  // const getReportFn = async () => {
  //   const data = await queryIndexFundDailyReport({});
  //   setReportList(data);
  // };
  const getHotPlateFn = async () => {
    const res = await queryIndexFundHotPlate({});
    setHotList(res);
  };
  useEffect(() => {
    // getReportFn();
    getHotPlateFn();
  }, []);

  const columns: ProColumns<any> = [
    {
      title: '基金公司',
      dataIndex: 'fundCompany',
      width: 80,
      ellipsis: true,
    },
    {
      title: '基金名称',
      dataIndex: 'fundName',
      width: 80,
      ellipsis: true,
    },
    {
      title: '交易金额(亿)',
      dataIndex: 'dealAmount',
      width: 50,
      ellipsis: true,
    },
    {
      title: '日涨跌',
      dataIndex: 'dailyRiseFall',
      width: 50,
      ellipsis: true,
      render: (_: any, record: any) => {
        return `${record?.dailyRiseFall}%`;
      },
    },
    {
      title: '基金净值',
      dataIndex: 'fundNav',
      width: 50,
      ellipsis: true,
    },
    {
      title: '基金份额(万份)',
      dataIndex: 'fundShare',
      width: 80,
      ellipsis: true,
    },
    {
      title: '基金规模(亿)',
      dataIndex: 'fundScale',
      width: 50,
      ellipsis: true,
    },
    {
      title: '前五日基金规模(亿)',
      dataIndex: 'fundScalePreFive',
      width: 80,
      ellipsis: true,
    },
    {
      title: '前20日基金规模(亿)',
      dataIndex: 'fundScalePreTwenty',
      width: 80,
      ellipsis: true,
    },
    {
      title: '份额变动(万份)',
      dataIndex: 'shareChange',
      width: 80,
      ellipsis: true,
    },
  ];

  // const reportDom = (item: any) => (
  //   <List.Item>
  //     <List.Item.Meta title={item?.dailyReportTitle} description={item?.dailyReportContent} />
  //   </List.Item>
  // );
  return (
    <ProCardPlus direction="column" ghost colSpan="100%" gutter={[0, GUTTER_SIZE]}>
      <ProCard style={{ marginTop: 8 }} gutter={GUTTER_SIZE} ghost>
        {/* // 日报部分应后端要求暂时先注释掉后面用的时候在打开注释 */}
        {/* <ProCard
          title={<p style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>ETF日报</p>}
          subTitle="已更新"
          bodyStyle={{ height: 350 }}
          bordered
          layout="center"
          className={styles['content-antd-card']}
        >
          <List
            className={styles['report-antd-list']}
            dataSource={reportList}
            renderItem={reportDom}
            itemLayout="vertical"
            size="small"
          />
        </ProCard> */}
        <ProCard
          title={<p style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>热门ETF</p>}
          // colSpan="30%"
          bordered
          className={styles['content-antd-card']}
        >
          <ProTable
            size="small"
            rowKey="fundName"
            options={false}
            search={false}
            columns={columns}
            dataSource={hotList}
            pagination={false}
            scroll={{
              y: 280,
            }}
          />
        </ProCard>
      </ProCard>
    </ProCardPlus>
  );
};

export default CardContainer;
