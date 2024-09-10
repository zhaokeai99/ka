import { useState, useCallback, useEffect } from 'react';
import { Select, Tabs, Button } from 'antd';
import TabContent from './TabContent';
import ProCardPlus from '@/components/ProCardPlus';
import { history } from 'umi';
import { getAllTemplate } from './service';
import styles from './index.less';

const FixedIncomePage: React.FC = () => {
  const [templateOptions, setTemplateOptions] = useState([]);

  const [activeKey, setActiveKey] = useState('');
  const [items, setItems] = useState([]);

  useEffect(() => {
    getAllTemplate()
      .then((res) => {
        if (res.success && res.data) {
          const selectOptions = [];
          res.data.forEach((item) => {
            if (item) {
              selectOptions.push({ value: item.modelId, label: item.modelName || item.modelId });
            }
          });

          setTemplateOptions(selectOptions);
        }
      })
      .catch((e) => console.log(e));
  }, []);

  // add 时检查是否存在，存在就不添加，不存在就添加。添加完毕要把tab设置一下
  const add = useCallback(
    (option) => {
      if (option && option.value) {
        let hasItem = false;
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          if (item && item.key === (option && option.value)) {
            hasItem = true;
          }
        }
        if (!hasItem && option && option.value) {
          setItems([
            ...items,
            {
              label: option && option.label,
              children: (
                <TabContent
                  downloadName={option && option.label}
                  templateId={option && option.value}
                ></TabContent>
              ),
              key: option && option.value,
            },
          ]);
        }
        setActiveKey(option && option.value);
      }
    },
    [items],
  );

  const remove = useCallback(
    (targetKey: string) => {
      const targetIndex = items.findIndex((pane) => pane.key === targetKey);
      const newPanes = items.filter((pane) => pane.key !== targetKey);
      if (newPanes.length && targetKey === activeKey) {
        const { key } = newPanes[targetIndex === newPanes.length ? targetIndex - 1 : targetIndex];
        setActiveKey(key);
      }
      setItems(newPanes);
    },
    [items],
  );

  const onEdit = useCallback(
    (targetKey: string, action: 'add' | 'remove') => {
      if (action === 'remove') {
        remove(targetKey);
      }
    },
    [remove],
  );

  const handleModuleChange = useCallback(
    (value, option) => {
      add(option);
    },
    [add],
  );

  // tabs add delete
  const onChange = (key: string) => {
    setActiveKey(key);
  };

  return (
    <ProCardPlus
      ghost
      className={styles.outCard}
      sn="_investment_creditRisks_fixedIncome__fixedIncomePage"
    >
      <div className={styles.templatesChooseContainer}>
        <span>请选择模型：</span>
        <Select
          defaultValue={(templateOptions[0] && templateOptions[0].value) || ''}
          style={{ width: 220 }}
          onChange={handleModuleChange}
          options={templateOptions}
          showSearch={true}
          optionFilterProp="label"
          allowClear
        />
        <Button
          style={{ marginLeft: 32 }}
          type="primary"
          onClick={() => history.push('/data_browser/index')}
        >
          数据浏览器
        </Button>
      </div>
      {items && items.length > 0 && (
        <Tabs
          style={{ minHeight: 420 }}
          hideAdd
          onChange={onChange}
          activeKey={activeKey}
          type="editable-card"
          onEdit={onEdit}
          items={items}
        />
      )}
      {(!items || items.length === 0) && (
        <div className={styles.emptyView}>请选择模型来查询数据。</div>
      )}
    </ProCardPlus>
  );
};

export default FixedIncomePage;
