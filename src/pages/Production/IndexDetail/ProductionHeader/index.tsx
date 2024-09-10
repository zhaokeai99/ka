import Search from '@/components/Search';
import { primaryColor3, staticCardBgColor, staticCardValueColor } from '@/themes/index';
import ProCard, { StatisticCard } from '@ant-design/pro-card';
import { Col, Descriptions, Rate, Row, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import { queryTopMarks, searchFundInfo } from '../service';
import Favorite from './Favorite';

const { Item } = Descriptions;
const { Statistic } = StatisticCard;

const ProductHeader: React.FC<any> = ({
  desColumn,
  contentItem,
  fundCode,
  fundShortName,
  productTypeDesc,
  productTypeOneDesc,
  riskLevelDesc,
  contentScore,
  unitNav,
  totalNav,
  returnToday,
  lDate,
  fundId,
  windFundCode,
}) => {
  const [tagList, setTagList] = useState([]);

  useEffect(() => {
    (async () => {
      const result = await queryTopMarks({ code: windFundCode || fundCode, markType: 'FUND' });
      setTagList(result);
    })();
  }, [windFundCode, fundCode]);

  return (
    <ProCard
      title={
        <Row align="middle" gutter={[15, 0]}>
          <Col style={{ fontSize: '20px', fontWeight: 500 }}>
            {fundShortName || '暂无简称'} - {fundCode}
          </Col>
          <Col>
            <Search
              searchInfo={searchFundInfo}
              openUrl="/production/index/newDetail/"
              labelName="fundName"
              keyName="fundCode"
            />
            {fundId && <Favorite fundId={fundId} />}
          </Col>
          <Col>
            {productTypeDesc && <Tag color={primaryColor3}>{productTypeDesc}</Tag>}
            {productTypeOneDesc && <Tag color={primaryColor3}>{productTypeOneDesc}</Tag>}
            {tagList?.map((i: any) => (
              <Tag color={primaryColor3}>{i}</Tag>
            ))}
          </Col>
          <Col>风险评级：{riskLevelDesc || '-'}</Col>
          {fundId && (
            <Col>
              <span>内部评分：</span>
              <Rate disabled value={contentScore} style={{ color: '#FBBE04', fontSize: '14px' }} />
            </Col>
          )}
        </Row>
      }
    >
      <Row style={{ marginTop: '20px' }}>
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
                  title: `单位净值（${lDate || '-'}）`,
                  tip: '数据日频更新，我司数值来源估值系统，市场数据来自wind',
                  value: unitNav || '-',
                  valueStyle: { color: staticCardValueColor },
                  description: returnToday ? (
                    <Statistic
                      title="日涨跌幅"
                      value={returnToday || ''}
                      trend={returnToday > 0 ? 'up' : 'down'}
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
                  title: `累计单位净值（${lDate || '-'}）`,
                  tip: '基金单位净值+基金历史上累计单位派息金额(基金历史上所有分红派息的总额/基金总份额',
                  valueStyle: { color: staticCardValueColor },
                  value: totalNav || '-',
                }}
              />
            </ProCard>
          </ProCard>
        </Col>
      </Row>
    </ProCard>
  );
};

ProductHeader.isProCard = true;

export default ProductHeader;
