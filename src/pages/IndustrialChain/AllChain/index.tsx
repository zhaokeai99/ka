import { useCallback, useEffect, useState } from 'react';
import { cardGutter, contentPadding } from '@/themes';
import ProCard from '@ant-design/pro-card';
import { history } from 'umi';
import { Col, Radio, Row, Empty, Button, message, Modal } from 'antd';
import CardItem from '../components/CardItem';
import type { ChainCardItemType } from './service';
import { queryIndustryChainList } from './service';
import type { followType } from '@/pages/IndustrialChain/components/CardItem/service';
import {
  unFollowIndustry,
  followIndustry,
} from '@/pages/IndustrialChain/components/CardItem/service';

// 全部产业链
const AllChain = () => {
  const [type, setType] = useState('default');
  const [list, setList] = useState<ChainCardItemType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const getList = useCallback(async () => {
    const result = await queryIndustryChainList({ type });

    setList(result);
  }, [type]);

  // 是否全部关注
  const isAllFollow = () => list?.every((item) => item.follow === '1');

  // 关注行业
  const followIndustryHandle = async (params: followType, fn: any) => {
    setLoading(true);

    const { success } = (await followIndustry(params)) || {};

    if (success) {
      getList();
      fn();
    }

    setLoading(false);
  };

  // 取消关注行业
  const unFollowIndustryHandle = async (params: followType, fn?: any) => {
    setLoading(true);

    const { success } = (await unFollowIndustry(params)) || {};

    if (success) {
      getList();
      fn();
    }

    setLoading(false);
  };

  useEffect(() => {
    // 请求接口
    getList();
  }, [type]);

  const onChange = (e: any) => {
    setType(e?.target?.value);
  };

  const goModel = () => {
    Modal.destroyAll();
    history.push('/industrialChain/modelData/异动推送');
  };

  // 强提示用户模型说明
  const info = () => {
    Modal.confirm({
      title: '关注成功',
      icon: null,
      cancelText: '知道了',
      okText: '查看说明',
      content: (
        <div>
          <p>
            关注后每日11点前后会在钉钉工作通知收到行业异动推送，具体介绍请查看<b>异动说明</b>
          </p>
        </div>
      ),
      onOk: goModel,
    });
  };

  return (
    <ProCard
      ghost
      direction="column"
      style={{ padding: contentPadding }}
      gutter={[0, cardGutter]}
      size="small"
    >
      <ProCard bordered={false} bodyStyle={{ padding: '12px' }}>
        <Radio.Group onChange={onChange} value={type} buttonStyle="solid">
          <Radio.Button value="default">默认分类</Radio.Button>
          <Radio.Button value="degrees">行业景气度排序</Radio.Button>
        </Radio.Group>
        {isAllFollow() ? (
          <Button
            loading={loading}
            style={{ float: 'right' }}
            onClick={() => {
              unFollowIndustryHandle(
                {
                  followType: 'ALL',
                },
                () => {
                  message.success('一键取关成功');
                },
              );
            }}
          >
            一键取关
          </Button>
        ) : (
          <Button
            loading={loading}
            style={{ float: 'right' }}
            onClick={() => {
              followIndustryHandle(
                {
                  followType: 'ALL',
                },
                () => {
                  info();
                },
              );
            }}
          >
            一键关注
          </Button>
        )}
      </ProCard>
      <ProCard bordered={false} bodyStyle={{ padding: '12px 18px' }}>
        {list?.length ? (
          <Row gutter={[16, 16]} style={{ paddingTop: '8px', paddingBottom: '8px' }}>
            {(list || []).map((item: any) => (
              <Col lg={8} xl={6} xxl={4} key={item?.industryChainName}>
                <CardItem
                  followIndustryHandle={followIndustryHandle}
                  unFollowIndustryHandle={unFollowIndustryHandle}
                  items={item}
                />
              </Col>
            ))}
          </Row>
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
      </ProCard>
    </ProCard>
  );
};

export default AllChain;
