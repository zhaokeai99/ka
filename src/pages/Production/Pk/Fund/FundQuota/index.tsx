import ProCard from '@ant-design/pro-card';
import IndexRadar from './IndexRadar';
import IndexTable from './IndexTable';

const FundQuota = ({ fundCodes }: any) => {
  return (
    <ProCard gutter={[8, 0]} ghost>
      <ProCard colSpan={12}>
        <IndexRadar fundCodes={fundCodes} />
      </ProCard>
      <ProCard colSpan={12}>
        <IndexTable />
      </ProCard>
    </ProCard>
  );
};

export default FundQuota;
