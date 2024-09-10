import {
  Avatar,
  Button,
  Col,
  Input,
  List,
  PaginationProps,
  Select,
  Row,
  Tag,
  DatePicker,
  Space,
  Form,
} from 'antd';
import type { DatePickerProps, RangePickerProps } from 'antd/es/date-picker';
import { memo, useEffect, useState } from 'react';
import ProCard from '@ant-design/pro-card';
import { LeftOutlined } from '@ant-design/icons';
import Icons from './icons';
import {
  EsIndexDataInfoFacadeQuerySimpleEsDataByPage,
  EsStockInfoFacadeQueryBrokerInfo,
  EsStockInfoFacadeQueryStockInfo,
} from './../service';
import ResultDetails from './resultDetails';
import './../index.css';
import StandardFormRow from '@/pages/Investment/components/StandardFormRow';

const { Search } = Input;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;

interface ModalProps {
  keyword: string;
  onBack: () => void;
  objId: string | undefined;
}

let timeout: ReturnType<typeof setTimeout> | null;
let currentValue: string;

const fetchStock = (value: string, callback: (data: { value: string; text: string }[]) => void) => {
  if (timeout) {
    clearTimeout(timeout);
    timeout = null;
  }
  currentValue = value;

  const fake = async () => {
    const params = { form: 0, size: 10, key: value };
    const result = await EsStockInfoFacadeQueryStockInfo(params);
    if (result.status === 'ok') {
      if (currentValue === value) {
        const { data } = result;
        const resultData = data.map((item: any) => ({
          value: item.stockCode,
          text: item.stockCode + ' - ' + item.stockName,
        }));
        callback(resultData);
      }
    }
  };

  timeout = setTimeout(fake, 300);
};

const fetchSource = (
  value: string,
  callback: (data: { value: string; text: string }[]) => void,
) => {
  if (timeout) {
    clearTimeout(timeout);
    timeout = null;
  }
  currentValue = value;

  const fake = async () => {
    const params = { form: 0, size: 10, key: value };
    const result = await EsStockInfoFacadeQueryBrokerInfo(params);
    if (result.status === 'ok') {
      if (currentValue === value) {
        const { data } = result;
        const resultData = data.map((item: any) => ({
          value: item.brokerName,
          text: item.brokerName,
        }));
        callback(resultData);
      }
    }
  };

  timeout = setTimeout(fake, 300);
};

