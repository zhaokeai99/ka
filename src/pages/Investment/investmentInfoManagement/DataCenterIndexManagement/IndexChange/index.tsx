import ProCardPlus from '@/components/ProCardPlus';
import { Button, Popover, Select, Space } from 'antd';
import React, { useEffect, useImperativeHandle, useState } from 'react';
import _ from 'lodash';
import { ColorResult, SketchPicker } from 'react-color';
import moment from 'moment';
import ProTable from '@ant-design/pro-table';

type PropsType = {
  onChartsShow: (val: any) => void;
  onMultiCalcClick: () => void;
  onSingleCalcClick: (row: any) => void;
  clientHeight: number;
  checkData: any[];
  onRemove: (val: any) => void;
  cRef: any;
  loadSelectRowKey?: any;
};

const colors = [
  '#5470c6',
  '#91cc75',
  '#fac858',
  '#ee6666',
  '#73c0de',
  '#3ba272',
  '#fc8452',
  '#9a60b4',
  '#ea7ccc',
];

const chartsTypes = [
  { label: '曲线图', value: 'smoothLine' },
  { label: '折线图', value: 'line' },
  { label: '直方图', value: 'column' },
  { label: '面积图', value: 'area' },
];
const axisPositionItems = [
  { label: '左轴', value: 'left' },
  { label: '右轴', value: 'right' },
];

let i = 0;

const SearchTree = (props: PropsType) => {
  const {
    clientHeight,
    checkData,
    cRef,
    onRemove,
    onChartsShow,
    loadSelectRowKey,
    onSingleCalcClick,
  } = props;
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [dataList, setDataList] = useState<any>([]);

  const handleCalsModal = (record: any) => {
    onSingleCalcClick(record);
  };

  const removeIndex = (record: any) => {
    _.remove(selectedRowKeys, (v) => {
      return v === record.indexCode;
    });
    onRemove(record);
    setSelectedRowKeys([...selectedRowKeys]);
  };

  const handleColorChange = (color: any, row: any) => {
    const target = _.find(dataList, { indexCode: row.indexCode });
    target.chartColor = color.hex;
    setDataList([...dataList]);
  };

  const chartTypeChange = (value: any, row: any) => {
    const target = _.find(dataList, { indexCode: row.indexCode });
    target.chartType = value;
    setDataList([...dataList]);
  };

  const axisPositionChange = (value: any, row: any) => {
    const target = _.find(dataList, { indexCode: row.indexCode });
    target.axisPosition = value;
    setDataList([...dataList]);
  };

  const columns = [
    {
      title: '指标名称',
      dataIndex: 'indexName',
      align: 'center',
    },
    {
      title: '频度',
      dataIndex: 'frequency',
      align: 'center',
      width: 55,
    },
    {
      title: '单位',
      dataIndex: 'indexUnit',
      align: 'center',
      width: 55,
    },
    {
      title: '来源',
      dataIndex: 'vendor',
      align: 'center',
      width: 90,
    },
    {
      title: '开始时间',
      dataIndex: 'beginDate',
      align: 'center',
      width: 100,
      render: (text: any, record: any) => {
        return record.beginDate ? moment(record.beginDate).format('YYYY-MM-DD') : '-';
      },
    },
    {
      title: '结束时间',
      dataIndex: 'endDate',
      align: 'center',
      width: 100,
      render: (text: any, record: any) => {
        return record.endDate ? moment(record.endDate).format('YYYY-MM-DD') : '-';
      },
    },
    {
      title: '轴线设置',
      dataIndex: 'axisPosition',
      align: 'center',
      width: 100,
      render: (text: any, record: any) => {
        return (
          <Select
            options={axisPositionItems}
            onChange={(value) => axisPositionChange(value, record)}
            value={text}
          />
        );
      },
    },
    {
      title: '图形',
      dataIndex: 'chartType',
      align: 'center',
      width: 100,
      render: (text: any, record: any) => {
        return (
          <Select
            options={chartsTypes}
            onChange={(value) => chartTypeChange(value, record)}
            value={text}
          />
        );
      },
    },
    {
      title: '颜色',
      dataIndex: 'chartColor',
      align: 'center',
      width: 55,
      render: (text: any, row: any) => {
        return (
          <Popover
            trigger="click"
            content={
              <SketchPicker
                color={text}
                onChange={(color: ColorResult) => handleColorChange(color, row)}
              />
            }
          >
            <div style={{ display: 'inline-block' }}>
              <div style={{ height: 14, width: 14, background: text, cursor: 'pointer' }} />
            </div>
          </Popover>
        );
      },
    },
    {
      title: '更新时间',
      align: 'center',
      dataIndex: 'updateTime',
      width: 100,
    },
    {
      title: '操作',
      valueType: 'option',
      width: 110,
      fixed: 'right',
      render: (text: any, record: any) => [
        <a
          onClick={() => {
            handleCalsModal(record);
          }}
        >
          计算
        </a>,
        <a
          onClick={() => {
            removeIndex(record);
          }}
        >
          删除
        </a>,
      ],
    },
  ];

  const fillData = (list: any) => {
    if (list) {
      const resultData = list.map((d: any) => {
        if (d.chartColor === undefined || d.chartColor === '') {
          d.chartColor = colors[i];
          i++;
          if (i > 8) {
            i = 0;
          }
        }
        if (d.chartType === undefined || d.chartType === '') {
          d.chartType = 'smoothLine';
        }
        if (d.axisPosition === undefined || d.axisPosition === '') {
          d.axisPosition = 'left';
        }
        return d;
      });
      setDataList(resultData);
    }
  };

  //账号变更
  useEffect(() => {
    setSelectedRowKeys(loadSelectRowKey);
  }, [loadSelectRowKey]);

  useEffect(() => {
    fillData(checkData);
    if (checkData && checkData.length === 0) {
      i = 0;
    }
  }, [checkData]);

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const dataHandle = () => {
    const chartsData = selectedRowKeys.map((key: any) => {
      return _.find(dataList, { indexCode: key });
    });
    onChartsShow(_.cloneDeep(chartsData));
  };
  //
  // const multiCalcClick = () => {
  //   if (dataList && dataList.length > 0) {
  //     onMultiCalcClick();
  //     return;
  //   }
  //   message.warn('请选择指标');
  // };

  //指定查询
  useImperativeHandle(cRef, () => ({
    getDataList: () => {
      return dataList;
    },
  }));

  return (
    <ProCardPlus style={{ height: clientHeight, width: '100%' }}>
      <div style={{ width: '100%', textAlign: 'right' }}>
        <Space>
          <Button type="primary" onClick={dataHandle}>
            提取数据
          </Button>
          {/*<Button type="primary" onClick={multiCalcClick}>*/}
          {/*  多指标计算*/}
          {/*</Button>*/}
        </Space>
      </div>
      <ProTable
        toolBarRender={false}
        search={false}
        actions={false}
        rowKey={'indexCode'}
        tableAlertRender={false}
        columns={columns}
        scroll={{ x: 1050, y: clientHeight - 39 - 12 - 32 - 24 }}
        dataSource={dataList}
        pagination={false}
        size={'small'}
        rowSelection={rowSelection}
      />
    </ProCardPlus>
  );
};

SearchTree.isProCard = true;

export default SearchTree;
