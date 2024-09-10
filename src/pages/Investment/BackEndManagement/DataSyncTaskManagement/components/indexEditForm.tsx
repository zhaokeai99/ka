import React, { memo, useState } from 'react';
import { message, AutoComplete } from 'antd';
import { ModalForm, ProForm, ProFormText, ProFormTextArea } from '@ant-design/pro-components';

interface ModalProps {
  initForm: any;
  visible: boolean;
  onFinish: (info: any) => void;
  onCancel: () => void;
}

const esDatatype = [
  'keyword',
  'text',
  'date',
  'array',
  'object',
  'nested',
  'geo_point',
  'geo_shape',
  'integer',
  'long',
  'short',
  'btye',
  'double',
  'float',
  'half_float',
  'scaled_float',
  'boolean',
  'range',
  'binary',
  'ip',
  'completion',
  'token_count',
  'attachment',
  'percolator',
];

function isJson(str: any) {
  if (typeof str === 'string') {
    try {
      const obj = JSON.parse(str);
      if (typeof obj === 'object' && obj) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  }
  return false;
}

function fuzzyQuery(list: any[], keyWord: string) {
  const arr = [];
  const reg = new RegExp(keyWord);
  for (let i = 0; i < list.length; i++) {
    if (reg.test(list[i])) {
      arr.push(list[i]);
    }
  }
  return arr;
}

const IndexEditInfo = (props: ModalProps) => {
  const { visible, initForm, onFinish, onCancel } = props;
  const [options, setOptions] = useState<{ value: string }[]>([]);

  const onSearch = (searchText: string) => {
    const f = fuzzyQuery(esDatatype, searchText);
    setOptions(f);
  };

  const save = (values: any) => {
    let me = values.mappingExpand;
    if (me !== undefined) {
      me = me.replace(' ', '');
      if (me !== '' && (me.substring(0, 1) !== '{' || !isJson(me))) {
        message.error('扩展字段，格式为json串');
        return false;
      }
      if (me === '') {
        values.mappingExpand = undefined;
      }
    }
    onFinish(values);
    return true;
  };

  return (
    <>
      <ModalForm
        title="索引映射维护"
        autoFocusFirstInput
        modalProps={{
          onCancel: () => onCancel(),
          destroyOnClose: true,
        }}
        visible={visible}
        submitTimeout={2000}
        onFinish={async (values) => {
          return save(values);
        }}
        initialValues={initForm}
        layout={'horizontal'}
      >
        <ProFormText width="md" name="columnName" label="原表字段" disabled={true} />
        <ProFormText width="md" name="mappingName" label="索引字段" />
        <ProForm.Item name="mappingType" label="索引类型">
          <AutoComplete dataSource={options} style={{ width: '328px' }} onSearch={onSearch} />
        </ProForm.Item>
        <ProFormTextArea width="md" name="mappingExpand" label="扩展字段" />
      </ModalForm>
    </>
  );
};

export default memo(IndexEditInfo);
