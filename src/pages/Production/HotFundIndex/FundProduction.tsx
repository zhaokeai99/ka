import ProCard from '@ant-design/pro-card';
import React, { useCallback, useState } from 'react';
import IndexTable from './compontents/IndexTable';
import SearchBar from './compontents/SearchBar';
import { queryTableData } from './service';

const FundProduction: React.FC<{ initSchemeId?: string }> = ({ initSchemeId }) => {
  const [tableData, setTableData] = useState([]);
  const [fundPkList, setFundPkList] = useState([]);
  const [newResultTags, setNewResultTags] = useState<[any]>();
  const [tableLoading, setTableLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 100 });
  const [searcherType] = useState('FUND');
  const [searchParams, setSearchParams] = useState({
    params: [],
    results: [],
  });

  const queryTableInfo = async (params: any) => {
    setTableLoading(true);
    const { pageNo, pageSize, totalNum, dataSource } = await queryTableData({
      ...params,
      pageSize: params.pageSize,
      pageNo: params.current,
    });
    setTableData(dataSource);
    setTableLoading(false);
    setPagination({ current: pageNo, pageSize, total: totalNum });
  };

  const handleTableChange = (pageInfo, _, sorter) => {
    const { column, order } = sorter || {};
    const { dataIndex, title } = column || {};
    const orderBy = order
      ? {
          colDesc: title,
          colName: dataIndex,
          orderEnum: order === 'descend' ? 'DESC' : 'ASC',
        }
      : null;
    queryTableInfo({
      ...pageInfo,
      searchModel: {
        orderBy,
        searcherType,
        ...searchParams,
      },
    });
  };

  const searchParamsChange = useCallback(({ params, results }) => {
    setSearchParams({ params, results });
    queryTableInfo({
      searchModel: {
        searcherType,
        params: [...params],
        results: [...results],
      },
      current: 1,
      pageSize: 10,
    });
  }, []);

  const handleFundPkList = (pkList) => {
    setFundPkList(pkList);
  };

  return (
    <ProCard ghost>
      <SearchBar
        searcherType={searcherType}
        fundPkList={fundPkList}
        initSchemeId={initSchemeId}
        onlyResultTagChange={(resultList: [any]) => {
          setNewResultTags(resultList);
        }}
        onFinish={(values: any) => {
          searchParamsChange(values);
        }}
      />
      <IndexTable
        data={tableData}
        pageInfo={pagination}
        searcherType={searcherType}
        searchParams={searchParams}
        onChange={handleTableChange}
        handleFundPkList={handleFundPkList}
        loading={tableLoading}
        newResultTags={newResultTags}
      />
    </ProCard>
  );
};

export default FundProduction;
