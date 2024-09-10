import {
  queryStockFinancialIndex,
  SelectKeyProvider,
  TabProvider,
} from '@/pages/IndustrialChain/ChainDetail/service';
import { useCallback, useContext, useEffect, useState } from 'react';
import TitleContent from '../TitleContent';
import SearchTable from './components/SearchTable';
import { radioList } from './service';

// 上市发债公司

// 公司类型
enum companyTypeMap {
  'A股' = 1,
  '港股' = 2,
  '发债' = 3,
}

const Listed = () => {
  const { selectKey }: any = useContext(SelectKeyProvider);
  const { tab } = useContext(TabProvider);
  // a股
  const [aQueryType, setAQueryType] = useState<string>('jlr');
  // 发债
  const [debtQueryType, setDebtQueryType] = useState<string>('jlr');
  const [aData, setAData] = useState<any>({});
  const [debtData, setDebtData] = useState<any>({});
  const [ALoading, setALoading] = useState<boolean>(false);
  const [debtLoading, setDebtLoading] = useState<boolean>(false);

  const getTableData = useCallback(
    async (companyType, queryType) => {
      if (tab === 'listed') {
        if (companyTypeMap[companyType] === 'A股') {
          setALoading(true);
        } else if (companyTypeMap[companyType] === '发债') {
          setDebtLoading(true);
        }

        const result = selectKey?.nodeId
          ? await queryStockFinancialIndex({
              companyType,
              queryType,
              nodeId: selectKey?.nodeId,
            })
          : {};

        if (companyTypeMap[companyType] === 'A股') {
          setAData(result);
          setALoading(false);
        } else if (companyTypeMap[companyType] === '发债') {
          setDebtData(result);
          setDebtLoading(false);
        }
      }
    },
    [selectKey?.nodeId, aQueryType, debtQueryType, tab],
  );

  useEffect(() => {
    getTableData(companyTypeMap['A股'], aQueryType);
  }, [selectKey?.nodeId, aQueryType, tab]);

  // 暂时注释掉，后端接口有问题
  useEffect(() => {
    getTableData(companyTypeMap['发债'], debtQueryType);
  }, [selectKey?.nodeId, debtQueryType, tab]);

  return (
    <div className="listed">
      <TitleContent
        data={[
          {
            title: selectKey?.nodeName,
            description: selectKey?.nodeDesc,
          },
        ]}
      />
      <SearchTable
        title="A股公司"
        loading={ALoading}
        data={aData?.data}
        radioList={radioList}
        columns={aData?.columns}
        onChange={(value: string) => setAQueryType(value)}
      />
      <SearchTable
        title="发债公司"
        loading={debtLoading}
        marginTop="25px"
        data={debtData?.data}
        radioList={radioList}
        columns={debtData?.columns}
        onChange={(value: string) => setDebtQueryType(value)}
      />
    </div>
  );
};

export default Listed;
