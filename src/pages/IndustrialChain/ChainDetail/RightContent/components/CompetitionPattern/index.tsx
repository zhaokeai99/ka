import {
  queryCompanyProductsIncome,
  queryCompanyProductsIncomeDeclareDate,
  SelectKeyProvider,
  TabProvider,
} from '@/pages/IndustrialChain/ChainDetail/service';
import { Empty } from 'antd';
import { useCallback, useContext, useEffect, useState } from 'react';
import TitleContent from '../TitleContent';
import SearchTable from './components/SearchTable';
import { columns } from './service';

// 竞争格局

const CompetitionPattern = () => {
  const { selectKey }: any = useContext(SelectKeyProvider);
  const { tab } = useContext(TabProvider);

  const [declareDate, setDeclareDate] = useState<string>('');
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [declareDateList, setDeclareDateList] = useState<any>([]);

  const getTableData = useCallback(
    async (decDate: string) => {
      setLoading(true);

      const result: never[] =
        selectKey?.nodeId && decDate
          ? await queryCompanyProductsIncome({
              declareDate: decDate,
              nodeId: selectKey?.nodeId,
            })
          : [];

      setData(result);
      setLoading(false);
    },
    [selectKey?.nodeId, declareDate, tab],
  );

  const getDeclareDate = useCallback(async () => {
    setLoading(true);

    const result = selectKey?.nodeId
      ? await queryCompanyProductsIncomeDeclareDate({
          nodeId: selectKey?.nodeId,
        })
      : [];

    const formateResult = result?.map((item: any) => ({
      label: item,
      value: item,
    }));

    setDeclareDateList(formateResult);
    setDeclareDate(formateResult[0]?.value || '');
    setLoading(false);
  }, [selectKey?.nodeId, tab]);

  useEffect(() => {
    if (tab === 'competitionPattern') {
      getDeclareDate();
    }
  }, [selectKey?.nodeId, tab]);

  useEffect(() => {
    if (tab === 'competitionPattern') {
      getTableData(declareDate);
    }
  }, [selectKey?.nodeId, declareDate, tab]);

  return (
    <div className="competition-pattern">
      <TitleContent
        data={[
          {
            title: selectKey?.nodeName,
            description: selectKey?.nodeDesc,
          },
        ]}
      />

      {declareDateList?.length ? (
        <SearchTable
          loading={loading}
          data={data}
          list={declareDateList}
          columns={columns}
          onChange={(value: string) => setDeclareDate(value)}
        />
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
    </div>
  );
};

export default CompetitionPattern;
