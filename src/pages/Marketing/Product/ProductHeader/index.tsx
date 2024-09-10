import {
  negativeColor,
  positiveColor,
  primaryColor3,
  staticCardBgColor,
  staticCardValueColor,
} from '@/themes/index';
import ProCard, { StatisticCard } from '@ant-design/pro-card';
import { Col, Descriptions, Row, Tag } from 'antd';
import React from 'react';
import { queryFundByNameLike } from '../service';
import Search from './Search';

const { Item } = Descriptions;
const { Statistic } = StatisticCard;

const ProductHeader: React.FC<any> = ({
  desColumn,
  contentItem,
  fundCode,
  fundAbbr,
  fundType,
  unitNavAmt,
  totalUnitNavAmt,
  d1StockAddPercent,
  navDate,
}) => {
  async function fetchList(keyword: string): Promise<any[]> {
    return queryFundByNameLike({ fundName: keyword }).then((result) => {
      return result.map((r: any) => ({
        key: r.fundCode,
        value: r.fundCode,
        label: r.fundName,
      }));
    });
  }

  return (
    <ProCard
      title={
        <Row align="middle">
          <Col style={{ fontSize: '20px', fontWeight: 500 }}>
            {fundAbbr || '暂无简称'} - {fundCode}
          </Col>
          <Col style={{ margin: '0 12px' }}>
            <Search fetchList={fetchList} links="/production/index/newDetail/" />
          </Col>
          <Col>{fundType && <Tag color={primaryColor3}>{fundType}</Tag>}</Col>
        </Row>
      }
    >
      <Row gutter={[8, 0]}>
        <Col span={14}>
          <Descriptions column={desColumn || 2}>
            {contentItem?.map((item: any, index: number) => (
              <Item key={index} label={item.label}>
                {item.value || '-'}
              </Item>
            ))}
          </Descriptions>
        </Col>
        <Col span={10}>
          <ProCard ghost direction="row" gutter={[10, 0]}>
            <ProCard ghost style={{ backgroundColor: staticCardBgColor, height: '100%' }}>
              <StatisticCard
                style={{ backgroundColor: 'transparent' }}
                statistic={{
                  title: `单位净值（${navDate || '-'}）`,
                  value: unitNavAmt || '-',
                  valueStyle: { color: staticCardValueColor },
                  description: d1StockAddPercent ? (
                    <Statistic
                      title="日涨跌幅"
                      value={d1StockAddPercent || ''}
                      valueStyle={{
                        color: d1StockAddPercent.startsWith('-') ? negativeColor : positiveColor,
                      }}
                    />
                  ) : (
                    '-'
                  ),
                }}
              />
            </ProCard>
            <ProCard ghost style={{ backgroundColor: staticCardBgColor, height: '100%' }}>
              <StatisticCard
                style={{ backgroundColor: 'transparent' }}
                statistic={{
                  title: `累计净值（${navDate || '-'}）`,
                  value: totalUnitNavAmt || '-',
                  valueStyle: { color: staticCardValueColor },
                }}
              />
            </ProCard>
          </ProCard>
        </Col>
      </Row>
    </ProCard>
  );
};

export default ProductHeader;