const ResultInfo = (props: ModalProps) => {
  const { keyword, onBack, objId } = props;
  const [loading, setLoading] = useState<boolean>(false);
  const [dataList, setDataList] = useState<any>([]);
  const [current, setCurrent] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [itemCheck, setItemCheck] = useState<any>(undefined);
  const [listParams, setListParams] = useState<any>({});
  const [sourceList, setSourceList] = useState<any[]>([]);
  const [stockList, setStockList] = useState<any[]>([]);

  const [searchForm] = Form.useForm();
  const pageSize = 10;
  //选择
  const checkItem = (data: any[], _objId: string) => {
    data.forEach((d) => {
      if (d.objId === _objId) {
        setItemCheck(d);
      }
    });
  };
  //数据查询
  const loadData = async (key: string | undefined, _objId: string | undefined = undefined) => {
    setLoading(true);
    searchForm.setFieldsValue({ docTime: undefined, source: undefined, stock: undefined });
    const filters: any = [],
      shoulds: any = [];
    if (!(key === undefined || key === '')) {
      shoulds.push({ type: 'match_phrase', name: 'title', text: `${key}`, boost: 1 });
      shoulds.push({ type: 'match_phrase', name: 'summary', text: key, boost: 1 });
      shoulds.push({ type: 'match_phrase', name: 'originalAuthor', text: `${key}`, boost: 1 });
    }
    const highlights = [
      {
        field: 'summary',
        numberOfFragments: 0,
        preTags: '<span class="redSpan">',
        postTags: '</span>',
      },
      {
        field: 'title',
        numberOfFragments: 0,
        preTags: '<span class="redSpan">',
        postTags: '</span>',
      },
      {
        field: 'originalAuthor',
        numberOfFragments: 0,
        preTags: '<span class="redSpan">',
        postTags: '</span>',
      },
    ];
    const params = {
      from: 0,
      size: 10,
      index: 'index_sirm_research_report',
      filters,
      query: { bool: { shoulds } },
      highlights,
      sorts: [
        // { name: '_score', order: 'desc' },
        { name: 'writeTime', order: 'desc' },
      ],
      matchAll: '0',
    };

    setListParams(params);
    const data = await EsIndexDataInfoFacadeQuerySimpleEsDataByPage(params);
    if (data.status === 'ok') {
      setDataList(data.data);
      setTotal(data.total);
      setCurrent(1);
      if (_objId !== undefined) {
        checkItem(data.data, _objId);
      } else {
        if (data.data.length > 0) {
          setItemCheck(data.data[0]);
        } else {
          setItemCheck(undefined);
        }
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData(keyword, objId);
  }, [keyword, objId]);

  const onSearch = (value: string) => {
    loadData(value);
  };

  const itemClick = (item: any) => {
    setItemCheck(item);
  };

  const searchData = async (params: any, page: number = 1) => {
    setLoading(true);
    setListParams(params);
    const data = await EsIndexDataInfoFacadeQuerySimpleEsDataByPage(listParams);
    if (data.status === 'ok') {
      setDataList(data.data);
      setTotal(data.total);
      setCurrent(page);
      if (data.data.length > 0) {
        setItemCheck(data.data[0]);
      }
    }
    setLoading(false);
  };

  const pageChange: PaginationProps['onChange'] = (page: number) => {
    listParams.from = pageSize * (page - 1);
    searchData({ ...listParams }, page);
  };

  const backClick = () => {
    onBack();
  };

  const mustsSet = (filters: any[], type: string, name: string, obj: any) => {
    const m: any = [];

    filters.forEach((must) => {
      if (!(must.type === type && must.name === name)) {
        m.push(must);
      }
    });
    if (obj !== undefined) {
      m.push(obj);
    }
    return m;
  };

  const onDateChange = (
    value: DatePickerProps['value'] | RangePickerProps['value'],
    dateString: [string, string] | string,
  ) => {
    // console.log('Selected Time: ', value);
    // console.log('Formatted Selected Time: ', dateString);
    listParams.from = 0;
    const range = { type: 'range', name: 'docTime', gte: dateString[0], lte: dateString[1] };
    const filters = mustsSet(listParams.filters, 'range', 'docTime', range);
    listParams.filters = filters;
    searchData({ ...listParams });
  };

  //来源机构
  const onSourceChange = (v: string) => {
    listParams.from = 0;
    let term = undefined;
    if (!(v == undefined || v == '')) {
      term = { type: 'term', name: 'brokerName', text: v };
    }
    const filters = mustsSet(listParams.filters, 'term', 'brokerName', term);
    listParams.filters = filters;
    searchData({ ...listParams });
  };

  const onSourceSearch = (newValue: string) => {
    if (newValue) {
      fetchSource(newValue, setSourceList);
    } else {
      setSourceList([]);
    }
  };

  //证券
  const onStockChange = (v: string) => {
    listParams.from = 0;
    let term = undefined;
    if (!(v == undefined || v == '')) {
      term = { type: 'term', name: 'stkCode', text: v };
    }
    const filters = mustsSet(listParams.filters, 'term', 'stkCode', term);
    listParams.filters = filters;
    searchData({ ...listParams });
  };

  const onStockSearch = (newValue: string) => {
    if (newValue) {
      fetchStock(newValue, setStockList);
    } else {
      setStockList([]);
    }
  };

  return (
    <>
      <Form form={searchForm}>
        <Row style={{ paddingBottom: 8 }}>
          <Col span={24}>
            <ProCard headStyle={{ border: 'none' }}>
              <Space>
                <Search
                  defaultValue={keyword}
                  placeholder="请输入需要搜索的关键词"
                  allowClear
                  onSearch={onSearch}
                  style={{ width: 600 }}
                />
                <Button icon={<LeftOutlined />} onClick={backClick} />
              </Space>
            </ProCard>
          </Col>
        </Row>
        <Row style={{ paddingBottom: 8 }}>
          <Col span={24}>
            <ProCard headStyle={{ border: 'none' }}>
              <StandardFormRow title="报告日期" block>
                <FormItem name="docTime" style={{ marginBottom: '0' }}>
                  <RangePicker format={'YYYY-MM-DD'} onChange={onDateChange} allowClear={true} />
                </FormItem>
              </StandardFormRow>
              <Row>
                <Col xs={24} sm={24} md={24} lg={10} xl={8} xxl={6}>
                  <StandardFormRow title="来源机构" block>
                    <FormItem name="source" style={{ marginBottom: '0' }}>
                      <Select
                        style={{ width: 200 }}
                        onChange={onSourceChange}
                        onSearch={onSourceSearch}
                        allowClear={true}
                        optionFilterProp="children"
                        showSearch
                        filterOption={false}
                      >
                        {sourceList?.map((item) => (
                          <Select.Option value={item.value}>{item.value}</Select.Option>
                        ))}
                      </Select>
                    </FormItem>
                  </StandardFormRow>
                </Col>
                <Col xs={24} sm={24} md={24} lg={10} xl={8} xxl={6}>
                  <StandardFormRow title="证券" block>
                    <FormItem name="stock" style={{ marginBottom: '0' }}>
                      <Select
                        style={{ width: 200 }}
                        onChange={onStockChange}
                        onSearch={onStockSearch}
                        allowClear={true}
                        optionFilterProp="children"
                        showSearch
                        filterOption={false}
                      >
                        {stockList?.map((item) => (
                          <Select.Option value={item.value}>{item.text}</Select.Option>
                        ))}
                      </Select>
                    </FormItem>
                  </StandardFormRow>
                </Col>
              </Row>
            </ProCard>
          </Col>
        </Row>
      </Form>
      <Row>
        <Col span={8} style={{ paddingRight: 4 }}>
          <ProCard headStyle={{ border: 'none' }}>
            <div>
              <List
                id={'listData'}
                loading={loading}
                dataSource={dataList}
                pagination={{
                  current: current,
                  pageSize: pageSize,
                  total: total,
                  onChange: pageChange,
                  showSizeChanger: false,
                  size: 'small',
                }}
                renderItem={(item: any) => (
                  <List.Item
                    onClick={() => itemClick(item)}
                    className={
                      'task-item ' + (itemCheck?.objId === item.objId ? 'task-item-check' : '')
                    }
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          shape="square"
                          size={'large'}
                          className={'datatypeIcon'}
                          src={Icons.IconPdf}
                        />
                      }
                      title={
                        <Space direction={'vertical'} style={{ width: '100%' }}>
                          <Row>
                            <Col span={12}>
                              {item.brokerName ? (
                                <div className={'es-list-title2'}>{item.brokerName}</div>
                              ) : (
                                ''
                              )}
                            </Col>
                            <Col span={12} style={{ textAlign: 'right' }}>
                              <div className={'es-list-title3'}>{item.docTime}</div>
                            </Col>
                          </Row>
                          <div
                            className={'es-list-title'}
                            dangerouslySetInnerHTML={{
                              __html: item.title_highlight ? item.title_highlight : item.title,
                            }}
                          ></div>
                        </Space>
                      }
                      description={
                        <>
                          {item.industryName ? (
                            <Tag className={'tag-style marginRight10'}>{item.industryName}</Tag>
                          ) : (
                            ''
                          )}
                          {item.docTypeName ? (
                            <Tag className={'tag-style'}>{item.docTypeName}</Tag>
                          ) : (
                            ''
                          )}
                        </>
                      }
                    />
                  </List.Item>
                )}
              />
            </div>
          </ProCard>
        </Col>
        <Col span={16} style={{ paddingLeft: 4 }}>
          <ProCard headStyle={{ border: 'none' }} style={{ minHeight: '100%' }}>
            <ResultDetails item={itemCheck} />
          </ProCard>
        </Col>
      </Row>
    </>
  );
};
export default memo(ResultInfo);
