import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { history, Link } from 'umi';
import type { ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import ProCard from '@ant-design/pro-card';
import { ModalForm, ProFormText } from '@ant-design/pro-form';
import type { ProFormInstance } from '@ant-design/pro-form';
import { Select, Button, Popconfirm, message, Divider } from 'antd';
import { urlQueryReplace } from '@/utils/utils';
import {
  queryProductDataSearch,
  queryColumnDropDownList,
  queryMyTreeStructure,
  queryProductStatusList,
  queryDataBrowserListPage,
  saveProductDataSearch,
  deleteProductDataSearch,
} from './service';
import styles from './index.less';

// 搜索条件Enum
const searchEnum = { treeId: '我的分类', productStatus: '产品状态' };

// 产品数据浏览器
const DataBrowser = () => {
  const formRef = useRef<ProFormInstance>();
  const actionRef = useRef<ActionType>();
  const [urlQuery, setUrlQuery] = useState({
    schemeName: history.location.query?.schemeName || '',
  });
  const [openSelect, setOpenSelect] = useState(false);
  const [timeStemp, setTimeStemp] = useState(new Date().getMilliseconds());
  const [isEdit, setEdit] = useState(false); // 是否编辑过
  const [planList, setPlanList] = useState([]); // 方案列表
  const [columnEnums, setColumnEnums] = useState({}); // 所有列项
  const [defaultColumns, setDefaultColumns] = useState<any[]>([]); // 默认展示列项
  const [columnsList, setColumnsList] = useState<any[]>([]); // 展示列项
  const [searchConfig, setSearchConfig] = useState(['treeId', 'productStatus']);
  const [schemeDetail, setSchemeDetail] = useState<any>({
    schemeName: '',
    schemeId: '',
  });

  // 回复初始值
  const handleInitReset = useCallback(() => {
    setOpenSelect(false);
    urlQueryReplace({ schemeName: '' });
    setUrlQuery({ schemeName: '' });
    setSearchConfig(['treeId', 'productStatus']);
    setSchemeDetail({ schemeName: '', schemeId: '' });
    setColumnsList(defaultColumns);
    formRef.current?.setFieldsValue({
      treeId: '',
      productStatus: [],
      searchConfig: ['treeId', 'productStatus'],
      columnConfig: defaultColumns,
    });
    actionRef.current?.reload();
  }, [defaultColumns]);

  // 处理方案发生改变的影响：
  const dealPlanChange = useCallback((detailInfo) => {
    if (!Object.keys(detailInfo).length) {
      actionRef.current?.reload();
      return;
    }
    const extinfo = detailInfo.extInfo || {};
    setSearchConfig(extinfo.searchConfig || []);
    setColumnsList(extinfo.columnConfig || []);
    setSchemeDetail({
      schemeName: detailInfo.schemeName || '',
      schemeId: detailInfo.id || '',
    });
    formRef.current?.setFieldsValue({
      treeId: extinfo.treeId || '',
      productStatus: extinfo.productStatus || [],
      searchConfig: extinfo.searchConfig || [],
      columnConfig: extinfo.columnConfig || [],
    });
    setEdit(false); // 默认是另存为（新增）
    actionRef.current?.reload();
  }, []);

  const getPlanList = useCallback(async (urlSchemeName) => {
    const result = await queryProductDataSearch();
    setPlanList(result || []);
    if (!result.length) {
      actionRef.current?.reload();
      return;
    }
    let defaultPlanList: any[] = [];
    // 处理 url 上的 schemeId
    if (urlSchemeName) {
      defaultPlanList = result.filter((item: any) => item.label === urlSchemeName);
      dealPlanChange(defaultPlanList[0] || {});
      return;
    }
    actionRef.current?.reload();
  }, []);

  // 更换url query
  const handleChangeQuery = useCallback(
    (val) => {
      setOpenSelect(false);
      urlQueryReplace({ schemeName: val.label });
      setUrlQuery({ schemeName: val.label });
      const defaultPlanList = planList.filter((item: any) => item.label === val.label);
      dealPlanChange(defaultPlanList[0] || {});
    },
    [planList],
  );

  // 获取列
  const getCloumnList = useCallback(async () => {
    const result = await queryColumnDropDownList();
    const columnMap = {};
    const columnSelectList: any = [];
    result.forEach((item: any) => {
      columnMap[item.columnKey] = {
        text: item.columnValue,
        disabled: item.isDefault === 1,
      };
      if (item.isDefault) {
        columnSelectList.push(item.columnKey);
      }
    });
    setColumnEnums(columnMap);
    setColumnsList(columnSelectList);
    setDefaultColumns(columnSelectList);
    formRef.current?.setFieldsValue({ columnConfig: columnSelectList });
    getPlanList(urlQuery.schemeName || '');
  }, []);

  // 新建或者保存方案
  const handleSave = useCallback(
    async (values) => {
      const searchVal = formRef.current?.getFieldsValue();
      const params = {
        ...(isEdit ? { schemeId: values.schemeId } : {}),
        ...values,
        isDefault: true,
        searchSchemeMaps: searchVal,
      };
      const { success, errorMsg } = await saveProductDataSearch(params);
      if (success) {
        message.success(
          isEdit ? `方案【${values.schemeName}】保存成功` : `新增方案【${values.schemeName}】成功`,
        );
        // 如果是新建方案，刷新方案列表
        urlQueryReplace({ schemeName: values.schemeName });
        setUrlQuery({ schemeName: values.schemeName });
        getPlanList(values.schemeName);
      } else {
        message.error(errorMsg || '请求失败');
      }
      return true;
    },
    [isEdit, searchConfig],
  );

  // 删除方案
  const handleDelete = useCallback(async () => {
    const { success, errorMsg } = await deleteProductDataSearch({
      schemeId: schemeDetail.schemeId,
    });
    if (success) {
      message.success('删除成功');
      handleInitReset();
      // 获取最新方案列表
      getPlanList('');
    } else {
      message.error(errorMsg || '删除失败');
    }
  }, [schemeDetail, actionRef]);

  // 重置
  const handleReset = useCallback(() => {
    if (!schemeDetail.schemeName || !planList.length) {
      handleInitReset();
      return;
    }
    const defaultPlanList = planList.filter((item: any) => item.label === schemeDetail.schemeName);
    dealPlanChange(defaultPlanList[0] || {});
  }, [schemeDetail, handleInitReset]);

  useEffect(() => {
    getCloumnList();
  }, []);

  const columns = useMemo(() => {
    const columnList = Object.keys(columnEnums).map((key) => {
      return {
        title: columnEnums[key].text,
        key,
        value: key,
        disabled: columnEnums[key].disabled,
      };
    });
    const searchClumn: any[] = [
      {
        title: '我的分类',
        dataIndex: 'treeId',
        key: 'treeId',
        valueType: 'treeSelect',
        hideInTable: true,
        hideInSearch: !searchConfig.includes('treeId'),
        params: { timeStemp },
        fieldProps: {
          placeholder: '请选择方案',
          onDropdownVisibleChange: (open: boolean) =>
            open && setTimeStemp(new Date().getMilliseconds()),
          onChange: () => setEdit(true),
        },
        request: async () => {
          return await queryMyTreeStructure();
        },
      },
      {
        title: '产品状态',
        dataIndex: 'productStatus',
        key: 'productStatus',
        valueType: 'select',
        hideInTable: true,
        hideInSearch: !searchConfig.includes('productStatus'),
        fieldProps: {
          mode: 'multiple',
          allowClear: false,
          maxTagCount: 'responsive',
          onChange: () => setEdit(true),
        },
        request: async () => {
          return await queryProductStatusList();
        },
      },
      {
        title: '更多条件',
        dataIndex: 'searchConfig',
        key: 'searchConfig',
        valueType: 'select',
        initialValue: searchConfig,
        fieldProps: {
          mode: 'multiple',
          onChange: (val: any) => {
            setSearchConfig(val);
            setEdit(true);
          },
        },
        hideInTable: true,
        valueEnum: searchEnum,
      },
      {
        title: '列项展示',
        dataIndex: 'columnConfig',
        key: 'columnConfig',
        valueType: 'treeSelect',
        fieldProps: {
          treeCheckable: true,
          allowClear: false,
          maxTagCount: 'responsive',
          options: columnList,
          onChange: (val: any) => {
            setColumnsList(val);
            setEdit(true);
          },
        },
        hideInTable: true,
      },
    ];
    const dynamicClumn = columnsList.map((key: string) => {
      return {
        title: columnEnums[key].text,
        dataIndex: key,
        key: key,
        hideInSearch: true,
        ...(key === 'fundCode' || key === 'fundName'
          ? {
              render: (text: any, record: any) => {
                return (
                  <Link to={`/production/index/detail/${record.fundId}`} className="text-ellipsis">
                    {text}
                  </Link>
                );
              },
            }
          : {}),
      };
    });
    return [...searchClumn, ...dynamicClumn];
  }, [columnsList, searchConfig, timeStemp, columnEnums]);

  const renderSubTitle = useMemo(() => {
    let saveBtn = (
      <Button size="small" onClick={() => handleSave(schemeDetail)}>
        保存
      </Button>
    );
    if (!isEdit || !schemeDetail.schemeId) {
      saveBtn = (
        <ModalForm
          title="新建方案"
          layout="horizontal"
          trigger={<Button size="small">{planList.length <= 0 ? '新增' : '另存为'}</Button>}
          autoFocusFirstInput
          modalProps={{ destroyOnClose: true }}
          onFinish={(values) => handleSave(values)}
        >
          <ProFormText width="md" name="schemeName" label="方案名称" rules={[{ required: true }]} />
        </ModalForm>
      );
    }
    if (planList.length) {
      return (
        <>
          <Select
            open={openSelect}
            labelInValue
            placeholder="请选择方案"
            style={{ minWidth: 100 }}
            value={
              schemeDetail.schemeName
                ? { lable: schemeDetail.schemeName, value: schemeDetail.schemeId }
                : null
            }
            bordered={false}
            onDropdownVisibleChange={(open) => setOpenSelect(open)}
            onChange={handleChangeQuery}
            dropdownRender={(menu) => (
              <>
                {menu}
                <Divider style={{ margin: '4px 0' }} />
                <div style={{ textAlign: 'center' }}>
                  <Button type="link" size="small" onClick={handleInitReset}>
                    清空选项
                  </Button>
                </div>
              </>
            )}
          >
            {planList.map((item: any) => {
              return (
                <Select.Option value={item.value} key={item.value}>
                  {item.label}
                </Select.Option>
              );
            })}
          </Select>
          {saveBtn}
          {schemeDetail.schemeId ? (
            <Popconfirm
              title="您确定要删除改方案么？"
              okText="确定"
              cancelText="取消"
              onConfirm={handleDelete}
            >
              <Button size="small" danger style={{ marginLeft: '8px' }}>
                删除
              </Button>
            </Popconfirm>
          ) : null}
        </>
      );
    }
    return saveBtn;
  }, [openSelect, planList, isEdit, schemeDetail, schemeDetail, handleDelete, handleInitReset]);

  return (
    <ProCard
      ghost
      size="small"
      title="我的搜索方案"
      subTitle={renderSubTitle}
      className={styles['page-wrap']}
      style={{ padding: '12px 12px' }}
    >
      <ProTable
        formRef={formRef}
        actionRef={actionRef}
        rowKey="fundId"
        columns={columns}
        scroll={{ x: 'max-content' }}
        options={false}
        manualRequest
        search={{ defaultCollapsed: false }}
        onReset={handleReset}
        request={async (params) => {
          const result = await queryDataBrowserListPage({
            treeId: params.treeId || '',
            productStatus: params.productStatus || [],
            pageNo: params.current,
            pageSize: params.pageSize,
          });
          return {
            data: result.dataList,
            success: true,
            total: result.total,
          };
        }}
        pagination={{ pageSize: 10 }}
      />
    </ProCard>
  );
};

export default DataBrowser;
