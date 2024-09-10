import ProCardPlus from '@/components/ProCardPlus';
import { Col, Row, Empty } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import CardItem from '@/pages/IndustrialChain/components/CardItem';
import type { ChainCardItemType } from '../../service';
import { queryIndustryChainList } from '../../service';
import type { followType } from '@/pages/IndustrialChain/components/CardItem/service';
import {
  unFollowIndustry,
  followIndustry,
} from '@/pages/IndustrialChain/components/CardItem/service';

const ChainCard = () => {
  const [list, setList] = useState<ChainCardItemType[]>([]);

  const getList = useCallback(async () => {
    const result = await queryIndustryChainList();

    setList(result || []);
  }, []);

  // 关注行业
  const followIndustryHandle = async (params: followType, fn: any) => {
    const { success } = (await followIndustry(params)) || {};

    if (success) {
      getList();
      fn();
    }
  };

  // 取消关注行业
  const unFollowIndustryHandle = async (params: followType, fn?: any) => {
    const { success } = (await unFollowIndustry(params)) || {};

    if (success) {
      getList();
      fn();
    }
  };

  // 产业链列表接口
  useEffect(() => {
    getList();
  }, []);

  return (
    <ProCardPlus
      title="行业选择"
      extra={
        <a style={{ fontSize: 12 }} href="#/industrialChain/allChain">
          展示全部 &gt;
        </a>
      }
    >
      {list?.length ? (
        <Row
          gutter={[16, 12]}
          style={{
            maxHeight: '242px',
            overflowY: 'hidden',
          }}
        >
          {(list || []).map((item: any) => (
            <Col lg={8} xl={6} xxl={4} key={item?.industryChainName}>
              <CardItem
                unFollowIndustryHandle={unFollowIndustryHandle}
                followIndustryHandle={followIndustryHandle}
                items={item}
              />
            </Col>
          ))}
        </Row>
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
    </ProCardPlus>
  );
};

ChainCard.isProCard = true;

export default ChainCard;
