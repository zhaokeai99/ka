import React, { useCallback, useState } from 'react';
import { Calendar, Select, Col, Row, Modal, Table } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import moment from 'moment';
import Item from './Item';
import { PUBLIC, PARTICIPANT_TYPE } from '../../../constant';
import styles from './index.less';

// 转对象为选中数组
const getObjectList = (stringObj) => {
  const objList = [];
  try {
    const obj = JSON.parse(stringObj);
    if (obj) {
      objList.push({
        participantType: obj.participantType,
        participantName: obj.realName,
        participantAccount: obj.name,
      });
    }
  } catch (e) {
    console.log(e);
  }

  return objList;
};

// 转列表为选中数组
const getStringList = (stringList) => {
  const objList = [];
  try {
    const list = JSON.parse(stringList);
    if (list) {
      list.forEach((element) => {
        if (element) {
          const data = {
            participantType: element.participantType,
            participantName: element.realName,
            participantAccount: element.name,
          };
          if (element.participantType === PARTICIPANT_TYPE.GROUP) {
            const roadShowParticipants =
              element.roadShowParticipants &&
              element.roadShowParticipants.map((item) => {
                return {
                  participantType: item.participantType,
                  participantName: item.realName,
                  participantAccount: item.name,
                };
              });
            data.roadShowParticipants = roadShowParticipants;
          }
          objList.push(data);
        }
      });
    }
  } catch (e) {
    console.log(e);
  }
  return objList;
};

// 解析查询的待编辑路演的详情回填到编辑页
const getDetailForShow = (data) => {
  const attachments = data.roadShowMeetingAttachmentDomainList || [];
  const { roadShowMeetingDO = {} } = data;

  const roadShowAttachments = [];
  if (attachments && attachments.length > 0) {
    attachments.forEach((element, index) => {
      if (element) {
        roadShowAttachments.push({
          uid: '' + index,
          name: element.fileName,
          status: 'done',
          type: element.fileType,
          url: element.fileUrl,
        });
      }
    });
  }
  const presenters = getStringList(roadShowMeetingDO.presenters);
  const roadShowOrganizerVO = getObjectList(roadShowMeetingDO.organizer);
  const result = {
    meetingSubject: roadShowMeetingDO.meetingSubject,
    customerName: roadShowMeetingDO.customerName,
    meetingForm: roadShowMeetingDO.meetingForm === 1 ? '线上' : '线下',
    roadShowAddress: roadShowMeetingDO.roadShowAddress,
    roadShowOrganizerVO,
    organizer:
      (roadShowOrganizerVO && roadShowOrganizerVO[0] && roadShowOrganizerVO[0].participantName) ||
      '--',
    room: roadShowMeetingDO.room,
    presenters,
    presentersString: (presenters && presenters[0] && presenters[0].participantName) || '--',
    publicToAll: roadShowMeetingDO.publicToAll ? PUBLIC.YES : PUBLIC.NO,
    times: [moment(roadShowMeetingDO.roadShowStartTime), moment(roadShowMeetingDO.roadShowEndTime)],
    digest: roadShowMeetingDO.digest,
    participants: getStringList(roadShowMeetingDO.participants),
    roadShowAttachments,
  };

  return result;
};

const getShowList = (dataList) => {
  if (dataList && dataList.length > 0) {
    const newList = [];
    for (let i = 0; i < dataList.length; i++) {
      if (dataList[i]) {
        newList.push(getDetailForShow(dataList[i]));
      }
    }

    return newList;
  }
  return [];
};

