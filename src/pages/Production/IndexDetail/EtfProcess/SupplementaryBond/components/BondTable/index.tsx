import React, { useState, memo, useMemo } from 'react';
import { Badge, Progress, Table } from 'antd';
import FileContentDiff from '../../../component/FileContentDiff';
import moment from 'moment';
// 补券流程
interface propsType {
  loading: boolean;
  dataSource: any[];
  current: number;
}
const instructionTypeList = ['个股', '组合', '个股批量', '组合批量'];
const status = ['未执行', '部分执行', '完成'];
const BondFile = (props: propsType) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [fileContent, setFileContent] = useState<any>({});
  const columns = useMemo(() => {
    switch (props.current) {
      case 0:
        return [
          {
            title: '文件类型',
            dataIndex: 'fileType',
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
          },
          {
            title: '文件路径',
            dataIndex: 'filePath',
          },
          {
            title: '必要文件',
            dataIndex: 'isNecessary',
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
            render: (text: any) => {
              return <Progress percent={text ? 100 : 0} status={text ? 'success' : 'exception'} />;
            },
          },
          {
            title: '文件到达时间',
            dataIndex: 'updateDate',
            render: (_: any, record: any) => {
              return record.updateDate ? moment(record.updateDate).format('YYYY-MM-DD') : '--';
            },
          },
        ];
      case 1:
        return [
          {
            title: '日期',
            dataIndex: 'businessDate',
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
            title: '基金名称',
            dataIndex: 'fundName',
          },
          {
            title: '预置序号',
            dataIndex: 'instructionNo',
          },
          {
            title: '指令类型',
            dataIndex: 'instructionType',
            render: (text: any) => {
              return instructionTypeList[text - 1] || '--';
            },
          },
          {
            title: '指令序号',
            dataIndex: 'dailyInstructionNo',
          },
          {
            title: '业务分类',
            dataIndex: 'businessClass',
            render: (text: any) => {
              return text == '1' ? '交易所业务' : '-';
            },
          },
          {
            title: '委托方向',
            dataIndex: 'entrustRestrict',
            render: (text: any) => {
              return text === '1' ? '买入' : '卖出';
            },
          },
          {
            title: '证券代码',
            dataIndex: 'stockCode',
          },
          {
            title: '证券名称',
            dataIndex: 'stockName',
          },
          {
            title: '清算速度',
            dataIndex: 'settleSpeed',
            render: (text: any) => {
              return text === '0' ? 'T+0' : 'T+1';
            },
          },
          {
            title: '指令数量',
            dataIndex: 'targetValue',
          },
          {
            title: '补券类型',
            dataIndex: 'supplyBondType',
          },
          {
            title: '指令状态',
            dataIndex: 'entrustExecuteStatus',
            render: (text: any) => {
              return status[text - 1] || '-';
            },
          },
        ];
      case 2:
        return [
          {
            title: '日期',
            dataIndex: 'businessDate',
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
            title: '基金名称',
            dataIndex: 'fundName',
          },
          {
            title: '成交数量',
            dataIndex: 'dealNumber',
          },
          {
            title: '指令金额',
            dataIndex: 'instructionAmount',
          },
          {
            title: '指令数量',
            dataIndex: 'instructionNumber',
          },
          {
            title: '指令类型',
            dataIndex: 'instructionType',
            render: (text: any) => {
              return instructionTypeList[text - 1] || '--';
            },
          },
          {
            title: '指令序号',
            dataIndex: 'dailyInstructionNo',
          },
          {
            title: '委托方向',
            dataIndex: 'entrustRestrict',
            render: (text: any) => {
              return text === '1' ? '买入' : '卖出';
            },
          },
          {
            title: '证券代码',
            dataIndex: 'stockCode',
          },
          {
            title: '指令下达时间',
            dataIndex: 'leaseDate',
          },
          {
            title: '结束时间',
            dataIndex: 'endDate',
          },
          {
            title: '补券类型',
            dataIndex: 'supplyBondType',
          },
          {
            title: '指令状态',
            dataIndex: 'entrustExecuteStatus',
            render: (text: any) => {
              return status[text - 1] || '-';
            },
          },
        ];
    }
  }, [props.current]);
  return (
    <>
      <Table<any>
        loading={props.loading}
        dataSource={props.dataSource}
        columns={columns}
        rowKey="fileName"
        pagination={false}
        scroll={{ x: 'max-content' }}
      />
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
export default memo(BondFile);
