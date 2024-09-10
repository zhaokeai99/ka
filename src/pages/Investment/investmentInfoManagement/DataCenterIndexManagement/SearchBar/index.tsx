import { Button, DatePicker, Form, Space, Dropdown } from 'antd';
import React, { useImperativeHandle, useState } from 'react';
import {
  AreaChartOutlined,
  BarChartOutlined,
  FundOutlined,
  LineChartOutlined,
  SearchOutlined,
  TableOutlined,
  CheckOutlined,
} from '@ant-design/icons';
import moment from 'moment';

const { RangePicker } = DatePicker;

type PropsType = {
  onTemplateSave: (data: any) => void;
  onTypeChange: (data: any) => void;
  onSearch: (data: any) => void;
  onDelete: (data: any) => void;
  onExportExcel?: () => void;
  onExportPic?: () => void;
  onChartStyleChange?: (data: any) => void;
  showDelete: any;
  cRef: any;
  chartStyle: any;
};

/**
 * 搜索条
 * @param props
 * @constructor
 */
const SearchBarView = (props: PropsType) => {
  const {
    cRef,
    onTemplateSave,
    onTypeChange,
    onSearch,
    onDelete,
    onExportPic,
    onExportExcel,
    onChartStyleChange,
    showDelete,
    chartStyle,
  } = props;
  const [dataType, setDataType] = useState<any>('data');
  //图表记录
  const [formSearch, setFormSearch] = useState<any>({});
  // const [chartStyle, setChartStyle] = useState<any>({ mark: false, unit: true, gridline: false });
  const [form] = Form.useForm();

  //保存按钮
  const onHandleSave = () => {
    const data = { dataType, formSearch };
    onTemplateSave(data);
  };

  //图形类型变更
  const typeChange = (value: any) => {
    setDataType(value);
    onTypeChange(value);
  };

  //搜索按钮
  const onSearchButton = () => {
    const dates = form.getFieldValue('searchDate');
    const params: any = {};
    if (dates) {
      if (dates.length > 0) {
        params.startDate = moment(dates[0]).format('YYYY-MM-DD');
      }
      if (dates.length > 1) {
        params.endDate = moment(dates[1]).format('YYYY-MM-DD');
      }
    }
    onSearch(params);
    setFormSearch(params);
  };

  //提供修改查询条件
  useImperativeHandle(cRef, () => ({
    setFormDate: (dates: any[]) => {
      const searchs = [];
      if (dates) {
        if (dates.length > 0 && dates[0]) {
          searchs.push(moment(dates[0]));
        } else {
          searchs.push(undefined);
        }
        if (dates.length > 1 && dates[1]) {
          searchs.push(moment(dates[1]));
        } else {
          searchs.push(undefined);
        }
      }
      const forms = { searchDate: searchs };
      setFormSearch(forms);
      form.setFieldsValue(forms);
    },
    setDataType: (type: any) => {
      setDataType(type);
      form.setFieldsValue({ dataType: type });
    },
  }));

  const styleChange = (value: any) => {
    let style = { ...chartStyle };
    if (value === 'mark') {
      style = { ...chartStyle, mark: !chartStyle.mark };
    } else if (value === 'unit') {
      style = { ...chartStyle, unit: !chartStyle.unit };
    } else if (value === 'gridline') {
      style = { ...chartStyle, gridline: !chartStyle.gridline };
    }
    // setChartStyle(style);
    onChartStyleChange?.(style);
  };

  const dropTypeItem = [
    {
      icon: <TableOutlined title={'表格'} />,
      label: <span style={{ color: '#eee !important' }}>表格</span>,
      key: 'data',
      onClick: () => typeChange('data'),
    },
    {
      icon: <FundOutlined title={'自定义图'} />,
      label: <span style={{ color: '#eee !important' }}>自定义图</span>,
      key: 'custom',
      onClick: () => typeChange('custom'),
    },
    {
      icon: <LineChartOutlined title={'曲线图'} />,
      label: <span style={{ color: '#eee !important' }}>曲线图</span>,
      key: 'smoothLine',
      onClick: () => typeChange('smoothLine'),
    },
    {
      icon: <LineChartOutlined title={'折线图'} />,
      label: <span style={{ color: '#eee !important' }}>折线图</span>,
      key: 'line',
      onClick: () => typeChange('line'),
    },
    {
      icon: <BarChartOutlined title={'直方图'} />,
      label: <span style={{ color: '#eee !important' }}>直方图</span>,
      key: 'column',
      onClick: () => typeChange('column'),
    },
    {
      icon: <AreaChartOutlined title={'堆叠面积图'} />,
      label: <span style={{ color: '#eee !important' }}>堆叠面积图</span>,
      key: 'area',
      onClick: () => typeChange('area'),
    },
  ];

  const dropStyleItem = [
    {
      icon: chartStyle.mark ? <CheckOutlined /> : undefined,
      label: <span style={{ color: '#eee !important' }}>标注</span>,
      key: 'mark',
      onClick: () => styleChange('mark'),
    },
    {
      icon: chartStyle.unit ? <CheckOutlined /> : undefined,
      label: <span style={{ color: '#eee !important' }}>单位</span>,
      key: 'unit',
      onClick: () => styleChange('unit'),
    },
    {
      icon: chartStyle.gridline ? <CheckOutlined /> : undefined,
      label: <span style={{ color: '#eee !important' }}>网格线</span>,
      key: 'gridline',
      onClick: () => styleChange('gridline'),
    },
  ];

  const getIcon = (type: any) => {
    if (type === 'data') {
      return <TableOutlined title={'表格'} />;
    } else if (type === 'custom') {
      return <FundOutlined title={'自定义图'} />;
    } else if (type === 'smoothLine') {
      return <LineChartOutlined title={'曲线图'} />;
    } else if (type === 'line') {
      return <LineChartOutlined title={'折线图'} />;
    } else if (type === 'column') {
      return <BarChartOutlined title={'直方图'} />;
    } else if (type === 'area') {
      return <AreaChartOutlined title={'堆叠面积图'} />;
    }
    return '';
  };

  return (
    <Form form={form}>
      <div style={{ display: 'inline-flex' }}>
        <Space>
          <Form.Item name={'searchDate'} noStyle>
            <RangePicker />
          </Form.Item>
          <Button type="primary" icon={<SearchOutlined />} onClick={onSearchButton} />
          <Dropdown menu={{ items: dropTypeItem }}>
            <Button type={'primary'}>{getIcon(dataType)}</Button>
          </Dropdown>
          <Dropdown menu={{ items: dropStyleItem }}>
            <Button>样式</Button>
          </Dropdown>
        </Space>
      </div>
      <div style={{ float: 'right', textAlign: 'right' }}>
        <Space>
          <Button type={'primary'} onClick={onHandleSave}>
            保存
          </Button>
          {showDelete ? (
            <Button type={'primary'} onClick={onDelete}>
              删除
            </Button>
          ) : (
            ''
          )}
          <Button onClick={onExportExcel}>导出</Button>
          <Button onClick={onExportPic}>导出图片</Button>
        </Space>
      </div>
    </Form>
  );
};

SearchBarView.isProCard = true;

export default SearchBarView;
