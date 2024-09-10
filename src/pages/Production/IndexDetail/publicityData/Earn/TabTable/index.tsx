import { useEffect, useState } from 'react';
import { Table } from 'antd';
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import ProCard from '@ant-design/pro-card';
import { queryIncomeRateData, queryAllIncomeRateData } from '../service';
import styles from './index.less';

function TabTable({ fundCode, columns }: any) {
  const [tableData, setTableData] = useState([]);
  const [data, setData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isCollapse, setIsCollapse] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const result = await queryIncomeRateData({
        code: fundCode,
      });
      const _data: any = [
        {
          name: result.foundIncomeName,
          incomeRate: result.countFoundIncomeRate == null ? 0 : result.countFoundIncomeRate,
          StandardIncomeRate: result.foundStandardIncomeRate,
          excessIncomeRate: result.foundExcessIncomeRate,
          tipText:
            '主动转型产品（开大会转型+LOF）为转型以来业绩数据；被动转型产品为合同生效日以来业绩数据',
        },
        {
          name: result.mon6IncomeRateName,
          incomeRate: result.mon6IncomeRate,
          StandardIncomeRate: result.mon6StandardIncomeRate,
          excessIncomeRate: result.mon6ExcessIncomeRate,
        },
        {
          name: result.year1IncomeRateName,
          incomeRate: result.year1IncomeRate,
          StandardIncomeRate: result.year1StandardIncomeRate,
          excessIncomeRate: result.year1ExcessIncomeRate,
        },
        // 屏蔽近两年数据
        // {
        //   name: result.year2IncomeRateName,
        //   incomeRate: result.year2IncomeRate,
        //   StandardIncomeRate: result.year2StandardIncomeRate,
        //   excessIncomeRate: result.year2ExcessIncomeRate,
        // },
        {
          name: result.year3IncomeRateName,
          incomeRate: result.year3IncomeRate,
          StandardIncomeRate: result.year3StandardIncomeRate,
          excessIncomeRate: result.year3ExcessIncomeRate,
        },
        {
          name: result.year5IncomeRateName,
          incomeRate: result.year5IncomeRate,
          StandardIncomeRate: result.year5StandardIncomeRate,
          excessIncomeRate: result.year5ExcessIncomeRate,
        },
        {
          name: result.transitionIncomeRateName,
          incomeRate: result.transitionIncomeRate,
          StandardIncomeRate: result.transitionStandardIncomeRate,
          excessIncomeRate: result.transitionExcessIncomeRate,
          tipText: '被动转型产品不列示此项数据',
        },
        {
          name: '2022年度',
          incomeRate: result.natureYear1IncomeRate,
          StandardIncomeRate: result.natureYear1StandardIncomeRate,
          excessIncomeRate: result.natureYear1ExcessIncomeRate,
        },
        {
          name: '2021年度',
          incomeRate: result.natureYear2IncomeRate,
          StandardIncomeRate: result.natureYear2StandardIncomeRate,
          excessIncomeRate: result.natureYear2ExcessIncomeRate,
        },
        {
          name: '2020年度',
          incomeRate: result.natureYear3IncomeRate,
          StandardIncomeRate: result.natureYear3StandardIncomeRate,
          excessIncomeRate: result.natureYear3ExcessIncomeRate,
        },
        {
          name: '2019年度',
          incomeRate: result.natureYear4IncomeRate,
          StandardIncomeRate: result.natureYear4StandardIncomeRate,
          excessIncomeRate: result.natureYear4ExcessIncomeRate,
        },
        {
          name: '2018年度',
          incomeRate: result.natureYear5IncomeRate,
          StandardIncomeRate: result.natureYear5StandardIncomeRate,
          excessIncomeRate: result.natureYear5ExcessIncomeRate,
        },
      ];
      setData(_data);
      setTableData(_data);
      setLoading(false);

      const allRes = await queryAllIncomeRateData({
        code: fundCode,
      });

      if (!allRes && !Array.isArray(allRes)) return;

      const _allData: any = [
        ..._data,
        ...allRes
          .map((item: any) => {
            return {
              ...item,
              name: `${item.year}年度`,
              StandardIncomeRate: item.standardIncomeRate,
              excessIncomeRate: item.excessIncomeRate,
            };
          })
          .splice(5),
      ];
      setAllData(_allData);
    })();
  }, []);

  return (
    <ProCard bodyStyle={{ padding: 0 }} wrap>
      <Table
        loading={loading}
        columns={columns}
        dataSource={tableData}
        style={{ width: '100%', height: '100%' }}
        pagination={false}
        size="small"
      />
      <div
        className={styles['btn_expend']}
        onClick={() => {
          if (isCollapse) {
            setTableData(allData);
          } else {
            setTableData(data);
          }
          setIsCollapse(!isCollapse);
        }}
      >
        {!isCollapse ? (
          <>
            收起
            <CaretUpOutlined />
          </>
        ) : (
          <>
            查看成立以来详细数据
            <CaretDownOutlined />
          </>
        )}
      </div>
    </ProCard>
  );
}

export default TabTable;
