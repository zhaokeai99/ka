import { memo, useMemo, useEffect, useCallback, useState } from 'react';
import { Modal, Row, Col, Input, Tabs, Table, message, Progress, Badge } from 'antd';
import InspectionResult from './InspectionResult';
import styles from './style.less';
import { queryTaskDetail } from './service';
import FileContentDiff from '../component/FileContentDiff';
import moment from 'moment';
const { TextArea } = Input;
const { TabPane } = Tabs;
interface propsType {
  fundCode: any;
  subTaskId: any;
  handleCancel: () => void;
}
const statusValue = {
  '0': { color: 'blue', text: '未办理' },
  '1': { color: 'green', text: '已办理' },
  '2': { color: 'gold', text: '超时未办理' },
};
// 日常任务详情
function Details(props: propsType) {
  const { handleCancel, subTaskId } = props;
  const [detailObj, setDetailObj] = useState<any>({});
  const [dateCheckCalibratorData, setDateCheckCalibrator] = useState<any>([]);
  const [fileCheckCalibratorData, setFileCheckCalibrator] = useState<any>([]);
  const [fileContrastCalibratorData, setFileContrastCalibrator] = useState<any>([]);
  const [visible, setVisible] = useState<boolean>(false);
  const [dataArr, setDataArr] = useState<any>({});
  const [fileVisible, setFileVisible] = useState<boolean>(false);
  const [fileContent, setFileContent] = useState<any>({});
  const columns_fileCheckCalibrator: any = useMemo(() => {
    return [
      {
        title: '校验器名称',
        dataIndex: 'calibratorName',
      },
      {
        title: '校验类型',
        dataIndex: 'calibratorType',
      },
      {
        title: '文件名称',
        dataIndex: 'fileName',
        ellipsis: true,
      },
      {
        title: '文件地址',
        dataIndex: 'filePath',
        ellipsis: true,
      },
      {
        title: '更新时间',
        dataIndex: 'updateDate',
        render: (_: any, record: any) => {
          return record.updateDate ? moment(record.updateDate).format('YYYY-MM-DD') : '--';
        },
      },
      {
        title: '校验结果',
        dataIndex: 'checkStatus',
        render: (text: any) => {
          return <Progress percent={text ? 100 : 0} status={text ? 'success' : 'exception'} />;
        },
      },
    ];
  }, []);
  const columns_fileContrastCalibrator: any = useMemo(() => {
    return [
      {
        title: '校验器名称',
        dataIndex: 'calibratorName',
      },
      {
        title: '校验类型',
        dataIndex: 'calibratorType',
      },
      {
        title: '原文件',
        dataIndex: 'originalFileName',
        ellipsis: true,
      },
      {
        title: '对比文件',
        dataIndex: 'contrastFileName',
        ellipsis: true,
      },
      {
        title: '校验结果',
        dataIndex: 'checkStatus',
        render: (text: any) => {
          return <Progress percent={text ? 100 : 0} status={text ? 'success' : 'exception'} />;
        },
      },
      {
        title: '更新时间',
        dataIndex: 'subTaskName',
        render: (_: any, record: any) => {
          return record.subTaskName ? moment(record.subTaskName).format('YYYY-MM-DD') : '--';
        },
      },
    ];
  }, []);
  const columns_dateCheckCalibrator: any = useMemo(() => {
    return [
      {
        title: '校验器名称',
        dataIndex: 'calibratorName',
      },
      {
        title: '校验类型',
        dataIndex: 'calibratorType',
      },
      {
        title: '校验执行器',
        dataIndex: 'calibratorExecute',
        ellipsis: true,
      },
      {
        title: '检查结果集',
        dataIndex: 'dataArray',
        render: (text: any) => {
          return (
            <a
              onClick={() => {
                setVisible(true);
                setDataArr(text || {});
              }}
            >
              查看详情
            </a>
          );
        },
      },
      {
        title: '更新时间',
        dataIndex: 'updateDate',
        render: (_: any, record: any) => {
          return record.updateDate ? moment(record.updateDate).format('YYYY-MM-DD') : '--';
        },
      },
    ];
  }, []);
  const getDataDetail = useCallback(async () => {
    const result = await queryTaskDetail({ id: subTaskId, fundCode: props.fundCode });
    setDetailObj(result.data || {});
    setDateCheckCalibrator(result.data?.calibratorArray?.dateCheckCalibrator || []);
    setFileCheckCalibrator(result.data?.calibratorArray?.fileCheckCalibrator || []);
    setFileContrastCalibrator(result.data?.calibratorArray?.fileContrastCalibrator || []);
    if (!result.success) {
      message.error(result.message);
    }
  }, [props.fundCode]);
  useEffect(() => {
    if (subTaskId) {
      getDataDetail();
    }
  }, [subTaskId]);
  return (
    <Modal visible={true} footer={false} centered onCancel={handleCancel} width={1100}>
      <Row gutter={[0, 12]}>
        <Col span={24}>
          <span className={styles['detail-head']}>基金代码： {detailObj.fundCode || '--'}</span>
        </Col>
        <Col span={12}>
          <span className={styles['detail-label']}>基金名称</span>
          <span className={styles['detail-value']}>{detailObj.fundName || '--'}</span>
        </Col>
        <Col span={12}>
          <span className={styles['detail-label']}>主任务</span>
          <span className={styles['detail-value']}>{detailObj.taskName || '--'}</span>
        </Col>
        <Col span={12}>
          <span className={styles['detail-label']}>办理岗位</span>
          <span className={styles['detail-value']}>{detailObj.handlePost || '--'}</span>
        </Col>
        <Col span={12}>
          <span className={styles['detail-label']}>子任务</span>
          <span className={styles['detail-value']}>{detailObj.subTaskName || '--'}</span>
        </Col>
        <Col span={12}>
          <span className={styles['detail-label']}>办理时间</span>
          <span className={styles['detail-value']}>{detailObj.handleDate || '--'}</span>
        </Col>
        <Col span={12}>
          <span className={styles['detail-label']}>任务状态</span>
          <span className={styles['detail-value']}>
            <Badge
              color={statusValue[detailObj.taskStatus]?.color}
              text={statusValue[detailObj.taskStatus]?.text}
            />
          </span>
        </Col>
        <Col span={12}>
          <span className={styles['detail-label']}>办理人</span>
          <span className={styles['detail-value']}>{detailObj.handleUser || '--'}</span>
        </Col>
        <Col span={24}>
          <TextArea placeholder="留言内容" value={detailObj.handleRemark} rows={6} disabled />
        </Col>
        {((fileCheckCalibratorData && fileCheckCalibratorData.length > 0) ||
          (fileContrastCalibratorData && fileContrastCalibratorData.length > 0) ||
          (dateCheckCalibratorData && dateCheckCalibratorData.length > 0)) && (
          <>
            <Col span={24}>
              <div className={styles['detail-child-head']}>任务校验</div>
            </Col>
            <Col span={24}>
              <Tabs>
                {fileCheckCalibratorData && fileCheckCalibratorData.length > 0 && (
                  <TabPane tab="文件下载检查" key="1">
                    <Table
                      bordered={false}
                      columns={columns_fileCheckCalibrator}
                      dataSource={fileCheckCalibratorData}
                      pagination={false}
                    />
                  </TabPane>
                )}
                {fileContrastCalibratorData && fileContrastCalibratorData.length > 0 && (
                  <TabPane tab="文件核对" key="2">
                    <Table
                      rowSelection={{
                        onSelect: (record: any) => {
                          if (record.contrastFlag) {
                            setVisible(true);
                            setFileContent(record || {});
                          }
                        },
                      }}
                      bordered={false}
                      columns={columns_fileContrastCalibrator}
                      dataSource={fileContrastCalibratorData}
                      pagination={false}
                    />
                  </TabPane>
                )}
                {dateCheckCalibratorData && dateCheckCalibratorData.length > 0 && (
                  <TabPane tab="数据检查" key="3">
                    <Table
                      bordered={false}
                      columns={columns_dateCheckCalibrator}
                      dataSource={dateCheckCalibratorData}
                      pagination={false}
                    />
                  </TabPane>
                )}
              </Tabs>
            </Col>
          </>
        )}
      </Row>
      <InspectionResult
        visible={visible}
        record={dataArr}
        handleOnCancel={() => {
          setVisible(false);
          setDataArr({});
        }}
      />
      <FileContentDiff
        visible={fileVisible}
        record={fileContent}
        handleOnCancel={() => {
          setFileVisible(false);
          setFileContent({});
        }}
      />
    </Modal>
  );
}

export default memo(Details);
