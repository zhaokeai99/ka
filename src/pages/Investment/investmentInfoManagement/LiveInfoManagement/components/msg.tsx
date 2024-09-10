import React, { memo, useCallback, useEffect, useState } from 'react';
import { Button, message, Modal } from 'antd';
import {
  SelmLiveRoadShowInfoFacadeIgnoreLog,
  SelmLiveRoadShowInfoFacadeQueryLogByPage,
} from '../service';
import { ProList } from '@ant-design/pro-components';
import { ExclamationCircleFilled } from '@ant-design/icons';

const { confirm } = Modal;

interface ModalProps {
  visible: boolean;
  onClose: (val?: string) => void;
  id: number;
}

// 弹窗
const Mail = (props: ModalProps) => {
  const { visible, id } = props;
  const [loading, setLoading] = useState<any>(true);
  const [dataSource, setDataSource] = useState<any>([]);
  const [pageInfo, setPageInfo] = useState<any>({ current: 1, pageSize: 10 });

  const loadInfo = async () => {
    setLoading(true);
    const params = {
      current: pageInfo.current,
      pageSize: pageInfo.pageSize,
      status: 1,
    };
    const result = await SelmLiveRoadShowInfoFacadeQueryLogByPage(params);
    const { current, data, pageSize, total } = result || {};
    setPageInfo({ current, pageSize, total });
    setDataSource(data);
    setLoading(false);
  };

  useEffect(() => {
    loadInfo();
  }, [id]);

  const listChange = async (page: number, pageSize: number) => {
    setLoading(true);
    const params = {
      current: page,
      pageSize: pageSize,
      status: 1,
    };
    const result = await SelmLiveRoadShowInfoFacadeQueryLogByPage(params);
    const { current, data, total } = result || {};
    setPageInfo({ current, pageSize, total });
    setDataSource(data);
    setLoading(false);
  };

  const [confirmLoading, setConfirmLoading] = React.useState(false);

  const ignoreRecord = async (row: any) => {
    setConfirmLoading(true);
    const params = {
      id: row.id,
      status: 2,
    };
    const result = await SelmLiveRoadShowInfoFacadeIgnoreLog(params);

    if (result.success && result.data > 0) {
      setConfirmLoading(false);
      message.success('忽略成功');
      listChange(pageInfo.current, pageInfo.pageSize);
      return;
    }
    message.error(result.errorMsg || '操作失败');

    setConfirmLoading(false);
  };

  const handleOk = useCallback(
    async (row: any) => {
      confirm({
        title: '确认忽略该条记录吗?',
        onOk() {
          ignoreRecord(row);
        },
      });
    },
    [props],
  );

  const handleCancel = () => {
    props.onClose('reload');
  };

  return (
    <>
      <Modal
        title={
          <div>
            <ExclamationCircleFilled style={{ color: '#faad14' }} />
            <span style={{ marginLeft: 5 }}>异常监控</span>
          </div>
        }
        visible={visible}
        maskClosable={false}
        width={800}
        destroyOnClose={true}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            关闭
          </Button>,
        ]}
      >
        <ProList<any>
          loading={loading}
          rowKey="name"
          dataSource={dataSource}
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
            onChange: listChange,
            current: pageInfo.current,
            pageSize: pageInfo.pageSize,
            total: pageInfo.total,
          }}
          metas={{
            title: {
              dataIndex: 'wxNameByRoom',
            },
            description: {
              dataIndex: 'msgText',
            },
            actions: {
              render: (text, row) => [
                <a
                  onClick={() => handleOk(row)}
                  target="_blank"
                  rel="noopener noreferrer"
                  key="link"
                >
                  忽略
                </a>,
              ],
            },
          }}
        />
      </Modal>
    </>
  );
};
export default memo(Mail);
