import React, { useState } from 'react';
import ChartsIncomeTrend from './ChartsIncomeTrend';
import { PortfolioInfo } from '@/pages/Investment/Simulation/PortfolioManagement/service';
import ReturnContribution from '@/pages/Investment/Simulation/PortfolioManagement/Charts/ReturnContribution';
import MaxPullbackAnalysisView from '@/pages/Investment/Simulation/PortfolioManagement/Charts/MaxPullbackAnalysisView';
import ChartsForm from '@/pages/Investment/Simulation/PortfolioManagement/Charts/ChartsForm';
import lodash from 'lodash';
import ProCardPlus from '@/components/ProCardPlus';
import ProCard from '@ant-design/pro-card';

interface ModalProps {
  portfolioInfo: PortfolioInfo;
  dicMap: { domain: []; benchmark: [] };
  tradeDate: string;
}

const ChartsComponent = (props: ModalProps) => {
  const { portfolioInfo, dicMap, tradeDate } = props;

  const [chartData, setChartData] = useState<any>({
    incomeData: { lineData: [], ColumnData: [] },
    incomeDetail: {},
    maxData: [],
    returnData: [],
  });
  const [version, setVersion] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const refreshData = (data: any) => {
    setChartData(data);
    setVersion(lodash.random(0, 999999, false));
  };
  return (
    <ProCardPlus bordered direction="column" gutter={[0, 10]}>
      <ChartsForm
        onRefresh={refreshData}
        portfolioInfo={portfolioInfo}
        dicMap={dicMap}
        tradeDate={tradeDate}
        onLoading={setLoading}
      />

      <ChartsIncomeTrend
        dicMap={dicMap}
        data={chartData.incomeData}
        version={version}
        detail={chartData.incomeDetail}
        loading={loading}
      />

      <ProCard ghost direction="row" gutter={[10, 0]} style={{ marginBottom: 10 }}>
        <ProCard ghost colSpan={12}>
          <MaxPullbackAnalysisView
            dicMap={dicMap}
            data={chartData.maxData}
            version={version}
            loading={loading}
          />
        </ProCard>
        <ProCard ghost colSpan={12}>
          <ReturnContribution data={chartData.returnData} version={version} loading={loading} />
        </ProCard>
      </ProCard>
    </ProCardPlus>
  );
};
export default ChartsComponent;
