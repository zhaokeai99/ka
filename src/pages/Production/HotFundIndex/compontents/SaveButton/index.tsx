import { memo, useState } from 'react';
import { Button, Popover, Space, Radio, Select, Input, message } from 'antd';
import { saveSolution } from '../../service';
import propSchemes from './scheme';

const { Option } = Select;

const SaveButton: React.FC<any> = ({
  name,
  params,
  results,
  codeOrName,
  searcherType,
  schemes = propSchemes,
}) => {
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [type, setType] = useState('new');
  const [schemeName, setSchemeName] = useState('');
  const [currentScheme, setCurrentScheme] = useState(null);
  const [inputStatus, setInputStatus] = useState({
    status: '',
    placeholder: '请设置方案名称',
  });
  const [selectStatus, setSelectStatus] = useState({
    status: '',
    placeholder: '请选择方案',
  });

  const handleTypeChange = (e) => {
    setType(e.target.value);
    setSchemeName('');
  };

  const handleSchemeChange = (id) => {
    setSelectStatus({
      status: '',
      placeholder: '请选择方案',
    });
    setCurrentScheme(id);
  };

  const onInputChange = (e) => {
    setSchemeName(e.target.value);
    setInputStatus({
      status: '',
      placeholder: '请设置方案名称',
    });
  };

  const onSave = async () => {
    if (type === 'new') {
      if (!schemeName) {
        setInputStatus({
          status: 'error',
          placeholder: '必填项',
        });

        return;
      }
    }

    if (type === 'old') {
      if (!currentScheme) {
        setSelectStatus({
          status: 'error',
          placeholder: '请选择方案',
        });

        return;
      }
    }

    setLoading(true);
    const { success } = await saveSolution({
      ...(type === 'old' && { id: currentScheme }),
      ...(type === 'new' && { name: schemeName }),
      searchModel: {
        codeOrName,
        params,
        results,
      },
      searcherType,
    });
    setLoading(false);

    if (!success) {
      return;
    }

    message.success('方案保存成功！');

    setVisible(false);

    // 还原
    setSchemeName('');
    setCurrentScheme(null);
    setInputStatus({
      status: '',
      placeholder: '请设置方案名称',
    });
    setSelectStatus({
      status: '',
      placeholder: '请选择方案',
    });
  };

  const content = (
    <Space size={1}>
      <Radio.Group buttonStyle="solid" defaultValue={type} onChange={handleTypeChange}>
        <Radio.Button value="new">新建</Radio.Button>
        <Radio.Button value="old">历史</Radio.Button>
      </Radio.Group>
      {type === 'new' && (
        <Input
          status={inputStatus.status}
          value={schemeName}
          style={{ width: '200px' }}
          placeholder={inputStatus.placeholder}
          onChange={onInputChange}
        />
      )}
      {type === 'old' && (
        <Select
          value={currentScheme}
          status={selectStatus.status}
          placeholder={selectStatus.placeholder}
          style={{ width: '200px' }}
          onChange={handleSchemeChange}
        >
          {(schemes || []).map(({ name: n, id }: any) => (
            <Option key={id} value={id}>
              {n}
            </Option>
          ))}
        </Select>
      )}
      <Button type="primary" onClick={onSave}>
        保存
      </Button>
    </Space>
  );

  return (
    <Popover
      content={content}
      trigger="click"
      visible={visible}
      onVisibleChange={(v) => setVisible(v)}
    >
      <Button loading={loading} type="primary">
        {name}
      </Button>
    </Popover>
  );
};

export default memo(SaveButton);
