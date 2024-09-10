import React, { useState, useCallback, useEffect, memo } from 'react';
import { Modal, Transfer, message } from 'antd';
import { getUserInfoByType, userRelationConfig } from './service';

interface ModalProps {
  visible: boolean;
  userId: string;
  title: string;
  dataList: any[];
  onClose: (val?: string) => void;
}

const ModalEdit = (props: ModalProps) => {
  const { visible, title } = props;
  const [searchList, setSearchList] = useState<any[]>([]);
  const [targetKeys, setTargetKeys] = useState<string[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  const handleSearchAll = useCallback(async (values) => {
    const data = await getUserInfoByType({
      ...values,
      userType: 0, // 机构用户
    });
    setSearchList(data);
  }, []);

  const handleChange = useCallback((nextTargetKeys: any) => {
    setTargetKeys(nextTargetKeys);
  }, []);

  const handleSelectChange = useCallback((sourceSelectedKeys: any, targetSelectedKeys: any) => {
    setSelectedKeys(() => {
      return [...sourceSelectedKeys, ...targetSelectedKeys];
    });
  }, []);

  const handleSubmit = useCallback(async () => {
    const result = await userRelationConfig({
      salesUserId: props.userId,
      agencyUserId: targetKeys,
    });
    if (result.success) {
      props.onClose();
      return;
    }
    message.error(result.errorMsg || '接口请求失败');
  }, [props, targetKeys]);

  useEffect(() => {
    if (props.visible) {
      handleSearchAll({});
      setTargetKeys(() => {
        return props.dataList?.map((item) => item.userId) || [];
      });
    }
  }, [props]);

  return (
    <Modal
      width="60%"
      title={`${title}-配置关联用户`}
      visible={visible}
      onCancel={() => props.onClose()}
      onOk={handleSubmit}
      okText="确认配置"
    >
      <Transfer
        oneWay
        showSearch
        dataSource={searchList}
        titles={['所有机构用户', '分配机构用户']}
        targetKeys={targetKeys}
        selectedKeys={selectedKeys}
        onChange={handleChange}
        onSelectChange={handleSelectChange}
        render={(item) =>
          `${item.agencyName || '暂无机构'}-${item.departmentName || '暂无部门'}-${item.title}-${
            item.mobile
          }`
        }
        style={{ marginBottom: 16 }}
        listStyle={{
          width: '50%',
          minHeight: '55vh',
        }}
      />
    </Modal>
  );
};

export default memo(ModalEdit);
