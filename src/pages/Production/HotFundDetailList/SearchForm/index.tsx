import React, { memo, useCallback, useMemo, useState, useEffect } from 'react';
import ProCard from '@ant-design/pro-card';
import {
  Form,
  Button,
  AutoComplete,
  Spin,
  Col,
  DatePicker,
  TreeSelect,
  Input,
  Select,
  Switch,
} from 'antd';
import { DownOutlined, SearchOutlined, UpOutlined } from '@ant-design/icons';
import styles from './index.less';
import {
  pullDownLinkage,
  queryClassify,
  queryDropOptions,
  queryFundManagers,
  queryLikeFundInfo,
  queryProductManagers,
} from '../service';
import { debounce as _debounce } from 'lodash';
import { RadioSelect } from '@/components/TagSelect';
import DebounceSelect from '@/components/DebounceSelect';
import moment from 'moment';

const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';

const SearchForm: React.FC<any> = ({ onFinish, onReset }) => {
  const [form] = Form.useForm();
  const [collapsed, setCollapsed] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [optionsData, setOptionsData] = useState<any[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [oneClassification, setOneClassification] = useState<any[]>([]);
  const [assetManagers, setAssetManagers] = useState<any[]>([]);
  const [classification, setClassification] = useState<any[]>([]);
  const [classifyObj, setClassifyObj] = useState({});
  const [productStageList, setProductStageList] = useState<any[]>([]);
  const [classifyOpt, setClassifyOpt] = useState<any[]>([]);
  const [switchStatus, setSwitchStatus] = useState(false);

  useEffect(() => {
    (async () => {
      const result = await queryDropOptions();
      const classify = await queryClassify();
      setClassifyOpt(classify);
      setAssetManagers(result.assetManagers);
      setClassification(result.classification);
      setClassifyObj(result.classifyObj);
      setProductStageList(result.productStageList);
      // setOneClassification(result.oneClassification);
    })();
  }, []);

  const queryProManagerOpt = useCallback(async (val: any) => {
    return await queryProductManagers({ productManager: val });
  }, []);

  const queryFundManagerOpt = useCallback(async (val: any) => {
    return await queryFundManagers({ fundManager: val });
  }, []);

  const queryOptions = useCallback(
    _debounce(async (value = '') => {
      setFetching(true);
      const result = await queryLikeFundInfo({ fundName: value });
      setFetching(false);
      setOptionsData(result);
    }, 800),
    [],
  );

  const handleChangeVal = useCallback(
    (values: any = {}) => {
      const { setupDate, openDate, collectDate, fundName, ...others } = values || {};
      onFinish({
        ...others,
        fundName: fundName || searchValue,
        approvalBeginDate: setupDate && setupDate[0] ? moment(setupDate[0]).format(dateFormat) : '',
        approvalEndDate: setupDate && setupDate[1] ? moment(setupDate[1]).format(dateFormat) : '',
        openBeginDate: openDate && openDate[0] ? moment(openDate[0]).format(dateFormat) : '',
        openEndDate: openDate && openDate[1] ? moment(openDate[1]).format(dateFormat) : '',
        collectBeginDate:
          collectDate && collectDate[0] ? moment(collectDate[0]).format(dateFormat) : '',
        collectEndDate:
          collectDate && collectDate[1] ? moment(collectDate[1]).format(dateFormat) : '',
      });
    },
    [searchValue],
  );

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
          onSelect={(val: any) => {
            const handleStr = val.split('/')[0];
            setSearchValue(handleStr);
            handleChangeVal({ fundName: handleStr, ...form.getFieldsValue() });
          }}
          value={searchValue}
        >
          <Input
            style={{ width: '480px' }}
            placeholder="基金产品代码/名称 模糊搜索"
            size="large"
            onPressEnter={() => handleChangeVal(form.getFieldsValue())}
          />
        </AutoComplete>
        <Button
          size="large"
          style={{ marginLeft: '12px' }}
          type="primary"
          icon={<SearchOutlined />}
          onClick={() => handleChangeVal(form.getFieldsValue())}
        >
          搜索
        </Button>
      </>
    ),
    [optionsData, searchValue, fetching],
  );

  // 重置
  const reset = useCallback(() => {
    form.resetFields();
    setSearchValue('');
    setSwitchStatus(false);
    onReset();
  }, []);

  return (
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
      style={{ marginBottom: 12 }}
      headerBordered
      collapsed={collapsed}
    >
      <Form
        layout="inline"
        form={form}
        onFinish={handleChangeVal}
        className={styles['search-form-style']}
      >
        <Col span={24} style={{ marginBottom: 12 }}>
          <Form.Item
            style={{ borderBottom: '1px dashed #ddd' }}
            name="productType"
            label="产品分类"
          >
            <RadioSelect
              onChange={async (val: any) => {
                const data = await pullDownLinkage({ keyword: classifyObj[val] });
                setOneClassification(data);
              }}
              expandable={false}
            >
              {classification.map((item: any) => (
                <RadioSelect.Option value={item.value} key={item.value}>
                  {item.label}
                </RadioSelect.Option>
              ))}
            </RadioSelect>
          </Form.Item>
        </Col>
        {oneClassification && oneClassification.length !== 0 && (
          <Col span={24} style={{ marginBottom: 12 }}>
            <Form.Item
              style={{ borderBottom: '1px dashed #ddd' }}
              name="productTypeOne"
              label="一级分类"
            >
              <RadioSelect expandable={false}>
                {oneClassification.map((item: any) => (
                  <RadioSelect.Option value={item.value} key={item.value}>
                    {item.label}
                  </RadioSelect.Option>
                ))}
              </RadioSelect>
            </Form.Item>
          </Col>
        )}
        <Col
          span={24}
          style={{
            marginBottom: 24,
            display: 'flex',
            flexDirection: 'row',
            borderBottom: '1px dashed #ddd',
          }}
        >
          <Col span={8} style={{ marginBottom: 12 }}>
            <Form.Item name="assetManager" label="管理人">
              <Select placeholder="请选择" options={assetManagers} />
            </Form.Item>
          </Col>
          <Col span={8} style={{ marginBottom: 12 }}>
            <Form.Item label="我的分类" name="treeId">
              <TreeSelect allowClear placeholder="请输入" treeData={classifyOpt} />
            </Form.Item>
          </Col>
        </Col>
        <Col span={8} style={{ marginBottom: 24 }}>
          <Form.Item label="成立日期" name="setupDate">
            <RangePicker style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={8} style={{ marginBottom: 24 }}>
          <Form.Item label="开放期" name="openDate">
            <RangePicker style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="募集期" name="collectDate">
            <RangePicker style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="产品经理" name="productManager">
            <DebounceSelect
              labelInValue={false}
              showSearch
              allowClear
              placeholder="请选择"
              fetchOptions={queryProManagerOpt}
              isInit={true}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="基金/投资经理" name="fundManager">
            <DebounceSelect
              labelInValue={false}
              showSearch
              allowClear
              placeholder="请选择"
              fetchOptions={queryFundManagerOpt}
              isInit={true}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="产品状态" name="productStage">
            <Select allowClear placeholder="请选择" options={productStageList} />
          </Form.Item>
        </Col>
        <Col span={24} style={{ marginTop: 24, textAlign: 'right' }}>
          <span>
            <span>仅查看已关注基金：</span>
            <Switch
              checked={switchStatus}
              style={{ marginRight: 12 }}
              onChange={(val: any) => {
                setSwitchStatus(val);
                handleChangeVal({ ...form.getFieldsValue(), follows: val });
              }}
              checkedChildren="开启"
              unCheckedChildren="关闭"
            />
          </span>
          <Button style={{ marginRight: 12 }} onClick={reset}>
            重置
          </Button>
          <Button type="primary" htmlType="submit">
            查询
          </Button>
        </Col>
      </Form>
    </ProCard>
  );
};

export default memo(SearchForm);
