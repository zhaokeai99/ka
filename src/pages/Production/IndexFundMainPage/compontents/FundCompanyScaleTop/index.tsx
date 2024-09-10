import React, { useMemo, memo, useState, useEffect } from 'react';
import ProCardPlus from '@/components/ProCardPlus';
import { Table } from 'antd';
import { CaretDownFilled, CaretUpOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import { ExportExcelComponent } from '@/components/thfund-front-component/src';
import { GUTTER_SIZE } from '@/utils/utils';
import { FundCompanyScaleTopType } from '../../data';
import { queryIndexFundCompanyScaleTop } from '../../service';
import { iconColor, industryName, exportExcelFundComponyTotalColumns } from '../../config';
import styles from '../../index.less';
// 更多 收起状态
let showMore = false;

const FundCompanyScaleTop: React.FC<{ fundType?: any }> = () => {
  const [dataSource, setData] = useState<{
    allData: FundCompanyScaleTopType[];
    showData: FundCompanyScaleTopType[];
  }>({
    allData: [],
    showData: [],
  });
  const { dateInfo } = useModel('useIndexFundMainPageModal'); // 全局dateInfo
  const [loading, setLoading] = useState<boolean>(false);

  // 获取基金公司汇总数据
  const getData = async () => {
    setLoading(true);
    const data = await queryIndexFundCompanyScaleTop({
      businessDate: dateInfo?.changeDate,
      industryName,
    });
    setData({
      allData: data,
      showData: showMore ? data : data?.slice(0, 6),
    });
    setLoading(false);
  };

  const fundCompanyScaleTopColumns: any = useMemo(
    () => [
      {
        title: '基金公司',
        dataIndex: 'fundCompany',
        align: 'left',
        render: (text: any, record: any) => (
          <a rel="noopener noreferrer" href={`#/production/fundCompany/${record.fundCompanyId}`}>
            {text}
          </a>
        ),
      },
      {
        title: '最新规模',
        dataIndex: 'fundScale',
        align: 'right',
      },
      {
        title: '产品数量',
        dataIndex: 'productCount',
        align: 'right',
      },
      {
        title: '平均规模',
        dataIndex: 'averageScale',
        align: 'right',
      },
      {
        title: '净流入金额（亿）',
        children: [
          {
            title: '近1日',
            dataIndex: 'oneInflowAmount',
            align: 'right',
          },
          {
            title: '近5日',
            dataIndex: 'fiveInflowAmount',
            align: 'right',
          },
          {
            title: '近20日',
            dataIndex: 'twentyInflowAmount',
            align: 'right',
          },
          {
            title: '近60日',
            dataIndex: 'sixtyInflowAmount',
            align: 'right',
          },
          {
            title: '今年以来',
            dataIndex: 'thisYearInflowAmount',
            align: 'right',
          },
        ],
      },
      {
        title: '排名',
        children: [
          {
            title: '规模',
            dataIndex: 'scaleRank',
            align: 'center',
          },
          {
            title: '数量',
            dataIndex: 'numRank',
            align: 'center',
          },
          {
            title: '近60日净流入',
            dataIndex: 'sixtyInflowAmountRank',
            align: 'center',
          },
          {
            title: '今年以来净流入',
            dataIndex: 'thisYearInflowAmountRank',
            align: 'center',
          },
        ],
      },
    ],
    [],
  );

  // 切换更多 收起
  const handleClick = (): void => {
    showMore = !showMore;
    if (showMore) {
      setData({ ...dataSource, showData: dataSource?.allData });
    } else {
      setData({ ...dataSource, showData: dataSource?.allData?.slice(0, 6) });
    }
  };

  // 我司要标红 由于后端没有其他标识可以标记天弘基金 跟后端沟通后用中文判断
  const rowClassName = (record: any) => {
    return record.fundCompany === '天弘基金' ? styles['selected-row'] : '';
  };

  useEffect(() => {
    getData();
  }, [dateInfo?.changeDate]);

  return (
    <ProCardPlus
      style={{ margin: '12px 0', padding: '0 4px 4px', backgroundColor: '#fff' }}
      ghost
      direction="column"
      gutter={[0, GUTTER_SIZE]}
      size="small"
      title="基金公司汇总"
      extra={
        <ExportExcelComponent
          exportName="导出报表"
          data={dataSource?.allData}
          columns={exportExcelFundComponyTotalColumns}
          onlyColumns={true}
          className={styles['exportbtn']}
          tableId={'fundCompanyScaleTopTable'}
        />
      }
    >
      <Table
        columns={fundCompanyScaleTopColumns}
        id="fundCompanyScaleTopTable"
        size="small"
        className={styles['fundCompanyScaleTopTable']}
        dataSource={dataSource?.showData}
        rowKey="outUserNo"
        pagination={false}
        rowClassName={rowClassName}
        bordered
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
    </ProCardPlus>
  );
};

export default memo(FundCompanyScaleTop);
