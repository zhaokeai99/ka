import { memo } from 'react';
import { COLORENUM } from '@/pages/IndustrialChain/data.d';
import { StarFilled } from '@ant-design/icons';
import { Card, message, Modal, Tag } from 'antd';
import { history, useModel } from 'umi';
import type { followType } from './service';
import { queryFatiguePOST, putFatiguePOST } from '@/services/fundportal/fatigue';
import styles from './index.less';

interface CardProps {
  followIndustryHandle: (value: followType, fn?: any) => void;
  unFollowIndustryHandle: (value: followType, fn?: any) => void;
  items: {
    bizDate?: string; // 业务日期
    abnormalSignal: boolean;
    follow: string; // 是否关注 0-未关注 1-已关注
    industryChainCode: string; // 产业链编号
    industryChainName: string; // 产业链名称
    industryProsperity: string; // 产业景气度
    resourcesPath: string; // 背景图
    chain: string; // 是否是产业链标记
  };
}

const CardItem = ({ items, followIndustryHandle, unFollowIndustryHandle }: CardProps) => {
  const { initialState } = useModel('@@initialState');

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

  // 读取疲劳度的值，确定是否显示，显示的话，上报疲劳度
  const queryFatigue = async () => {
    const param = {
      itemList: [
        {
          contentType: 'focusCard',
          contentCode: 'focus',
          solutionCode: 'TH_ADD_ATTENTION_INDUSTRIAL_CHAIN_SOLUTION',
        },
      ],
      channel: 'FRONT',
      secondChannel: 'FUNDPORTAL',
      userId: initialState?.userName,
    };

    const { success, data } = (await queryFatiguePOST(param)) || {};

    if (success && data && data.itemList && data.itemList[0]) {
      if (!data.itemList[0].control) {
        const upParam = {
          contentType: 'focusCard',
          contentCode: 'focus',
          positionCode: 'TH_ADD_ATTENTION_INDUSTRIAL_CHAIN',
          userAction: 'CLICK',
          userId: initialState?.userName,
          channel: 'FRONT',
          secondChannel: 'FUNDPORTAL',
        };
        // 强提示
        info();

        // 上报疲劳度
        await putFatiguePOST(upParam);
      } else {
        message.success('关注成功');
      }
    }
  };

  return (
    <Card
      bordered={false}
      headStyle={{ padding: 0, margin: 0 }}
      bodyStyle={{ padding: 0, paddingTop: 8, margin: 0 }}
      className={styles['card-item']}
    >
      <StarFilled
        className={styles['card-item-tag']}
        style={{ color: items.follow === '1' ? '#FAAD14' : '#BFBFBF' }}
        onClick={(e) => {
          e?.stopPropagation();
          if (items?.follow === '0') {
            followIndustryHandle(
              {
                followIndustryName: items?.industryChainName,
                followType: 'SINGLE',
              },
              queryFatigue,
            );
          } else {
            unFollowIndustryHandle(
              {
                followIndustryName: items?.industryChainName,
                followType: 'SINGLE',
              },
              () => {
                message.success('取消关注成功');
              },
            );
          }
        }}
      />

      <div className={styles['card-item-content']}>
        <div className={styles['card-item-top']}>
          <span title={items?.industryChainName} className={styles['card-item-content-title']}>
            {items?.industryChainName ?? '行业未知'}
          </span>

          {items?.abnormalSignal ? (
            <Tag className={styles['start-filled']} color={COLORENUM?.red6}>
              异动
            </Tag>
          ) : null}
        </div>
        <div className={styles['card-item-content-desc']}>
          行业景气度： {items?.industryProsperity ?? '未知'}
        </div>
      </div>

      <div className={styles['card-item-content-btn']}>
        <div
          onClick={() =>
            history.push(
              `/industrialChain/industryCenter/${items?.industryChainName}/${items?.industryChainCode}/${items?.chain}`,
            )
          }
        >
          行业主页
        </div>
        {items?.chain === '1' ? (
          <div
            className={styles['chain-btn']}
            onClick={() =>
              history.push(
                `/industrialChain/chainDetail/${items?.industryChainName}/${items?.industryChainCode}`,
              )
            }
          >
            全景产业链
          </div>
        ) : null}
      </div>
    </Card>
  );
};

export default memo(CardItem);
