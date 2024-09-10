import React, { useState, memo, useCallback, useEffect, useMemo } from 'react';
import { Steps, Result, Row, Col, DatePicker, Button, Badge, Progress } from 'antd';
import FileContentDiff from '../component/FileContentDiff';
import { CheckCircleFilled } from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { queryPcfFlow, queryPcfFlowDetail } from './service';
import moment from 'moment';
const { Step } = Steps;
// PCF上传
interface propsType {
  fundId: string;
}
export type TableListItem = {
  id: number;
  fileType: string;
  fileName: string;
  filePath: string;
  fileStatus: number;
  updateDate: string;
};
const PCFUpload = (props: propsType) => {
  const [current, setCurrent] = useState<number>(0);
  const [steptState, setSteptState] = useState<number>(0);
  const [steptList, setSteptList] = useState<any[]>([]);
  const [visible, setVisible] = useState<boolean>(false);
  const [fileContent, setFileContent] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [businessDate, setBusinessDate] = useState<string>(moment().format('YYYY-MM-DD'));
  const columns: ProColumns<any>[] = useMemo(() => {
    return [
      {
        title: '文件类型',
        dataIndex: 'fileType',
        search: false,
        render: (text: any, record: any) => {
          if (record.contrastFlag) {
            return (
              <a
                onClick={() => {
                  setVisible(true);
                  setFileContent(record || {});
                }}
              >
                {text}
              </a>
            );
          }
          return text;
        },
      },
      {
        title: '文件名称',
        dataIndex: 'fileName',
        search: false,
      },
      {
        title: '文件路径',
        dataIndex: 'filePath',
        search: false,
      },
      {
        title: '必要文件',
        dataIndex: 'isNecessary',
        hideInTable: current == 0 ? false : true,
        render: (text: any) => {
          return (
            <Badge
              status={text === 'YES' ? 'success' : 'error'}
              text={text === 'YES' ? '是' : '否'}
            />
          );
        },
      },
      {
        title: '文件状态',
        dataIndex: 'fileStatus',
        search: false,
        render: (text: any) => {
          return <Progress percent={text ? 100 : 0} status={text ? 'success' : 'exception'} />;
        },
      },
      {
        title: '文件到达时间',
        dataIndex: 'updateDate',
        valueType: 'date',
        search: false,
        render: (_: any, record: any) => {
          return record.updateDate ? moment(record.updateDate).format('YYYY-MM-DD hh:mm:ss') : '-';
        },
      },
    ];
  }, [current]);
  const handleReloadTable = useCallback(
    async (curr: any, flowId: any, time: any) => {
      if (!!flowId) {
        setLoading(true);
        setDataSource([]);
        if (curr !== 4) {
          const result: any = await queryPcfFlowDetail({
            fundCode: props.fundId,
            flowId,
            businessDate: time,
          });
          if (result.success) {
            setDataSource(result.data || []);
          }
        }
        setLoading(false);
      }
    },
    [props.fundId],
  );
  const handleStepOnChange = useCallback(
    (curr: any) => {
      setCurrent(curr);
      handleReloadTable(curr, steptList[curr]?.flowId || '', businessDate);
    },
    [businessDate, steptState],
  );
  const getQueryPcfFlow = useCallback(
    async (time: any) => {
      const { data = [] } = await queryPcfFlow({ fundCode: props.fundId, businessDate: time });
      let curr = 0;
      for (let i = 0; i < data?.length; i++) {
        if (data[i].flowStatus === 'PASS') {
          curr = curr + 1;
        }
      }
      setSteptState(curr);
      setCurrent(curr === 5 ? 4 : curr);
      setSteptList(data || []);
      handleReloadTable(curr, data[curr]?.flowId || '', time);
    },
    [props.fundId],
  );
  useEffect(() => {
    const time = moment().format('YYYY-MM-DD');
    getQueryPcfFlow(time);
  }, []);
  return (
    <>
      <Row>
        <Col style={{ padding: '24px' }} span={24}>
          <span style={{ margin: '0 5px' }}>业务日期 :</span>
          <DatePicker
            style={{ width: 350 }}
            value={moment(businessDate)}
            onChange={(_: any, dateString: any) => {
              setBusinessDate(dateString);
            }}
            allowClear={false}
          />
          <div style={{ float: 'right' }}>
            <Button
              style={{ marginRight: '10px' }}
              onClick={() => {
                const time = moment().format('YYYY-MM-DD');
                setBusinessDate(time);
                getQueryPcfFlow(time);
              }}
            >
              重置
            </Button>
            <Button
              loading={loading}
              onClick={() => {
                getQueryPcfFlow(businessDate);
              }}
              type="primary"
            >
              查询
            </Button>
          </div>
        </Col>
        <Col style={{ padding: '20px 12px' }} span={24}>
          <Steps current={steptState} onChange={handleStepOnChange} size="small">
            {steptList.map((item: any, index: number) => {
              return (
                <Step
                  onClick={() => {
                    if (steptState === index) {
                      handleStepOnChange(index);
                    }
                  }}
                  key={item.flowId}
                  disabled={steptState >= index ? false : true}
                  title={item.flowName}
                  description={
                    item.completeDate ? moment(item.completeDate).format('YYYY-MM-DD') : null
                  }
                  icon={current === index && index !== steptState && <CheckCircleFilled />}
                />
              );
            })}
          </Steps>
        </Col>
        {current !== 3 && (
          <Col span={24} style={{ padding: '0 12px 20px' }}>
            <h2 style={{ fontSize: 18, fontWeight: 'bold' }}>
              {steptList[current]?.flowName || ''}
            </h2>
          </Col>
        )}
        <Col span={24} style={{ padding: '0 12px' }}>
          {current !== 4 && (
            <ProTable<any>
              search={false}
              toolBarRender={false}
              loading={loading}
              dataSource={dataSource}
              columns={columns}
              rowKey="fileType"
              pagination={false}
              scroll={{ x: 'max-content' }}
            />
          )}
          {current === 4 && (
            <Result
              status="success"
              title="流程已全部完成!"
              subTitle={steptList[steptList.length - 1]?.completeDate || null}
            />
          )}
        </Col>
      </Row>
      <FileContentDiff
        visible={visible}
        record={fileContent}
        handleOnCancel={() => {
          setVisible(false);
          setFileContent({});
        }}
      />
    </>
  );
};
export default memo(PCFUpload);
