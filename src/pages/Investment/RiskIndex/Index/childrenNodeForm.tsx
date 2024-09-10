import ProForm, { ModalForm, ProFormSelect, ProFormText } from '@ant-design/pro-form';
import { useEffect, useState } from 'react';
import { getNodeByOriginIdAndNodeId, getPublishIndexNodeList } from './service';
import { filter as _filter, findIndex as _findIndex } from 'lodash';
import ProCardPlus from '@/components/ProCardPlus';
import { Button, message, Popconfirm } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ConditionForm from './conditionForm';
import { EditableProTable } from '@ant-design/pro-components';

const columns: any = [
  // {
  //   title: '',
  //   dataIndex: 'paramName',
  //   hideInTable: true
  // },
  {
    title: '参数名称',
    dataIndex: 'paramValue',
    readonly: true,
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

const ChildrenNodeForm = (props: any) => {
  const [indexNode, setIndexNode] = useState<any>([]);
  const [showFilterList, setShowFilterList] = useState(false);
  const [filterEditData, setFilterEditData] = useState();
  const [showConditionEdit, setShowConditionEdit] = useState(false);
  const [childId, setChildId] = useState('');
  const [keyWord, setKeyWord] = useState('');
  const [paramValue, setParamValue] = useState();
  const [editableKeys, setEditableRowKeys] = useState([]);

  const edits = (data: any) => {
    setShowConditionEdit(true);
    setFilterEditData(data);
  };

  const deletes = (data: any) => {
    const childFilterConditionList =
      props?.editableFormRef?.current?.getFieldsValue()?.childFilterConditionList;
    const paramValueIndex = _findIndex(childFilterConditionList, { paramValue: data?.paramValue });
    const newData = [...childFilterConditionList];
    newData.splice(paramValueIndex, 1);
    props?.editableFormRef?.current?.setFieldsValue({
      childFilterConditionList: newData,
    });
  };

  const getParamValue = async (id: string, name: string) => {
    if (id) {
      const list = await getPublishIndexNodeList({
        calculationName: name,
      });
      const data = _filter(list, { calculationId: id });
      const newData = await getNodeByOriginIdAndNodeId({
        calculationId: data[0]?.calculationId,
        originCalculationId: data[0]?.originCalculationId,
      });
      let filterData: any = _filter(newData?.filterConditionList, {
        paramValueType: 'variable',
      });
      filterData = filterData?.map((item: { paramValue: any; paramName: any }) => {
        return {
          ...item,
          value: item?.paramValue,
          label: item?.paramValue,
        };
      });
      setParamValue(filterData);
    }
  };

  useEffect(() => {
    if (props?.title === '编辑') {
      props?.formRef?.current?.setFieldsValue(props?.initialValues);
    }
    if (props?.initialValues?.childFilterConditionList) {
      setEditableRowKeys(
        props?.initialValues.childFilterConditionList?.map((_: any, index: number) => index),
      );
    }
    getParamValue(props?.initialValues?.childId, props?.initialValues?.childName);
  }, [props]);

  useEffect(() => {
    getParamValue(childId, keyWord || '');
  }, [childId]);

  return (
    <ModalForm {...props}>
      <ProForm.Group>
        <ProFormSelect
          label="节点名称"
          width="md"
          name="childName"
          placeholder="请选择"
          showSearch
          debounceTime={300}
          request={async ({ keyWords }) => {
            setKeyWord(keyWords);
            const data = await getPublishIndexNodeList({
              calculationName: keyWords,
            });
            setIndexNode(data);
            return data;
          }}
          fieldProps={{
            onChange: (value) => {
              if (props?.initialValues?.childId !== value) {
                props?.formRef?.current?.setFieldsValue({
                  childFilterConditionList: [],
                });
              }
              setChildId(value);
              props?.formRef?.current?.setFieldsValue({
                childName: _filter(indexNode, { value: value })[0]?.calculationName,
                childTreeType: _filter(indexNode, { value: value })[0]?.calculationType,
              });
            },
          }}
          rules={[{ required: true, message: '必选' }]}
          options={indexNode}
        />
        <ProFormSelect
          label="节点类型"
          width="md"
          disabled
          name="childTreeType"
          placeholder="请选择"
          rules={[{ required: true, message: '必选' }]}
          options={[
            {
              label: '复合',
              value: 'custom',
            },
            {
              label: '取值',
              value: 'source',
            },
          ]}
        />
      </ProForm.Group>
      <ProForm.Group title="因子信息">
        <ProFormText width={'sm'} disabled name="childName" label="节点名称" />
        <ProFormText
          width={'sm'}
          name="alias"
          rules={[{ required: true, message: '必选' }]}
          label="别名"
        />
        <ProFormText width={'sm'} name="defaultValue" label="默认值" />
      </ProForm.Group>
      <ProCardPlus
        ghost
        style={{ padding: '12px', width: '100%' }}
        title="过滤条件"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setShowFilterList(true)}>
            新建
          </Button>
        }
      >
        <EditableProTable
          editableFormRef={props?.editableFormRef}
          columns={columns}
          name="childFilterConditionList"
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
      </ProCardPlus>

      <ConditionForm
        title="新增"
        key="add"
        type="add"
        nodeType="custom"
        paramNameSelect={paramValue}
        childId={childId}
        visible={showFilterList}
        onFinish={async (values: any) => {
          let newData: any = [];
          const childFilterConditionList =
            props?.editableFormRef?.current?.getFieldsValue()?.childFilterConditionList;
          const paramValueIndex = _findIndex(childFilterConditionList, {
            paramValue: values?.paramValue,
          });

          if (paramValueIndex === -1) {
            if (childFilterConditionList) {
              newData = [...childFilterConditionList, { ...values }];
            } else {
              newData.push({ ...values });
            }
            props?.editableFormRef?.current.setFieldsValue({
              childFilterConditionList: newData,
            });
            setEditableRowKeys(newData.map((item: any, index: any) => index));
            message.success('添加成功');
            setShowFilterList(false);
          } else {
            message.error('该别名已经存在，请更改别名');
          }
        }}
        onVisibleChange={setShowFilterList}
      />

      <ConditionForm
        title="编辑"
        key="edit"
        type="edit"
        nodeType="custom"
        childData={indexNode}
        paramNameSelect={paramValue}
        initialValues={filterEditData}
        visible={showConditionEdit}
        onFinish={(values: any) => {
          const childFilterConditionList =
            props?.editableFormRef?.current?.getFieldsValue()?.childFilterConditionList;
          const paramValueIndex = _findIndex(childFilterConditionList, {
            paramValue: values?.paramValue,
          });
          const newData: any = [...childFilterConditionList];
          if (filterEditData?.paramValue === values?.paramValue || paramValueIndex === -1) {
            const idx: any = newData?.findIndex((v: any) => v.id === values.id);
            newData[idx] = values;
            console.log(newData);
            props?.editableFormRef?.current.setFieldsValue({
              childFilterConditionList: newData,
            });
            setEditableRowKeys(newData?.map((item: any, index: number) => index));
            setShowConditionEdit(false);
          } else {
            message.error('该别名已经存在，请更改别名');
          }
          setShowConditionEdit(false);
        }}
        onVisibleChange={setShowConditionEdit}
      />
    </ModalForm>
  );
};

export default ChildrenNodeForm;
