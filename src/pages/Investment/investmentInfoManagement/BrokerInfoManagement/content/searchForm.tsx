import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import ProCard from '@ant-design/pro-card';
import { Button, Col, DatePicker, Form, Input, Row, Select, Space } from 'antd';
import lodash from 'lodash';
import { memo, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import StandardFormRow from '../../../components/StandardFormRow';
import { RadioSelect } from '../../../components/TagSelect';
import { DicProps } from '../index';
import '../index.css';
import {
  SelmRoadShowOpLogFacadeQuerySearchRoadShowOpTopByPage,
  WindCompIntroductionFacadeQueryCompIntroductionByPage,
} from '../service';
import Icons from './../icons';
import { SelmRoadShowInfoFacadeSaveKeywordOpLog } from '../service';
import moment from 'moment';

const FormItem = Form.Item;

interface ModalProps {
  cRef: any;
  dicMap: DicProps;
  version: number;
  onSearch: (val: any) => void;
  keywords: string | undefined;
}

/**
 * 搜索窗口
 * @param props
 * @constructor
 */
const SearchHistory = (props: ModalProps) => {
  const { cRef, dicMap, version, onSearch, keywords } = props;
  const [hotMap, setHotMap] = useState<any[]>([]);
  const [classesMap, setClassesMap] = useState<any[]>([]);
  const [industryMap, setIndustryMap] = useState<any[]>([]);
  const [companyMap, setCompanyMap] = useState<any[]>([]);
  const [sellerMap, setSellerMap] = useState<any[]>([]);
  const [searchParams, setSearchParams] = useState<any>({});
  const [searchMode, setSearchMode] = useState<boolean>(false);
  const [searchFormHeight, setSearchFormHeight] = useState<string>('82px');

  const [searchForm] = Form.useForm();
  const searshCard = useRef(null);
  const searchRef = useRef<HTMLDivElement>(null);

  let _versionCompany = 0;

  //加载热门搜索
  const loadData = useCallback(async () => {
    const params = { sortField: 'cts', sortOrder: 'desc', pageSize: 5, current: 1 };
    const result = await SelmRoadShowOpLogFacadeQuerySearchRoadShowOpTopByPage(params);
    if (result.success) {
      setHotMap(result.data.data);
      return;
    }
  }, []);

  //保存热门搜索
  const saveLog = async (keyword: string) => {
    const params = { keyword };
    await SelmRoadShowInfoFacadeSaveKeywordOpLog(params);
    loadData();
  };

  const pushAll = (list: any[]) => {
    if (list === undefined) {
      return [{ v: -1, n: '全部' }];
    }
    return [{ v: -1, n: '全部' }].concat(list);
  };

  const pushIndustryAll = (list: any[]) => {
    if (list === undefined) {
      return [
        { v: -1, n: '全部' },
        { v: -2, n: '个人关注' },
      ];
    }
    return [
      { v: -1, n: '全部' },
      { v: -2, n: '个人关注' },
    ].concat(list);
  };

  //加载
  useEffect(() => {
    loadData();
  }, []);

  //字典更新内容变更
  useEffect(() => {
    setClassesMap(pushAll(dicMap?.classes));
    setSellerMap(pushAll(dicMap?.seller));

    setIndustryMap(pushIndustryAll(dicMap?.industry));
  }, [version]);

  // 点击
  const hisClick = useCallback((keyword: string) => {
    const params = {
      keyword: keyword,
    };
    searchForm.setFieldsValue({
      keyword: keyword,
      classes: -1,
      industry: '全部',
      dateStart: undefined,
      dateEnd: undefined,
      company: undefined,
      seller: '全部',
      showLevel: -1,
      wechatGroup: -1,
    });
    setSearchParams(params);
    onSearch(params);
  }, []);

  //搜索词变更
  useEffect(() => {
    if (keywords !== undefined && keywords !== '') {
      hisClick(keywords);
    }
  }, [keywords]);

  //所属类目
  const classesChange = useCallback(
    (v: string | number) => {
      if (v === -1) {
        searchParams.classes = undefined;
      } else {
        searchParams.classes = v;
      }
      setSearchParams({ ...searchParams });
      onSearch(searchParams);
    },
    [searchParams],
  );

  //行业分类
  const industryChange = useCallback(
    (v: string | number) => {
      if (v === '全部') {
        searchParams.industry = undefined;
      } else {
        searchParams.industry = v;
      }
      setSearchParams({ ...searchParams });
      onSearch(searchParams);
    },
    [searchParams],
  );

  //时间开始
  const dataStartChange = useCallback(
    (date: any, dateString: string) => {
      if (dateString === undefined || dateString === null) {
        searchParams.dateStart = undefined;
      } else {
        searchParams.dateStart = moment(dateString, 'YYYY-MM-DD');
      }
      setSearchParams({ ...searchParams });
      onSearch(searchParams);
    },
    [searchParams],
  );

  //时间结束
  const dateEndChange = useCallback(
    (date: any, dateString: string) => {
      if (dateString === undefined || dateString === null) {
        searchParams.dateEnd = undefined;
      } else {
        searchParams.dateEnd = moment(dateString, 'YYYY-MM-DD').add(1, 'day');
      }
      setSearchParams({ ...searchParams });
      onSearch(searchParams);
    },
    [searchParams],
  );

  //相关公司
  const companyChange = useCallback(
    (v: any) => {
      searchParams.company = v;
      setSearchParams({ ...searchParams });
      onSearch(searchParams);
    },
    [searchParams],
  );

  //相关公司查询
  const companySearch = useCallback(async (v: string) => {
    const params = { keyword: v, pageSize: 10, current: 1 };
    const versionNum = lodash.random(0, 99999999);
    _versionCompany = versionNum;
    const data = await WindCompIntroductionFacadeQueryCompIntroductionByPage(params);
    if (data.success && versionNum === _versionCompany) {
      setCompanyMap(data.data.data);
    }
  }, []);

  //卖方机构
  const sellerSelect = useCallback(
    (v: any) => {
      if (v === '全部') {
        searchParams.seller = undefined;
      } else {
        searchParams.seller = v;
      }
      setSearchParams({ ...searchParams });
      onSearch(searchParams);
    },
    [searchParams],
  );

  //参会形式
  const showLevelSelect = useCallback(
    (v: any) => {
      if (v === -1) {
        searchParams.showLevel = undefined;
      } else {
        searchParams.showLevel = v;
      }
      setSearchParams({ ...searchParams });
      onSearch(searchParams);
    },
    [searchParams],
  );

  const formSetValue = (values: any) => {
    searchForm.setFieldsValue(values);
  };

  //搜索
  const searchHandle = useCallback(async () => {
    const values = await searchForm.validateFields();
    const params = {
      keyword: values.keyword,
    };
    searchForm.setFieldsValue({
      classes: -1,
      industry: '全部',
      dateStart: undefined,
      dateEnd: undefined,
      company: undefined,
      seller: '全部',
      showLevel: -1,
      wechatGroup: -1,
    });
    setSearchParams(params);
    onSearch(params);
    if (values.keyword) {
      saveLog(values.keyword);
    }
  }, []);

  //搜索框回车
  const keywordPress = async (key: any) => {
    if (key.key === 'Enter') {
      searchHandle();
    }
  };

  //搜索窗口高度
  const setFormHeight = useCallback(() => {
    const h = searchRef?.current?.offsetHeight;
    setSearchFormHeight(h + 'px');
  }, []);

  //更多
  const btnExpand = useCallback(() => {
    if (!searchMode) {
      // @ts-ignore
      setSearchMode(true);
    } else {
      setSearchMode(false);
    }
    setTimeout(setFormHeight, 200);
  }, [searchMode]);

  const searchToggle = () => {
    setTimeout(setFormHeight, 200);
  };

  //更新
  useImperativeHandle(cRef, () => ({
    // 更新树
    formSetValue: (values: any) => {
      formSetValue(values);
    },
  }));

  return (
    <div style={{ padding: '16px 0 0 16px' }}>
      <Form form={searchForm}>
        <ProCard
          ref={searshCard}
          bordered
          bodyStyle={{ padding: '0', overflow: 'hidden', position: 'relative' }}
        >
          <div style={{ padding: '35px' }}>
            <Row>
              <Col span={24} style={{ textAlign: 'center', height: '68px' }}>
                <div style={{ display: 'inline-block' }}>
                  <div style={{ float: 'left', marginTop: '7px', marginRight: '12px' }}>
                    <div style={{ width: '116px', height: '26px' }}>{Icons.IconTitleReport}</div>
                  </div>
                  <div style={{ float: 'left' }}>
                    <div>
                      <Input.Group size={'large'} compact style={{ display: 'contents' }}>
                        <FormItem name="keyword" style={{ marginBottom: '0' }}>
                          <Input
                            style={{ width: '440px', textAlign: 'left' }}
                            onKeyPress={keywordPress}
                          />
                        </FormItem>
                        <Button
                          size={'large'}
                          type="primary"
                          style={{ width: '70px' }}
                          onClick={searchHandle}
                        >
                          搜索
                        </Button>
                      </Input.Group>
                    </div>
                    <div style={{ textAlign: 'left' }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          marginTop: '7px',
                          lineHeight: '22px',
                          height: '22px',
                          fontSize: '12px',
                        }}
                      >
                        热门搜索：
                        <span className={'search_word'}>
                          {hotMap.map((item: any) => {
                            return (
                              <>
                                <span
                                  style={{ cursor: 'pointer' }}
                                  key={item.keyword}
                                  onClick={() => hisClick(item.keyword)}
                                >
                                  {item.keyword}
                                </span>
                                <span className={'search_word_space'} key={item.keyword + '_|'}>
                                  &nbsp;|&nbsp;
                                </span>
                              </>
                            );
                          })}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </ProCard>
        <ProCard style={{ marginTop: '16px' }}>
          <div className={'search_form'} style={{ height: searchFormHeight }}>
            <div ref={searchRef}>
              <StandardFormRow title="所属类目" block>
                <FormItem name="classes" style={{ marginBottom: '0' }} initialValue={-1}>
                  <RadioSelect onChange={classesChange}>
                    {classesMap?.map((item: any) => (
                      <RadioSelect.Option value={item.v} key={item.v}>
                        {' '}
                        {item.n}{' '}
                      </RadioSelect.Option>
                    ))}
                  </RadioSelect>
                </FormItem>
              </StandardFormRow>
              <StandardFormRow title="行业分类" block>
                <FormItem name="industry" style={{ marginBottom: '0' }} initialValue={'全部'}>
                  <RadioSelect expandable={true} onChange={industryChange} onToggle={searchToggle}>
                    {industryMap?.map((item: any) => (
                      <RadioSelect.Option value={item.n}>{item.n}</RadioSelect.Option>
                    ))}
                  </RadioSelect>
                </FormItem>
              </StandardFormRow>
              {searchMode ? (
                <StandardFormRow title="选择日期" block>
                  <FormItem style={{ marginBottom: '0' }}>
                    <Space>
                      <FormItem name="dateStart" style={{ marginBottom: '0' }}>
                        <DatePicker onChange={dataStartChange} />
                      </FormItem>
                      <FormItem name="dateEnd" style={{ marginBottom: '0' }}>
                        <DatePicker onChange={dateEndChange} />
                      </FormItem>
                    </Space>
                  </FormItem>
                </StandardFormRow>
              ) : (
                ''
              )}
              {searchMode ? (
                <StandardFormRow title="相关公司" block>
                  <FormItem name="company" style={{ marginBottom: '0' }} initialValue={''}>
                    <Select
                      showSearch
                      allowClear
                      onSearch={companySearch}
                      onChange={companyChange}
                      filterOption={() => true}
                      style={{ width: '150px' }}
                    >
                      {companyMap?.map((item) => (
                        <Select.Option value={item.infoWindcode}>{item.compSname}</Select.Option>
                      ))}
                    </Select>
                  </FormItem>
                </StandardFormRow>
              ) : (
                ''
              )}
              {searchMode ? (
                <StandardFormRow title="卖方机构" block>
                  <FormItem name="seller" style={{ marginBottom: '0' }} initialValue={'全部'}>
                    <RadioSelect expandable={true} onChange={sellerSelect} onToggle={searchToggle}>
                      {sellerMap?.map((item: any) => {
                        return (
                          <RadioSelect.Option value={item.n} key={item.n}>
                            {item.n}
                          </RadioSelect.Option>
                        );
                      })}
                    </RadioSelect>
                  </FormItem>
                </StandardFormRow>
              ) : (
                ''
              )}
              {searchMode ? (
                <StandardFormRow title="参会形式" block>
                  <FormItem name="showLevel" style={{ marginBottom: '0' }} initialValue={-1}>
                    <RadioSelect onChange={showLevelSelect}>
                      <RadioSelect.Option value={-1} key={-1}>
                        全部
                      </RadioSelect.Option>
                      <RadioSelect.Option value={0} key={0}>
                        线上
                      </RadioSelect.Option>
                      <RadioSelect.Option value={1} key={1}>
                        线下
                      </RadioSelect.Option>
                      <RadioSelect.Option value={2} key={2}>
                        线上+线下
                      </RadioSelect.Option>
                    </RadioSelect>
                  </FormItem>
                </StandardFormRow>
              ) : (
                ''
              )}
              {/*{searchMode ? (*/}
              {/*  <StandardFormRow title="微信群名称" block>*/}
              {/*    <FormItem name="wechatGroup" style={{ marginBottom: '0' }} initialValue={-1}>*/}
              {/*      <RadioSelect*/}
              {/*        expandable={true}*/}
              {/*        onChange={wechatGroupSelect}*/}
              {/*        onToggle={searchToggle}*/}
              {/*      >*/}
              {/*        {wechatGroupMap?.map((item: any) => {*/}
              {/*          return (*/}
              {/*            <RadioSelect.Option value={item.v} key={item.v}>*/}
              {/*              {item.n}*/}
              {/*            </RadioSelect.Option>*/}
              {/*          );*/}
              {/*        })}*/}
              {/*      </RadioSelect>*/}
              {/*    </FormItem>*/}
              {/*  </StandardFormRow>*/}
              {/*) : (*/}
              {/*  ''*/}
              {/*)}*/}
            </div>
          </div>
          <Row>
            <Col style={{ textAlign: 'center' }} span={24}>
              <div className={'btn_expend'} onClick={btnExpand}>
                {searchMode ? <CaretUpOutlined /> : <CaretDownOutlined />}
              </div>
            </Col>
          </Row>
        </ProCard>
      </Form>
    </div>
  );
};

export default memo(SearchHistory);
