import React, { useCallback, useEffect, useState, useContext, memo } from 'react';
import {
  ProFormDatePicker,
  ProFormText,
  ProFormRadio,
  ProFormCheckbox,
} from '@ant-design/pro-form';
import ProCard from '@ant-design/pro-card';
import { Form, Button, message, Modal, Spin } from 'antd';
import { history } from 'umi';
import { cardGutter, contentPadding } from '@/themes';
import ProCardPlus from '@/components/ProCardPlus';
import { TabLayoutContext } from '@/components/thfund-front-component/src';
import { cloneDeep, isFunction } from 'lodash';
import moment from 'moment';
import styles from './index.less';
import {
  queryExampleByFundId,
  downloadExcel,
  makeExampleByFundCode,
  updateState,
  updateExample,
  exampleByFundInfoType,
} from '../service';

const formLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 13 },
};
const templateCode = 'o3Template';

const DetailFile: React.FC = ({ match }: any) => {
  const [formRef] = Form.useForm();
  const { params } = match;
  const { fundId, type } = params;
  const templateVersion = history?.location?.query?.templateVersion;
  const [exampleByFundInfo, setExampleByFundInfo] = useState<exampleByFundInfoType>({});
  const { key: tabKey, removeTab } = useContext(TabLayoutContext);
  const [isChange, setIschange] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const [settlementFlagOp, setSettlementFlagOp] = useState([]);
  const [unfreezeFlagOp, setUnfreezeFlagOp] = useState([]);

  const formaterData = (data: any) => {
    // 为切换是否属于解冻套餐 联动 保存初始化选项
    if (data.topicSorts.length > 2) {
      data.topicSorts[2].topics.map((item: any) => {
        if (item.topicCode === 'settlementFlag') {
          const value = item.topicDefValue.reduce((pre: any, cur: any) => {
            pre.push(cur.key);
            return pre;
          }, []);
          setSettlementFlagOp(value);
        }
        if (item.topicCode === 'unfreezeFlag') {
          const value = item.topicDefValue.reduce((pre: any, cur: any) => {
            pre.push(cur.key);
            return pre;
          }, []);
          setUnfreezeFlagOp(value);
        }
      });
    }
  };
  // 获取单个实例信息
  const getExampleByFundInfo = async () => {
    setLoading(true);
    const tempParams = {
      templateCode,
      fundId,
      templateVersion,
    };
    const { success, data } = await queryExampleByFundId(tempParams);
    setLoading(false);
    if (success) {
      setExampleByFundInfo(data);
      formaterData(data);
    }
  };

  // 是否置灰函数
  const isDisabled = useCallback(
    (name: any) => type === 'look' || type === 'audit' || ['FundCode', 'FundName'].includes(name),
    [],
  );

  // 0:单选
  const detailRadio = useCallback((item: any) => {
    let value = undefined;
    const options = item?.value?.map((element: any) => {
      if (element.checked) value = element.key;
      return { ...element, label: element.oprions, value: element.key };
    });

    return (
      <ProFormRadio.Group
        name={item.topicCode}
        label={item.topicName}
        options={options}
        initialValue={value}
        disabled={isDisabled(item.topicCode)}
        rules={[{ required: item.required === '1', message: '请选择' }]}
        extra={<div dangerouslySetInnerHTML={{ __html: item.topicRemark }} />}
      />
    );
  }, []);

  // 1：多选
  const detailCheckbox = useCallback((item: any) => {
    const value: any[] = [];
    const options = item?.value?.map((element: any) => {
      if (element.checked) value.push(element.key);
      return { ...element, label: element.oprions, value: element.key };
    });
    return (
      <ProFormCheckbox.Group
        name={item.topicCode}
        label={item.topicName}
        options={options}
        initialValue={value}
        disabled={isDisabled(item.topicCode)}
        rules={[{ required: item.required === '1', message: '请选择' }]}
        extra={<div dangerouslySetInnerHTML={{ __html: item.topicRemark }} />}
      />
    );
  }, []);

  // 2：文本
  const detailDefault = useCallback((item: any) => {
    return (
      <ProFormText
        key={item.topicName}
        name={item.topicCode}
        label={item.topicName}
        extra={<div dangerouslySetInnerHTML={{ __html: item.topicRemark }} />}
        initialValue={item.value || ''}
        disabled={isDisabled(item.topicCode)}
        rules={[{ required: item.required === '1' }]}
      />
    );
  }, []);

  // 3：日期
  const detailData = useCallback((item: any) => {
    return (
      <ProFormDatePicker
        name={item.topicCode}
        label={item.topicName}
        initialValue={item.value || undefined}
        extra={<div dangerouslySetInnerHTML={{ __html: item.topicRemark }} />}
        rules={[{ required: item.required === '1' }]}
        disabled={isDisabled(item.topicCode)}
        fieldProps={{
          style: { width: '100%' },
          format: 'YYYY-MM-DD',
        }}
      />
    );
  }, []);

  // 渲染组件方法
  const renderFun = {
    // 0:单选 1：多选； 2：文本； 3：日期；
    // 单选
    '0': detailRadio,
    // 多选
    '1': detailCheckbox,
    // 普通input
    '2': detailDefault,
    // 日期
    '3': detailData,
  };

  // 保存
  const save = useCallback(
    async (clickType: string) => {
      // 校验
      let pass = true;
      const submitDataList = cloneDeep(exampleByFundInfo);
      const formValues = formRef.getFieldsValue();
      await formRef.validateFields().catch(() => {
        pass = false;
        // message.warn('必填项未填！请您检查所有配置项是否填全！');
      });

      if (!pass && clickType === 'generateReport') return;
      submitDataList?.topicSorts?.slice(1).forEach((element: any) => {
        element?.topics?.forEach((topicsItem: any) => {
          // 单选赋值
          if (topicsItem?.topicType === '0') {
            topicsItem?.value?.forEach((item: any) => {
              item.checked = item?.key === formValues[topicsItem?.topicCode] ? true : false;
            });
            // 多选赋值
          } else if (topicsItem?.topicType === '1') {
            topicsItem?.value?.forEach((item: any) => {
              item.checked = formValues[topicsItem?.topicCode]?.includes(item.key) ? true : false;
            });
          } else {
            topicsItem.value = formValues[topicsItem?.topicCode];
          }
        });
      });

      const { success } = await updateExample({
        ...submitDataList,
        submit: clickType === 'generateReport' ? true : false,
      });
      if (success) {
        message.success(clickType === 'generateReport' ? '生成成功！' : '保存成功！');
        removeTab(tabKey);
      }
    },
    [exampleByFundInfo],
  );

  // 关闭
  const close = useCallback(() => {
    if (isChange) {
      Modal.confirm({
        title: '提示！',
        content: '存在修改是否要保存？',
        okText: '保存并关闭',
        cancelText: '不保存并关闭',
        onOk: () => save('save'),
        onCancel: () => removeTab(tabKey),
      });
    } else {
      removeTab(tabKey);
    }
  }, [isChange]);

  // 审核 通过不通过 状态：2：复核通过，3：复核失败，4：已发送
  const pass = useCallback(async (value: any) => {
    setLoading(true);
    const updateStateParams = {
      templateCode,
      fundId,
      templateVersion,
      state: value,
    };
    const { success } = await updateState(updateStateParams);
    setLoading(false);
    if (success) {
      if (value === '2') {
        Modal.confirm({
          title: '提示！',
          content: '是否立即发送邮件？',
          okText: '发送邮件',
          cancelText: '关闭',
          onOk: () => {
            history?.push(
              `/production/setting/parameterManage?fundId=${fundId}&templateVersion=${templateVersion}&sendModalShow=true`,
            );
          },
          afterClose: () => removeTab(tabKey),
        });
      } else {
        removeTab(tabKey);
      }
      message.success('复核完成');
    }
  }, []);

  // 渲染按钮
  const btnList = {
    look: [
      {
        title: '关闭',
        click: close,
      },
    ],
    modify: [
      {
        title: '保存',
        type: 'primary',
        click: () => save('save'),
      },
      {
        title: '生成参数表',
        type: 'primary',
        click: () => save('generateReport'),
      },
      {
        title: '关闭',
        click: close,
      },
    ],
    audit: [
      {
        title: '通过',
        type: 'primary',
        click: () => pass('2'),
      },
      {
        title: '不通过',
        type: 'primary',
        click: () => pass('3'),
      },
      {
        title: '关闭',
        click: close,
      },
    ],
  };

  // 下载excel
  const onDownload = useCallback(() => {
    // if (type === 'modify' || type === 'audit') {
    return (
      <Button
        type="primary"
        loading={btnLoading}
        onClick={async () => {
          if (type === 'modify' || type === 'look') {
            window.open(exampleByFundInfo.excelUrl);
          }
          if (type === 'audit') {
            setBtnLoading(true);
            const { success, data } = await downloadExcel({
              templateCode,
              fundId,
              templateVersion,
            });
            setBtnLoading(false);
            if (!success || !data) {
              return;
            }
            window.open(data);
          }
        }}
      >
        下载excel
      </Button>
    );
    // } else {
    //   return null;
    // }
  }, [type, exampleByFundInfo.excelUrl]);

  // 点击重新生成
  const rebuildClick = useCallback(async () => {
    setLoading(true);
    const aDate = formRef.getFieldValue('ApprovalStartDate');
    const { success, data } = await makeExampleByFundCode({
      templateCode,
      fundId,
      templateVersion,
      approvalStartDate: moment(aDate).format('YYYY-MM-DD'),
    });
    setLoading(false);
    if (success) {
      const dataMap = {};
      setExampleByFundInfo(data);
      formaterData(data);
      // 如果版本号改变需要改变url上的参数 防止刷新出现问题
      if (data.templateVersion !== templateVersion)
        history.replace({ search: `?templateVersion=${data.templateVersion}` });

      // 单选多选取值
      data?.topicSorts?.slice(1)?.map((item: any) => {
        item?.topics?.map((topicsItem: any) => {
          if (topicsItem?.topicType === '0') {
            const v = topicsItem?.value?.filter((i: any) => i.checked)[0]?.key;
            dataMap[topicsItem?.topicCode] = v || undefined;
          } else if (topicsItem?.topicType === '1') {
            const v: any = [];
            topicsItem?.value?.forEach((i: any) => {
              if (i?.checked) v.push(i?.key);
              dataMap[topicsItem?.topicCode] = v || undefined;
            });
          } else {
            dataMap[topicsItem?.topicCode] = topicsItem?.value || undefined;
          }
        });
      });
      formRef.setFieldsValue(dataMap);
    }
  }, []);

  // 重新生成
  const rebuild = useCallback(
    (index: number) => {
      if (type === 'modify' && index === 1) {
        return (
          <Button type="primary" onClick={rebuildClick}>
            重新生成
          </Button>
        );
      } else {
        return null;
      }
    },
    [type],
  );

  // 联动设置值
  const setValue = (belongUnfreezePackage: any) => {
    // 若会计选择非解冻套餐(key0)，则“自动业务交收标志”和“一键解冻业务标志”全不选；
    // 2、若会计选择解冻套餐:公募(key1)，则“自动业务交收标志”和“一键解冻业务标志”全选；
    // 3、若会计选择解冻套餐:专户(key2)，则“自动业务交收标志”和“一键解冻业务标志”除71902 TA认申购款到账，其余全选。

    if (belongUnfreezePackage === 'key0') {
      formRef.setFieldsValue({ settlementFlag: [], unfreezeFlag: [] });
    } else if (belongUnfreezePackage === 'key1') {
      formRef.setFieldsValue({ settlementFlag: settlementFlagOp, unfreezeFlag: unfreezeFlagOp });
    } else if (belongUnfreezePackage === 'key2') {
      const va = settlementFlagOp.filter((x) => x !== 'key8');
      formRef.setFieldsValue({ settlementFlag: va, unfreezeFlag: unfreezeFlagOp });
    } else {
      return;
    }
  };

  // 点击关闭提示存在修改
  const handleFormChange = (changedValues: any) => {
    console.log('changedValues', changedValues);
    if (changedValues.belongUnfreezePackage !== undefined) {
      setValue(changedValues.belongUnfreezePackage);
    }
    setIschange(true);
  };

  useEffect(() => {
    getExampleByFundInfo();
  }, []);

  return (
    <ProCard
      // title="基金参数填写"
      extra={onDownload()}
      style={{ padding: contentPadding }}
      direction="column"
      ghost
      gutter={[0, cardGutter]}
      size="small"
      className={styles['parameter-manage']}
    >
      <Spin tip="加载中..." spinning={loading}>
        <Form form={formRef} {...formLayout} onValuesChange={handleFormChange}>
          {/* 数组第一项是邮件设置 用不到 截掉 */}
          {Array.isArray(exampleByFundInfo?.topicSorts) &&
            exampleByFundInfo?.topicSorts?.slice(1).map((item: any, index: number) => (
              <ProCardPlus
                title={item?.topSort}
                extra={rebuild(index)}
                headStyle={{ position: 'relative' }}
                style={{ marginBottom: '8px' }}
              >
                {Array.isArray(item?.topics) &&
                  item?.topics.map(
                    (topicsItem: any) =>
                      isFunction(renderFun[topicsItem.topicType]) &&
                      renderFun[topicsItem.topicType](topicsItem),
                  )}
              </ProCardPlus>
            ))}
          <div
            style={{
              height: '60px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {btnList[type]?.map((item: any) => (
              <Button style={{ marginRight: 20 }} type={item?.type} onClick={item?.click}>
                {item?.title}
              </Button>
            ))}
          </div>
        </Form>
      </Spin>
    </ProCard>
  );
};

export default memo(DetailFile);
