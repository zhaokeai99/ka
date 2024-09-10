import React, { useState, useEffect } from 'react';
import { Descriptions, Row, Col, Switch, Select } from 'antd';
import ProCard, { StatisticCard } from '@ant-design/pro-card';
import { staticCardValueColor, staticCardBgColor } from '@/themes/index';
import Search from '@/components/Search';
// import { HeartFilled, HeartOutlined } from '@ant-design/icons';
import { fuzzySearch, queryBaseInfo, queryCompanyScaleQuarterData } from '../service';
import './index.less';
import moment from 'moment';

const { Item } = Descriptions;
const { Option } = Select;

const ProductHeader: React.FC<any> = ({ desColumn, code }) => {
  const [contentItem, setContentItem] = useState<any>([]);
  const [fundCompanyData, setFundCompanyData] = useState<any>({});
  const [isReject, setIsReject] = useState(false);
  const [cardData, setCardData] = useState<any>({});
  const [isProfitFixed, setIsProfitFixed] = useState(false); // 为持有人盈利卡片 配置是不是固定写死
  const [isNotCardFetch, setIsNotCardFetch] = useState(false); // 要不要根据下拉列表 拉取卡片的值 第一次设默认值的时候 不拉取
  const [profitValue, setProfitValue] = useState(''); // 持有人盈利下拉列表默认值

  const profitOption = [1, 2, 3, 4, 5, 6, 7, 8].map((i) => ({
    index: i - 1,
    label: moment().subtract(i, 'Q').format('Y[Q]Q'),
    value: moment().subtract(i, 'Q').endOf('quarter').endOf('month').format('YMMDD'),
    disabled: i == 1 ? false : isProfitFixed,
  }));

  const [profitOptions, setprofitOptions] = useState(profitOption); // 持有人盈利下拉列表默认值
  // const defaultProfitValue = moment() // 按当前日期计算
  //   .subtract(1, 'Q')
  //   .endOf('quarter')
  //   .endOf('month')
  //   .format('YMMDD');

  // 查看基金公司基础信息
  useEffect(() => {
    (async () => {
      const result = await queryBaseInfo({
        fundCompCode: code,
      });
      setFundCompanyData(result);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const data = await queryCompanyScaleQuarterData({
        code: code,
        isReject: false,
      });
      setIsProfitFixed(data?.extInfo?.isFixed);
      const { dateStr } = data;
      setIsNotCardFetch(true); // 第一次不重新拉取卡片值 单独处理
      // 为什么单独处理 业务方要求中间卡片 持有人数量是有默认值的 单独调了下接口 参数传空
      // 不处理的话 Q2 Q4 有值，Q1 Q3没值
      // 根据返回的dateStr设置一下第三张卡片下拉列表的默认值和第二张卡片日期括号的默认值
      setProfitValue(profitOption.filter((i) => i.label === dateStr)[0].value);
      // @ts-ignore
      const sliceIndex: any = profitOption.find((i) => i.label === dateStr).index;
      setprofitOptions(profitOption.slice(sliceIndex));
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (isNotCardFetch) return;
      const data = await queryCompanyScaleQuarterData({
        code: code,
        isReject: isReject,
        startDate: profitValue,
      });
      setCardData(data);
    })();
  }, [isReject, profitValue, isNotCardFetch]);

  useEffect(() => {
    if (!!fundCompanyData) {
      const { generalManager, fundCompENName, webSiteURL, compAddress } = fundCompanyData;
      const Items = [
        {
          label: '英文名称',
          value: fundCompENName,
        },
        {
          label: '总经理',
          value: generalManager,
        },
        {
          label: '网站地址',
          value: webSiteURL,
        },
        {
          label: '办公地址',
          value: compAddress,
        },
      ];
      setContentItem(Items);
    }
  }, [fundCompanyData]);

  return (
    <ProCard
      title={
        <Row align="middle" gutter={[15, 0]}>
          <Col style={{ fontSize: '20px', fontWeight: 500 }}>
            {fundCompanyData.fundCompName || '-'}
          </Col>
          <Col>
            <Search
              searchInfo={fuzzySearch}
              openUrl="/Production/FundCompany/"
              labelName="label"
              newKey="compNameKey"
              keyName="fundCompCode"
            />
          </Col>
          {/* <Col>
            {collection ? (
              <HeartFilled
                style={{ color: 'red' }}
                onClick={() => {
                  setCollect(0);
                }}
              />
            ) : (
              <HeartOutlined
                onClick={() => {
                  setCollect(1);
                }}
              />
            )}
          </Col> */}
        </Row>
      }
    >
      <Row style={{ marginTop: '20px' }}>
        <Col span={9}>
          <Descriptions column={desColumn || 1}>
            {contentItem?.map((item: any, index: number) => (
              <Item key={index} label={item.label}>
                {item.value || '-'}
              </Item>
            ))}
          </Descriptions>
        </Col>
        <Col span={15}>
          <ProCard ghost direction="row" gutter={[8, 0]}>
            <ProCard
              colSpan={8}
              ghost
              style={{ backgroundColor: staticCardBgColor, height: '100%' }}
              className="hasSwitch"
              extra={
                <Switch
                  defaultChecked={false}
                  size="small"
                  onChange={(checked: boolean) => {
                    setIsReject(checked);
                    setIsNotCardFetch(true);
                  }}
                />
              }
            >
              <StatisticCard
                style={{ backgroundColor: 'transparent' }}
                statistic={{
                  title: (
                    <span style={{ fontSize: '12px' }}>公募资产总规模({cardData.dateStr})</span>
                  ),
                  tip: `数据来源于估值系统，${isReject ? '' : '未'}剔除联接基金重复投资部分`,
                  value: cardData.totalPublicFundAmt ? `${cardData.totalPublicFundAmt}万亿元` : '-',
                  valueStyle: { color: staticCardValueColor },
                }}
              />
            </ProCard>
            <ProCard
              colSpan={7}
              ghost
              style={{ backgroundColor: staticCardBgColor, height: '100%' }}
            >
              <StatisticCard
                style={{ backgroundColor: 'transparent' }}
                statistic={{
                  title: (
                    <span style={{ fontSize: '12px' }}>
                      持有人数量
                      {!isNotCardFetch
                        ? ''
                        : `(${moment(profitValue).format('Y')}${
                            moment(profitValue).month() == 3 || moment(profitValue).month() == 12
                              ? '年末'
                              : '年中'
                          })`}
                    </span>
                  ),
                  tip: '数据源来自基金产品定报中的半年报/年报开户数并进行管理人汇总',
                  valueStyle: { color: staticCardValueColor },
                  value: cardData.holderCount ? `${cardData.holderCount}亿` : '-',
                }}
              />
            </ProCard>
            <ProCard
              colSpan={9}
              ghost
              style={{ backgroundColor: staticCardBgColor, height: '100%' }}
            >
              <StatisticCard
                style={{ backgroundColor: 'transparent' }}
                className="hasSelect"
                statistic={{
                  title: <span style={{ fontSize: '12px' }}>为持有人盈利</span>,
                  tip: '数据源来自估值系统',
                  valueStyle: { color: staticCardValueColor },
                  description: (
                    <>
                      <Select
                        size="small"
                        style={{ width: '92px', marginRight: '6px' }}
                        value={profitValue}
                        onChange={(value: string) => {
                          setProfitValue(value);
                          setIsNotCardFetch(false);
                        }}
                      >
                        {profitOptions.map(({ value, label, disabled }: any) => {
                          return (
                            <Option style={{ fontSize: '12px' }} value={value} disabled={disabled}>
                              {label}
                            </Option>
                          );
                        })}
                      </Select>
                      <span
                        style={{ color: staticCardValueColor, fontSize: '24px', fontWeight: 400 }}
                      >
                        {/* 2727.55亿 */}
                        {isProfitFixed
                          ? `${cardData?.extInfo?.holderProfitDesc}亿`
                          : cardData.holderProfit
                          ? `${cardData.holderProfit}亿`
                          : '-'}
                      </span>
                    </>
                  ),
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
