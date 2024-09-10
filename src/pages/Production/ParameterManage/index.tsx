import React, { useState, useRef, useCallback, useEffect } from 'react';
import type { MutableRefObject } from 'react';
import { history } from 'umi';
import ProTable from '@ant-design/pro-table';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProCard from '@ant-design/pro-card';
import { ProFormSelect } from '@ant-design/pro-form';
import type { FormInstance } from 'antd';
import { Button, Modal } from 'antd';
import { cardGutter, contentPadding } from '@/themes';
import { map as _map } from 'lodash';
import AddModal from './AddModal';
import SendModal from './Send';
import DebounceSelect from '@/components/DebounceSelect';
import { queryTemplate, getEmailInfo, sendEmail, queryByKeywordByExample } from './service';

const templateCode = 'o3Template';

const fundType = {
  '1': '权益类产品',
  '2': '固收类产品',
  '3': '混合类产品',
  '4': '商品及金融衍生品类产品',
  '5': '股票型基金 ',
  '6': '混合型基金',
  '7': '债券型基金 ',
  '8': '货币市场型基金',
  '10': 'FOF',
  '11': '另类基金',
  '12': '其他类产品',
};

const ParameterManage: React.FC = () => {
  const tableFormRef: MutableRefObject<FormInstance | undefined> = useRef();
  const actionRef = useRef<ActionType>();
  const [addModalShow, setAddModalShow] = useState<boolean>(false);
  const [sendModalShow, setSendModalShow] = useState<boolean>(false);
  const query = history?.location?.query;
  const [sendModalData, setSendModalData] = useState<any>({
    templateVersion: '',
    fundId: '',
    data: [],
  });

  // 获取全部产品实例信息
  const requestTableList = useCallback(async (params: any) => {
    const { current, fundIds, ...values } = params;
    const newParams = {
      ...values,
      templateCode,
      pageNo: current,
      fundIds: _map(fundIds, 'value'),
    };
    const result = await queryTemplate(newParams);
    return result;
  }, []);

  // 获取发送邮件信息
  const fetchEmailInfo = useCallback(async (params: any) => {
    const { success, data } = await getEmailInfo(params);
    if (success) {
      setSendModalData({
        data,
        templateVersion: params.templateVersion,
        fundId: params.fundId,
        templateCode,
      });
      setSendModalShow(true);
      if (query?.sendModalShow) history.replace({ search: '' });
    }
  }, []);

  // 操作按钮
  const handleClick = (item: any, record: any) => {
    if (item.key === 'send') {
      fetchEmailInfo({
        templateCode,
        templateVersion: record.templateVersion,
        fundId: record.fundId,
      });
    } else {
      history.push(
        `parameterManage/detailFile/${record.fundId}/${item.key}?templateVersion=${record.templateVersion}`,
      );
    }
  };

  // 提交
  const handleFinish = async (values: any) => {
    const { data, templateVersion, fundId } = sendModalData;
    values['emailText'] = values['emailText'].replace(/ /g, '&nbsp;').replace(/\n|\r/g, '<br>');

    // 给除了emailFileInfo 赋值
    data.forEach((element: any) => {
      element['emailParamValue'] = values[element['emailParamCode']] || element['emailParamValue'];
    });

    // 给emailFileInfo 赋值
    const emailFileInfo = values?.emailFileInfo?.reduce((pre: any, item: any) => {
      // 剔除默认上传文件
      // if (item.uid !== '1') {
      pre.push({
        fileName: item?.name,
        fileUrl: item?.response?.data,
      });
      // }
      return pre;
    }, []);

    // 提交入参
    const params = {
      templateCode,
      templateVersion,
      fundId,
      emailInfo: data,
      emailFileInfo,
    };
    const { success } = await sendEmail(params);
    if (success) {
      Modal.success({
        content: '发送成功！',
      });
      actionRef?.current?.reload();
      setSendModalShow(false);
    }
  };

  const columns: ProColumns[] = [
    {
      title: '基金代码',
      dataIndex: 'fundCode',
      key: 'fundCode',
      hideInSearch: true,
      render: (text, item) => <a href={`#/production/index/detail/${item.fundId}`}>{text}</a>,
    },
    {
      title: '基金名称',
      hideInTable: true,
      dataIndex: 'fundIds',
      key: 'fundIds',
      renderFormItem: () => (
        <DebounceSelect
          showSearch
          placeholder="名称、代码支持模糊搜索"
          fetchOptions={queryByKeywordByExample}
          mode="multiple"
          allowClear
        />
      ),
    },
    {
      title: '基金名称',
      dataIndex: 'fundName',
      key: 'fundName',
      hideInSearch: true,
      render: (text, item) => <a href={`#/production/index/detail/${item.fundId}`}>{text}</a>,
    },
    {
      title: '产品分类',
      dataIndex: 'fundType',
      valueType: 'select',
      hideInTable: true,
      renderFormItem: (item) => {
        return (
          <ProFormSelect name={item.dataIndex} placeholder="请选择产品分类" valueEnum={fundType} />
        );
      },
    },
    {
      title: '修改人',
      dataIndex: 'createUserName',
      key: 'createUserName',
      hideInSearch: true,
    },
    {
      title: '复核人',
      dataIndex: 'updateUserName',
      key: 'updateUserName',
      hideInSearch: true,
    },
    {
      title: '状态',
      dataIndex: 'state',
      key: 'state',
      hideInSearch: true,
    },
    {
      title: '操作',
      key: 'option',
      valueType: 'option',
      align: 'center',
      render: (_, record) => [
        record?.operate?.map((item: any) => (
          <Button
            type="link"
            disabled={!item.checked}
            onClick={() => handleClick(item, record)}
            key={item.key}
          >
            {item.oprions}
          </Button>
        )),
      ],
    },
  ];

  useEffect(() => {
    if (query?.sendModalShow) {
      fetchEmailInfo({
        templateCode,
        templateVersion: query?.templateVersion,
        fundId: query?.fundId,
      });
    }
    if (
      history?.location?.pathname === '/production/setting/parameterManage' &&
      !query?.sendModalShow
    ) {
      actionRef?.current?.reload();
    }
  }, [query]);

  return (
    <ProCard ghost direction="column" style={{ padding: contentPadding }}>
      <ProCard ghost size="small" gutter={[0, cardGutter]}>
        <ProTable
          className="parameterManage"
          size="small"
          actionRef={actionRef}
          formRef={tableFormRef}
          search={{
            labelWidth: 95,
            defaultCollapsed: false,
          }}
          pagination={{ pageSize: 10 }}
          request={requestTableList}
          columns={columns}
          toolBarRender={() => [
            <Button key="button" type="primary" onClick={() => setAddModalShow(true)}>
              新增
            </Button>,
          ]}
        />
        <AddModal visible={addModalShow} addClosedModal={() => setAddModalShow(false)} />
        <SendModal
          visible={sendModalShow}
          sendClosedModal={() => setSendModalShow(false)}
          sendModalData={sendModalData}
          handleFinish={handleFinish}
        />
      </ProCard>
    </ProCard>
  );
};

export default ParameterManage;
