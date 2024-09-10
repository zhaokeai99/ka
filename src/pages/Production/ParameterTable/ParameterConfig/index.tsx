import { FEE_MAX } from '@/utils/utils';
import DebounceSelect from '@/components/DebounceSelect';
import { cardGutter, contentPadding } from '@/themes';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import ProCard from '@ant-design/pro-card';
import { TabLayoutContext } from '@/components/thfund-front-component/src';
import { Button, DatePicker, Form, message, Modal, Select, Tabs, Tag } from 'antd';
import { get as _get, mapValues as _mapValues, mapKeys as _mapKeys, map as _map } from 'lodash';
import moment from 'moment';
import useAuth from '@/components/Hooks/useAuth';
import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  getPanoramaFundInfo,
  queryByKeyword,
  queryChildProductInfoList,
  queryEffectVersionsByFundId,
  queryFundParamInfo,
  queryStatusByVersionId,
  reviewFundParamInfo,
  saveFundParamInfo,
  updateFundParamInfo,
  previewPdfResult,
  copyFundParamInfo,
} from '../service';
import { fundParamTradeRateObj, TabForm } from './components';
import styles from './index.less';

const { TabPane } = Tabs;
const { confirm } = Modal;
let timer: any = null;

const ParameterConfig = ({ match }: any) => {
  const { key: tabKey, setTabTitle, trigger, setRemoveCallbacks } = useContext(TabLayoutContext);
  const { params } = match;
  const { fundId, versionId: vid, actionType } = params;
  const [typeName] = useState(() => {
    if (actionType === 'add' || actionType === 'copy') return '新增';
    if (actionType === 'edit') return '编辑';
    return '查看';
  });
  const efTime = useRef(null);
  const [tabList, setTabList] = useState<any[]>([]);
  const [versionId, setVersionId] = useState(vid);
  const [originTabList, setOriginTabList] = useState<any>(null);
  const formRefs = useRef([]);
  const [currentTab, setCurrentTab] = useState('');
  const [statusName, setStatusName] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [value, setValue] = useState(null);
  const [newValue, setNewValue] = useState(null);
  const [childTable, setChildTable] = useState([]);
  const [secondCity, setSecondCity] = useState();
  const [effectTime, setEffectTime] = useState(moment());
  const [previewLoading, setPreviewLoading] = useState(false);
  const [fundName, setFundName] = useState(null);
  const isFundOperation = useAuth({ sn: '_production_parameter_table__operations' });

  const showModal = () => {
    setIsModalVisible(true);
  };

  // 表单数据变化提醒
  const setTabEditStatus = async (suffix = '*') => {
    if (fundName) {
      setTabTitle(tabKey, `${typeName}${fundName}`, suffix);
    } else {
      const fundInfoResult = await getPanoramaFundInfo({ fundId });
      setTabTitle(tabKey, `${typeName}${fundInfoResult.fundName}`, suffix);
      setFundName(fundInfoResult.fundName);
    }
  };

  // 预览参数表
  const previewPdf = async (newParams) => {
    if (timer) {
      return;
    }
    setPreviewLoading(true);
    message.info('正在生成预览文件，请稍后...');

    const fetchExportData = async () => {
      const result = await previewPdfResult(newParams);
      const { status, pdfUrl } = result;
      if (status === 'success') {
        timer = null;
        clearTimeout(timer);
        setPreviewLoading(false);
        if (pdfUrl) {
          window.open(pdfUrl);
        }
      } else if (status === 'wait') {
        timer = setTimeout(() => {
          fetchExportData();
        }, 3000);
      } else {
        setPreviewLoading(false);
        message.warn('导出异常!', 4);
        timer = null;
      }
    };
    fetchExportData();
  };

  // 一键复制
  const onCopyTo = async (p: any) => {
    confirm({
      title: '请您确认',
      icon: <ExclamationCircleOutlined />,
      content: `是否将(${p.label})配置复制到当前？`,
      onOk: async () => {
        if (value && secondCity) {
          const tabKeys = _map(tabList, 'childFundId');

          const submitDataList: any = [];
          const { data } = await copyFundParamInfo({
            fundId: fundId,
            sourceId: secondCity,
          });

          tabKeys.forEach((tabK, i) => {
            const formData = formRefs.current[tabK].getFieldsValue();
            const fundParamBasics = _get(formData, 'fundParamBasic', {});
            const fundParamSettlementAcctLists = _get(formData, 'fundParamSettlementAcctList', []);
            const fundParamSettlementAcctListData = data[i]?.fundParamSettlementAcctList;
            const list = fundParamSettlementAcctLists.map((item, index) => {
              if (!fundParamSettlementAcctListData) {
                return;
              }
              return {
                ...(fundParamSettlementAcctListData && fundParamSettlementAcctListData[index]),
                acctBank: item?.acctBank || fundParamSettlementAcctListData[index]?.acctBank,
                acctName: item?.acctName || fundParamSettlementAcctListData[index]?.acctName,
                acctNo: item?.acctNo || fundParamSettlementAcctListData[index]?.acctNo,
                payAcctBankNo:
                  item?.payAcctBankNo || fundParamSettlementAcctListData[index]?.payAcctBankNo,
              };
            });

            submitDataList.push({
              childFundId: tabK,
              ...data[i],
              fundParamBasic: {
                ...data[i]?.fundParamBasic,
                chargeMode: fundParamBasics?.chargeMode || data[i].fundParamBasic?.chargeMode,
                defaultDivideMethod:
                  fundParamBasics?.defaultDivideMethod ||
                  data[i].fundParamBasic?.defaultDivideMethod,
                fundCode: fundParamBasics?.fundCode || data[i].fundParamBasic?.fundCode,
                manageRate: fundParamBasics?.manageRate || data[i].fundParamBasic?.manageRate,
                escrowRate: fundParamBasics?.escrowRate || data[i].fundParamBasic?.escrowRate,
                fundTrusteeCode:
                  fundParamBasics?.fundTrusteeCode || data[i].fundParamBasic?.fundTrusteeCode,
                fundTrustee: fundParamBasics?.fundTrustee || data[i].fundParamBasic?.fundTrustee,
                salesRate: fundParamBasics?.salesRate || data[i].fundParamBasic?.salesRate,
                fundName: fundParamBasics?.fundName || data[i].fundParamBasic?.fundName,
                fundShortName:
                  fundParamBasics?.fundShortName || data[i].fundParamBasic?.fundShortName,
                registration: fundParamBasics?.registration || data[i].fundParamBasic?.registration,
                registrationCode:
                  fundParamBasics?.registrationCode || data[i].fundParamBasic?.registrationCode,
                raiseEndDate: fundParamBasics?.raiseEndDate?.format('YYYY/MM/DD'),
                raiseStartDate: fundParamBasics?.raiseStartDate?.format('YYYY/MM/DD'),
              },
              fundParamSettlementAcctList: list,
              ...(_mapValues(
                fundParamTradeRateObj,
                (_value, key) => data?.fundParamTradeRateList?.[key],
              ) || {}),
              ...(_mapKeys(
                _mapValues(fundParamTradeRateObj, (_value, key) => {
                  const result = data?.fundParamTradeRateList?.[key] || [];
                  if (result.length === 1) return [0];

                  return result
                    .filter(({ maxValue }: any) => maxValue !== FEE_MAX)
                    .map(({ maxValue }: any) => maxValue)
                    .join(',');
                }),
                (_value, key) => `${key}Str`,
              ) || {}),
            });
          });

          if (data) {
            message.success('复制成功！');
            setTabEditStatus();
            setTabList((list) =>
              list.map((l, i) => ({
                ...l,
                ...submitDataList[i],
                childFundId: l.childFundId,
              })),
            );
          }
        }
      },
    });
  };

  const handleOk = () => {
    setIsModalVisible(false);
    onCopyTo(newValue);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const getFormData = (eTime = null, defaultData = null) => {
    const tabKeys = _map(defaultData || tabList, 'childFundId');
    const submitDataList: any = [];
    const effectiveTime = eTime ? eTime.format('YYYY-MM-DD') : effectTime?.format('YYYY-MM-DD');

    tabKeys.forEach((tabK) => {
      const formData = formRefs.current[tabK].getFieldsValue();
      submitDataList.push({
        childFundId: tabK,
        ...formData,
        fundParamBasic: {
          ...formData?.fundParamBasic,
          raiseEndDate: formData?.fundParamBasic?.raiseEndDate?.format('YYYY/MM/DD'),
          raiseStartDate: formData?.fundParamBasic?.raiseStartDate?.format('YYYY/MM/DD'),
        },
        fundParamTradeRateList: _mapValues(fundParamTradeRateObj, (_value, key) => formData?.[key]),
      });
    });

    return {
      effectiveTime,
      submitDataList,
    };
  };

  const resetTabAndStatus = async ({ formData, vId }: any) => {
    setTabEditStatus('');
    setOriginTabList(formData);
    const status = await queryStatusByVersionId({ id: vId || versionId });
    setStatusName(status);
    trigger('PARAMETERCONFIG', { id: fundId });
  };

  // 提交
  const submitHandle = async (type: string) => {
    // 提交校验，预览或保存草稿不校验
    let pass = true;
    const tabKeys = _map(tabList, 'childFundId');

    const formData = getFormData();

    // 预览直接看
    if (type === '预览') {
      previewPdf({
        fundId,
        ...formData,
      });
      return;
    }

    // 保存草稿不做校验
    // 二次保存草稿
    if (type === '-2' && versionId) {
      const { success } = await updateFundParamInfo({
        ...formData,
        fundId,
        id: versionId,
        status: type,
      });
      if (success) {
        message.success('保存成功！');
        await resetTabAndStatus({ formData });
        return true;
      }
      return;
    }
    // 新增草稿
    if (type === '-2') {
      const { success, data } = await saveFundParamInfo({
        ...formData,
        fundId,
        status: type,
      });
      if (success) {
        message.success('保存成功！');
        setVersionId(data);
        await resetTabAndStatus({ formData, vId: data });
        return true;
      }
      return;
    }

    // 非保存草稿而是提交的需要校验完整性
    await Promise.all(tabKeys.map((tabK: any) => formRefs.current[tabK].validateFields())).catch(
      () => {
        pass = false;
        message.warn('必填项未填！请您检查所有配置项是否填全！');
      },
    );

    if (!formData.effectiveTime) pass = false;
    if (!pass) return;

    // 二次保存或编辑
    if (versionId) {
      const { success } = await updateFundParamInfo({
        ...formData,
        fundId,
        id: versionId,
        status: '0',
      });
      if (success) {
        message.success('提交成功！');
        await resetTabAndStatus({ formData });
        return true;
      }
      return;
    }
    // 第一次提交
    const { success, data } = await saveFundParamInfo({
      ...formData,
      fundId,
      status: '0',
    });
    if (success) {
      message.success('提交成功！');
      setVersionId(data);
      await resetTabAndStatus({ formData, vId: data });
    }
    return true;
  };

  // 重制
  const resetForm = () => {
    const tabKeys = _map(tabList, 'childFundId');
    setEffectTime(moment(originTabList.effectiveTime));
    const { submitDataList } = originTabList || {};
    tabKeys.forEach((tabK) => {
      const tempObj = submitDataList.find(({ childFundId }: any) => childFundId === tabK);

      formRefs.current[tabK].setFieldsValue({
        ...tempObj,
        fundParamBasic: {
          ...tempObj.fundParamBasic,
          raiseEndDate: tempObj?.fundParamBasic?.raiseEndDate
            ? moment(tempObj?.fundParamBasic?.raiseEndDate)
            : tempObj?.fundParamBasic?.raiseEndDate,
          raiseStartDate: tempObj?.fundParamBasic?.raiseStartDate
            ? moment(tempObj?.fundParamBasic?.raiseStartDate)
            : tempObj?.fundParamBasic?.raiseStartDate,
        },
      });
    });
    setTabEditStatus('');
  };

  //复用当前
  const copyCurrent = () => {
    const formData = formRefs.current[currentTab].getFieldsValue();
    const tabs = _map(tabList, 'childFundId');

    tabs.forEach((tab) => {
      if (tab !== currentTab) {
        const {
          fundCode,
          fundName: fName,
          fundShortName,
        } = formRefs.current[tab].getFieldValue('fundParamBasic');
        formRefs.current[tab].setFieldsValue({
          ...formData,
          fundParamBasic: {
            ...formData.fundParamBasic,
            fundCode,
            fundName: fName,
            fundShortName,
          },
        });
      }
    });

    setTabEditStatus();
    message.success('已将其他子基金按照当前基金内容设置完成!', 4);
  };

  // 生效
  const takeEffect = async () => {
    const effectiveTime = moment(effectTime).format('YYYY-MM-DD');

    if (!effectiveTime) return;

    const formData = getFormData(efTime.current);

    try {
      const originDataStr = JSON.stringify(originTabList);
      const currentDataStr = JSON.stringify(formData);

      if (originDataStr !== currentDataStr) {
        const result = await new Promise((resolve) => {
          confirm({
            title: '数据有更新，是否保存并立即生效？',
            icon: <ExclamationCircleOutlined />,
            okText: '保存并生效',
            cancelText: '取消',
            onOk() {
              resolve(true);
            },
            onCancel() {
              resolve(false);
            },
          });
        });
        if (!result) return;
        if (result) {
          const saveSuccess = await submitHandle('0');
          if (!saveSuccess) return;
        }
      }
    } catch (e) {
      console.error(e);
    }

    const onReturn = async () => {
      message.success('已成功！');
      const status = await queryStatusByVersionId({ id: versionId });
      setStatusName(status);
      setTabEditStatus('');
      trigger('PARAMETERCONFIG', { id: fundId });
    };

    confirm({
      title: '请您确认',
      icon: <ExclamationCircleOutlined />,
      content: `是否将 (${effectiveTime}) 设置为生效日？`,
      onOk: async () => {
        const {
          success,
          needConfirm,
          effectiveTime: et,
        } = await reviewFundParamInfo({
          id: versionId,
          effectiveTime,
        });
        if (success) {
          if (needConfirm) {
            confirm({
              title: '已存在生效参数表',
              icon: <ExclamationCircleOutlined />,
              content: `是否覆盖(${et})？`,
              onOk: async () => {
                const { success: s } = await reviewFundParamInfo({
                  id: versionId,
                  effectiveTime,
                  confirm: true,
                });

                if (s) {
                  onReturn();
                }
              },
            });
          } else {
            onReturn();
          }
        }
      },
    });
  };

  const onSecondCityChange = (nValue: any) => {
    setSecondCity(nValue);
  };

  //基金版本列表
  const getQueryEffectVersionsByFundId = async ({ id }: { id: string }) => {
    const data = await queryEffectVersionsByFundId({
      fundId: id,
    });
    setChildTable(data || []);
  };

  // 初始化
  useEffect(() => {
    (async () => {
      // 只有新增时存在草稿状态，新增无versionId
      const {
        data: result,
        eTime,
        status,
        id,
      } = await queryFundParamInfo({
        fundId,
        id: versionId,
      });

      if (id) {
        setVersionId(id);
      }

      // 新增
      if (!versionId && actionType === 'add' && status !== '草稿') {
        const childProduct = await queryChildProductInfoList({ fundId });
        const defaultData = childProduct.map((product: any) => ({
          childFundId: product.id,
          fundParamBasic: {
            fundName: product.fundName,
            fundShortName: product.fundShortName,
            fundCode: product.fundCode,
            chargeMode: product.chargeMode,
            manageRate: product.manageRate,
            escrowRate: product.escrowRate,
            salesRate: product.salesRate,
            fundManager: product.fundManager,
            fundManagerCode: product.fundManagerCode,
            fundTrustee: product.fundTrustee,
            fundTrusteeCode: product.fundTrusteeCode,
            defaultDivideMethod: product.defaultDivideMethod,
            raiseStartDate: product.raiseStartDate,
            raiseEndDate: product.raiseEndDate,
          },
          fundParamSettlementAcctList: product.acctResults,
          fundParamSettlementBusiList: product.fundParamSettlementBusiList,
          fundParamLimitList: product.fundParamLimitList,
        }));
        setTabList(defaultData);
        setCurrentTab(`${_get(childProduct, '[0].id', '')}`);
        // 设置初始值
        const formData = getFormData(moment(eTime), defaultData);
        setOriginTabList(formData);
      } else {
        setEffectTime(moment(eTime));
        setCurrentTab(`${_get(result, '[0].childFundId', '')}`);
        setTabList(result);
        // 设置初始值
        const formData = getFormData(moment(eTime), result);
        setOriginTabList(formData);
        setStatusName(status);
      }

      // 不是复制已生效的来的
      if (versionId && actionType === 'copy') {
        setVersionId('');
        setStatusName('');
      }

      if (versionId && actionType !== 'add' && actionType !== 'copy') {
        const statusNow = await queryStatusByVersionId({ id: versionId });
        setStatusName(statusNow);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabKey]);

  useEffect(() => {
    if (value) {
      getQueryEffectVersionsByFundId({ id: value });
    }
  }, [value]);

  useEffect(() => {
    (async () => {
      const fundInfoResult = await getPanoramaFundInfo({ fundId });
      setFundName(fundInfoResult.fundName);
      setTabTitle(tabKey, `${typeName}${fundInfoResult.fundName}`);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 设置关闭页签回调
  useEffect(() => {
    setRemoveCallbacks((callbacks: any) => ({
      ...callbacks,
      [tabKey]: async () => {
        try {
          const originDataStr = JSON.stringify(originTabList);
          const formData = getFormData(efTime.current);
          const currentDataStr = JSON.stringify(formData);
          if (originDataStr !== currentDataStr) {
            const result = await new Promise((resolve) => {
              confirm({
                title: '您确定要关闭当前页签么？',
                icon: <ExclamationCircleOutlined />,
                content: '当前表单已做修改，并且尚未保存，如果继续关闭将可能丢失内容！',
                onOk() {
                  resolve(true);
                },
                onCancel() {
                  resolve(false);
                },
              });
            });
            return result;
          }
        } catch (error) {
          console.error(error);
          return true;
        }
        return true;
      },
    }));

    return () => {
      setRemoveCallbacks((callbacks: any) => ({
        ...callbacks,
        [tabKey]: null,
      }));
      efTime.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [originTabList]);

  return (
    <ProCard
      ghost
      size="small"
      direction="column"
      className={styles['parameter-table']}
      gutter={[cardGutter, cardGutter]}
      style={{ padding: contentPadding }}
    >
      <ProCard className={styles['btn-content']}>
        {isFundOperation && statusName === '已提交' && (
          <Button type="primary" onClick={takeEffect}>
            生效
          </Button>
        )}
        {isFundOperation &&
          statusName !== '已生效' &&
          statusName !== '将生效' &&
          actionType !== 'read' && (
            <Button type="primary" onClick={() => submitHandle('-2')}>
              保存草稿
            </Button>
          )}
        {isFundOperation &&
          statusName !== '已生效' &&
          statusName !== '将生效' &&
          actionType !== 'read' && (
            <Button type="primary" onClick={() => submitHandle('0')}>
              提交
            </Button>
          )}
        {isFundOperation &&
          statusName !== '已生效' &&
          statusName !== '将生效' &&
          actionType !== 'read' && (
            <Button type="primary" onClick={resetForm}>
              重置
            </Button>
          )}
        {isFundOperation &&
          statusName !== '已生效' &&
          statusName !== '将生效' &&
          tabList.length > 1 &&
          actionType !== 'read' && (
            <Button type="primary" onClick={copyCurrent}>
              复用当前
            </Button>
          )}
        {isFundOperation &&
          (actionType === 'add' || actionType === 'copy') &&
          statusName !== '已生效' &&
          statusName !== '将生效' && (
            <>
              <Button type="primary" onClick={showModal}>
                一键复制
              </Button>
              <Modal
                width={400}
                title="复制基金"
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
              >
                <>
                  <Form.Item label="基金名称">
                    <DebounceSelect
                      showSearch
                      placeholder="名称、代码支持模糊搜索"
                      fetchOptions={queryByKeyword}
                      onChange={(val) => {
                        setValue(val?.value);
                        setNewValue(val);
                      }}
                    />
                  </Form.Item>
                  <Form.Item label="基金版本">
                    <Select
                      value={secondCity}
                      options={childTable}
                      fieldNames={{
                        label: 'effectStatus',
                        value: 'id',
                      }}
                      onChange={onSecondCityChange}
                    />
                  </Form.Item>
                </>
              </Modal>
            </>
          )}
        <Button type="primary" onClick={() => submitHandle('预览')} loading={previewLoading}>
          预览参数表
        </Button>
        <span className={styles['ta-parameter-effect-time']}>生效日期: </span>
        <DatePicker
          disabled={actionType === 'read' ? true : false}
          value={effectTime}
          onChange={(date) => {
            efTime.current = date;
            setEffectTime(date);
            setTabEditStatus();
          }}
          allowClear={false}
        />
      </ProCard>
      <ProCard className={styles['tabs-content']}>
        <Tabs
          type="card"
          animated={true}
          activeKey={currentTab}
          tabBarExtraContent={
            statusName === '将生效' || statusName === '已生效' || statusName === '已提交' ? (
              <Tag className={styles['tabs-tag']} color="#87d068">
                {statusName}
              </Tag>
            ) : statusName ? (
              <Tag color="#f50">{statusName}</Tag>
            ) : null
          }
          onChange={(tk) => setCurrentTab(tk)}
        >
          {/* TODO 后端回返回一个数组，拿到数据循环生成TabPane */}
          {tabList.length &&
            tabList.map((tabData: any) => {
              return (
                <TabPane
                  tab={tabData?.fundParamBasic?.fundShortName}
                  key={`${tabData.childFundId}`}
                  forceRender={true}
                >
                  <TabForm
                    ref={formRefs}
                    index={tabData.childFundId}
                    disabled={actionType === 'read'}
                    name="parameter-config"
                    changeValues={setTabEditStatus}
                    data={tabData}
                  />
                </TabPane>
              );
            })}
        </Tabs>
      </ProCard>
    </ProCard>
  );
};

export default ParameterConfig;
