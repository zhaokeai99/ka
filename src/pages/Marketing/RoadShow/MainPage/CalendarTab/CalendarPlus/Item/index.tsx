import moment from 'moment';
import React, { memo, useState } from 'react';
import Cancel from '../../../../../../../img/cancel.png';
import Edit from '../../../../../../../img/edit.png';
import styles from './index.less';

// 获取状态类型
const getStatusType = (item) => {
  if (item.cancel) {
    return 'cancel';
  }
  const { roadShowStartTime, roadShowEndTime } = item || {};
  const startTime = moment(roadShowStartTime);
  const endTime = moment(roadShowEndTime);
  const now = moment();
  if (now.isBefore(startTime)) {
    return 'undone';
  } else if (now.isAfter(endTime)) {
    return 'done';
  } else {
    return 'going';
  }
};
// 需要重新解析数据结构
const Item: React.FC<any> = (props = {}) => {
  const { item, onDetail, onEdit, onCancel } = props;
  const { roadShowMeetingDO = {} } = item || {};
  const [showEdit, setShowEdit] = useState(false);
  const title = roadShowMeetingDO.meetingSubject || '--';
  const time =
    (roadShowMeetingDO.roadShowStartTime &&
      moment(roadShowMeetingDO.roadShowStartTime).format('HH:ss')) ||
    '--';
  const over =
    roadShowMeetingDO.roadShowEndTime &&
    moment(roadShowMeetingDO.roadShowEndTime).isBefore(moment());

  return (
    <div
      className={styles[`container`]}
      onMouseEnter={() => {
        setShowEdit(true);
      }}
      onMouseLeave={() => {
        setShowEdit(false);
      }}
    >
      <div className={styles[`item-status-${getStatusType(roadShowMeetingDO)}`]}></div>
      <div
        title={time}
        className={styles[`item-date`]}
        onClick={() => onDetail && onDetail(roadShowMeetingDO.id, item)}
      >
        {time}
      </div>
      <div
        title={title}
        className={styles['item-title']}
        style={{ backgroundColor: `${item.isMy ? '#84adfd' : ''}` }}
        onClick={() => onDetail && onDetail(roadShowMeetingDO.id, item)}
      >
        {title}
      </div>
      {showEdit && item.isMy && !roadShowMeetingDO.cancel && (
        <div className={styles[`option`]}>
          <img
            src={Edit}
            title="编辑路演"
            className={styles[`icon`]}
            onClick={() => onEdit && onEdit(roadShowMeetingDO.id, item)}
          ></img>
          {!over && (
            <img
              src={Cancel}
              title="取消路演"
              className={styles[`icon`]}
              onClick={() => onCancel && onCancel(roadShowMeetingDO.id)}
            ></img>
          )}
        </div>
      )}
    </div>
  );
};

export default memo(Item);
