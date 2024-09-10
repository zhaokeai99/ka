import { FormInstance, message, Popconfirm } from 'antd';
import { Form, Button } from 'antd';
import { useRef, useEffect, useState } from 'react';
import ProForm, { ModalForm, ProFormSelect, ProFormText, ProFormList } from '@ant-design/pro-form';
import { EditableProTable } from '@ant-design/pro-components';
import ConditionForm from './conditionForm';
import ProCardPlus from '@/components/ProCardPlus';
import { PlusOutlined } from '@ant-design/icons';
import { queryTableById, getIndexGroupList, queryTable } from './service';
import { filter as _filter } from 'lodash';
import Composite from './composite';

const MyForm = ({ visible, type, title, initialValues, onVisibleChange, onFinish }: any) => {
  const formRef = useRef<FormInstance>();
  const [form] = Form.useForm();
  const nodeType = Form.useWatch('calculationType', form);
  const editableFormRef = useRef<any>();
  const [dataSourceSelect, setDataSourceSelect] = useState([]); // 数据视图选择option
  const [paramNameSelect, setParamNameSelect] = useState([]); // 因子选择option
  const [calculationGroupSelect, setCalculationGroupSelect] = useState([]); // 分组选择option
  const [editableKeys, setEditableRowKeys] = useState([]);
  const [showConditionAdd, setShowConditionAdd] = useState(false);
  const [showConditionEdit, setShowConditionEdit] = useState(false);
  const [editData, setEditData] = useState({});
  const edits = (data: any) => {
    setEditData(data);
    setShowConditionEdit(true);
  };

  const deletes = (data: any) => {
    const newData = [...editableFormRef?.current?.getFieldsValue().filterConditionList].filter(
      (item: any) => item.id !== data.id,
    );
    editableFormRef?.current?.setFieldsValue({
      filterConditionList: newData,
    });
  };

  useEffect(() => {
    // 确保formRef存在
    setTimeout(() => {
      let result: any[] = []; //结果因子
      let dimension: any[] = []; //维度因子
      if (initialValues?.calculationDataIndexList) {
        result = _filter(initialValues?.calculationDataIndexList, { paramType: 'result' });
        dimension = _filter(initialValues?.calculationDataIndexList, { paramType: 'dimension' });
      }
      formRef?.current?.setFieldsValue({
        ...initialValues,
        dataViewId: dataSourceSelect.find(
          (item: any) => item.value[0] === initialValues?.dataViewId,
        ),
        result,
        dimension,
        filterConditionList: initialValues?.filterConditionList?.map(
          (item: any, index: number) => ({ ...item, id: index }),
        ),
      });
      (async () => {
        const { data } = await getIndexGroupList({ calculationId: initialValues?.calculationId });
        const newData = data?.map(({ calculationGroupId, calculationGroupName }: any) => ({
          label: calculationGroupName,
          value: calculationGroupId,
        }));
        setCalculationGroupSelect(newData);
        if (initialValues?.filterConditionList) {
          setEditableRowKeys(
            initialValues.filterConditionList?.map((item: any, index: number) => index),
          );
        }
        const res: any = await queryTableById({ id: initialValues?.dataViewId });
        setParamNameSelect(res);
      })();
    }, 200);
  }, [initialValues]);

  useEffect(() => {
    (async () => {
      const res: any = await queryTable({});
      setDataSourceSelect(res);
    })();
  }, []);

  const columns: any = [
    {
      title: '参数名称',
      dataIndex: 'paramValue',
      valueType: 'select',
      readonly: true,
      fieldProps: (_: any, { rowIndex }: any) => {
        return {
          options: paramNameSelect,
          rules: [{ required: true, message: '必选' }],
          onSelect: (value: any) => {
            editableFormRef?.current?.setRowData(rowIndex, {
              fieldType: paramNameSelect?.find((item: any) => item.columnName === value)?.dataType,
            });
          },
        };
      },
    },
    {
      title: '字段类型',
      dataIndex: 'fieldType',
      readonly: true,
    },
    {
      title: '条件类型',
      dataIndex: 'conditionType',
      search: false,
      valueType: 'select',
      readonly: true,
      fieldProps: {
        options: [
          {
            value: 'noMandatory',
            label: '非必选',
          },
          {
            value: 'mandatory',
            label: '必填',
          },
        ],
      },
    },
    {
      title: '参数类型',
      dataIndex: 'paramValueType',
      valueType: 'select',
      readonly: true,
      valueEnum: {
        variable: {
          text: '变量',
        },
        replace: {
          text: '替换量',
        },
        constValue: {
          text: '常量',
        },
      },
    },
    {
      title: '描述',
      dataIndex: 'paramDesc',
      search: false,
      readonly: true,
    },
    {
      title: '操作',
      valueType: 'option',
      width: '120',
      key: 'option',
    },
  ];

  return (
    <ModalForm
      width="1000px"
      form={form}
      modalProps={{
        destroyOnClose: true,
      }}
      disabled={type === 'select' ? true : false}
      title={title}
      formRef={formRef}
      visible={!!visible}
      layout={'horizontal'}
      onVisibleChange={onVisibleChange}
      onFinish={async (values: any) => {
        const filterConditionList = editableFormRef?.current?.getFieldsValue().filterConditionList;
        const params = {
          ...values,
          filterConditionList: filterConditionList || values?.filterConditionList,
        };
        if (type === 'edit') {
          params.id = initialValues.id;
        }
        await formRef.current?.validateFields();
        const result = await onFinish(params);
        formRef.current?.resetFields();
        return result;
      }}
    >
      <ProFormText
        label="节点名称"
        name="calculationName"
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 14 }}
      />
      <ProFormSelect
        label="节点类型"
        name="calculationType"
        placeholder="请选择 取值 or 复合"
        rules={[{ required: true, message: '必选' }]}
        options={[
          { label: '取值', value: 'source' },
          { label: '复合', value: 'custom' },
        ]}
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 14 }}
      />
      <ProFormSelect
        label="节点分组"
        name="calculationGroupId"
        placeholder="请选择节点分组"
        rules={[{ required: true, message: '必选' }]}
        options={calculationGroupSelect}
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 14 }}
      />
      {nodeType === 'source' && (
        <>
          <ProFormSelect
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 14 }}
            label="数据视图"
            name="dataViewId"
            placeholder="请选择节点分组"
            rules={[{ required: true, message: '必选' }]}
            options={dataSourceSelect}
            fieldProps={{
              showSearch: false,
              labelInValue: true,
              onSelect: async (value: any) => {
                formRef?.current?.setFieldsValue({ dataViewId: value });
                const result = await queryTableById({ id: value.value[0] });
                setParamNameSelect(result);
              },
            }}
          />
          <ProFormList
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 14 }}
            label="结果因子"
            name="result"
            labelAlign="right"
            layout={'horizontal'}
            itemContainerRender={(doms: any) => {
              return <ProForm.Group>{doms}</ProForm.Group>;
            }}
            initialValue={[{}]}
            min={1}
            max={1}
          >
            <ProFormSelect
              label="参数名称"
              name="paramName"
              placeholder="请选择"
              rules={[{ required: true, message: '必选' }]}
              options={paramNameSelect}
              min={1}
              max={1}
              labelCol={{ span: 6 }}
              width={'xl'}
              fieldProps={{
                showSearch: false,
                onSelect: (value: any) => {
                  formRef?.current?.setFieldsValue({
                    result: [
                      {
                        paramName: value,
                        fieldType: paramNameSelect?.find((item: any) => item.columnName === value)
                          ?.dataType,
                      },
                    ],
                  });
                },
              }}
            />
            <ProFormText label="字段类型" name="fieldType" width={'xl'} labelCol={{ span: 6 }} />
            <ProFormText label="描述" name="paramDesc" width={'xl'} labelCol={{ span: 6 }} />
            <ProFormText label="公式" name="fieldFormula" width={'xl'} labelCol={{ span: 6 }} />
          </ProFormList>
          <ProFormList
            label="维度因子"
            name="dimension"
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 14 }}
            itemContainerRender={(doms: any) => {
              return <ProForm.Group labelLayout="inline">{doms}</ProForm.Group>;
            }}
            copyIconProps={false}
            min={1}
            max={1}
          >
            <ProFormSelect
              label="参数名称"
              name="paramName"
              placeholder="请选择"
              rules={[{ required: true, message: '必选' }]}
              options={paramNameSelect}
              max={1}
              labelCol={{ span: 6 }}
              width={'xl'}
              fieldProps={{
                showSearch: false,
                onSelect: (value: any) => {
                  formRef?.current?.setFieldsValue({
                    dimension: [
                      {
                        paramName: value,
                        fieldType: paramNameSelect?.find((item: any) => item.columnName === value)
                          ?.dataType,
                      },
                    ],
                  });
                },
              }}
            />
            <ProFormText label="字段类型" name="fieldType" width={'xl'} labelCol={{ span: 6 }} />
            <ProFormText label="描述" name="paramDesc" width={'xl'} labelCol={{ span: 6 }} />
          </ProFormList>
          <>
            <div style={{ display: 'none' }}>
              <ProFormText name="calculationId" />
              <ProFormText name="originCalculationId" />
            </div>
            <ProCardPlus
              ghost
              style={{ padding: '12px', width: '100%' }}
              title="过滤条件"
              extra={
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => setShowConditionAdd(true)}
                >
                  新建
                </Button>
              }
            >
              <>
                <EditableProTable
                  editableFormRef={editableFormRef}
                  columns={columns}
                  name="filterConditionList"
                  rowKey="id"
                  scroll={{
                    x: true,
                  }}
                  min={1}
                  recordCreatorProps={false}
                  editable={{
                    type: 'multiple',
                    editableKeys,
                    actionRender: (row: any) => {
                      return [
                        <Button type="link" onClick={() => edits(row)}>
                          编辑
                        </Button>,
                        <Popconfirm
                          title="您确定要删除吗？"
                          onConfirm={() => {
                            deletes(row);
                            message.success('删除成功');
                          }}
                          onCancel={() => {
                            message.success('取消删除');
                          }}
                          okText="确定"
                          cancelText="取消"
                        >
                          <Button type="link">删除</Button>
                        </Popconfirm>,
                      ];
                    },
                    onChange: setEditableRowKeys,
                  }}
                />

                {/** 新建表单 */}
                <ConditionForm
                  title="新增"
                  key="add"
                  type="add"
                  visible={showConditionAdd}
                  paramNameSelect={paramNameSelect}
                  onFinish={(values: any) => {
                    let newData: any = [];
                    if (editableFormRef?.current?.getFieldsValue()?.filterConditionList) {
                      newData = [
                        ...editableFormRef?.current?.getFieldsValue()?.filterConditionList,
                        values,
                      ];
                    } else {
                      newData.push(values);
                    }
                    editableFormRef?.current.setFieldsValue({
                      filterConditionList: newData,
                    });

                    setEditableRowKeys(newData.map((item: any, index: any) => index));
                    setShowConditionAdd(false);
                  }}
                  onVisibleChange={setShowConditionAdd}
                />

                {/** 编辑表单 */}
                <ConditionForm
                  title="编辑"
                  key="edit"
                  type="edit"
                  initialValues={editData}
                  visible={showConditionEdit}
                  paramNameSelect={paramNameSelect}
                  onFinish={(values: any) => {
                    const newData: any = [
                      ...editableFormRef?.current.getFieldsValue().filterConditionList,
                    ];
                    const idx: any = newData?.findIndex((v: any) => v.id === values.id);
                    newData[idx] = values;
                    editableFormRef?.current.setFieldsValue({
                      filterConditionList: newData,
                    });
                    setEditableRowKeys(newData?.map((item: any, index: number) => index));
                    setShowConditionEdit(false);
                  }}
                  onVisibleChange={setShowConditionEdit}
                />
              </>
            </ProCardPlus>
          </>
        </>
      )}
      {nodeType === 'custom' && (
        <Composite initialValues={initialValues} type={type} form={formRef} />
      )}
    </ModalForm>
  );
};

export default MyForm;
