import React from 'react';
import { Descriptions, Modal, Tag } from 'antd';
import moment from 'moment';
import { downloadTime, iconUrl } from '../service';

type PropsType = {
  visible: boolean;
  onClose: () => void;
  initValues: any;
};

const color = ['blue', 'green', 'cyan', 'orange', 'geekblue', 'purple'];

const MaterialDetail = (props: PropsType) => {
  const { visible, onClose, initValues } = props;
  const {
    materialName,
    labels,
    contentClassifyName,
    materialTypeName,
    materialStatusName,
    fundVOS,
    fundManagers,
    creator,
    gmtCreate,
    description,
    downloadTimes,
    validEndTime,
    validStartTime,
    materialFiles,
    extInfo,
    materialId,
  } = initValues;

  const renderDownloadList = (item: any, key: number) => {
    const { domainUrl, fileUrl, fileName, fileId } = item || {};
    const name = fileName?.split('.');
    const isPic = ['jpeg', 'jpg', 'png', 'gif'].includes(name[1]);

    return (
      <a
        className="download-container"
        key={key}
        href={`${domainUrl}${fileUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={async () =>
          await downloadTime({
            fileId: fileId,
            materialId,
            usageType: 'download',
          })
        }
      >
        <img alt="" src={isPic ? `${domainUrl}${fileUrl}` : iconUrl(name[1])} />
        <span className="file-name-style" title={fileName}>
          {name[0] || ''}
        </span>
        <span className="file-suffix">.{name[1] || '-'}</span>
      </a>
    );
  };

  const checkEndDate = () => {
    const permanent = validEndTime && moment(validEndTime).get('year') === 9999;

    if (permanent) {
      return <Tag color="geekblue">永久有效</Tag>;
    } else {
      if (validEndTime && moment(validEndTime) < moment()) {
        return <Tag color="red">已失效</Tag>;
      }

      return `${validStartTime ? moment(validStartTime).format('YYYY-MM-DD') : '-'} ~ ${
        validEndTime ? moment(validEndTime).format('YYYY-MM-DD') : '-'
      }`;
    }
  };

  return (
    <Modal
      title="素材详情"
      visible={visible}
      onCancel={onClose}
      footer={null}
      width="70%"
      maskClosable={false}
    >
      <Descriptions labelStyle={{ fontWeight: '500' }} style={{ paddingLeft: '24px' }}>
        <Descriptions.Item label="素材名称">{materialName || '-'}</Descriptions.Item>
        <Descriptions.Item span={2} label="素材标签">
          {labels && labels.length > 0
            ? labels?.map((i: any, key: any) => <Tag color={color[key % 6]}>{i.labelName}</Tag>)
            : '-'}
        </Descriptions.Item>
        <Descriptions.Item span={3} label="关联产品">
          {fundVOS && fundVOS.length > 0 ? fundVOS.map((i: any) => i.fundAbbr).join(', ') : '-'}
        </Descriptions.Item>
        <Descriptions.Item label="内容分类">{contentClassifyName || '-'}</Descriptions.Item>
        <Descriptions.Item label="素材类型">{materialTypeName || '-'}</Descriptions.Item>
        <Descriptions.Item label="素材状态">
          <Tag color={extInfo?.statusColor}>{materialStatusName || '-'}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="关联基金经理">
          {fundManagers && fundManagers.length > 0
            ? fundManagers.map((i: any) => i.name).join(', ')
            : '-'}
        </Descriptions.Item>
        <Descriptions.Item label="上传人">{creator || '-'}</Descriptions.Item>
        <Descriptions.Item label="下载次数">{downloadTimes}次</Descriptions.Item>
        <Descriptions.Item label="有效期">{checkEndDate()}</Descriptions.Item>
        <Descriptions.Item label="上传时间" span={2}>
          {gmtCreate ? moment(gmtCreate).format('YYYY年MM月DD日') : '-'}
        </Descriptions.Item>
        <Descriptions.Item span={3} label="素材描述">
          {description || '-'}
        </Descriptions.Item>
        <Descriptions.Item span={3} label="素材文件">
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {materialFiles && materialFiles.length > 0
              ? materialFiles?.map((i: any, key: any) => renderDownloadList(i, key))
              : '-'}
          </div>
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default MaterialDetail;
