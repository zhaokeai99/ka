import React from 'react';
import { Drawer, Descriptions } from 'antd';
import PeopleSelect from '../PeopleSelect';
import { STYLE_LABEL, PARTICIPANT_TYPE } from '../../constant';
import moment from 'moment';

import styles from './index.less';

const sortPic = (item1, item2) => {
  if (item1 && item2 && item1.type === 'pic' && item2.type === 'other') {
    return -1;
  }
  return 0;
};
// 获取状态类型
const getStatusString = (item) => {
  if (item.cancel) {
    return '已取消';
  }
  const { roadShowStartTime, roadShowEndTime } = item || {};
  const startTime = moment(roadShowStartTime);
  const endTime = moment(roadShowEndTime);
  const now = moment();
  if (now.isBefore(startTime)) {
    return '待开始';
  } else if (now.isAfter(endTime)) {
    return '已结束';
  } else {
    return '正在进行中';
  }
};
/**
 * @param {*} imgData 图片对象
 * @param {*} str     图片下载到本地的文件名
 * @param {*} type    图片下载到本地的类型
 */
// const commonDownloads = (imgData, str, type) => {
//   const blob = new Blob([imgData], { type: type });
//   if (window.navigator && window.navigator.msSaveOrOpenBlob) { // 兼容ie
//       window.navigator.msSaveOrOpenBlob(blob, str);
//   } else {
//       const downloadElement = document.createElement('a');
//       const href = window.URL.createObjectURL(blob); // 静态方法会创建一个 DOMString，其中包含一个表示参数中给出的对象的URL。这个 URL 的生命周期和创建它的窗口中的 document 绑定。这个新的URL 对象表示指定的 File 对象或 Blob 对象
//       downloadElement.href = href;
//       downloadElement.download = str;
//       document.body.appendChild(downloadElement);
//       downloadElement.click();
//       document.body.removeChild(downloadElement);
//       window.URL.revokeObjectURL(href); // 释放之前已经存在的、通过调用 URL.createObjectURL() 创建的 URL 对象。当你结束使用某个 URL 对象之后，应该通过调用这个方法来让浏览器知道不用在内存中继续保留对这个文件的引用了。
//   }
// }

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

const DetailDialog: React.FC<any> = (props = {}) => {
  // 附件图片类型单独过滤一下，缩略展示，其他的提供下载
  const { onClose, visible, data = {} } = props;

  const attachments =
    (data.roadShowMeetingAttachmentDomainList &&
      data.roadShowMeetingAttachmentDomainList.sort(sortPic)) ||
    [];
  const { roadShowMeetingDO = {} } = data;

  return (
    <Drawer width={800} title="路演详情" placement="right" onClose={onClose} visible={visible}>
      <Descriptions title="基本信息：">
        <Descriptions.Item label="主题">
          {roadShowMeetingDO.meetingSubject || '--'}
        </Descriptions.Item>
        <Descriptions.Item label="时间">
          {moment(roadShowMeetingDO.roadShowStartTime).format('YY-MM-DD HH:ss') +
            moment(roadShowMeetingDO.roadShowEndTime).format(' - HH:ss') || '--'}
        </Descriptions.Item>
        <Descriptions.Item label="外部访客">
          {roadShowMeetingDO.customerName || '--'}
        </Descriptions.Item>
        <Descriptions.Item label="形式">
          {STYLE_LABEL[roadShowMeetingDO.meetingForm] || '--'}
        </Descriptions.Item>
        <Descriptions.Item label="是否公开">
          {roadShowMeetingDO.publicToAll ? '是' : '否'}
        </Descriptions.Item>
        <Descriptions.Item label="组织者">
          <PeopleSelect value={getObjectList(roadShowMeetingDO.organizer)} noBordered disabled />
        </Descriptions.Item>
        <Descriptions.Item label="主讲人">
          <PeopleSelect value={getStringList(roadShowMeetingDO.presenters)} noBordered disabled />
        </Descriptions.Item>
        <Descriptions.Item label="参与人">
          <PeopleSelect value={getStringList(roadShowMeetingDO.participants)} noBordered disabled />
        </Descriptions.Item>
        <Descriptions.Item label="地点">
          {roadShowMeetingDO.roadShowAddress || '--'}
        </Descriptions.Item>
        <Descriptions.Item label="会议室">{roadShowMeetingDO.room || '--'}</Descriptions.Item>
        <Descriptions.Item label="状态">{getStatusString(roadShowMeetingDO)}</Descriptions.Item>
      </Descriptions>
      <Descriptions title="">
        <Descriptions.Item label="摘要">{roadShowMeetingDO.digest || '--'}</Descriptions.Item>
      </Descriptions>
      <Descriptions title="附件：">
        {attachments &&
          attachments.map((item) => {
            if (item.fileType && item.fileType.indexOf('image') > -1) {
              return (
                <Descriptions.Item label={item.fileName}>
                  <div className={styles['img-container']}>
                    <img
                      title="右键保存图片"
                      src={item.fileUrl}
                      /*onClick={() => commonDownloads(item.url, item.name, item.type)}*/ className={
                        styles['img-small']
                      }
                    />
                  </div>
                </Descriptions.Item>
              );
            } else {
              return (
                <Descriptions.Item label={item.fileName}>
                  <a href={item.fileUrl} target="blank">
                    下载
                  </a>
                </Descriptions.Item>
              );
            }
          })}
      </Descriptions>
    </Drawer>
  );
};

export default DetailDialog;
