import React, { memo } from 'react';
import { useModel } from 'umi';
import moment from 'moment';

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

const getUserNameString = (userString) => {
  let userList = [];
  try {
    userList = JSON.parse(userString);
  } catch (e) {
    console.log(e);
  }
  let result = '';
  if (userList && userList.length > 0) {
    userList.forEach((item) => {
      result += item.realName + ',';
    });
    return result.substring(0, result.length - 1);
  }
  return '--';
};
const ShowItem: React.FC<any> = (props = {}) => {
  const { data, onDetail, onEdit, onCancel } = props;
  const { initialState } = useModel('@@initialState');

  const { roadShowMeetingDO = {} } = data;
  const isMy = initialState.userNo === roadShowMeetingDO.creator;
  const over =
    roadShowMeetingDO.roadShowEndTime &&
    moment(roadShowMeetingDO.roadShowEndTime).isBefore(moment());

  return (
    <div className={styles[`container`]}>
      <div className={styles[`content-container`]}>
        <h2>{roadShowMeetingDO.meetingSubject || '--'}</h2>
        <span className={styles['summary']}>{roadShowMeetingDO.digest || '--'}</span>
        <div className={styles['label-container']}>
          <div className={styles[`item-status-${getStatusType(roadShowMeetingDO)}`]}></div>
          <span className={styles['label']}>时间：</span>
          <div className={styles['data']}>
            {moment(roadShowMeetingDO.roadShowStartTime).format('YY-MM-DD hh:mm') +
              moment(roadShowMeetingDO.roadShowEndTime).format(' - hh:mm') || '--'}
          </div>
          {/* <div>{data.endTime || '--'}</div> */}
          <span className={styles['label']}>主讲人：</span>
          <div className={styles['data-people']}>
            {getUserNameString(roadShowMeetingDO.presenters) || '--'}
          </div>
          <span className={styles['label']}>地点：</span>
          <div className={styles['data']}>{roadShowMeetingDO.roadShowAddress || '--'}</div>
          <span className={styles['label']}>会议室：</span>
          <div className={styles['data']}>{roadShowMeetingDO.room || '--'}</div>
          <span className={styles['label']}>外部访客：</span>
          <div className={styles['data']}>{roadShowMeetingDO.customerName || '--'}</div>
        </div>
      </div>
      <div className={styles[`option`]}>
        <a
          title="查看路演详情"
          className={styles[`item`]}
          onClick={() => onDetail && onDetail(roadShowMeetingDO.id, data)}
        >
          详情
        </a>
        {isMy && !roadShowMeetingDO.cancel && (
          <a
            title="编辑路演信息"
            className={styles[`item`]}
            onClick={() => onEdit && onEdit(roadShowMeetingDO.id, data)}
          >
            编辑
          </a>
        )}
        {isMy && !roadShowMeetingDO.cancel && !over && (
          <a
            title="取消路演"
            className={styles[`item`]}
            onClick={() => onCancel && onCancel(roadShowMeetingDO.id)}
          >
            取消
          </a>
        )}
      </div>
    </div>
  );
};

export default memo(ShowItem);
