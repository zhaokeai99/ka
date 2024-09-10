import React, { useRef, useMemo, useState } from 'react';
import {
  ModalForm,
  ProFormText,
  ProFormSelect,
  ProFormTextArea,
  ProFormInstance,
} from '@ant-design/pro-form';
import CommonUpload from '@/components/CommonUpload';
import { Spin } from 'antd';
import debounce from 'lodash/debounce';
import { queryUserEmail } from '../service';
import styles from '../DetailFile/index.less';

export default (props: {
  visible: boolean;
  sendClosedModal: any;
  sendModalData: any;
  handleFinish: any;
}) => {
  const { visible, sendClosedModal, sendModalData, handleFinish } = props;

  const formRef = useRef<ProFormInstance<{}>>();
  const [options, setOptions] = useState<any[]>([]);
  const [fetching, setFetching] = useState(false);
  const [defaultFileList, setDefaultFileList] = useState<any[]>([]);
  const fetchRef = useRef(0);

  // 整理接口返回的数据为Map
  const newData = useMemo(() => {
    const dataMap = {};
    sendModalData?.data?.map((item: any) => {
      dataMap[item.emailParamCode] =
        item.emailParamCode === 'emailText'
          ? item.emailParamValue.replace(/<br>/g, '\r').replace(/&nbsp;/g, ' ')
          : item.emailParamValue;
      return dataMap;
    });

    // 默认已上传的文件
    const tmpDefaultFileList = [
      {
        uid: '1',
        status: 'done',
        url: dataMap['ExcelUrl'],
        name: dataMap['ExcelName'],
        // 为了跟点击上传的文件数据结构一致 构造一个
        response: {
          data: dataMap['ExcelUrl'],
        },
      },
    ];
    setDefaultFileList(tmpDefaultFileList);

    return dataMap;
  }, [sendModalData]);

  // 收件人、抄送人模糊查询
  const handleSearch = useMemo(() => {
    setOptions([]);
    const loadOptions = async (keyword: string) => {
      if (!keyword) return;
      fetchRef.current += 1;
      setOptions([]);
      setFetching(true);

      const result = await queryUserEmail({ keyword });
      setOptions(result);
      setFetching(false);
    };

    return debounce(loadOptions, 800);
  }, [queryUserEmail, 800]);

  return (
    <ModalForm
      title="邮件发送"
      formRef={formRef}
      visible={visible}
      width="60%"
      onFinish={handleFinish}
      layout={'horizontal'}
      labelCol={{ span: 4 }}
      className={styles['parameter-manage']}
      modalProps={{
        onCancel: () => {
          sendClosedModal();
        },
        destroyOnClose: true,
        cancelText: '关闭',
        okText: '确认发送',
      }}
    >
      <ProFormSelect
        name="Addressee"
        key="Addressee"
        label="收件人"
        mode="multiple"
        initialValue={newData['Addressee']}
        showSearch
        options={options}
        style={{ height: 'auto' }}
        rules={[{ required: true, message: '邮件必须至少具有一个收件人。' }]}
        fieldProps={{
          filterOption: false,
          onSearch: handleSearch,
          notFoundContent: fetching ? <Spin size="small" /> : null,
        }}
      />
      <ProFormSelect
        name="CopyAddressee"
        key="CopyAddressee"
        label="抄送人"
        mode="multiple"
        initialValue={newData['CopyAddressee']}
        showSearch
        options={options}
        fieldProps={{
          filterOption: false,
          onSearch: handleSearch,
          notFoundContent: fetching ? <Spin size="small" /> : null,
        }}
      />
      <ProFormText
        name="emailTitle"
        label="邮件主题"
        placeholder="请输入邮件主题"
        initialValue={newData['emailTitle']}
        rules={[{ required: true, message: '请输入邮件主题' }]}
      />
      <CommonUpload
        name="emailFileInfo"
        label="邮件附件"
        initialValue={defaultFileList}
        fieldProps={{
          defaultFileList: defaultFileList,
          // onRemove: (file: any) => file?.uid !== '1',
        }}
      />
      <ProFormTextArea
        name="emailText"
        label="邮件正文"
        initialValue={newData['emailText']}
        placeholder="请输入邮件正文"
        rules={[{ required: true, message: '请输入邮件正文' }]}
      />
    </ModalForm>
  );
};
