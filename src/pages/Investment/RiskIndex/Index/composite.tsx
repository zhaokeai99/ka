import ProCardPlus from '@/components/ProCardPlus';
import { PlusOutlined } from '@ant-design/icons';
import ProCard from '@ant-design/pro-card';
import { Button, message, Popconfirm, Space } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import ChildrenNodeForm from './childrenNodeForm';
import { getPublishIndexNodeList } from './service';
import { filter as _filter, findIndex as _findIndex, uniqBy as _uniqBy } from 'lodash';
import { ProFormList, ProFormText } from '@ant-design/pro-form';
import { EditableProTable } from '@ant-design/pro-components';

const filterColumns = [
  {
    title: '英文key',
    dataIndex: 'paramValue',
  },
  {
    title: '中文别名',
    dataIndex: 'paramDesc',
  },
  {
    title: '字段类型',
    dataIndex: 'fieldType',
  },
  {
    title: '条件类型',
    dataIndex: 'conditionType',
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
];

const Composite = ({ form, type, initialValues }: any) => {
  const formRef = useRef();
  const editableFormRef = useRef();
  const childNodeFormRef = useRef();
  const filterFormRef = useRef();
  const [showConditionAdd, setShowConditionAdd] = useState(false);
  const [childNodeFormTitle, setChildNodeFormTitle] = useState('add');
  const [editData, setEditData] = useState<any[]>([]);
  const [childNodeKeys, setChildNodeKeys] = useState([]);

  const getFilterList = (newData: any) => {
    // 筛选本身节点过滤条件
    const data: any[] = [];
    newData.forEach((item: { childFilterConditionList: any }) => {
      if (item?.childFilterConditionList) {
        data.push(..._filter(item?.childFilterConditionList, { paramValueType: 'variable' }));
      }
    });
    form?.current?.setFieldsValue({
      filterConditionList: _uniqBy(data, 'paramValue'),
    });
  };

  const deletes = async (data: any) => {
    const childNodeList = form?.current?.getFieldsValue()?.childNodeList;
    const paramValueIndex = _findIndex(childNodeList, { alias: data?.alias });
    const newData: any = [...childNodeList];
    newData.splice(paramValueIndex, 1);
    form?.current?.setFieldsValue({
      childNodeList: newData,
    });
    getFilterList(newData);
    setChildNodeKeys(newData.map((item: any, index: any) => index));
  };

  const columns = [
    {
      title: '节点名称',
      dataIndex: 'childName',
      readonly: true,
    },
    {
      title: '别名(公式中使用)',
      readonly: true,
      dataIndex: 'alias',
    },
    {
      title: '默认值(当计算为空时)',
      readonly: true,
      dataIndex: 'defaultValue',
    },
    {
      title: '操作',
      render: (value: any) => {
        return (
          <Space>
            <Button
              type="link"
              onClick={() => {
                setChildNodeFormTitle('edit');
                setShowConditionAdd(true);
                setEditData(value);
              }}
            >
              编辑
            </Button>
            <Popconfirm
              title="您确定要删除吗？"
              onConfirm={() => {
                deletes(value);
                message.success('删除成功');
              }}
              onCancel={() => {
                message.success('取消删除');
              }}
              okText="确定"
              cancelText="取消"
            >
              <Button type="link">删除</Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  useEffect(() => {
    if (type !== 'add') {
      form?.current?.setFieldsValue({
        ...initialValues,
        indexCalculationFormulaReq: [initialValues?.indexCalculationFormulaInfo],
        childNodeList: initialValues?.aliasList,
      });
      if (initialValues?.aliasList) {
        setChildNodeKeys(initialValues.aliasList?.map((item: any, index: number) => index));
      }
    }
  }, [type]);

  return (
    <ProCard ghost split="horizontal">
      <ProFormList
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 14 }}
        label="公式管理"
        name="indexCalculationFormulaReq"
        initialValue={[{}]}
        min={1}
        max={1}
      >
        <ProFormText
          width="xl"
          labelCol={{ span: 6 }}
          rules={[{ required: true, message: '必选' }]}
          name="calculationFormula"
          label="计算公式"
        />
        <ProFormText
          width="xl"
          labelCol={{ span: 6 }}
          rules={[{ required: true, message: '必选' }]}
          name="formulaValueName"
          label="字段名称"
        />
        <ProFormText
          width="xl"
          labelCol={{ span: 6 }}
          rules={[{ required: true, message: '必选' }]}
          name="alias"
          label="字段别名"
        />
      </ProFormList>
      <ProCardPlus
        ghost
        style={{ padding: '12px' }}
        title="子节点管理"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setShowConditionAdd(true);
              setChildNodeFormTitle('add');
            }}
          >
            新建
          </Button>
        }
      >
        <EditableProTable
          editableFormRef={childNodeFormRef}
          columns={columns}
          name="childNodeList"
          scroll={{
            x: true,
          }}
          min={1}
          recordCreatorProps={false}
          editable={{
            type: 'multiple',
            childNodeKeys,
            onChange: setChildNodeKeys,
          }}
        />
      </ProCardPlus>
      <ProCardPlus ghost style={{ padding: '12px' }} title="过滤条件">
        <EditableProTable
          editableFormRef={filterFormRef}
          columns={filterColumns}
          name="filterConditionList"
          rowKey="id"
          scroll={{
            x: true,
          }}
          min={1}
          recordCreatorProps={false}
        />
      </ProCardPlus>
      {/* 新增编辑子节点信息 */}
      <ChildrenNodeForm
        formRef={formRef}
        editableFormRef={editableFormRef}
        title={childNodeFormTitle === 'add' ? '新增' : '编辑'}
        visible={showConditionAdd}
        initialValues={childNodeFormTitle === 'add' ? {} : editData}
        modalProps={{
          destroyOnClose: true,
          onCancel: () => setShowConditionAdd(false),
        }}
        onFinish={async (value: any) => {
          const data = await getPublishIndexNodeList({
            calculationName: value?.childName,
          });
          if (data) {
            const childNodeList = form?.current?.getFieldsValue()?.childNodeList;
            const theSameAliasIndex = _findIndex(childNodeList, { alias: value?.alias });
            const childItem = {
              ...value,
              originChildId: _filter(data, { calculationName: value.childName })[0]
                ?.originCalculationId,
              childId: _filter(data, { calculationName: value.childName })[0]?.calculationId,
            };
            if (childNodeFormTitle === 'edit') {
              //判断别名是否有相同的
              if (editData?.alias === value?.alias || theSameAliasIndex === -1) {
                const childData: any = [...childNodeList];
                childData[theSameAliasIndex] = childItem;
                form?.current?.setFieldsValue({
                  childNodeList: childData,
                });
                getFilterList(childData);
                setChildNodeKeys(childData.map((item: any, index: any) => index));
                message.success('修改成功');
                setShowConditionAdd(false);
              } else {
                message.error('该别名已经存在，请更改别名');
              }
            } else {
              //判断别名是否有相同的
              if (theSameAliasIndex === -1) {
                let newData: any = [];
                if (form?.current?.getFieldsValue()?.childNodeList) {
                  newData = [...form?.current?.getFieldsValue()?.childNodeList, childItem];
                } else {
                  newData.push(childItem);
                }
                form?.current?.setFieldsValue({
                  childNodeList: newData,
                });
                getFilterList(newData);
                setChildNodeKeys(newData.map((item: any, index: any) => index));
                message.success('添加成功');
                setShowConditionAdd(false);
              } else {
                message.error('该别名已经存在，请更改别名');
              }
            }
          }
        }}
      />
    </ProCard>
  );
};

export default Composite;
