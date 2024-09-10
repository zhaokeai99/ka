import React from 'react';
import ProCard from '@ant-design/pro-card';
import './index.less';

const LeftList: React.FC<any> = (props: any) => {
  const { QueryEtfIndexInfoCondition } = props;
  const className = (data: number) => {
    return data > 0 ? 'add' : data === 0 ? 'stable' : 'reduce';
  };

  return (
    <>
      <div>
        <div>页面说明:</div>
        <div>1、面积代表基金规模</div>
        <div>2、颜色代表基金规模扩增程度</div>
        <div>3、双击跳转基金全景图</div>
      </div>
      <div>
        <ProCard ghost style={{ margin: '5px 0' }} bordered direction="column">
          <div className="title"> 份额 </div>
          <div className="infoCondition"> {QueryEtfIndexInfoCondition.fundvol}亿份 </div>
          <div className="etfIndexInfoCondition">
            <span className={className(QueryEtfIndexInfoCondition.fundvolAdd)}>
              {QueryEtfIndexInfoCondition.fundvolAdd ? QueryEtfIndexInfoCondition.fundvolAdd : 0}
            </span>
            <span className={className(QueryEtfIndexInfoCondition.fundvolAddRatio)}>
              {QueryEtfIndexInfoCondition.fundvolAddRatio}%
            </span>
          </div>
        </ProCard>
        <ProCard ghost style={{ margin: '5px 0' }} bordered direction="column">
          <div className="title"> 规模 </div>
          <div className="infoCondition"> {QueryEtfIndexInfoCondition.navAmt}亿元 </div>
          <div className="etfIndexInfoCondition">
            <span className={className(QueryEtfIndexInfoCondition.navAmtAdd)}>
              {QueryEtfIndexInfoCondition.navAmtAdd}
            </span>
            <span className={className(QueryEtfIndexInfoCondition.navAmtAddRatio)}>
              {QueryEtfIndexInfoCondition.navAmtAddRatio}%
            </span>
          </div>
        </ProCard>
        <ProCard ghost style={{ margin: '5px 0' }} bordered direction="column">
          <div className="title"> 只数 </div>
          <div className="infoCondition"> {QueryEtfIndexInfoCondition.totalFundNum}个 </div>
          <div className="etfIndexInfoCondition">
            <span className={className(QueryEtfIndexInfoCondition.totalFundNumAdd)}>
              {QueryEtfIndexInfoCondition.totalFundNumAdd}
            </span>
            <span className={className(QueryEtfIndexInfoCondition.totalFundNumAddRatio)}>
              {QueryEtfIndexInfoCondition.totalFundNumAddRatio}%
            </span>
          </div>
        </ProCard>
      </div>
    </>
  );
};

export default LeftList;
