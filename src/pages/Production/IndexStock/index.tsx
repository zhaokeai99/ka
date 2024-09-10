import React, { useRef, useMemo, useCallback, useState, useEffect, MutableRefObject } from 'react';
import {
  Table,
  message,
  Input,
  InputNumber,
  Modal,
  Row,
  Col,
  Select,
  Space,
  Tag,
  AutoComplete,
  Button,
  Spin,
  FormInstance,
} from 'antd';
import ProCard from '@ant-design/pro-card';
import { ExportOutlined } from '@ant-design/icons';
import ProCardPlus from '@/components/ProCardPlus';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { DownOutlined, SearchOutlined, UpOutlined } from '@ant-design/icons';
import qs from 'qs';
import { COLORS } from '@/utils/utils';
import type { IndexItem } from './data';
import {
  fetchIndexSortSys,
  queryIndexPageList,
  queryIndexPublisherList,
  querySearchIndexInfo,
} from './service';
import styles from './index.less';
import { debounce as _debounce } from 'lodash';

const { Option } = Select;

const TableList: React.FC<{ history: any; location: any }> = ({ history, location }) => {
  const tableFormRef: MutableRefObject<FormInstance | undefined> = useRef();
  const actionRef = useRef<ActionType>();
  const [selectedRowKeys, setSelectedRowKeys] = useState(() => {
    if (!location.query?.srk) return [];
    return location.query.srk.split(',');
  });
  const [indexModal, setIndexModal] = useState({
    show: false,
    blockConfig: [],
    nonBlockConfig: [],
  });
  const [pagination, setPagination] = useState({
    // eslint-disable-next-line radix
    current: parseInt(location.query?.current) || 1,
    // eslint-disable-next-line radix
    pageSize: parseInt(location.query?.pageSize) || 10,
  });
  const [numStart, setNumStart] = useState<any>(null);
  const [numEnd, setNumEnd] = useState<any>(null);
  const [defaultVal, setDefaultVal] = useState<any>(null);
  const [selectData, setSelectData] = useState<any>([]);
  const [collapsed, setCollapsed] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [optionsData, setOptionsData] = useState<any[]>([]);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    (async () => {
      const data = await fetchIndexSortSys();
      setSelectData([{ label: '全部', value: '' }, ...data]);
      if (Array.isArray(data) && data.length > 0) {
        setDefaultVal(data[0].value);
      }
    })();
  }, []);

  useEffect(() => {
    (tableFormRef.current as any)?.setFieldsValue({
      ...location.query,
      securitiesTypeId: location?.query?.securitiesTypeId
        ? parseInt(location?.query?.securitiesTypeId)
        : '',
      releaseDate: [location.query.startDate, location.query.endDate],
      sampleNum: {
        sampleNumStart: location.query.sampleNumStart,
        sampleNumEnd: location.query.sampleNumEnd,
      },
      fullName: {
        indexName: location.query.indexName,
        selectType: location.query.selectType,
      },
    });
  }, [location, defaultVal]);

  const onOpenIndexModal = useCallback((item) => {
    setIndexModal({
      show: true,
      blockConfig: item.blockConfig || [],
      nonBlockConfig: item.nonBlockConfig || [],
    });
  }, []);

  const columns: ProColumns<IndexItem>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
      fixed: 'left',
      render: (_, item, index) => (
        <span>
          {((pagination.current as number) - 1) * (pagination.pageSize as number) + index + 1}
        </span>
      ),
    },
    {
      title: '指数代码',
      dataIndex: 'indexCode',
      width: 150,
      fixed: 'left',
      search: false,
      render: (_, item) => (
        <a target="_blank" href={item.indexWebsite} rel="noopener noreferrer">
          {_}
          <ExportOutlined style={{ marginLeft: '5px' }} />
        </a>
      ),
    },
    {
      title: '指数简称',
      dataIndex: 'indexShortName',
      width: 160,
      fixed: 'left',
      search: false,
    },
    {
      title: '指数全称',
      dataIndex: 'indexName',
      hideInSearch: true,
    },
    {
      title: '指数全称',
      dataIndex: 'fullName',
      hideInTable: true,
      renderFormItem: (_, {}, form) => (
        <Input.Group compact>
          <Select
            style={{ width: '45%' }}
            onChange={(value: any) => {
              form.setFieldsValue({
                fullName: {
                  ...form.getFieldValue('fullName'),
                  selectType: value,
                },
              });
            }}
            defaultValue={location?.query?.selectType}
            allowClear
          >
            <Option value="contain">包含</Option>
            <Option value="notContain">不包含</Option>
            <Option value="equal">等于</Option>
            <Option value="notEqual">不等于</Option>
            <Option value="beginWith">开头是</Option>
            <Option value="beginNotWith">开头不是</Option>
            <Option value="endWith">结尾是</Option>
            <Option value="endNotWith">结尾不是</Option>
          </Select>
          <Input
            onChange={(val: any) => {
              form.setFieldsValue({
                fullName: {
                  ...form.getFieldValue('fullName'),
                  indexName: val.target.value,
                },
              });
            }}
            style={{ width: '55%' }}
            defaultValue={location?.query?.indexName}
          />
        </Input.Group>
      ),
    },
    {
      title: '发布方',
      dataIndex: 'publisher',
      // valueEnum: {
      //   '': { text: '全部' },
      //   CSI: { text: '中证' },
      //   CNI: { text: '国证' },
      //   SSI: { text: '新华' },
      //   CESC: { text: '华证' },
      // },
      valueType: 'select',
      request: queryIndexPublisherList,
    },
    {
      title: '指数新规',
      dataIndex: 'complianceMark',
      search: false,
      valueEnum: {
        '': { text: '全部' },
        YES: { text: '是' },
        NO: { text: '否' },
      },
      render: (_, { blockConfig, nonBlockConfig }: any) => (
        <a
          onClick={() =>
            onOpenIndexModal({
              blockConfig,
              nonBlockConfig,
            })
          }
        >
          {_}
        </a>
      ),
    },
    {
      title: '新规阻断详情',
      dataIndex: 'blockDetail',
      search: false,
    },
    {
      title: '指数分类',
      dataIndex: 'securitiesType',
      search: false,
    },
    {
      title: '跟踪产品数',
      dataIndex: 'trackIndexNum',
      search: false,
    },
    {
      title: '样本数量',
      dataIndex: 'sampleNum',
      // eslint-disable-next-line no-empty-pattern
      renderFormItem: (_, {}, form) => (
        <Input.Group compact>
          <InputNumber
            className={styles['my-left-input-number']}
            min={0}
            onChange={(value) => {
              setNumStart(value);
              form.setFieldsValue({
                sampleNum: {
                  ...form.getFieldValue('sampleNum'),
                  sampleNumStart: typeof value === 'number' ? value : '',
                },
              });
            }}
            defaultValue={location?.query?.sampleNumStart}
            value={numStart}
            // value={form.getFieldValue('sampleNum')?.sampleNumStart || location?.query?.sampleNumStart}
          />
          <Input
            style={{
              width: '16%',
              borderLeft: 0,
              borderRight: 0,
              pointerEvents: 'none',
              backgroundColor: '#fff',
            }}
            placeholder="~"
            disabled
          />
          <InputNumber
            className={styles['my-right-input-number']}
            min={0}
            onChange={(value) => {
              setNumEnd(value);
              form.setFieldsValue({
                sampleNum: {
                  ...form.getFieldValue('sampleNum'),
                  sampleNumEnd: typeof value === 'number' ? value : '',
                },
              });
            }}
            defaultValue={location?.query?.sampleNumEnd}
            value={numEnd}
          />
        </Input.Group>
      ),
    },
    {
      title: '发布时间',
      dataIndex: 'releaseDate',
      valueType: 'date',
      hideInSearch: true,
      fixed: 'right',
      width: 100,
    },
    {
      title: '发布时间',
      dataIndex: 'releaseDate',
      valueType: 'dateRange',
      hideInTable: true,
      search: {
        transform: (value) => {
          return {
            startDate: value[0],
            endDate: value[1],
          };
        },
      },
    },
    {
      title: '操作',
      valueType: 'option',
      fixed: 'right',
      width: 50,
      render: (text, record) => (
        <a
          href={`#/production/indexStock/detail/${record.indexCode}`}
          rel="noopener noreferrer"
          key="detail"
        >
          详情
        </a>
      ),
    },
    {
      title: '指数行业分类',
      dataIndex: 'securitiesTypeId',
      hideInTable: true,
      valueType: 'select',
      fieldProps: {
        options: selectData,
        defaultValue: '',
        allowClear: false,
      },
    },
    {
      title: '我司已发',
      dataIndex: 'thfundPublish',
      hideInTable: true,
      valueEnum: {
        0: '是',
        1: '否',
      },
    },
    {
      title: '指数新规',
      dataIndex: 'newRule',
      hideInTable: true,
      valueEnum: {
        0: '是',
        1: '否',
      },
    },
  ];

  const onSelectionChange = useCallback(
    (values) => {
      if (values.length > 5) {
        message.warn('最多同时对比5条数据！');
        return;
      }
      setSelectedRowKeys(values);
      history.replace({
        pathname: location.pathname,
        search: qs.stringify({
          ...location.query,
          srk: values.join(','),
        }),
      });
    },
    [history, location],
  );

  const queryOptions = useCallback(
    _debounce(async (value = '') => {
      setFetching(true);
      const result = await querySearchIndexInfo({
        keyword: value,
      });
      setFetching(false);
      setOptionsData(
        result?.map(({ indexName, indexCode }: any) => ({
          key: indexCode,
          value: indexName,
          label: (
            <>
              {indexName}
              <Tag color="blue" style={{ marginLeft: '10px' }}>
                {indexCode}
              </Tag>
            </>
          ),
        })),
      );
    }),
    [],
  );

  const handleChangeVal = () => {
    tableFormRef?.current?.submit();
  };

  const renderTitle = useMemo(
    () => (
      <>
        <AutoComplete
          allowClear
          style={{ margin: '12px 0' }}
          onSearch={(val: any) => {
            setSearchValue(val);
            queryOptions(val);
          }}
          notFoundContent={fetching ? <Spin size="small" /> : null}
          filterOption={false}
          options={optionsData}
          onClear={() => {
            setSearchValue('');
          }}
          onChange={(val: any) => setSearchValue(val)}
          onSelect={(val: any, { value }: any) => {
            setSearchValue(value);
            handleChangeVal();
          }}
          value={searchValue}
        >
          <Input
            style={{ width: '480px' }}
            placeholder="指数代码/名称 模糊搜索"
            size="large"
            onPressEnter={() => handleChangeVal()}
          />
        </AutoComplete>
        <Button
          size="large"
          style={{ marginLeft: '12px' }}
          type="primary"
          icon={<SearchOutlined />}
          onClick={() => handleChangeVal()}
        >
          搜索
        </Button>
      </>
    ),
    [optionsData, searchValue, fetching],
  );

  const queryPageList = (params: any) => {
    const {
      sampleNum,
      indexCode,
      publisher,
      startDate,
      endDate,
      fullName,
      securitiesTypeId,
      ...attrs
    } = {
      ...location.query,
      ...params,
    } as any;
    history.replace({
      pathname: location.pathname,
      search: qs.stringify({
        ...attrs,
        ...sampleNum,
        ...fullName,
        indexCode,
        publisher,
        startDate,
        endDate,
        securitiesTypeId,
      }),
    });

    return queryIndexPageList(
      {
        keyword: searchValue,
        indexCode,
        publisher,
        startDate,
        endDate,
        ...attrs,
        ...sampleNum,
        ...fullName,
        securitiesTypeId,
      },
      ({ success, current, pageSize }) => {
        if (success) {
          setPagination({
            current,
            pageSize,
          });
        }
      },
    );
  };

  const onRest = () => {
    history.replace({
      pathname: location.pathname,
      search: '',
    });
    setSearchValue('');
    setNumEnd(null);
    setNumStart(null);
  };

  return (
    <>
      <ProCardPlus title="" ghost style={{ padding: '12px' }} direction="column">
        <ProCard
          className={styles['search-form-title-container']}
          title={renderTitle}
          extra={
            <Button
              type="primary"
              onClick={() => {
                setCollapsed(!collapsed);
              }}
            >
              高级筛查
              {collapsed ? (
                <DownOutlined style={{ fontSize: 12 }} />
              ) : (
                <UpOutlined style={{ fontSize: 12 }} />
              )}
            </Button>
          }
          style={{ marginBottom: collapsed ? 12 : 1 }}
          headerBordered
          collapsed={true}
        />
        {defaultVal && (
          <ProTable<IndexItem>
            actionRef={actionRef}
            formRef={tableFormRef}
            size="small"
            tableAlertRender={({ selectedRowKeys: sRowKeys, onCleanSelected }) => (
              <Space size={24}>
                <span>
                  已选 {sRowKeys.length} 项
                  <a style={{ marginLeft: 8 }} onClick={onCleanSelected}>
                    取消选择
                  </a>
                </span>
                <span>
                  {sRowKeys.map((selectedKey, index): any => (
                    <Tag
                      closable
                      key={selectedKey}
                      onClose={() => {
                        setSelectedRowKeys((keys: any) =>
                          keys.filter((key: any) => key !== selectedKey),
                        );
                      }}
                      color={COLORS[index]}
                    >
                      {selectedKey}
                    </Tag>
                  ))}
                </span>
              </Space>
            )}
            rowSelection={{
              selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
              selectedRowKeys,
              preserveSelectedRowKeys: true,
              onChange: onSelectionChange,
            }}
            tableAlertOptionRender={() =>
              selectedRowKeys?.length > 1 ? (
                <a
                  href={`#/production/indexStock/compare/_single_/${selectedRowKeys}`}
                  rel="noopener noreferrer"
                  key="compare"
                >
                  对比数据
                </a>
              ) : null
            }
            rowKey="indexCode"
            search={{
              collapseRender: false,
              collapsed,
              className: collapsed ? styles.hide : styles.show,
              labelWidth: 120,
            }}
            options={false}
            pagination={pagination}
            onReset={onRest}
            request={queryPageList}
            columns={columns}
            scroll={{ x: 'max-content' }}
          />
        )}
        {/* 指数新规弹窗 */}
      </ProCardPlus>
      <Modal
        width={700}
        title="指数新规"
        visible={indexModal.show}
        footer={null}
        onCancel={() =>
          setIndexModal({
            show: false,
            blockConfig: [],
            nonBlockConfig: [],
          })
        }
      >
        <Row>
          <Col span={12}>
            <h3>阻断</h3>
            {indexModal.blockConfig.map((item: any, index: number) => (
              // eslint-disable-next-line react/no-array-index-key
              <Row key={index} gutter={[0, 4]}>
                <Col span={6} style={{ fontWeight: 'bolder' }}>
                  {item.configName || ''}:
                </Col>
                <Col span={6}>{item.configValue || ''}</Col>
                <Col span={6} style={{ fontWeight: 'bolder' }}>
                  阈值:
                </Col>
                <Col span={6}>{item.configThreshold || ''}</Col>
              </Row>
            ))}
          </Col>
          <Col span={12}>
            <h3>非阻断</h3>
            {indexModal.nonBlockConfig.map((item: any, index: number) => (
              // eslint-disable-next-line react/no-array-index-key
              <Row key={index} gutter={[0, 4]}>
                <Col span={12} style={{ fontWeight: 'bolder' }}>
                  {item.configName || ''}:
                </Col>
                <Col span={12}>{item.configValue || ''}</Col>
              </Row>
            ))}
          </Col>
        </Row>
      </Modal>
    </>
  );
};

export default TableList;
