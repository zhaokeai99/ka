import React, { useRef, useState } from 'react';
import ProCardPlus from '@/components/ProCardPlus';
import { contentPadding } from '@/themes';
import ProTable, { ActionType } from '@ant-design/pro-table';
import styles from './index.less';
import {
  downLoadAgencyOnlineSituation,
  queryAgencyOnlineSituation,
  queryScTreeData,
} from './service';
import { Button, Cascader, Checkbox, Space, Tooltip } from 'antd';
import moment from 'moment';
import { DownloadOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { last as _last } from 'lodash';
import { ProFormInstance } from '@ant-design/pro-form';

const legendData = [
  { type: '上线+托管', className: 'table-legend-online-hosting' },
  { type: '上线', className: 'table-legend-online' },
  { type: '未上线', className: 'table-legend-not-online' },
  { type: '仅托管', className: 'table-legend-hosting' },
];

// 渠道上线情况
const ChannelOnLine = () => {
  const actionRef = useRef<ActionType>();
  const formRef = useRef<ProFormInstance>();
  const [columns, setColumns] = useState<any[]>([]);
  const [showTime, setShowTime] = useState(false);
  const [showNum, setShowNum] = useState(false);
  const [downLoading, setDownLoading] = useState(false);
  const [prodOpts, setProdOpts] = useState<any[]>([]);
  const [agencyOpts, setAgencyOpts] = useState<any[]>([]);
  const [actionDisabled, setActionDisabled] = useState(false);

  const basicList = [
    {
      title: '',
      dataIndex: 'fName',
      key: 'fName',
      width: 116,
      render: (_: any, record: any) => (
        <div className={styles['channel-table-title']}>
          <Tooltip title={record?.fName}>
            <div className={styles['name']}>{record?.fName || '-'}</div>
          </Tooltip>
          <div className={styles['code']}>{record?.fCode || '-'}</div>
        </div>
      ),
      fixed: true,
      hideInSearch: true,
    },
    {
      title: '日期',
      key: 'date',
      dataIndex: 'date',
      hideInTable: true,
      valueType: 'date',
      fieldProps: {
        allowClear: false,
        defaultValue: moment().subtract(1, 'day'),
        disabledDate: (current: any) => current > moment().subtract(1, 'day').endOf('day'),
      },
    },
    {
      title: '产品',
      key: 'fundCodes',
      dataIndex: 'fundCodes',
      hideInTable: true,
      valueType: 'cascader',
      fieldProps: {
        fieldNames: {
          label: 'name',
          value: 'code',
          children: 'childs',
        },
        multiple: true,
        showCheckedStrategy: Cascader.SHOW_PARENT,
        showSearch: true,
        onChange: (_: any, selectOpts: any) => {
          setProdOpts(selectOpts);
        },
        getPopupContainer: (triggerNode: any) => triggerNode.parentElement,
      },
      request: async () => {
        return await queryScTreeData({ type: 'fund_type' });
      },
    },
    {
      title: '渠道',
      key: 'agencyCodes',
      dataIndex: 'agencyCodes',
      hideInTable: true,
      valueType: 'cascader',
      fieldProps: {
        fieldNames: {
          label: 'name',
          value: 'code',
          children: 'childs',
        },
        multiple: true,
        showCheckedStrategy: Cascader.SHOW_PARENT,
        showSearch: true,
        onChange: (_: any, selectOpts: any) => {
          setAgencyOpts(selectOpts);
        },
        getPopupContainer: (triggerNode: any) => triggerNode.parentElement,
      },
      request: async () => {
        return await queryScTreeData({ type: 'agency_kind' });
      },
    },
    {
      title: '仅查询母基金',
      key: 'isParent',
      dataIndex: 'isParent',
      hideInTable: true,
      valueType: 'switch',
      fieldProps: {
        checkedChildren: '是',
        unCheckedChildren: '否',
      },
    },
  ];

  // 判断单元格显示样式
  const checkStyle = (item: any) => {
    const { hosting, date } = item || {};
    let style = '';

    if (hosting === '1') {
      // 托管 是否上线 ? 上线+托管 : 托管
      style = date ? 'channel-table-cell-online-hosting' : 'channel-table-cell-hosting';
    } else {
      // 未托管 是否上线 ? 上线 : 未托管(正常情况下不会出现这类数据 显示按未上线处理)
      style = date ? 'channel-table-cell-online' : 'channel-table-cell-not-online';
    }

    return style;
  };

  // 单元格样式
  const tableCell = (item: any) => {
    const { date, amt } = item || {};
    const style = checkStyle(item);

    // 未上线
    if (item === '-' || style === 'channel-table-cell-not-online') {
      return <div className={styles[style]} />;
    }

    return (
      <div className={styles[style]}>
        {showNum && <div title={amt ?? '-'}>{amt ?? '-'}</div>}
        {showTime && (
          <div title={date ? moment(date).format('YYYY-MM-DD') : '-'}>
            {date ? moment(date).format('YYYY-MM-DD') : '-'}
          </div>
        )}
      </div>
    );
  };

  // 处理列表columns
  const handleColumns = (data: any) => {
    const columnsList =
      data?.map((i: any) => ({
        ...i,
        width: 116,
        render: (text: any) => tableCell(text),
        search: false,
      })) || [];

    setColumns([...basicList, ...columnsList]);
  };

  // 显示上线日期、存量规模
  const checkChange = (val: any, type: string) => {
    if (type === 'TIME') {
      setShowTime(val?.target?.checked);
    } else {
      setShowNum(val?.target?.checked);
    }
    actionRef.current?.reload();
  };

  // 处理下拉数据 后端传参只接受子节点code
  const handleOptions = (dataArr: any) => {
    // 获取数组最后一项
    const lastData = dataArr?.map((i: any) => _last(i));
    const loop = (data: any, arr: any = []) => {
      data?.map((i: any) => {
        if (i.childs && i.childs.length) {
          return loop(i.childs, arr);
        }
        arr.push(i.code);
      });
      return arr;
    };
    const codeArr = loop(lastData);
    return codeArr;
  };

  // 列表请求
  const tableRequest = async (params: any) => {
    const { isParent, date } = params;
    const { success, data } = await queryAgencyOnlineSituation({
      isParent: isParent ? '1' : '0',
      date: date
        ? moment(date).format('YYYY-MM-DD')
        : moment().subtract(1, 'day').format('YYYY-MM-DD'),
      fundCodes: handleOptions(prodOpts),
      agencyCodes: handleOptions(agencyOpts),
    });

    handleColumns(data?.columns);
    return { data: data?.data || [], success };
  };

  // 下载
  const downloadFile = async (values: any) => {
    const { date, isParent } = values;
    setDownLoading(true);
    const { success, data } = await downLoadAgencyOnlineSituation({
      isParent: isParent ? '1' : '0',
      date: date
        ? moment(date).format('YYYY-MM-DD')
        : moment().subtract(1, 'day').format('YYYY-MM-DD'),
      fundCodes: handleOptions(prodOpts),
      agencyCodes: handleOptions(agencyOpts),
    });
    setDownLoading(false);

    if (success) {
      window.open(data);
    }
  };

  return (
    <ProCardPlus sn="_marketing_channelOnLine" ghost style={{ padding: contentPadding }}>
      <ProTable
        rowKey="fCode"
        bordered
        className={styles['channel-table']}
        columns={columns}
        options={false}
        pagination={{ current: 1, pageSize: 10, showSizeChanger: false }}
        actionRef={actionRef}
        formRef={formRef}
        search={{ labelWidth: 'auto' }}
        onLoadingChange={(val: any) => setActionDisabled(val)}
        headerTitle={
          <Space>
            <span>渠道上线情况</span>
            <Tooltip title="产品选择仅支持查询母基金。如勾选“仅查询母基金”，则查询到的产品上线日期为母基金上线日期，存量规模为份额合并规模。">
              <QuestionCircleOutlined style={{ fontSize: '14px' }} />
            </Tooltip>
            {legendData?.map((i: any) => (
              <div key={i.type} className={styles[i.className]}>
                {i.type}
              </div>
            ))}
          </Space>
        }
        toolBarRender={() => {
          return [
            <Checkbox
              disabled={actionDisabled}
              checked={showTime}
              onChange={(val: any) => checkChange(val, 'TIME')}
            >
              上线日期
            </Checkbox>,
            <Checkbox
              disabled={actionDisabled}
              checked={showNum}
              onChange={(val: any) => checkChange(val, 'NUM')}
            >
              存量规模(万)
            </Checkbox>,
            <Button
              disabled={actionDisabled}
              loading={downLoading}
              onClick={() => downloadFile(formRef.current?.getFieldsValue())}
              size="small"
            >
              <DownloadOutlined />
              下载
            </Button>,
          ];
        }}
        request={tableRequest}
        scroll={{ x: 'max-content', y: 500 }}
      />
    </ProCardPlus>
  );
};

export default ChannelOnLine;
