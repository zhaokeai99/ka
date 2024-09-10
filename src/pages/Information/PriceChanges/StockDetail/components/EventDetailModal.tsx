import { Modal } from 'antd';
import React, { useMemo } from 'react';
import styles from '../index.less';

interface IEventDetailModal {
  visible?: boolean;
  onClose?: () => void;
  record?: Partial<{
    eventDetail: string;
    eventTitle: string;
    eventType: string;
    tradeDate: string;
    windBondCode: string;
    eventDetailJson: string;
  }>;
  title?: React.ReactNode;
  stockType?: string;
}

const ASharesTemplate = {
  // ● 事件类型：主体违规
  ehaviors: '违规行为',
  illeg_type: '违规类型',
  subjects: '被处罚对象',
  relation_types: '被处罚对象和主体的关系',
  disposal_types: '处罚类型',

  // 事件类型：大约几百个
  s_event_content: '事件详情',
  event_title: '标题',
  event_abstract: '事件摘要',

  //   详情模板（交易细节可能缺失，缺失则不展示）：
  title: '标题',
  holder_name: '持有人名称',
  transact_type_name: '增减持',
  transact_quantity: '增减持数量',
  trade_detail: '交易细节',

  // 4 重要公告
  link: '链接',

  //事件类型：高舆情、中舆情、低舆情
  newstag: '舆情标签',
  emotion: '舆情正负面',
  url: '舆情链接',
  sourcename: '舆情源',
  ann_datetime: '舆情时间',

  //   事件类型：商票持续逾期名单
  商票持续逾期名单: '商票持续逾期名单',
  票据承兑余额: '票据承兑余额',
  票据累计逾期发生额: '票据累计逾期发生额',
  票据逾期余额: '票据累计逾期发生额',
  group_name: '公司谱系',
};

const HKSharesTemplate = {
  //   ● 事件类型：主体违规
  behaviors: '违规行为',
  illeg_type: '违规类型',
  subjects: '被处罚对象',
  relation_types: '被处罚对象和主体的关系',
  disposal_types: '处罚类型',

  // 事件类型：大约几百个
  s_event_content: '事件详情',
  event_title: '标题',
  event_abstract: '事件摘要',

  // 4 重要公告
  link: '链接',
  title: '标题',

  // 事件类型：机构评级
  institution: '评级机构',
  analyst: '分析师',
  score: '打分',
  rating: '评级机构',
  chg_drctn_code: '评级变动方向',
  description: '详情描述',

  //事件类型：高舆情、中舆情、低舆情
  newstag: '舆情标签',
  emotion: '舆情正负面',
  url: '舆情链接',
  sourcename: '舆情源',
  ann_datetime: '舆情时间',

  //   事件类型：商票持续逾期名单
  商票持续逾期名单: '商票持续逾期名单',
  票据承兑余额: '票据承兑余额',
  票据累计逾期发生额: '票据累计逾期发生额',
  票据逾期余额: '票据累计逾期发生额',
  group_name: '公司谱系',

  //   事件类型：大股东减持
  holder_name: '股东名称',
  holder_typename: '股东类型',
  shrnum: '减持股数量',
  shr_typename: '减持股类型',
};

const isUrlArray = ['url', 'ann_link'];

const EventDetailModal: React.FC<IEventDetailModal> = ({
  visible,
  onClose,
  title,
  record,
  stockType,
}) => {
  const eventJson = useMemo(() => {
    return record?.eventDetailJson;
  }, [record]);

  const template = useMemo(() => {
    switch (stockType) {
      case 'A股':
        return ASharesTemplate;
      case '港股':
        return HKSharesTemplate;
      default:
        return [];
    }
  }, [stockType]);

  const labelMaxWidth = useMemo(() => {
    let maxWidth = 0;
    if (eventJson) {
      Object.keys(eventJson)?.forEach((v) => {
        if (Object.keys(template).includes(v) && eventJson[v]) {
          const targetWidth = template?.[v]?.length * 12 + 16;
          if (targetWidth > maxWidth) {
            maxWidth = targetWidth;
          }
        }
      });
    }

    return maxWidth;
  }, [eventJson]);

  const urlify = (text: any) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, (url: any) => {
      return `<a target="_blank" rel="noopener noreferrer" href="${url}">${url}</a>`;
    });
  };

  return (
    <Modal
      visible={visible}
      onCancel={onClose}
      onOk={onClose}
      title={title}
      width={600}
      className={styles['move-event-modal']}
      footer={false}
    >
      {record?.eventTitle && (
        <div className={styles['event-title']}>{record?.eventTitle ?? '--'}</div>
      )}
      <div className={styles['event-detail-box']}>
        {eventJson &&
          Object.keys(eventJson)?.length > 0 &&
          Object.keys(eventJson)?.map((v) => {
            if (Object.keys(template).includes(v) && eventJson[v]) {
              const html = urlify(eventJson[v]);
              return (
                <div key={v} className={styles['event-content']}>
                  <div className={styles['event-label']} style={{ width: labelMaxWidth }}>
                    <span>{template[v]}：</span>
                  </div>
                  {isUrlArray.includes(v) ? (
                    <a target="_blank" href={eventJson[v]} rel="noopener noreferrer">
                      查看原链接
                    </a>
                  ) : (
                    <div
                      className={styles['event-txt']}
                      dangerouslySetInnerHTML={{ __html: `${html}` }}
                    ></div>
                  )}
                </div>
              );
            }
          })}
      </div>
    </Modal>
  );
};

export default EventDetailModal;
