import type { FormInstance } from 'antd';
import { Form } from 'antd';
import { useRef, useEffect, useCallback, useState } from 'react';
import { debounce as _debounce } from 'lodash';
import ProForm, {
  ModalForm,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-form';
import { EditableProTable } from '@ant-design/pro-components';

import { queryIntegrationSource, querySourceTable, searchColumn } from './service';

const MyForm = ({ visible, type, title, initialValues, onVisibleChange, onFinish }: any) => {
  const formRef = useRef<FormInstance>();
  const [form] = Form.useForm();
  const [dataSourceIdArray, setDataSourceIdArray] = useState([]);
  const [dataSourceTableArray, setDataSourceTableArray] = useState([]);
  // const dataSourceType = Form.useWatch('dataSourceType', form);
  const tableRef = useRef({});
  const [dataSource, setDataSource] = useState(() => []);
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);

  const columns = [
    {
      title: '参数名称',
      dataIndex: 'columnName',
      readonly: true,
      width: '25%',
    },
    {
      title: '参数类型',
      key: 'state',
      dataIndex: 'dataType',
      readonly: true,
      width: '30%',
    },
    {
      title: '描述',
      dataIndex: 'comment',
      width: '30%',
    },
  ];

  useEffect(() => {
    // 确保formRef存在
    setTimeout(() => {
      formRef?.current?.setFieldsValue({
        ...initialValues,
      });
      if (type === 'edit') {
        formRef?.current?.setFieldsValue({
          dataSourceId: dataSourceIdArray.find(
            (item) => item.value[0] === initialValues?.dataSourceId,
          ),
        });
        tableRef.current = {
          id: initialValues?.dataSourceId,
        };
        (async function resultFn(params) {
          if (params?.id) {
            const result: any = await querySourceTable(params);
            setDataSourceTableArray(result);
            formRef?.current?.setFieldsValue({
              table: result.find((item: any) => item.value[1] === initialValues?.tableView),
            });
            tableRef.current = {
              ...tableRef.current,
              table: result.find((item: any) => item.value[1] === initialValues?.tableView)
                ?.value[0],
            };
          }
        })({ id: initialValues?.dataSourceId });

        if (initialValues?.fieldModelList && Array.isArray(initialValues.fieldModelList)) {
          setEditableRowKeys(initialValues.fieldModelList.map((item: any, index: number) => index));
          setDataSource(
            initialValues?.fieldModelList.map((item: any, index: number) => ({
              ...item,
              id: index,
            })),
          );
        }
      }
    }, 100);
  }, [initialValues]);

  useEffect(() => {
    (async function resultFn() {
      const result: any = await queryIntegrationSource({});
      setDataSourceIdArray(result);
    })();
  }, []);

  useEffect(() => {
    formRef?.current?.setFieldsValue({
      fieldModelList: dataSource,
    });
  }, [dataSource]);

  const handleSearchFundInfo = useCallback(
    _debounce(async (value) => {
      const result: any = await queryIntegrationSource({ id: value });
      setDataSourceIdArray(result);
    }, 300),
    [],
  );

  const handleSearchSourceTable = useCallback(
    _debounce(async (value) => {
      const newData: any = dataSourceIdArray.filter((item: any) => item.value[1].indexOf(value));
      setDataSourceIdArray(newData);
    }, 300),
    [],
  );

  const handleInputSearch = useCallback(
    _debounce(async (value: any) => {
      const { success, data }: any = await searchColumn({
        ...tableRef.current,
        schema: value.target.value,
      });
      formRef?.current?.setFieldsValue({
        schema: value.target.value,
      });
      tableRef.current = {
        ...tableRef.current,
        schema: value.target.value,
      };
      if (success) {
        const newData = data.map(({ columnName, dataType, comment }: any, index: number) => {
          return {
            id: (Date.now() + index).toString(),
            dataType,
            comment,
            columnName,
          };
        });
        setDataSource(newData);
        setEditableRowKeys(newData.map(({ id }: any) => id));
      }
    }, 300),
    [],
  );

  return (
    <ModalForm
      form={form}
      title={title}
      formRef={formRef}
      visible={!!visible}
      layout={'horizontal'}
      onVisibleChange={(v: boolean) => {
        onVisibleChange(v);
      }}
      onFinish={async (values: any) => {
        const params = { ...values };

        if (type === 'edit') {
          params.id = initialValues.id;
        }

        await formRef.current?.validateFields();
        const result = await onFinish(params);
        formRef.current?.resetFields();
        setDataSource([]);
        onVisibleChange(false);
        return result;
      }}
    >
      <ProFormSelect
        label="数据源ID"
        name="dataSourceId"
        placeholder="请选择数据源ID"
        rules={[{ required: true, message: '必选' }]}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 14 }}
        options={dataSourceIdArray}
        fieldProps={{
          showSearch: true,
          onSearch: handleSearchFundInfo,
          labelInValue: true,
          onSelect: async (value: any) => {
            formRef?.current?.setFieldsValue({
              dataSourceId: value,
            });
            const result: any = await querySourceTable({ id: value.value[0], table: '' });
            setDataSourceTableArray(result);
            tableRef.current = {
              id: value.value[0],
            };
          },
        }}
      />
      <ProFormSelect
        label="视图Code"
        name="table"
        placeholder="请选择视图Code"
        rules={[{ required: true, message: '必选' }]}
        options={dataSourceTableArray}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 14 }}
        fieldProps={{
          showSearch: true,
          onSearch: handleSearchSourceTable,
          labelInValue: true,
          onSelect: async (value: any) => {
            formRef?.current?.setFieldsValue({
              table: value,
            });
            tableRef.current = {
              ...tableRef.current,
              table: value.value[1],
            };
            const { success, data } = await searchColumn({
              ...tableRef.current,
            });
            if (success) {
              const newData = data.map(({ columnName, dataType, comment }: any, index: number) => {
                return {
                  id: (Date.now() + index).toString(),
                  dataType,
                  comment,
                  columnName,
                };
              });
              setDataSource(newData);
              setEditableRowKeys(newData.map(({ id }: any) => id));
            }
          },
        }}
      />
      <ProFormText
        label="视图名称"
        name="tableName"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 14 }}
      />
      <ProFormText
        label="schema"
        name="schema"
        disabled={dataSource.length ? true : false}
        onChange={handleInputSearch}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 14 }}
      />
      <ProFormTextArea
        label="描述信息"
        name="tableDesc"
        placeholder="请输入描述信息"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 14 }}
      />
      <div style={{ display: 'none' }}>
        <ProFormText name="fieldModelList" />
      </div>
      {dataSource.length ? (
        <>
          <ProForm.Group title="字段属性：" />
          <div style={{ maxHeight: '200px', overflowY: 'scroll' }}>
            <>
              <EditableProTable
                columns={columns}
                rowKey="id"
                value={dataSource}
                onChange={setDataSource}
                controlled
                recordCreatorProps={false}
                editable={{
                  type: 'multiple',
                  editableKeys,
                  actionRender: (row: any, config: any, defaultDoms: { delete: any }) => {
                    return [defaultDoms.delete];
                  },
                  onValuesChange: (record: any, recordList: any) => {
                    _debounce(async () => {
                      setDataSource(recordList);
                    }, 300);
                  },
                  onChange: setEditableRowKeys,
                }}
              />
            </>
          </div>
        </>
      ) : null}
    </ModalForm>
  );
};

export default MyForm;
