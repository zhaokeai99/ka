import ProCardPlus from '@/components/ProCardPlus';
import { cardGutter, contentPadding } from '@/themes';
import ProCard from '@ant-design/pro-card';
import MyPie from './Pie';
import Statistic from './Statistic';
import { Button, Form, Input, message, Switch, Table, Tooltip } from 'antd';
import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  getIndexHotMapUserWeights,
  queryComplianceConfigList,
  updateComplianceConfig,
} from './service';
import './index.less';
interface DataType {
  configKey: string;
  configName: string;
  configThreshold: string;
  configValue: string;
  isExceed: string;
  blockFlag: boolean;
}

interface PieData {
  title: string;
  type: string;
  value: number;
}

const EditableContext = React.createContext(null);

const EditableRow = ({ index, ...props }: any) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}: any) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      const obj = {
        ...record,
        configThreshold: values.configThreshold,
      };

      const res = await updateComplianceConfig({
        ...obj,
      });

      if (res) message.success('修改成功');

      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
          width: 260,
        }}
        name={dataIndex}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

const IndexParameters: React.FC = () => {
  const [newData, setNewData] = useState<DataType[]>([]);
  const [pieData, setPieData] = useState<PieData[]>([]);

  useEffect(() => {
    (async () => {
      const data = await queryComplianceConfigList();
      setNewData(data);

      const weightsData = await getIndexHotMapUserWeights();
      setPieData(weightsData);
    })();
  }, []);

  const onChange = (checked: boolean, item: DataType) => {
    setNewData(
      newData.map((cur) => {
        if (cur.configKey === item.configKey) {
          return {
            ...cur,
            blockFlag: checked,
          };
        }
        return cur;
      }),
    );

    if (checked) {
      if (item?.configThreshold) {
        (async () => {
          const res = await updateComplianceConfig({
            ...item,
            blockFlag: checked,
          });
          if (res) {
            message.success('修改成功');
          } else {
            message.error('修改失败');
          }
        })();
      } else {
        message.warning('指数新规阻塞状态阈值不可以为空');
      }
    } else {
      (async () => {
        const res = await updateComplianceConfig({
          ...item,
          blockFlag: checked,
        });
        if (res) {
          message.success('修改成功');
        } else {
          message.error('修改失败');
        }
      })();
    }
  };

  const defaultColumns = [
    {
      title: '指标项',
      dataIndex: 'configName',
      key: 'configName',
    },
    {
      title: '属性',
      dataIndex: 'blockFlag',
      key: 'blockFlag',
      render: (v: boolean, item: DataType) => {
        return (
          <Switch
            checked={v}
            style={{ width: '68px' }}
            onChange={(checked) => onChange(checked, item)}
            checkedChildren="阻断"
            unCheckedChildren="非阻断"
            defaultChecked
          />
        );
      },
    },
    {
      title: '阈值',
      dataIndex: 'configThreshold',
      key: 'configThreshold',
      width: 300,
      editable: true,
      render: (v: any) => {
        return <div style={{ color: '#4568F5' }}>{v || '-'}</div>;
      },
    },
  ];

  const handleSave = (row: DataType) => {
    const dataSource = [...newData];
    const index = newData.findIndex((item) => row.configKey === item.configKey);
    const item = newData[index];
    dataSource.splice(index, 1, { ...item, ...row });
    setNewData(dataSource);
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };
  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: any) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  return (
    <ProCard
      style={{ padding: contentPadding }}
      direction="column"
      ghost
      gutter={[cardGutter, cardGutter]}
      size="small"
    >
      <ProCardPlus
        title="指数新规"
        gutter={[0, cardGutter]}
        extra={
          <Tooltip placement="top" title="当前参数重新计算">
            <Button type="primary">重新计算</Button>
          </Tooltip>
        }
      >
        <div className="table">
          <Table
            components={components}
            bordered
            rowKey="id"
            pagination={false}
            columns={columns}
            size="small"
            dataSource={newData}
          />
        </div>
      </ProCardPlus>
      <ProCardPlus
        title="指数热力模型"
        direction="column"
        gutter={[0, cardGutter]}
        extra={
          <Tooltip placement="top" title="热力模型重新计算">
            <Button type="primary">重新计算</Button>
          </Tooltip>
        }
      >
        <ProCard>
          <Statistic queryPieData={setPieData} />
        </ProCard>
        <ProCard layout="center" style={{ width: '100%', height: '100%' }}>
          <MyPie pieData={pieData} />
        </ProCard>
      </ProCardPlus>
    </ProCard>
  );
};

export default IndexParameters;
