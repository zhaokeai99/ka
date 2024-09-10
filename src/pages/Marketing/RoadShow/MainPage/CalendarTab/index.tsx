import React, { useState, useCallback, useEffect } from 'react';
import moment from 'moment';
import { message } from 'antd';
// import SummaryText from './SummaryText';
import CalendarPlus from './CalendarPlus';
import BadgeArea from './BadgeArea';
import CalendarSearch from './CalendarSearch';
import { queryRoadShow } from '../../service';

import styles from './index.less';

// 展示用的数据，需要弄成按照日期展示的列表，详情都有，所以可以不用查询了
const getFormatDisplayData = (datas) => {
  const result = {};
  if (datas && datas.length > 0) {
    for (let i = 0; i < datas.length; i++) {
      if (
        datas[i] &&
        datas[i].roadShowMeetingDO &&
        datas[i].roadShowMeetingParticipantDomainList &&
        datas[i].roadShowMeetingPresenterDomainList
      ) {
        const {
          roadShowMeetingDO,
          roadShowMeetingParticipantDomainList,
          roadShowMeetingPresenterDomainList,
          roadShowMeetingAttachmentDomainList = [],
        } = datas[i];
        const roadShowDate = moment(roadShowMeetingDO.roadShowStartTime).format('YYYY-MM-DD');
        if (!result[roadShowDate]) {
          result[roadShowDate] = [];
        }
        result[roadShowDate].push({
          roadShowMeetingDO,
          roadShowMeetingPresenterDomainList,
          roadShowMeetingParticipantDomainList,
          roadShowMeetingAttachmentDomainList,
        });
      }
    }
  }

  return result;
};

const RoadShow: React.FC<any> = (props = {}) => {
  const { onDetail, onEdit, onCancel } = props;
  const [data, setData] = useState({}); // data是个按照日历日期排满的，对象 { date: [{ 路演详细 }]}
  const [searchCase, setSearchCase] = useState({});
  const [currentDate, setCurrentDate] = useState(moment());

  // 过滤条件变化 变化后查询
  const onSearchChange = useCallback((value) => {
    setSearchCase(value);
  }, []);

  // 日历变化后查询
  const onCalendarChange = useCallback((value) => {
    setCurrentDate(value);
  }, []);

  // 上一个月，下一个月 变化后查询
  const onNext = useCallback(
    (next) => {
      // 这里查询时查整月的，并且前后加7天，防止当前页展示的前后两个月7天的元素透出
      const newDate =
        next === 1
          ? moment(currentDate).add(1, 'months')
          : moment(currentDate).subtract(1, 'months');
      setCurrentDate(newDate);
    },
    [currentDate],
  );

  // 变化后查询逻辑
  useEffect(() => {
    const params = {
      index: 1,
      size: 1000,
      queryRoadShowRangeType: searchCase.my, // 我创建的，我参加的，全部
      queryRoadShowStatusType: searchCase.status, // 路演状态，全部，未开始，完成
      // 日历组件，向前可能多展示6个，总共6行，所以向后可能多展示13个，需要时间拉长一些
      startDate: moment(currentDate)
        .startOf('month')
        .subtract(7, 'days')
        .format('YYYY-MM-DD HH:ss:mm'),
      endDate: moment(currentDate).endOf('month').add(14, 'days').format('YYYY-MM-DD HH:ss:mm'),
    };

    queryRoadShow(params)
      .then((res) => {
        if (res && res.success && res.data && res.data.records) {
          setData(getFormatDisplayData(res.data.records));
        } else {
          message.error('没有数据！');
        }
      })
      .catch((e) => console.log(e));
  }, [currentDate, searchCase]);

  return (
    <>
      <CalendarSearch onSearchChange={onSearchChange} />
      <div className={styles['info-container']}>
        {/* <SummaryText
          data={{
            title: '已结束：',
            type: 'done',
            data: 1000,
          }}
        />
        <SummaryText
          data={{
            title: '待开始：',
            type: 'undone',
            data: 200,
          }}
        /> */}
        <BadgeArea />
      </div>
      <CalendarPlus
        datas={data}
        onCalendarChange={onCalendarChange}
        value={currentDate}
        nextMonthCall={onNext}
        onDetail={onDetail}
        onEdit={onEdit}
        onCancel={onCancel}
      />
    </>
  );
};

export default RoadShow;
