import React, { memo, useCallback, useState, useEffect } from 'react';
import { Modal, Button, Tag, Descriptions } from 'antd';
interface PropsType {
  visible: boolean;
  handleOk: any;
  handleCancel: any;
  editObj: any;
}
const TrackAdd: React.FC<PropsType> = (props) => {
  const { visible, handleOk, handleCancel, editObj } = props;
  const [tags, setTags] = useState<any[]>([]);
  const [deleteTags, setDeleteTags] = useState<any[]>([]);
  useEffect(() => {
    setTags(() => {
      if (Array.isArray(editObj.userComposeList)) {
        return editObj.userComposeList;
      }
    });
  }, [editObj]);
  const handleFinish = useCallback(() => {
    let composeIds: any = deleteTags;
    if (composeIds.length === 0) {
      composeIds = tags.map((item) => item.composeId);
    }
    handleOk({ composeIds });
  }, [handleOk, deleteTags, tags]);
  const onCancel = useCallback(() => {
    handleCancel();
  }, [handleCancel]);
  //删除赛道中单个组合
  const handleClose = useCallback(
    (removedTag) => {
      const _tags: any[] = tags.filter((tag: any) => tag.composeId !== removedTag);
      setTags(_tags);
      setDeleteTags([...deleteTags, removedTag]);
    },
    [tags],
  );
  return (
    <Modal
      title="删除赛道中的组合"
      visible={visible}
      onCancel={onCancel}
      centered
      width={500}
      footer={false}
    >
      <Descriptions bordered>
        <Descriptions.Item span={24} label="赛道名称">
          {editObj.trackName}
        </Descriptions.Item>
        <Descriptions.Item span={24} label="组合名称">
          {tags &&
            Array.isArray(tags) &&
            tags.map((item: any) => {
              return (
                <Tag
                  style={{ marginBottom: 8 }}
                  key={item.composeId}
                  closable
                  color="blue"
                  onClose={() => handleClose(item.composeId)}
                >
                  {item.composeName}
                </Tag>
              );
            })}
        </Descriptions.Item>
      </Descriptions>
      <div style={{ marginTop: 20, textAlign: 'center' }}>
        <Button style={{ width: 100 }} onClick={handleFinish} type="primary">
          确定
        </Button>
      </div>
    </Modal>
  );
};

export default memo(TrackAdd);
