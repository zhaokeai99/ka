import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { Form, Input, message, Modal, Select } from 'antd';
import type { ProColumns } from '@ant-design/pro-table';
import { EditableProTable } from '@ant-design/pro-table';
import type { DataSourceType } from '../service';
import {
  MpBenchmarkQuerySecurities,
  MpBmComplexAddList,
  MpBmComplexEditList,
  MpBmComplexQuery,
} from '../service';
import lodash from 'lodash';

const { Option } = Select;
const SelectSecurity = ({ value, onChange }: any) => {
  const ref = useRef<any>();

  const [selectState, setSelectState] = useState<any>({ data: [], value: undefined });
  const [openStatus, setOpenStatus] = useState<boolean>(false);

  const dicInit = () => {
    if (value !== undefined) {
      setSelectState({ data: [value], value: undefined });
    }
  };

  useEffect(() => {
    // 加截字典
    dicInit();
  }, []);

  const handleChange = (e: any) => {
    const target = lodash.find(selectState.data, { indexCode: e });
    onChange?.(target);
    setSelectState({ ...selectState, value: e });
    setOpenStatus(false);
  };

  const transData = (list: any[]) => {
    if (list === undefined || list === null || list === []) {
      return [];
    }
    const rlt = list.map((item) => {
      return {
        indexCode: item.securitiesCode,
        indexName: item.securitiesName,
        indexSysName: item.indexSysName,
        indexClassPath: item.indexClassPath,
      };
    });
    return rlt;
  };

  let timeout: any;
  let currentValue: any;
  const fetch = (v: any, callback: any) => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    currentValue = v;

    const fake = async () => {
      const result = await MpBenchmarkQuerySecurities({ securitiesCode: v });

      if (currentValue === v) {
        const data = transData(result);
        callback(data);
      }
    };

    timeout = setTimeout(fake, 1000);
  };
  const handleSearch = async (v: any) => {
    if (v) {
      fetch(v, (data: any) => {
        setSelectState({ value: v, data });
        // @ts-ignore
        ref?.current.focus();
        setOpenStatus(true);
      });
    } else {
      setSelectState({ data: [] });
    }
  };

  return (
    <>
      <Select
        ref={ref}
        open={openStatus}
        showSearch
        value={value?.indexCode}
        placeholder={'请选择'}
        defaultActiveFirstOption={false}
        showArrow={false}
        filterOption={false}
        onFocus={() => {
          setOpenStatus(true);
        }}
        onBlur={() => {
          setOpenStatus(false);
        }}
        onSearch={handleSearch}
        onChange={handleChange}
        notFoundContent={null}
        key={(Math.random() * -1000000).toFixed(0)}
      >
        {selectState?.data.map((d: { indexCode: any; indexName: any }) => (
          <Option key={d.indexCode}>{d.indexName}</Option>
        ))}
      </Select>
    </>
  );
};

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
};

interface ModalProps {
  visible: boolean;
  modalType: string;
  initValues?: any;
  mpDomain?: any;
  onClose: (val?: string) => void;
}

