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
}

const template = {
  // 模板1
  b_rate_style: '债券评级变化⽅向',
  b_creditrating_change: '前次评级为',
  b_info_precreditrating: '本次评级',
  b_info_creditrating: '评级机构',
  b_info_creditratingexplain: '评级说明',

  // 模板2
  s_info_compname: '评级变化⽅向',
  b_info_creditratingagency: '评级展望',
  b_info_issuerratetype: '评级主体类型',

  // 模板3
  illeg_type: '违规类型',
  subjects: '被处罚对象',
  relation_types: '被处罚对象和主体的关系',
  disposal_types: '处罚类型',

  //模板 4 评级机构关注
  event_name: '机构关注事件类型',
  event_title: '事件标题',
  ann_abstract: '摘要',

  // 模板 5 债券违约
  b_default_reason: '违约原因',
  b_default_date_balance: '违约⽇债券余额(元)',
  b_capital_resalepayment: '应付本息及回售款(元)',
  b_payment_cap_int_resale: '实际兑付本息及回售款(元)',

  // 模板 6 重要公告
  title: '标题',
  ann_link: '公告链接',

  // 模板 7 ⾼/中/低舆情
  newstag: '舆情标签',
  emotion: '舆情正负⾯',
  url: '舆情链接',
  sourcename: '舆情源',
  ann_datetime: '舆情时间',

  // 模板 8 其他（包括负⾯舆情表中的多个事件类型）
  event_abstract: '事件摘要',
};

const isUrlArray = ['url', 'ann_link'];

const EventDetailModal: React.FC<IEventDetailModal> = ({ visible, onClose, title, record }) => {
  const eventJson = useMemo(() => {
    return record?.eventDetailJson;
  }, [record]);

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
      className={styles['coupon-after-modal']}
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
