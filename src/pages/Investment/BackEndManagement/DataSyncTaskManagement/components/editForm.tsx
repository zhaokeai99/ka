import {
  Avatar,
  Button,
  Divider,
  Form,
  Input,
  message,
  Modal,
  Radio,
  RadioChangeEvent,
  Select,
  Space,
  Spin,
} from 'antd';
import React, { memo, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import ProCard from '@ant-design/pro-card';
import { DicProps } from './../index';
import SelectHandle from '@/pages/Investment/util/SelectHandle';
import {
  EsDataSyncTaskFacadeCancelDataSyncTask,
  EsDataSyncTaskFacadeForgoDataSyncTask,
  EsDataSyncTaskFacadeGetDataSyncTask,
  EsDataSyncTaskFacadePublishDataSyncTask,
  EsDataSyncTaskFacadeSaveDataSyncTask,
  EsIntegrationSourceFacadeQueryTableInfoPart,
  EsIntegrationSourceFacadeRunSqlWithColumn,
  EsIntegrationSourceQuery,
} from './../service';
import IndexTableForm from './indexTableForm';
import './../index.css';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import PreviewTableForm from './previewTable';

const { TextArea } = Input;
const Option = Select.Option;
const { confirm } = Modal;

let timeout: ReturnType<typeof setTimeout> | null;
let currentValue: string;

interface ModalProps {
  dicMap: DicProps;
  version: number;
  cRef: any;
  onSuccess: () => void;
}

function tableInfoHandle(tableData: any[]) {
  const data: any[] = [];
  tableData.forEach((t) => {
    const d = {
      id: t.schemaName + '.' + t.tableName,
      tableName: t.tableName,
      schemaName: t.schemaName,
      comment: t.comment,
      showName: t.schemaName + '.' + t.tableName + (t.comment ? '(' + t.comment + ')' : ''),
    };
    if (t.schemaName === undefined || t.schemaName === null) {
      d.id = t.tableName;
      d.showName = t.tableName + (t.comment ? '(' + t.comment + ')' : '');
    }
    data.push(d);
  });
  return data;
}

function genSql(table: String) {
  return 'select * from ' + table;
}

const fetchDataTable = (
  value: string,
  dsId: number,
  callback: (data: { value: string; text: string }[]) => void,
) => {
  if (timeout) {
    clearTimeout(timeout);
    timeout = null;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  currentValue = value;

  const fake = async () => {
    const str = {
      key: value,
      id: dsId,
    };
    const data = await EsIntegrationSourceFacadeQueryTableInfoPart(str);
    if (currentValue === value) {
      if (data.success) {
        callback(tableInfoHandle(data.data));
      }
    }
  };

  timeout = setTimeout(fake, 300);
};
const EsTaskEditInfo = (props: ModalProps) => {
  const { dicMap, version, cRef, onSuccess } = props;
  const [form] = Form.useForm();
  const IndexTableRef = useRef();

  const [dataBaseType, setDataBaseType] = useState<any[]>([]);
  const [datasourceMap, setDatasourceMap] = useState<any[]>([]);
  const [tableMap, setTableMap] = useState<any[]>([]);
  const [testDataList, setTestDataList] = useState<any[]>([]);
  const [testTableColumns, setTestTableColumns] = useState<any[]>([]);
  const [columnInfo, setColumnInfo] = useState<any[]>([]);
  const [indexAnalyzer, setIndexAnalyzer] = useState<any[]>([]);
  const [dataFieldList, setDataFieldList] = useState<any[]>([]);
  const [formSpin, setFormSpin] = useState<boolean>(false);
  const [syncTypeShow, setSyncTypeShow] = useState<boolean>(true);
  const [taskTitle, setTaskTitle] = useState<string>('任务维护');
  const [btnForgoStatus, setBtnForgoStatus] = useState<boolean>(false);
  const [btnCancelStatus, setBtnCancelStatus] = useState<boolean>(false);
  const [testSqlFormShow, setTestSqlFormShow] = useState<boolean>(false);

  const datalinkTmp: any = {};
  useEffect(() => {
    setDataBaseType(dicMap?.dataBaseType);
    setIndexAnalyzer(dicMap?.indexAnalyzer);
  }, [version]);
  const clearData = () => {
    setColumnInfo([]);
    setTestTableColumns([]);
    setTestDataList([]);
    setTableMap([]);
  };

  const dataBaseTypeLoad = async (value: string) => {
    clearData();
    if (datalinkTmp[value] !== undefined) {
      setDatasourceMap(datalinkTmp[value]);
      return;
    }
    const query = { sourceType: value };
    const data = await EsIntegrationSourceQuery(query);
    if (data.success) {
      datalinkTmp[value] = data.data;
      setDatasourceMap(data.data);
    }
  };
  //数据类型选择
  const dataBaseTypeChange = async (value: string) => {
    dataBaseTypeLoad(value);
    form.setFieldsValue({ datasourceId: '', tableInfo: '' });
  };
  //数据源选择
  const datasourceChange = async (value: string) => {
    console.log(value);
    clearData();
    form.setFieldsValue({ tableInfo: '' });
  };
  //数据源选择
  const tableSearch = (newValue: string) => {
    if (newValue) {
      const dsId = form.getFieldValue('datasourceId');
      fetchDataTable(newValue, dsId, setTableMap);
    } else {
      setTableMap([]);
    }
  };
  //表选择
  const tableChange = async (value: string) => {
    form.setFieldsValue({ taskSql: genSql(value) });
  };
  //设置测试表格列
  const setTestColumns = (columnList: string[]) => {
    const columns: any[] = [];
    columnList.map((c) => {
      const info = { title: c, dataIndex: c, ellipsis: true, width: 100 };
      columns.push(info);
    });
    setTestTableColumns(columns);
  };
  //查询sql
  const linkSqlInfo = async (params: any) => {
    setTestDataList([]);
    const data = await EsIntegrationSourceFacadeRunSqlWithColumn(params);
    if (data.success) {
      setColumnInfo(data.data.columnList);
      setTestColumns(data.data.columnList);
      setTestDataList(data.data.dataList);
    }
  };
  //
  const onTestSqlInfo = async () => {
    const sql = form.getFieldValue('taskSql');
    const dataSourceId = form.getFieldValue('datasourceId');
    if (dataSourceId === undefined || dataSourceId === '') {
      message.warn('请选择数据源!');
      return;
    }
    if (sql === undefined || sql === '') {
      message.warn('请输入sql!');
      return;
    }
    const query = { id: dataSourceId, sql: sql };
    linkSqlInfo(query);
    setTestSqlFormShow(true);
  };
  //隐藏测试表格
  const onHideTestTable = () => {
    setTestSqlFormShow(true);
  };
  //同步数据类型
  const syncTypeChange = (e: RadioChangeEvent) => {
    setSyncTypeShow(e.target.value === 0);
  };
  //增量记录列名变更
  const syncColumnChange = (e: any) => {
    const indexName = form.getFieldValue('indexName');
    const taskName = form.getFieldValue('taskName');
    const name = indexName + '_' + taskName + '_' + e;
    const configName = form.getFieldValue('syncConfigName');
    if (configName === undefined || configName === null || configName.replace(' ', '') === '') {
      form.setFieldsValue({ syncConfigName: name });
    }
  };
  //加载
  const loadTaskData = useCallback(async (id: number) => {
    setFormSpin(true);
    const params = { id: id };
    const data = await EsDataSyncTaskFacadeGetDataSyncTask(params);
    form.setFieldsValue(data);
    //加载索引映射
    if (data.fieldItems) {
      const fieldData = JSON.parse(data.fieldItems);
      setDataFieldList(fieldData);
    }
    //加载数据源
    dataBaseTypeLoad(data.sourceType);
    datasourceChange(data.datasourceId);
    //测试连接
    const sqlPara = { id: data.datasourceId, sql: data.taskSql };
    linkSqlInfo(sqlPara);
    //增量
    setSyncTypeShow(data.syncType === 0);
    setFormSpin(false);

    setTaskTitle('任务维护 - ' + data.taskName);
  }, []);
  //新增任务
  const addTask = () => {
    //清除字段
    form.resetFields();
    //清除表数据
    clearData();
    //索引映射
    setDataFieldList([]);
    setTaskTitle('新增任务');
  };
  //状态设置
  const setStatus = (status: number | undefined) => {
    if (status === undefined) {
      //新建
      setBtnForgoStatus(false);
      setBtnCancelStatus(false);
    } else if (status === 0) {
      //未发布
      setBtnForgoStatus(true);
      setBtnCancelStatus(false);
    } else if (status === 1) {
      //已发布
      setBtnForgoStatus(false);
      setBtnCancelStatus(true);
    } else if (status === 2) {
      setBtnForgoStatus(false);
      setBtnCancelStatus(false);
    }
  };
  //
  useImperativeHandle(cRef, () => ({
    setTaskId: (id: number, currStatus: number) => {
      setStatus(currStatus);
      return loadTaskData(id);
    },
    taskAdd: () => {
      setStatus(undefined);
      addTask();
    },
  }));

  const validTable = (rows: any) => {
    let isPass = false;
    rows.forEach((row: any) => {
      if (!(row.mappingName === undefined || row.mappingName === '')) {
        isPass = true;
      }
    });
    return isPass;
  };

  //保存
  const btnSaveClick = useCallback(async () => {
    // @ts-ignore
    const rowTable = IndexTableRef?.current?.getTableInfo();

    if (!validTable(rowTable)) {
      message.error('索引配置未配置');
      return;
    }
    confirm({
      title: '保存',
      content: '确认保存该记录吗?',
      icon: <ExclamationCircleOutlined />,
      async onOk() {
        const values = await form?.validateFields();
        const params = { ...values };
        params.fieldItems = JSON.stringify(rowTable);
        const data = await EsDataSyncTaskFacadeSaveDataSyncTask(params);
        if (data.success) {
          message.success('保存成功!');
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          if (data.refresh) {
            loadTaskData(data.id);
          }
          onSuccess?.();
        }
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }, []);
  //作废
  const btnCancelClick = useCallback(async () => {
    confirm({
      title: '作废',
      content: '确认作废该记录吗?',
      icon: <ExclamationCircleOutlined />,
      async onOk() {
        const params = { id: form.getFieldValue('id') };
        const data = await EsDataSyncTaskFacadeCancelDataSyncTask(params);
        if (data.data) {
          message.success('作废成功!');
          onSuccess?.();
        }
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }, []);
  //发布
  const btnPublishClick = useCallback(async () => {
    confirm({
      title: '发布',
      content: '确认发布该记录吗?',
      icon: <ExclamationCircleOutlined />,
      async onOk() {
        const values = await form?.validateFields();
        const params = { ...values };
        // @ts-ignore
        params.fieldItems = JSON.stringify(IndexTableRef?.current?.getTableInfo());
        const data = await EsDataSyncTaskFacadePublishDataSyncTask(params);
        if (data.data) {
          message.success('发布成功!');
          onSuccess?.();
        }
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }, []);
  //放弃修改
  const btnForgoClick = useCallback(async () => {
    confirm({
      title: '取消修改',
      content: '确认取消修改该记录吗?',
      icon: <ExclamationCircleOutlined />,
      async onOk() {
        const params = { id: form.getFieldValue('id') };
        const data = await EsDataSyncTaskFacadeForgoDataSyncTask(params);
        if (data.data) {
          message.success('放弃修改成功!');
          onSuccess?.();
        }
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }, []);
  return (
    <>
      <ProCard title={taskTitle}>
        <Spin spinning={formSpin}>
          <Form
            form={form}
            name="basic"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ numberOfShards: 3, numberOfReplicas: 1 }}
          >
            <Form.Item name="id" hidden={true}>
              <Input type={'hidden'} />
            </Form.Item>
            <Form.Item name="taskId" hidden={true}>
              <Input type={'hidden'} />
            </Form.Item>
            <Form.Item name="esIndexId" hidden={true}>
              <Input type={'hidden'} />
            </Form.Item>
            <Form.Item
              label="任务名称"
              name="taskName"
              rules={[{ required: true, message: '请输入任务名称!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="任务描述"
              name="taskDesc"
              rules={[{ required: true, message: '请输入任务描述!' }]}
            >
              <Input />
            </Form.Item>
            <Divider orientation="left" orientationMargin="0">
              <Avatar
                style={{ backgroundColor: '#3277fc', verticalAlign: 'middle' }}
                size="small"
                gap={1}
              >
                1
              </Avatar>
              数据源
            </Divider>
            <Form.Item label="数据源" name={'dataGroup'}>
              <Input.Group compact={true}>
                <Form.Item
                  name={'sourceType'}
                  rules={[{ required: true, message: '请选择数据源!' }]}
                >
                  <Select style={{ width: '100px' }} onChange={dataBaseTypeChange}>
                    {SelectHandle.toOptionsDic(dataBaseType)}
                  </Select>
                </Form.Item>
                <Form.Item
                  name={'datasourceId'}
                  rules={[{ required: true, message: '请选择数据连接!' }]}
                >
                  <Select style={{ width: '200px' }} onChange={datasourceChange}>
                    {SelectHandle.toOptions(datasourceMap, 'id', 'sourceDesc')}
                  </Select>
                </Form.Item>
                <Form.Item name={'tableInfo'} rules={[{ required: false, message: '请选择表!' }]}>
                  <Select
                    style={{ width: '400px' }}
                    onChange={tableChange}
                    allowClear={true}
                    showSearch={true}
                    filterOption={false}
                    onSearch={tableSearch}
                    optionFilterProp="children"
                  >
                    {tableMap.map((item: any) => {
                      return <Option key={item.id}>{item.showName}</Option>;
                    })}
                    {SelectHandle.toOptions(tableMap, 'id', 'sourceDesc')}
                  </Select>
                </Form.Item>
              </Input.Group>
            </Form.Item>

            <Form.Item
              label="sql文本"
              name="taskSql2"
              rules={[{ required: false, message: '请输入sql文本!' }]}
            >
              <Input.Group>
                <Form.Item name="taskSql" rules={[{ required: true, message: '请输入sql文本!' }]}>
                  <TextArea />
                </Form.Item>
                <Form.Item name="testButton">
                  <Space>
                    <Button type={'link'} onClick={onTestSqlInfo}>
                      测试sql
                    </Button>
                    <Button type={'link'} onClick={onHideTestTable}>
                      显示测试表格
                    </Button>
                  </Space>
                </Form.Item>
              </Input.Group>
            </Form.Item>
            <Divider orientation="left" orientationMargin="0">
              <Avatar
                style={{ backgroundColor: '#3277fc', verticalAlign: 'middle' }}
                size="small"
                gap={1}
              >
                2
              </Avatar>
              索引映射
            </Divider>
            <IndexTableForm
              columnList={columnInfo}
              cRef={IndexTableRef}
              sourceDataList={dataFieldList}
            />
            <Divider orientation="left" orientationMargin="0">
              <Avatar
                style={{ backgroundColor: '#3277fc', verticalAlign: 'middle' }}
                size="small"
                gap={1}
              >
                3
              </Avatar>
              索引配置
            </Divider>
            <Form.Item
              label="索引名称"
              name="indexName"
              rules={[{ required: true, message: '请输入索引名称!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="索引描述"
              name="indexDesc"
              rules={[{ required: false, message: '请输入索引描述!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="分片数"
              name="numberOfShards"
              rules={[{ required: true, message: '请输入分片数!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="副本数"
              name="numberOfReplicas"
              rules={[{ required: true, message: '请输入副本数!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="分词器"
              name="analyzer"
              rules={[{ required: true, message: '请输入分词器!' }]}
            >
              <Select>{SelectHandle.toOptionsDic(indexAnalyzer)}</Select>
            </Form.Item>
            <Divider orientation="left" orientationMargin="0">
              <Avatar
                style={{ backgroundColor: '#3277fc', verticalAlign: 'middle' }}
                size="small"
                gap={1}
              >
                4
              </Avatar>
              任务配置
            </Divider>
            <Form.Item
              label="任务类型"
              name="taskType"
              rules={[{ required: true, message: '请选择任务类型!' }]}
            >
              <Select>
                <Option key={'1'}>定时任务</Option>
                <Option key={'2'}>管理任务</Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="任务执行时间"
              name="syncSchedule"
              rules={[{ required: true, message: '请输入任务执行时间!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="共享主键"
              name="primaryKey"
              rules={[{ required: true, message: '请选择共享主键!' }]}
            >
              <Select>
                {columnInfo.map((item) => (
                  <Option key={item}>{item}</Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="同步类型"
              name="syncType"
              rules={[{ required: true, message: '请选择同步类型!' }]}
            >
              <Radio.Group onChange={syncTypeChange}>
                <Radio value={0}>增量</Radio>
                <Radio value={1}>全量</Radio>
              </Radio.Group>
            </Form.Item>
            {syncTypeShow ? (
              <Form.Item
                label="增量记录列名"
                name="syncColumn"
                rules={[{ required: true, message: '请选择增量记录列名!' }]}
              >
                <Select onChange={syncColumnChange}>
                  {columnInfo.map((item) => (
                    <Option key={item}>{item}</Option>
                  ))}
                </Select>
              </Form.Item>
            ) : (
              ''
            )}
            {syncTypeShow ? (
              <Form.Item
                label="增量码表名称"
                name="syncConfigName"
                rules={[{ required: true, message: '请输入增量码表名称!' }]}
              >
                <Input />
              </Form.Item>
            ) : (
              ''
            )}
            <Form.Item style={{ textAlign: 'center' }} wrapperCol={{ span: 24 }}>
              <Space size={'large'}>
                {btnCancelStatus ? (
                  <Button type="primary" onClick={btnCancelClick} danger>
                    作废
                  </Button>
                ) : (
                  ''
                )}
                <Button type="primary" onClick={btnSaveClick} className={'ant-btn-green'}>
                  保存
                </Button>
                <Button type="primary" onClick={btnPublishClick}>
                  发布
                </Button>
                {btnForgoStatus ? <Button onClick={btnForgoClick}>放弃修改</Button> : ''}
              </Space>
            </Form.Item>
          </Form>
        </Spin>
      </ProCard>
      <Modal
        title={'连接测试'}
        visible={testSqlFormShow}
        width={1000}
        destroyOnClose={true}
        onOk={() => setTestSqlFormShow(false)}
        onCancel={() => setTestSqlFormShow(false)}
        footer={[
          <Button key="back" onClick={() => setTestSqlFormShow(false)}>
            关闭
          </Button>,
        ]}
      >
        <PreviewTableForm data={testDataList} columns={testTableColumns} />
      </Modal>
    </>
  );
};
export default memo(EsTaskEditInfo);
