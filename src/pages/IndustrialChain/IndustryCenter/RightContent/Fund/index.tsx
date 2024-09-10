import ProCardPlus from '@/components/ProCardPlus';
import ProTable from '@ant-design/pro-table';
import { useContext, useEffect, useMemo, useState } from 'react';
import { IndustryProvider, queryIndustryFundInfo } from '../../service';

const Fund = () => {
  const { industryId } = useContext(IndustryProvider);
  const [dataList, setDataList] = useState([]);

  // TODO 字段对应
  const column: any[] = useMemo(
    () => [
      {
        title: '序号',
        key: 'id',
        render: (_: any, __: any, index: number) => index + 1,
      },
      {
        title: '基金简称',
        dataIndex: 'fundName',
        ket: 'fundName',
        render: (text: any, record: any) => (
          <a rel="noopener noreferrer" href={`#/production/index/newDetail/${record.fundCode}`}>
            {text}
          </a>
        ),
      },
      {
        title: '基金代码',
        dataIndex: 'fundCode',
        key: 'fundCode',
        render: (text: any, record: any) => (
          <a rel="noopener noreferrer" href={`#/production/index/newDetail/${record.fundCode}`}>
            {text}
          </a>
        ),
      },
      {
        title: '最新净值(元)',
        dataIndex: 'navUnit',
        key: 'navUnit',
      },
      {
        title: '日增长率(%)',
        dataIndex: 'dqPctchange',
        key: 'dqPctchange',
      },
    ],
    [],
  );

  // TODO 无数据
  useEffect(() => {
    (async () => {
      const result = await queryIndustryFundInfo({ queryType: 'chain', queryValue: industryId });
      setDataList(result);
    })();
  }, [industryId]);

  return (
    <ProCardPlus title="基金" extra={<a style={{ fontSize: 12 }}>查看更多基金 &gt;</a>}>
      <ProTable
        size="small"
        rowKey="fundCode"
        columns={column}
        bordered
        dataSource={dataList}
        search={false}
        options={false}
        pagination={false}
        scroll={{ x: 'max-content' }}
      />
    </ProCardPlus>
  );
};

Fund.isProCard = true;

export default Fund;
