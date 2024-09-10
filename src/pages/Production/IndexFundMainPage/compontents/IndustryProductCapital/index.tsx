import React, { useMemo, memo, useState, useEffect, useCallback } from 'react';
import ProCardPlus from '@/components/ProCardPlus';
import { Table, Select, Button } from 'antd';
import { CaretDownFilled, CaretUpOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import { ExportExcelComponent } from '@/components/thfund-front-component/src';
import { GUTTER_SIZE, capitalLeave } from '@/utils/utils';
import { AllMarketCapitalType } from '../../data';
import { queryIndustry, industryProductCapital } from '../../service';
import { nameColor, iconColor, exportExcelColums } from '../../config';
import styles from '../../index.less';
// 更多收起状态
let showMore = false;

const IndustryProductCapital: React.FC<{ fundType?: any }> = () => {
  const [dataSource, setData] = useState<{
    allData: AllMarketCapitalType[];
    showData: AllMarketCapitalType[];
  }>({
    allData: [],
    showData: [],
  }); // 全部数据和需要展示的数据
  const [industryOptions, setIndustryOptions] = useState<any[]>([]); // 行业下拉选项
  const [chooseOption, setChooseOption] = useState(null); // 行业选择项
  const { dateInfo } = useModel('useIndexFundMainPageModal'); // 全局业务日期
  const [loading, setLoading] = useState<boolean>(false);

  // 获取行业产品资金流向
  const getData = async () => {
    setLoading(true);
    const params = {
      businessDate: dateInfo?.changeDate || dateInfo?.date,
      industryName: chooseOption || null,
    };
    const data = await industryProductCapital(params);
    setData({
      allData: data,
      showData: showMore ? data : data?.slice(0, 6),
    });
    setLoading(false);
  };

  // 获取ETF行业分类
  const getIndustry = useCallback(async () => {
    const data = await queryIndustry();
    setIndustryOptions([
      {
        industryName: '全部',
        industryValue: null,
      },
      ...data,
    ]);
  }, []);

  // 行业产品资金流向columns
  const industryProductCapitalColumns: any = useMemo(
    () => [
      {
        title: '行业名称',
        dataIndex: 'industryName',
        align: 'left',
        width: 90,
        ellipsis: true,
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
        align: 'left',
        width: 90,
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
        width: 90,
        ellipsis: true,
        render: (text: any, record: any) => (
          <a rel="noopener noreferrer" href={`#/production/index/newDetail/${record.fundCode}`}>
            {text}
          </a>
        ),
      },
      {
        title: '基金公司',
        dataIndex: 'fundCompany',
        align: 'left',
        width: 90,
        ellipsis: true,
        render: (text: any, record: any) => (
          <a rel="noopener noreferrer" href={`#/production/fundCompany/${record.fundCompanyId}`}>
            {text}
          </a>
        ),
      },

      {
        title: '最新规模',
        dataIndex: 'newScale',
        width: 70,
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
    ],
    [],
  );

  // 点击展开收起
  const handleClick = (): void => {
    showMore = !showMore;
    if (showMore) {
      setData({ ...dataSource, showData: dataSource?.allData });
    } else {
      setData({ ...dataSource, showData: dataSource?.allData?.slice(0, 6) });
    }
  };

  // 选择ETF行业
  const handleChange = (value: any) =>
    value === '全部' ? setChooseOption(null) : setChooseOption(value); // 全部不是null 后端查不出来

  // 查询指定行业产品资金流向
  const handleQuery = () => getData();

  // 获取ETF行业分类
  useEffect(() => {
    getIndustry();
  }, []);

  // 获取行业产品资金流向
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
      title="行业产品资金流向"
      extra={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Select
            size="small"
            style={{ width: 200 }}
            onChange={handleChange}
            options={industryOptions}
            fieldNames={{ label: 'industryName', value: 'industryName' }}
            placeholder={'请选择'}
            defaultValue="全部"
          ></Select>
          <Button
            type="primary"
            size="small"
            onClick={handleQuery}
            style={{ marginLeft: '10px', fontSize: '12px' }}
          >
            查询
          </Button>
          <ExportExcelComponent
            exportName="导出报表"
            data={dataSource?.allData}
            columns={exportExcelColums}
            className={styles['exportbtn']}
            tableId={'industryProductCapitalTable'}
            onlyColumns={true}
          />
        </div>
      }
    >
      <Table
        columns={industryProductCapitalColumns}
        id="industryProductCapitalTable"
        size="small"
        className={styles['industryProductCapitalTable']}
        dataSource={dataSource?.showData}
        rowKey="outUserNo"
        pagination={false}
        loading={loading}
        bordered
        summary={() => (
          <Table.Summary fixed>
            <Table.Summary.Row>
              {showMore ? (
                <Table.Summary.Cell index={0} colSpan={20}>
                  <CaretUpOutlined style={{ color: iconColor }} />
                  <a className={styles['more']} onClick={handleClick}>
                    收起
                  </a>
                </Table.Summary.Cell>
              ) : (
                <Table.Summary.Cell index={0} colSpan={20}>
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

export default memo(IndustryProductCapital);
