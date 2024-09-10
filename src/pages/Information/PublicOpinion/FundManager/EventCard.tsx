import React, { useState, useCallback } from 'react';
import ProCardPlus from '@/components/ProCardPlus';
import { Select, List, Empty } from 'antd';
import moment from 'moment';
import styles from './index.less';
import DetailModal from '../components/DetailModal';
import EventDetail from '../components/EventDetail';

type EventProps = {
  dateRangeVal?: string;
  eventList: any[];
  eventTotal?: string;
  setDateRangeVal?: (a: string) => void;
  dateRangeOptions?: { label: string; value: string }[];
};

// 舆情信息
const EventCard = (props: EventProps) => {
  const { dateRangeVal, eventList, eventTotal, setDateRangeVal, dateRangeOptions } = props;
  const [isShowDetailModal, showDetailModal] = useState(false);
  const [detailInfo, setDetailInfo] = useState<{ id: number; eventType: number }>({
    id: 0,
    eventType: 0,
  });

  const hanldeOpenDetail = useCallback((info) => {
    setDetailInfo({ id: info.id, eventType: info.xyType });
    showDetailModal(true);
  }, []);

  return (
    <>
      <ProCardPlus
        title="舆情信息"
        subTitle={
          <span>
            事件合计：
            <span style={{ color: '#D9001B', paddingLeft: '5px', paddingRight: '10px' }}>
              {eventTotal}
            </span>
          </span>
        }
        extra={[
          <span>
            范围：
            <Select
              style={{ width: 120 }}
              value={dateRangeVal}
              onChange={(v) => {
                if (setDateRangeVal) setDateRangeVal(v);
              }}
              options={dateRangeOptions}
            />
          </span>,
        ]}
        style={{ height: '660px' }}
        layout="center"
      >
        {eventList.length <= 0 ? (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        ) : (
          <List
            style={{ maxHeight: '600px', overflowY: 'scroll' }}
            itemLayout="vertical"
            dataSource={eventList}
            renderItem={(item) => (
              <List.Item>
                <div className={styles['list-header']}>
                  <div className={styles['header-title']}>{item.eventTitle}</div>
                  <div className={styles['header-date']}>
                    {moment(item.tDate).format('YYYY-MM-DD')}
                  </div>
                </div>
                <EventDetail data={item} hanldeOpenDetail={hanldeOpenDetail} />
              </List.Item>
            )}
          />
        )}
      </ProCardPlus>
      <DetailModal
        visible={isShowDetailModal}
        eventId={detailInfo.id}
        xyType={detailInfo.eventType}
        onClose={useCallback(() => showDetailModal(false), [])}
      />
    </>
  );
};
EventCard.isProCard = true;

export default EventCard;
