import React, { useCallback, useEffect, useState } from 'react';
import ProCardPlus from '@/components/ProCardPlus';
import { cardGutter, contentPadding } from '@/themes';
import Header from './header';
import TabTable from '../TabTable';
import ProCard from '@ant-design/pro-card';
import { Col, Empty, Row } from 'antd';
import { find as _find } from 'lodash';
import '../index.less';
import {
  queryBondList,
  queryCompInfoByCompId,
  queryFinancialRepByQuarter,
  queryLastWkDayByNow,
  queryQuarterList,
} from '../service';
import moment from 'moment';

const formatData = (val: moment.MomentInput) => {
  return val ? moment(val).format('YYYY-MM-DD') : '-';
};

const bondListColumns = [
  {
    title: '债券名称',
    key: 'bondAbbrName',
    dataIndex: 'bondAbbrName',
  },
  {
    title: '证券类别',
    key: 'bondClassTypeName',
    dataIndex: 'bondClassTypeName',
  },
  {
    title: '起息日',
    key: 'interestStartDate',
    dataIndex: 'interestStartDate',
    render: formatData,
  },
  {
    title: '到期日',
    key: 'maturityDate',
    dataIndex: 'maturityDate',
    render: formatData,
  },
  {
    title: '中债估值',
    key: 'day60AnalNetAmt',
    dataIndex: 'day60AnalNetAmt',
  },
  {
    title: '净值',
    key: 'day60NetCloseAmt',
    dataIndex: 'day60NetCloseAmt',
  },
  {
    title: '债项评级',
    key: 'bondExRating',
    dataIndex: 'bondExRating',
  },
  {
    title: '内部评级',
    key: 'bondRating',
    dataIndex: 'bondRating',
  },
  {
    title: '是否持仓',
    key: 'hold',
    dataIndex: 'hold',
  },
];

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

const SubjectDetails: React.FC = ({ match }: any) => {
  const { id } = match?.params || {};
  const [data, setData] = useState([
    { quarterName: '2021年报' },
    { quarterName: '2020年报' },
    { quarterName: '2019年报' },
    { quarterName: '2018年报' },
  ]);
  const [bondData, setBondData] = useState<any[]>([]);
  const [infoData, setInfoData] = useState<any>({});
  const [dateString, setDateString] = useState(
    moment(new Date()).subtract(1, 'days').format('YYYY-MM-DD'),
  );

  useEffect(() => {
    (async () => {
      const result = await queryQuarterList({});
      setData(result);
      const res = await queryLastWkDayByNow({});
      setDateString(res);
    })();
  }, []);

  const getFinancialRepByQuarter = useCallback(async () => {
    if (dateString) {
      const result = await queryFinancialRepByQuarter({
        compId: id,
        LDate: dateString,
      });
      setData(result || []);
    }
  }, [id, dateString]);

  const getCompInfoByCompId = useCallback(async () => {
    const result = await queryCompInfoByCompId({
      compId: id,
      LDate: dateString,
    });
    setInfoData(result || {});
  }, [id, dateString]);

  const getBondList = useCallback(async () => {
    const result = await queryBondList({
      compIds: [id],
      LDate: dateString,
    });
    setBondData(result || []);
  }, [id, dateString]);

  useEffect(() => {
    getFinancialRepByQuarter();
    getCompInfoByCompId();
    getBondList();
  }, [id, dateString]);

  const onChange = (date: any) => {
    setDateString(date);
  };

  return (
    <div className="detailsProCard">
      <ProCardPlus
        style={{ padding: contentPadding }}
        direction="column"
        ghost
        gutter={[0, cardGutter]}
      >
        {dateString ? (
          <Header dateStr={dateString} change={onChange} data={infoData} desColumn={3} />
        ) : (
          ''
        )}

        <ProCardPlus title="债券">
          <ProCard>
            {bondData[0]?.listData?.length ? (
              <TabTable data={bondData[0]?.listData} columns={bondListColumns} />
            ) : (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </ProCard>
        </ProCardPlus>
        <ProCardPlus title="财务指标">
          <div className="details">
            <Row style={{ minHeight: '40px' }} wrap={true} className={'pk-column-title-first'}>
              <Col className="pk-column-title">人民币</Col>
              {data.map((j: any) => {
                return (
                  <Col key={`pk-column-${j?.quarterName}`} className="pk-column-title">
                    {j?.quarterName}
                  </Col>
                );
              })}
            </Row>
            {columns.map((item, i) => {
              return (
                <Row
                  key={item.key}
                  style={{ minHeight: '40px' }}
                  wrap={true}
                  className={i === 0 ? 'pk-column-title-first' : ''}
                >
                  <Col className="pk-column">{item.label}</Col>
                  {data.map((j: any) => {
                    const obj = _find(data, { quarterName: j?.quarterName }) || {};
                    return (
                      <Col key={`pk-column-${j?.quarterName}`} className="pk-column">
                        {data.length && obj[item.key] ? obj[item.key] : '-'}
                      </Col>
                    );
                  })}
                </Row>
              );
            })}
          </div>
        </ProCardPlus>
      </ProCardPlus>
    </div>
  );
};

export default SubjectDetails;