// 弹窗
const BenchmarksModal = (props: ModalProps) => {
  const { visible, modalType, mpDomain, initValues } = props;
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>(() => []);
  const [weights, setWeights] = useState<number>(0);
  const [editKeys, setEditKeys] = useState<any[]>([]);

  const [benchmarksForm] = Form.useForm();

  useEffect(() => {
    // 加截字典
    setEditKeys([]);
  }, [initValues.id]);

  const indexDataHandle = (data: any[]) => {
    return data.map((item) => {
      return {
        ...item,
        securities: {
          indexCode: item.indexCode,
          indexName: item.indexName,
          indexSysName: item.indexSysName,
          indexClassPath: item.indexClassPath,
        },
      };
    });
  };

  const dataRepart = (data: any[]) => {
    const d = lodash.countBy(data, 'indexCode');
    let str = '',
      isErr = false;
    for (const k in d) {
      if (d[k] > 1) {
        str = str + k + ',';
        isErr = true;
      }
    }
    if (isErr) {
      message.error(str + ' 指标代码重复');
      return false;
    }
    //单项有0
    {
      let zero = false,
        name = '';
      data.map((item: any) => {
        const w = item.weight;
        if (w === undefined || w === 0 || Number.parseFloat(w) === 0) {
          zero = true;
          name = item.indexName;
        }
      });
      if (zero) {
        message.warn(name + '权重为0!');
        return false;
      }
    }
    //指标合计为0
    {
      let w = 0;
      data.map((item: any) => {
        w = w + item.weight;
      });
      if (w !== 100) {
        message.warn('指标合计不为100');
        return false;
      }
    }
    return true;
  };

  const setWeightsByList = (list: any[]) => {
    let w = 0;
    list.map((item) => {
      w = w + Number.parseFloat(item.weight);
    });
    setWeights(w);
  };

  const loadEditValue = async (info: any) => {
    const result = await MpBmComplexQuery({ domain: info.domain, bmCode: info.bmCode });
    if (result) {
      const list = indexDataHandle(result);
      benchmarksForm.setFieldsValue({
        domain: result[0].domain,
        bmCode: info.bmCode,
        bmName: info.bmName,
        list: JSON.stringify(list),
      });
      setWeightsByList(list);
      setDataSource(list);
    } else {
      props.onClose('cancel');
      message.error('未找到相关记录');
    }
  };

  useEffect(() => {
    if (props.visible && props.modalType === 'edit') {
      // 如果是编辑操作,回显数据
      loadEditValue(initValues);
    }
  }, [props]);

  const handleOk = useCallback(async () => {
    const values = await benchmarksForm?.validateFields();
    if (values.list === undefined || values.list === null || values.list === '') {
      message.warn('请添加指标');
      return;
    }

    if (dataSource.length === 0) {
      message.warn('请添加指标');
      return;
    }
    if (!dataRepart(dataSource)) {
      return;
    }

    setConfirmLoading(true);
    const list = dataSource.map((n: any) => {
      return {
        id: n.id,
        indexClassPath: n.indexClassPath,
        indexCode: n.indexCode,
        indexName: n.indexName,
        indexSysName: n.indexSysName,
        weight: n.weight,
      };
    });
    const params = {
      bmCode: values.bmCode,
      bmName: values.bmName,
      domain: values.domain,
      list: list,
    };
    let result: any = {};
    if (modalType === 'edit') {
      result = await MpBmComplexEditList(params);
    } else {
      result = await MpBmComplexAddList(params);
    }
    if (result.success) {
      message.success('保存成功');
      props.onClose('reload');
      setConfirmLoading(false);
      return;
    }
    setConfirmLoading(false);
    message.error(result.errorMsg);
  }, [dataSource]);

  const handleCancel = () => {
    setDataSource([]);
    setWeights(0);
    props.onClose('cancel');
  };

  const tableChangeHandle = (data: any) => {
    //计算
    let sum = 0,
      sumEdited = 0,
      cts = 0;
    let target = data.map((n: any) => {
      const tgt = lodash.indexOf(editKeys, n.id);
      if (tgt < 0) {
        sum = sum + n.weight;
        cts = cts + 1;
      } else {
        sumEdited = sumEdited + n.weight;
      }
      return { ...n, ...n.securities };
    });
    //计算
    let sumAdd = 0,
      ctsAdd = 0;
    target = target.map((n: any) => {
      const tgt = lodash.indexOf(editKeys, n.id);
      if (tgt < 0) {
        ctsAdd = ctsAdd + 1;
        const tgtWeight = (n.weight / sum) * (100 - sumEdited);
        let w = Number.parseFloat(tgtWeight.toFixed(2));
        if (ctsAdd === cts) {
          w = 100 - sumEdited - sumAdd;
        }
        if (w < 0) {
          n.weigth = 0;
        } else {
          n.weight = Number.parseFloat(w.toFixed(2));
        }
        sumAdd = sumAdd + w;
      }
      return n;
    });

    benchmarksForm.setFieldsValue({ list: JSON.stringify(target) });
    setDataSource(target);
    setWeightsByList(target);
  };

  const rowDelete = (record: DataSourceType) => {
    const target = dataSource.filter((item) => item.id !== record.id);
    benchmarksForm.setFieldsValue({ list: JSON.stringify(target) });
    setDataSource([...target]);
    setWeightsByList(target);
  };

  const rowSave = async (rowKey: any) => {
    editKeys.push(rowKey);
    setEditKeys([...editKeys]);
  };

  const columns: ProColumns<DataSourceType>[] = [
    {
      title: '指标代码',
      dataIndex: 'securities',
      width: '50%',
      renderFormItem: () => <SelectSecurity />,
      render: (text, record) => {
        return record?.indexName;
      },
      formItemProps: () => {
        return {
          rules: [{ required: true, message: '此项为必填项' }],
        };
      },
    },
    {
      title: '权重(%)',
      dataIndex: 'weight',
      width: '30%',
      valueType: 'digit',
      fieldProps: () => {
        return { max: 100, min: 0 };
      },
      formItemProps: () => {
        return {
          rules: [{ required: true, message: '此项为必填项' }],
        };
      },
    },
    {
      title: '操作',
      valueType: 'option',
      width: '20%',
      render: (text, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
            setDataSource(dataSource);
            action?.startEditable?.(record.id);
          }}
        >
          编辑
        </a>,
        <a
          key="delete"
          onClick={() => {
            rowDelete(record);
          }}
        >
          删除
        </a>,
      ],
    },
  ];
  return (
    <Modal
      title={modalType === 'add' ? '创建基准' : '编辑基准'}
      width={'40%'}
      visible={visible}
      onOk={handleOk}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
      maskClosable={false}
      destroyOnClose={true}
    >
      <Form {...layout} form={benchmarksForm} preserve={false}>
        <Form.Item name="id" hidden={true}>
          <Input hidden={true} />
        </Form.Item>
        <Form.Item name="list" hidden={true}>
          <Input hidden={true} />
        </Form.Item>
        <Form.Item
          name="domain"
          label={'业务域'}
          rules={[{ required: true, message: '请选择业务域!' }]}
        >
          <Select
            placeholder="请选择业务域"
            disabled={modalType !== 'add'}
            showSearch
            optionFilterProp="children"
          >
            {mpDomain.map((val: any) => (
              <Option key={val?.value} value={val?.value}>
                {val?.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="bmCode"
          label={'基准代码'}
          rules={[{ required: true, message: '请填写基准代码!' }]}
        >
          <Input maxLength={20} placeholder={'请输入基准代码'} disabled={modalType !== 'add'} />
        </Form.Item>
        <Form.Item
          name="bmName"
          label={'基准名称'}
          rules={[{ required: true, message: '请填写基准名称!' }]}
        >
          <Input maxLength={200} placeholder={'请输入基准名称'} />
        </Form.Item>
      </Form>
      <EditableProTable<DataSourceType>
        rowKey="id"
        headerTitle={
          <span style={{ color: 'red' }}>权重合计：{Number.parseFloat(weights.toFixed(2))}%</span>
        }
        recordCreatorProps={{
          position: 'bottom',
          record: () => ({ id: (Math.random() * -1000000).toFixed(0) }),
        }}
        columns={columns}
        value={dataSource}
        onChange={tableChangeHandle}
        editable={{
          type: 'multiple',
          editableKeys,
          onChange: setEditableRowKeys,
          onSave: rowSave,
        }}
      />
    </Modal>
  );
};

export default memo(BenchmarksModal);
