import React, { memo, useState, useEffect } from 'react';
import { Popover, Select, Space } from 'antd';
import { differenceBy as _differenceBy, map as _map, uniqBy as _uniqBy, get as _get } from 'lodash';

const { Option, OptGroup } = Select;
// const { TabPane } = Tabs;

const PopSelector: React.FC<any> = ({
  children,
  allData,
  schemeData,
  defaultData,
  callback,
  selectorWidth = 260,
}) => {
  // 获取所有分类
  const [categories] = useState(() =>
    _uniqBy(
      (allData || []).map(({ colCategoryDesc, colCategory }) => ({
        label: colCategoryDesc,
        value: colCategory,
        key: colCategory,
      })),
      'value',
    ),
  );
  const [currentCategory, setCurrentCategory] = useState(_get(categories, '[0].value', ''));
  // // data是用来传输的数据
  const [selectData, setSelectData] = useState([]);
  // options是为了显示的
  const [allOptions] = useState(() =>
    (allData || []).map(({ colName, colDesc, colCategory, disabled = false }) => ({
      label: colDesc,
      value: colName,
      key: colName,
      category: colCategory,
      disabled,
    })),
  );
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [unSelectedOptions, setUnSelectedOptions] = useState(() =>
    (allData || []).map(({ colName, colDesc, colCategory, disabled = false }) => ({
      label: colDesc,
      value: colName,
      key: colName,
      category: colCategory,
      disabled,
    })),
  );
  // // 方案
  // const [schemes] = useState(() =>
  //   (schemeData || []).map(({ id, name }) => ({ label: name, value: id, key: id })),
  // );
  // const [currentScheme, setCurrentScheme] = useState(null);

  // 选择标签
  const handleChange = (value: any) => {
    // 设置显示
    setSelectedOptions(value);
    setUnSelectedOptions(_differenceBy(allOptions, value, 'value'));

    // 找到所有选中的key
    const keys = _map(value, 'key');

    // 设置数据
    setSelectData(() =>
      allData.filter((d) => {
        const { colName } = d || {};
        return keys.includes(colName);
      }),
    );
  };

  // // 选择方案
  // const handleSchemeChange = (value) => {
  //   setCurrentScheme(value);
  //   const selectScheme = schemeData.find(({ id }) => id === value);
  //   const params = _get(selectScheme, 'searchModel.params', []);
  //   const results = _get(selectScheme, 'searchModel.results', []);
  //   const codeOrName = _get(selectScheme, 'searchModel.codeOrName', '');

  //   const finalData: any[] = [];

  //   params.forEach((param) => {
  //     const obj = allData.find((d) => d.colName === param.colName);
  //     finalData.push({
  //       ...obj,
  //       value: param.value,
  //     });
  //   });

  //   const options = finalData.map(({ colDesc, colName, colCategory, disabled = false }) => ({
  //     label: colDesc,
  //     value: colName,
  //     key: colName,
  //     category: colCategory,
  //     disabled,
  //   }));

  //   // 设置显示
  //   setSelectedOptions(options as any);
  //   setUnSelectedOptions(_differenceBy(allOptions, options, 'value'));

  //   // 设置数据
  //   setSelectData({
  //     callType: 'scheme',
  //     codeOrName,
  //     results,
  //     params: finalData as any,
  //   });
  // };

  // 监听defaultData变化，只用来设置内部显示，不会回传
  useEffect(() => {
    if (defaultData) {
      const finalData: any[] = [];

      defaultData.forEach((dd) => {
        const obj = allData.find((d) => d.colName === dd.colName);
        finalData.push({
          ...obj,
          value: dd.value,
        });
      });

      const options = finalData.map(({ colDesc, colName, colCategory, disabled = false }) => ({
        label: colDesc,
        value: colName,
        key: colName,
        category: colCategory,
        disabled,
      }));

      // 设置显示
      setSelectedOptions(options as any);
      setUnSelectedOptions(_differenceBy(allOptions, options, 'value'));
    }
  }, [defaultData]);

  // 监听selectData变化，触发回调
  useEffect(() => {
    if (callback) {
      callback(selectData);
    }
  }, [selectData]);

  const tagSelector = (
    <Space size={2}>
      <Select
        style={{ width: 110 }}
        defaultValue={currentCategory}
        onChange={(value) => setCurrentCategory(value)}
      >
        {categories.map(({ label, value, key }) => (
          <Option key={key} value={value}>
            {label}
          </Option>
        ))}
      </Select>
      <Select
        // allowClear
        labelInValue={true}
        mode="multiple"
        style={{ width: selectorWidth }}
        onChange={handleChange}
        maxTagCount="responsive"
        placeholder="选择筛选项"
        value={selectedOptions}
        showSearch={false}
      >
        <OptGroup label="已选中">
          {selectedOptions.map(({ label, value, key, disabled }) => (
            <Option key={key} value={value} disabled={disabled}>
              {label}
            </Option>
          ))}
        </OptGroup>
        <OptGroup label="未选中">
          {unSelectedOptions.map(({ label, value, key, category, disabled }: any) =>
            category === currentCategory ? (
              <Option key={key} value={value} disabled={disabled}>
                {label}
              </Option>
            ) : null,
          )}
        </OptGroup>
      </Select>
    </Space>
  );

  // const schemeTag = (
  //   <Space size={2}>
  //     历史方案选项：
  //     <Select
  //       value={currentScheme}
  //       placeholder="请选择方案"
  //       style={{ width: selectorWidth }}
  //       onChange={handleSchemeChange}
  //     >
  //       {(schemes || []).map(({ value, label, key }: any) => (
  //         <Option key={key} value={value}>
  //           {label}
  //         </Option>
  //       ))}
  //     </Select>
  //   </Space>
  // );

  // const tabTags = (
  //   <Tabs defaultActiveKey="tab1" size="small">
  //     <TabPane tab="筛选标签库" key="tab1">
  //       {tagSelector}
  //     </TabPane>
  //     <TabPane tab="我的检测方案" key="tab2">
  //       {schemeTag}
  //     </TabPane>
  //   </Tabs>
  // );

  if (!allData && !schemeData) return null;

  return (
    <div style={{ width: '100%', textAlign: 'center' }}>
      <Popover
        title=""
        placement="bottomRight"
        content={tagSelector}
        trigger="click"
        // handleVisibleChange={(v: boolean) => setVisible(v)}
        // visible={visible}
      >
        {children}
      </Popover>
    </div>
  );
};

export default memo(PopSelector);
