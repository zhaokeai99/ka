import React, { useEffect, useCallback, useState } from 'react';
import ProCard from '@ant-design/pro-card';
import { Button, Form, Select, DatePicker, Row, Col } from 'antd';
import moment from 'moment';
import { publicSentimentList, queryIndustryNodeTree } from '../service';

const { Option, OptGroup } = Select;
const dateFormat = 'YYYY-MM-DD';
const { RangePicker }: any = DatePicker;

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

//  搜索
interface ViewSearchProps {
  handleSearch: (value: any) => void;
}

const ViewSearch = (props: ViewSearchProps) => {
  const { handleSearch } = props;
  const [form] = Form.useForm<{
    emotion: string;
    chainName: any;
    chainNodeName: any;
    replyDate: any[];
  }>();
  const chainNameValue: any = Form.useWatch('chainName', form);
  const [chainData, setChainData] = useState<any>([]);
  const [nodeData, setNodeData] = useState([]);
  const [defaultName, setDefaultName] = useState<any>({
    value: undefined,
    label: undefined,
    key: undefined,
  });

  // 获取下拉数据
  const getIndustryNodeTree = useCallback(
    async ({ chainId, queryType }) => {
      const { success, data } = await queryIndustryNodeTree({
        chainId,
        queryType,
      });

      if (success) {
        return data;
      } else {
        return [];
      }
    },
    [chainNameValue],
  );

  // 多维数组 变成一维数组
  const flatten: any = (arr: any[]) => {
    return [].concat(
      ...arr?.map((item: any) => {
        return item?.children //判断是否有子项，否则递归flatten报错
          ? [].concat(item, ...flatten(item?.children))
          : [].concat(item);
      }),
    );
  };

  // 获取半导体的信息
  const findBDT = (arr: { nodeName: string; nodeId: string | number }[]) => {
    if (!Array.isArray(arr)) return;

    const arrList = flatten(arr);

    return arrList.filter((item: { nodeName: string }) => item.nodeName === '半导体');
  };

  // 获取行业列表
  useEffect(() => {
    (async () => {
      const result = await getIndustryNodeTree({
        chainId: '',
        queryType: 'chain',
      });

      if (result?.length) {
        await setChainData(result || []);

        if (result[0]?.children?.length) {
          const findBDTInfo = findBDT(result);

          const { nodeName, nodeId } = findBDTInfo[0] || result[0]?.children[0] || {};
          const nameVal = { label: nodeName, value: nodeId, key: nodeId } || {};

          form.setFieldValue('chainName', nameVal);
          setDefaultName(nameVal);

          handleSearch({
            ...form.getFieldsValue(),
            current: 1,
            pageSize: 10,
            isFormSearch: true,
          });
        }
      }
    })();
  }, []);

  // 行业改变，请求节点的接口
  useEffect(() => {
    (async () => {
      form.setFieldValue('chainNodeName', undefined);

      setNodeData([]);

      if (chainNameValue?.value) {
        const nodeList = await getIndustryNodeTree({
          chainId: chainNameValue?.value,
          queryType: 'node',
        });

        if (nodeList?.length) {
          setNodeData(nodeList || []);
        }
      }
    })();
  }, [chainNameValue]);

  // 查询
  const onSearch = () => {
    handleSearch({
      ...form.getFieldsValue(),
      current: 1,
      pageSize: 10,
      isFormSearch: true,
    });
  };

  // 重置
  const onReset = () => {
    form.resetFields();

    handleSearch({
      ...form.getFieldsValue(),
      isFormSearch: true,
      current: 1,
      pageSize: 10,
    });
  };

  return (
    <ProCard size="small" gutter={[0, 8]} style={{ paddingTop: 24, paddingBottom: 0 }}>
      <Form
        {...layout}
        form={form}
        layout="horizontal"
        initialValues={{
          replyDate: [moment(moment().subtract(30, 'days').format(dateFormat)), moment()],
          chainName: defaultName,
        }}
      >
        <Row>
          <Col span={5}>
            <Form.Item label="情绪" name="emotion">
              <Select allowClear placeholder="请选择情绪">
                {(publicSentimentList || []).map(({ value, label }) => {
                  return (
                    <Option key={value} value={value}>
                      {label}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item label="行业" name="chainName">
              <Select labelInValue placeholder="请选择行业">
                {(chainData || []).map(({ nodeName, nodeId, children = [] }: any) => (
                  <OptGroup key={nodeId} label={nodeName}>
                    {children?.map(({ nodeId: val, nodeName: title }: any) => {
                      return (
                        <Option key={val} value={val}>
                          {title}
                        </Option>
                      );
                    })}
                  </OptGroup>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item label="节点" name="chainNodeName">
              <Select allowClear placeholder="请选择节点">
                {(nodeData || []).map(({ nodeName, children = [] }) => (
                  <OptGroup key={nodeName} label={nodeName}>
                    {children?.map(({ nodeName: title }) => {
                      return (
                        <Option key={title} value={title}>
                          {title}
                        </Option>
                      );
                    })}
                  </OptGroup>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="日期" name="replyDate">
              <RangePicker suffixIcon={null} style={{ width: '100%' }} format={dateFormat} />
            </Form.Item>
          </Col>
          <Col span={3} style={{ textAlign: 'right' }}>
            <Button htmlType="button" onClick={onReset}>
              重置
            </Button>
            <Button type="primary" style={{ marginLeft: 8 }} onClick={onSearch}>
              查询
            </Button>
          </Col>
        </Row>
      </Form>
    </ProCard>
  );
};

export default ViewSearch;
