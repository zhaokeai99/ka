import React from 'react';
import CardContainer from './compontents/CardContainer';
// import NewsAndHots from './compontents/NewsAndHots';
// import FundRunChart from './compontents/FundRunChart';
// import FundFlowsTable from './compontents/FundFlowsTable';
// import RankTableList from './compontents/RankTableList';
import AllMarketCapital from './compontents/AllMarketCapital';
import ChartContainer from './compontents/ChartContainer';
import ThFundMobility from './compontents/ThFundMobility';
import IndustryProductCapital from './compontents/IndustryProductCapital';
import FundCompanyScaleTop from './compontents/FundCompanyScaleTop';

export default function () {
  return (
    <>
      <CardContainer fundType="etf" />
      <AllMarketCapital fundType="etf" />
      <ChartContainer fundType="etf" />
      <ThFundMobility fundType="etf" />
      <IndustryProductCapital fundType="etf" />
      <FundCompanyScaleTop fundType="etf" />
      {/* <NewsAndHots fundType="etf" />
      <FundRunChart fundType="etf" />
      <FundFlowsTable fundType="etf" />
      <RankTableList fundType="etf" /> */}
    </>
  );
}