const CalendarPlus: React.FC<any> = (props = {}) => {
  const { initialState } = useModel('@@initialState');
  const {
    onDetail,
    onEdit,
    onCancel,
    datas,
    onCalendarChange,
    value: initValue,
    nextMonthCall,
  } = props;

  const [showDetailDatas, setShowDetailList] = useState({
    show: false,
    dataList: [],
  });

  // data 这些数据应该来自props，然后需要通过工具函数获取目标 解析数据
  const getListData = useCallback(
    (date) => {
      // const date = value.format('YYYY-MM-DD');
      const listData = (datas && date && datas[date.format('YYYY-MM-DD')]) || [];

      const result = listData.filter((item) => {
        const { roadShowMeetingDO } = item || {};
        return !!roadShowMeetingDO;
      });
      return result;
    },
    [datas],
  );

  const showDetailDlg = useCallback(
    (dataList) => {
      // todo delete
      setShowDetailList({
        show: true,
        dataList,
      });
      if (dataList && dataList.length > 0) {
        setShowDetailList({
          show: true,
          dataList,
        });
      }
    },
    [datas],
  );

  const dateCellRender = useCallback(
    (date) => {
      const listData = getListData(date);
      return (
        <div className={styles['container']}>
          <div className={styles['head-container']}>
            {listData.length > 0 && (
              <EyeOutlined
                className={styles['detail']}
                title="查看路演列表详情"
                onClick={() => showDetailDlg(listData)}
              />
            )}
            <span>{moment(date).date()}</span>
          </div>
          <ul className={styles['events']}>
            {listData.map((item) => (
              <li key={item.roadShowMeetingDO.id}>
                <Item
                  item={{
                    ...item,
                    isMy:
                      initialState.userNo ===
                      (item.roadShowMeetingDO && item.roadShowMeetingDO.creator),
                  }}
                  onDetail={onDetail}
                  onEdit={onEdit}
                  onCancel={onCancel}
                />
              </li>
            ))}
          </ul>
        </div>
      );
    },
    [datas],
  );

  const monthCellRender = useCallback(() => {
    return (
      <div className={styles['notes-month']}>
        <span>暂不支持月份展示</span>
      </div>
    );
  }, [datas]);

  const onChangeValue = useCallback((date) => {
    if (onCalendarChange) {
      onCalendarChange(date);
    }
  }, []);

  const columns = [
    {
      title: '外部访客',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: '形式',
      dataIndex: 'meetingForm',
      key: 'meetingForm',
    },
    {
      title: '主讲人',
      dataIndex: 'presentersString',
      key: 'presentersString',
    },
    {
      title: '会议室',
      dataIndex: 'room',
      key: 'room',
    },
    {
      title: '会议主题',
      dataIndex: 'meetingSubject',
      key: 'meetingSubject',
    },
    {
      title: '组织者',
      dataIndex: 'organizer',
      key: 'organizer',
    },
  ];

  console.log(showDetailDatas.dataList);
  return (
    <>
      <Calendar
        dateFullCellRender={dateCellRender}
        monthCellRender={monthCellRender}
        headerRender={({ value, onChange }) => {
          const start = 0;
          const end = 12;
          const monthOptions = [];

          const current = value.clone();
          const localeData = value.localeData();
          const months = [];
          for (let i = 0; i < 12; i++) {
            current.month(i);
            months.push(localeData.monthsShort(current));
          }

          for (let index = start; index < end; index++) {
            monthOptions.push(
              <Select.Option className="month-item" key={`${index}`}>
                {months[index]}
              </Select.Option>,
            );
          }
          const month = value.month();

          const year = value.year();
          const options = [];
          for (let i = year - 10; i < year + 10; i += 1) {
            options.push(
              <Select.Option key={i} value={i} className="year-item">
                {i}
              </Select.Option>,
            );
          }
          return (
            <div style={{ padding: 8 }}>
              <Row gutter={8}>
                {/* <Col>
              <Radio.Group size="small" onChange={e => onTypeChange(e.target.value)} value={type}>
                <Radio.Button value="month">Month</Radio.Button>
                <Radio.Button value="year">Year</Radio.Button>
              </Radio.Group>
            </Col> */}
                <Col>
                  <Select
                    size="small"
                    dropdownMatchSelectWidth={false}
                    className="my-year-select"
                    onChange={(newYear) => {
                      const now = value.clone().year(newYear);
                      onChange(now);
                    }}
                    value={String(year)}
                  >
                    {options}
                  </Select>
                </Col>
                <Col>
                  <Select
                    size="small"
                    dropdownMatchSelectWidth={false}
                    value={String(month)}
                    onChange={(selectedMonth) => {
                      const newValue = value.clone();
                      newValue.month(parseInt(selectedMonth, 10));
                      onChange(newValue);
                    }}
                  >
                    {monthOptions}
                  </Select>
                </Col>
                <Col>
                  <div className={styles[`search-next`]}>
                    <a
                      title="上一月"
                      className={styles[`item`]}
                      onClick={() => nextMonthCall && nextMonthCall(-1)}
                    >
                      {'<<'}
                    </a>
                    <a
                      title="下一月"
                      className={styles[`item`]}
                      onClick={() => nextMonthCall && nextMonthCall(1)}
                    >
                      {'>>'}
                    </a>
                  </div>
                </Col>
              </Row>
            </div>
          );
        }}
        value={initValue}
        onChange={onChangeValue}
      />
      <Modal
        title=""
        width={800}
        visible={showDetailDatas.show}
        onOk={() => setShowDetailList({ show: false, dataList: [] })}
        onCancel={() => setShowDetailList({ show: false, dataList: [] })}
      >
        <Table
          dataSource={getShowList(showDetailDatas.dataList)}
          columns={columns}
          pagination={false}
        />
      </Modal>
    </>
  );
};

export default CalendarPlus;
