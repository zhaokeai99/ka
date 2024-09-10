import { totalCount } from '@/utils/utils';
import { Col, Row } from 'antd';
import { find as _find, map as _map, findIndex as _findIndex } from 'lodash';
import React, { useState, useEffect } from 'react';
import { queryFinancialRepByComp } from '../../service';
// import '../index.less';
// import { queryFundCompanyPKListByCompCodes } from '../service';

const columns = [
  {
    label: '总资产(亿元)',
    key: 'totAssets',
  },
  {
    label: '货币资产(亿元)',
    key: 'monetaryCap',
  },
  {
    label: '净资产(亿元)',
    key: 'navAsset',
  },
  {
    label: '负债合计(亿元)',
    key: 'totLiab',
  },
  {
    label: '资产负债率(%)',
    key: 'sFaDebttoassets',
  },
  {
    label: '净利润(亿元)',
    key: 'netProfitInclMinIntInc',
  },
  {
    label: '营业收入(亿元)',
    key: 'operRev',
  },
  {
    label: '营业利润(亿元)',
    key: 'operProfit',
  },
  {
    label: 'EBITDA(亿元)',
    key: 'sFaEbitda',
  },
  {
    label: 'EBITDA/营业总收入(%)',
    key: 'ebitdaDivideTotOperRev',
  },
  {
    label: '主营业务利润率(%)',
    key: 'sSegmentSalesRatio',
  },
  {
    label: '主营业务收入增长率(%)',
    key: 'sPrimeOperRevYoy',
  },
  {
    label: '总资产报酬率(%)',
    key: 'sFaRoa2Year',
  },
  {
    label: '净资产回报率(%)',
    key: 'sFaRoeYear',
  },
  {
    label: '经营活动现金流(亿元)',
    key: 'netCashFlowsOperAct',
  },
  {
    label: '投资活动现金流(亿元)',
    key: 'netCashFlowsInvAct',
  },
  {
    label: '筹资活动现金流(亿元)',
    key: 'netCashFlowsFncAct',
  },
  {
    label: '经营性现金流/EBITDA(%)',
    key: 'operActDividedEbitda',
  },
  {
    label: '存货周转率',
    key: 'sFaInvturn',
  },
  {
    label: '流动比率',
    key: 'sFaCurrent',
  },
  {
    label: '速动比率',
    key: 'sFaQuick',
  },
  {
    label: '带息债务(亿元)',
    key: 'sFaInterestdebt',
  },
  {
    label: '净债务(亿元)',
    key: 'sFaNetdebt',
  },
  {
    label: '获息倍数',
    key: 'sFaEbittointerest',
  },
  {
    label: 'EBITDA/带息债务(%)',
    key: 'ebitdaDividedSFaInterestdebt',
  },
  {
    label: '流动负债/负债合计(%)',
    key: 'sFaCurrentdebttodebt',
  },
  {
    label: '带息债务/总投入资本(%)',
    key: 'sFaIntdebttototalcap',
  },
  {
    label: '货币资金/流动负债(%)',
    key: 'sFaCashtoliqdebt',
  },
  {
    label: '货币资金/总债务(%)',
    key: 'sFaCashtoliqdebtwithinterest',
  },
];

//
const FinancialInformation = ({ fundCodes, quarterName, dateString }: any) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    (async () => {
      if (fundCodes.length) {
        const result = await queryFinancialRepByComp({
          compIds: _map(fundCodes, 'key'),
          LDate: dateString,
        });
        setData(result || []);
      } else {
        setData([]);
      }
    })();
  }, [fundCodes, dateString]);

  return (
    <div className="financialInformation">
      {columns.map((item, i) => {
        return (
          <Row
            key={item.key}
            style={{ minHeight: '40px' }}
            wrap={true}
            className={i === 0 ? 'pk-column-title-first' : ''}
          >
            <Col className="pk-column-title">{item.label}</Col>

            {totalCount.map((j) => {
              const { key = '' } = _find(fundCodes, { index: j }) || {};
              const obj: any = _find(data, { id: key }) || {};
              const index = _findIndex(obj?.listData, { quarterName: quarterName });
              return (
                <Col key={`pk-column-${j}`} className="pk-column">
                  {data.length && obj?.listData
                    ? obj?.listData[index]
                      ? obj?.listData[index][item.key]
                      : '-'
                    : '-'}
                </Col>
              );
            })}
          </Row>
        );
      })}
    </div>
  );
};

export default FinancialInformation;
