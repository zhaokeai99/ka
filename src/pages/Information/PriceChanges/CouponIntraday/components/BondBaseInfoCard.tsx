import React, { useState, useEffect } from 'react';
import { useParams, history } from 'umi';
import { cardGutter } from '@/themes';
import ProCard from '@ant-design/pro-card';
import { Row, Col, Tag, Spin } from 'antd';
import { IBondBaseInfoType } from '../service';
import styles from '../index.less';
import { getBondBaseInfo } from '../service';

const BondBaseInfoCard = () => {
  const [baseInfo, setBaseInfo] = useState<Partial<IBondBaseInfoType>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const pramas = useParams<{ id: string }>(); //TODO

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data } = await getBondBaseInfo({ bondCode: pramas?.id });
      setBaseInfo({
        ...data,
      });
      setLoading(false);
    })();
  }, [pramas?.id]);

  const onNavigateClick = (bondCode: any, name: any) => () => {
    history.push(`/information/priceChanges/subjectDetail/${name}/${bondCode}`);
  };

  return (
    <Spin spinning={loading}>
      <Row gutter={[cardGutter, cardGutter]}>
        <Col span={12}>
          <ProCard size="small">
            <div className={styles['base-info-title']}>
              <div className={styles['base-info-text']}>
                <div className={styles['base-info-name']} title={baseInfo?.bondShortName ?? '--'}>
                  {baseInfo?.bondShortName ?? '--'}
                </div>
                {baseInfo?.industryName && (
                  <div style={{ flex: 1 }}>
                    <Tag color="volcano" style={{ marginLeft: 12 }}>
                      {baseInfo?.industryName}
                    </Tag>
                  </div>
                )}
              </div>
            </div>
            <Row>
              <Col span={6}>
                <div className={styles['base-info-label']}>剩余期限</div>
                <div className={styles['base-info-value']}>
                  {baseInfo?.remainingMaturity ?? '--'}
                </div>
              </Col>
              <Col span={6}>
                <div className={styles['base-info-label']}>票面利率</div>
                <div className={styles['base-info-value']}>{baseInfo?.couponRate ?? '--'}</div>
              </Col>
              <Col span={6}>
                <div className={styles['base-info-label']}>债项评级</div>
                <div className={styles['base-info-value']}>{baseInfo?.bondRating ?? '--'}</div>
              </Col>
              <Col span={6}>
                <div className={styles['base-info-label']}>到期日</div>
                <div className={styles['base-info-value']}>{baseInfo?.maturityDate ?? '--'}</div>
              </Col>
            </Row>
          </ProCard>
        </Col>
        <Col span={12}>
          <ProCard size="small">
            <div className={styles['base-info-title']}>
              <div className={styles['base-info-text']}>
                <div className={styles['base-info-name']} title={baseInfo?.compName ?? '--'}>
                  {baseInfo?.compName ?? '--'}
                </div>
                {baseInfo?.compWindName && (
                  <div style={{ flex: 1 }}>
                    <Tag color="volcano" style={{ marginLeft: 12 }}>
                      {baseInfo?.compWindName}
                    </Tag>
                  </div>
                )}
              </div>
              {baseInfo?.compCode && (
                <div className={styles['base-info-nav']}>
                  <a
                    onClick={onNavigateClick(baseInfo?.compCode, baseInfo?.compName)}
                    target="__block"
                  >
                    主体详情&gt;&gt;
                  </a>
                </div>
              )}
            </div>
            <Row>
              <Col span={6}>
                <div className={styles['base-info-label']}>主体评级</div>
                <div className={styles['base-info-value']}>{baseInfo?.compRating ?? '--'}</div>
              </Col>
              <Col span={6}>
                <div className={styles['base-info-label']}>所属行业</div>
                <div className={styles['base-info-value']}>{baseInfo?.compWindName ?? '--'}</div>
              </Col>
              <Col span={6}>
                <div className={styles['base-info-label']}>性质</div>
                <div className={styles['base-info-value']}>{baseInfo?.guarantorNature ?? '--'}</div>
              </Col>
              <Col span={6}>
                <div className={styles['base-info-label']}>地区</div>
                <div className={styles['base-info-value']}>{baseInfo?.region ?? '--'}</div>
              </Col>
            </Row>
          </ProCard>
        </Col>
      </Row>
    </Spin>
  );
};

export default BondBaseInfoCard;
