import React, { useMemo, useState, useCallback, useRef } from 'react';
import ProCardPlus from '@/components/ProCardPlus';
import ProTable from '@ant-design/pro-table';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import { ProFormUploadButton, ModalForm } from '@ant-design/pro-components';
import PrepareDocument from '../DocumentPrepare/PrepareDocument';
import DebounceSelect from '@/components/DebounceSelect';
import { queryDocumentPrepareList, queryManagerByKeyword, completeBankRecord } from './service';
import Context from '../DocumentPrepare/context';
import { message } from 'antd';

type TableListItem = {
  id: number;
  fundCode: string;
  fundName: string;
  status: string;
  manager: string;
  productType: string;
  accountType: string;
  recordType: string;
  fundId: number;
};

const accountType = {
  BANK_ACCOUNT: '银行间户',
  STOCK_ACCOUNT: '股东户',
};

// 备案管理页面
const RegistrationManage: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [showDocument, setShowDocument] = useState(false); // 是否显示 开户材料准备浮窗
  const [id, setId] = useState(0); // 浮窗详情id
  const [fundId, setFundId] = useState(0); // 选择查看的基金id
  const [isModalOpen, setIsModalOpen] = useState(false);

  async function fetchList(keyword: string): Promise<any[]> {
    return queryManagerByKeyword({ keyword }).then((result: any) =>
      result.map((r: any) => ({
        value: r['manager'],
        label: r['manager'],
      })),
    );
  }

  const columns: ProColumns<TableListItem>[] = useMemo(
    () => [
      {
        title: '',
        dataIndex: 'id',
        hideInTable: true,
        search: false,
      },
      {
        title: '基金代码',
        dataIndex: 'fundCode',
        fixed: 'left',
        width: 130,
        search: false,
        render: (text, item) => <a href={`#/production/index/detail/${item.fundId}`}>{text}</a>,
      },
      {
        title: '基金名称',
        dataIndex: 'fundName',
        fixed: 'left',
        width: 200,
        render: (text, item) => <a href={`#/production/index/detail/${item.fundId}`}>{text}</a>,
      },
      {
        title: '产品状态',
        dataIndex: 'fundState',
        valueType: 'select',
        valueEnum: {
          '0': { text: '募集期' },
          '1': { text: '待成立' },
          '2': { text: '存续中' },
        },
      },
      {
        title: '产品经理/项目经理',
        dataIndex: 'manager',
        valueType: 'select',
        renderFormItem: () => (
          <DebounceSelect
            showSearch
            placeholder="名称支持模糊搜索"
            fetchOptions={fetchList}
            allowClear
          />
        ),
      },
      {
        title: '产品类别',
        dataIndex: 'productType',
        search: false,
      },
      {
        title: '开户类别',
        dataIndex: 'acctType',
        search: false,
        render: (text: any) => <span>{accountType[text]}</span>,
      },
      {
        title: '备案状态',
        dataIndex: 'status',
        search: false,
      },
      {
        fixed: 'right',
        width: 180,
        title: '操作',
        dataIndex: '',
        valueType: 'option',
        render: (text, record) => {
          return [
            <a
              key="view"
              onClick={() => {
                setId(record.id);
                setFundId(record.fundId);
                setShowDocument(true);
              }}
            >
              查看
            </a>,
          ];
        },
      },
    ],
    [],
  );

  const handleColse = useCallback((key) => {
    setShowDocument(false);
    if (key === 'reload') {
      actionRef.current?.reload();
    }
  }, []);

  const onFinish = useCallback(async () => {
    // 打开新弹窗
    setIsModalOpen(true);
  }, [id]);

  // 完成备案
  const modalOnFinish = useCallback(
    async (values) => {
      const res = await completeBankRecord({ id, fileUrl: values?.file[0]?.response?.data });
      if (res) {
        message.success('完成备案');
        setIsModalOpen(false);
        return;
      }
      message.error('完成备案失败');
    },
    [id],
  );

  return (
    <ProCardPlus ghost style={{ padding: '12px' }}>
      {/* table列表 */}
      <ProTable<TableListItem>
        size="small"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 130,
        }}
        request={async (params) => {
          const { total, dataList } = await queryDocumentPrepareList({
            ...params,
            manager: params?.manager?.value,
            keyword: params?.fundName,
            pageNo: params.current,
          });
          return {
            total: total,
            data: dataList,
          };
        }}
        columns={columns}
        pagination={{
          pageSize: 10,
        }}
        scroll={{ x: 'max-content' }}
        options={{
          density: false,
        }}
      />
      {/* 开户材料准备浮窗 */}
      <Context.Provider value={fundId}>
        <PrepareDocument
          showDocument={showDocument}
          onClose={handleColse}
          id={id}
          title={'备案管理'}
          okText={'完成备案'}
          onFinishProps={onFinish}
        />
      </Context.Provider>
      <ModalForm<{ file: string }>
        title="上传材料"
        visible={isModalOpen}
        modalProps={{
          onCancel: () => setIsModalOpen(false),
        }}
        onFinish={modalOnFinish}
      >
        <ProFormUploadButton
          name={'file'}
          label={'人行备案通知书：'}
          fieldProps={{
            method: 'PUT',
            name: 'multipartFile',
          }}
          max={1}
          action="/object"
          rules={[{ required: true, message: '请上传' }]}
        />
      </ModalForm>
    </ProCardPlus>
  );
};

export default RegistrationManage;
