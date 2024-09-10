import React, { useEffect, useRef, useState } from 'react';
import { message, Button, Upload } from 'antd';
import type { ProFormInstance } from '@ant-design/pro-form';
import {
  ModalForm,
  ProFormSelect,
  ProFormRadio,
  ProFormText,
  ProFormDatePicker,
  ProFormDependency,
} from '@ant-design/pro-form';
import { queryDis, queryCareFeeFundInfo, addCareFee, updateCareFee } from './service';
// import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import CommonUpload from '@/components/CommonUpload';
import './index.less';

const maxNumber = 99999999999999;
interface ModalProps {
  visible: boolean;
  modalType: string;
  initValues?: any;
  onClose: (val?: string) => void;
}

const numCheck = (_, value: any, callback: (val?: any) => void) => {
  const numStr = String(value).trim(),
    strOne = String(value).replace('.', '');
  if (value == undefined) {
    callback('请输入有效数字');
  } else if (!/^[0-9]+$/.test(strOne) && String(value).length > 0) {
    // 判断非法字符
    callback('请输入有效数字');
  } else if (Number(numStr) >= 100) {
    // 判断有效区域内数字
    callback('请输入100以内数字');
  } else if (numStr.length == strOne.length + 1 && numStr.split('.')[1].length > 6) {
    // 含有小数点时控制小数位数
    callback('小数位数不可超过6位');
  } else {
    callback();
  }
};

const sectionCheck = (_, value: any, callback: (val?: any) => void) => {
  const tempStr = String(value)
    .replace(/\s/g, '')
    .replace(/([.]*)/g, '')
    .replace(/([,]*)/g, '');
  const tempArr = String(value).replace(/\s/g, '').split(','),
    newArr = Array.from(new Set(tempArr));

  // 判断是否为空
  if (tempStr.length == 0) {
    callback('请填入有效数字');
  }
  // 判断非法字符
  else if (!/^[0-9]+$/.test(tempStr)) {
    callback('请勿输入数字、小数点、英文逗号外的其他字符');
  }
  // 判断重复
  else if (tempArr.length != newArr.length) {
    callback('输入数字中存在重复数据');
  }
  // 判断边界
  else if (Number(newArr.slice(-1)) >= maxNumber) {
    callback('最大值超出边界');
  } else if (Number(newArr[0]) <= 0) {
    callback('最小值超出边界');
  } else {
    callback();
  }
};

const fileCheck = (_, value: any, callback: (val?: any) => void) => {
  if (value.length == 0) {
    callback('请上传代销协议');
  } else {
    callback();
  }
};

const sectionItemCheck = (_, value: any, callback: (val?: any) => void) => {
  const numStr = String(value).trim(),
    strOne = String(value).replace('.', '');
  if (value == undefined) {
    callback('请输入有效数字');
  } else if (!/^[0-9]+$/.test(strOne) && String(value).length > 0) {
    // 判断非法字符
    callback('请输入有效数字');
  } else if (numStr.length == strOne.length + 1 && numStr.split('.')[1].length > 6) {
    // 含有小数点时控制小数位数
    callback('小数位数不可超过6位');
  } else {
    callback();
  }
};

const beforeUpload = (file: any) => {
  // const fileType = file.type === 'xls' || file.type === 'xlsx';
  if (file.size <= 0) {
    message.error('上传文件不能为空!');
  }
  return file.size || Upload.LIST_IGNORE;
};

// 弹窗
const DetailModal = (props: ModalProps) => {
  const formRef = useRef<ProFormInstance>();
  const [isCollapse] = useState(true);
  const { visible, modalType } = props;
  const initStates = {
    distributor: { value: '', label: '' },
    fund: [],
    fundRadio: '0',
    effectDate: null,
    effectEndDate: null,
    personType: '9',
    personalFeeType: '0',
    impersonalFeeType: '0',
    personalCareFee: '',
    impersonalCareFee: '',
    external: '0',
    exchange: '0',
    subscribeFee: '',
    purchaseFee: '',
    redeemFee: '',
    convertFee: '',
    convertRecuperateFee: '',
    fileUrl: [],
    section: '',
    remarkOne: '',
  };
  const [perSectionList, setPerSectionList] = useState([]);
  const [imPerSectionList, setImPerSectionList] = useState([]);

  useEffect(() => {
    if (props.visible)
      if (Object.keys(props.initValues).length) {
        formRef.current?.setFieldsValue({
          ...props.initValues,
          fundRadio: props.initValues.fundCode == '***' ? '0' : '1',
          personalCareFee: parseFloat(
            (props.initValues.tConfConsignmentFeeRangeDOs[0].careFee * 100).toPrecision(12),
          ),
          impersonalCareFee: parseFloat(
            (props.initValues.tConfConsignmentFeeRangeDOs[0].careFee * 100).toPrecision(12),
          ),
          personalFeeType: props.initValues.feeType,
          impersonalFeeType: props.initValues.feeType,
          subscribeFee: props.initValues.subscribeFee * 100,
          purchaseFee: props.initValues.purchaseFee * 100,
          redeemFee: props.initValues.redeemFee * 100,
          convertFee: props.initValues.convertFee * 100,
          convertRecuperateFee: parseFloat(
            (props.initValues.convertRecuperateFee * 100).toPrecision(12),
          ),
          distributor: {
            value: props.initValues.distributorCode,
            label: props.initValues.distributorName,
          },
          fund:
            props.initValues.fundCode == '***'
              ? []
              : {
                  value: props.initValues.fundCode,
                  label: props.initValues.fundName,
                },
          remarkOne: '', // 不回显
          fileUrl: [],
        });
        const { tConfConsignmentFeeRangeDOs } = props.initValues;
        if (props.initValues.personType == 0) {
          let _string = '';
          setPerSectionList(
            tConfConsignmentFeeRangeDOs.map((i: any) => {
              const obj = {};
              const feeEnd = i.feeEnd == maxNumber ? 'Max' : i.feeEnd;
              obj[`section_${feeEnd}`] = i.careFee * 100;
              formRef.current?.setFieldsValue(obj);
              _string = _string + ',' + i.feeEnd;
              return feeEnd;
            }),
          );
          formRef.current?.setFieldsValue({ section: _string.slice(1, -15) });
        } else if (props.initValues.personType == 1) {
          let im_string = '';
          setImPerSectionList(
            tConfConsignmentFeeRangeDOs.map((i: any) => {
              const obj = {};
              const feeEnd = i.feeEnd == maxNumber ? 'Max' : i.feeEnd;
              obj[`im_section_${feeEnd}`] = i.careFee * 100;
              formRef.current?.setFieldsValue(obj);
              im_string = im_string + ',' + i.feeEnd;
              return feeEnd;
            }),
          );
          formRef.current?.setFieldsValue({ im_section: im_string.slice(1, -15) });
        }
      } else {
        formRef.current?.setFieldsValue(initStates);
        setPerSectionList([]);
        setImPerSectionList([]);
      }
  }, [props]);

  const handleSection = async (str: any, type: any) => {
    const tempArr = String(str).replace(/\s/g, '').split(','),
      newArr = Array.from(new Set(tempArr));
    const arr: any = newArr
      .sort((a, b) => {
        return Number(a) - Number(b);
      })
      .concat(['Max']);
    if (type == 'person') {
      setPerSectionList(arr);
      // 分段清空
      const obj = {};
      arr.forEach((i: any) => {
        obj[`section_${i}`] = i.careFee;
        formRef.current?.setFieldsValue(obj);
      });
    } else {
      setImPerSectionList(arr);
      // 分段清空
      const obj = {};
      arr.forEach((i: any) => {
        obj[`im_section_${i}`] = i.careFee;
        formRef.current?.setFieldsValue(obj);
      });
    }
  };

  // 获取分段数组
  const getSectionArr = (values: any, sectionList: any, type: any) => {
    const temp: [] = [];
    for (const [index] of sectionList.entries()) {
      const obj = {
        feeStart: '0',
        feeEnd: String(maxNumber),
        careFee: 1,
        careFeeType: '0',
      };
      // 循环第一个
      if (index == 0) {
        obj.feeStart = '0';
        obj.feeEnd = sectionList[index];
        if (type == 'person') {
          obj.careFee = values[`section_${sectionList[index]}`] / 100;
        } else {
          obj.careFee = values[`im_section_${sectionList[index]}`] / 100;
        }
        obj.careFeeType = '0';
      }
      // 正常取值
      else {
        obj.feeStart = sectionList[index - 1];
        obj.feeEnd = sectionList[index] == 'Max' ? String(maxNumber) : sectionList[index];
        if (type == 'person') {
          obj.careFee = values[`section_${sectionList[index]}`] / 100;
        } else {
          obj.careFee = values[`im_section_${sectionList[index]}`] / 100;
        }
        obj.careFeeType = '0';
      }
      temp.push(obj);
    }
    return temp;
  };

  const handleSubmit = async (value: any) => {
    try {
      let result: any = {};
      const {
        fundRadio,
        convertFee,
        convertRecuperateFee,
        effectDate,
        effectEndDate,
        exchange,
        external,
        personalFeeType,
        impersonalFeeType,
        personalCareFee,
        impersonalCareFee,
        distributor,
        fund,
        personType,
        purchaseFee,
        redeemFee,
        subscribeFee,
        fileUrl,
        remarkOne,
      } = value;
      const distributorCode = distributor.value;
      const distributorName = distributor.label;
      const fundCodeFundName =
        fundRadio == '0'
          ? ['***=全部']
          : Array.isArray(fund)
          ? fund.map((i: any) => {
              return `${i?.value.split('-')[0]}=${i?.label}`;
            })
          : [`${props.initValues.fundCode}=${props.initValues.fundName}`]; //若未选择 不是个数组 单独处理
      const para = {
        tconfConsignmentFeeDO: {
          convertFee: convertFee / 100,
          convertRecuperateFee: convertRecuperateFee / 100,
          effectDate,
          effectEndDate,
          exchange,
          external,
          distributorCode,
          distributorName,
          fundCodeFundName,
          personType,
          purchaseFee: purchaseFee / 100,
          redeemFee: redeemFee / 100,
          subscribeFee: subscribeFee / 100,
          id: props.initValues.id,
          personalFeeType: personalFeeType ? personalFeeType : '',
          impersonalFeeType: impersonalFeeType ? impersonalFeeType : '',
          personalFeeRate:
            personalFeeType == '0' || personalFeeType == '1'
              ? [
                  {
                    careFee: personalCareFee ? personalCareFee / 100 : '',
                    feeEnd: String(maxNumber),
                    careFeeType: '0',
                    feeStart: '0',
                  },
                ]
              : getSectionArr(value, perSectionList, 'person'),
          impersonalFeeRate:
            impersonalFeeType == '0' || impersonalFeeType == '1'
              ? [
                  {
                    careFee: impersonalCareFee ? impersonalCareFee / 100 : '',
                    feeEnd: String(maxNumber),
                    careFeeType: '0',
                    feeStart: '0',
                  },
                ]
              : getSectionArr(value, imPerSectionList, 'imperson'),
          remarkOne,
        },
        files: fileUrl
          ? {
              fileDownloadUrl: fileUrl[0]?.response?.data,
              fileName: fileUrl[0]?.name,
            }
          : null,
      };
      if (props.modalType === 'add') {
        result = await addCareFee(para);
      } else {
        result = await updateCareFee(para);
      }
      if (result.success) {
        formRef.current?.resetFields();
        props.onClose('reload');
        return;
      }
      message.error(result.errorMsg || '接口请求失败');
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <ModalForm
      width={850}
      visible={visible}
      labelCol={{ span: 4 }}
      layout={'horizontal'}
      title={modalType === 'add' ? '新增' : '编辑'}
      formRef={formRef}
      initialValues={initStates}
      modalProps={{
        onCancel: () => {
          formRef.current?.resetFields();
          props.onClose('cancel');
        },
      }}
      onFinish={handleSubmit}
    >
      <ProFormSelect
        fieldProps={{
          labelInValue: true,
        }}
        name="distributor"
        label="销售商"
        disabled={modalType === 'add' ? false : true}
        request={async () => {
          const libraryTypeList = await queryDis();
          if (Array.isArray(libraryTypeList)) {
            return libraryTypeList.map((item) => ({
              label: item.cDistributorName,
              value: item.cDistributorCode,
            }));
          }
          return libraryTypeList;
        }}
        placeholder="请选择销售商"
        rules={[{ required: true }]}
      />
      <ProFormRadio.Group
        name="fundRadio"
        label="基金选择"
        disabled={modalType === 'add' ? false : true}
        rules={[{ required: true }]}
        options={[
          {
            label: '全部',
            value: '0',
          },
          {
            label: '手动选取',
            value: '1',
          },
        ]}
      />
      <ProFormDependency name={['fundRadio']}>
        {({ fundRadio }) => {
          return fundRadio == '1' ? (
            <ProFormSelect
              name="fund"
              label="基金"
              disabled={modalType === 'add' ? false : true}
              fieldProps={{
                labelInValue: true,
                // optionFilterProp:"children"
              }}
              mode="multiple"
              request={async () => {
                const impactTypeList = await queryCareFeeFundInfo();
                if (Array.isArray(impactTypeList)) {
                  return impactTypeList.map((item, index) => ({
                    key: index,
                    label: item.cFundName,
                    value: `${item.cFundCode}-${index}`,
                    // 这个地方在value后面拼index，是因为后端存在重复数据，导致下拉列表滚动全是重复数据
                  }));
                }
                return impactTypeList;
              }}
              placeholder="请选择影响类型"
              rules={[{ required: true }]}
            />
          ) : null;
        }}
      </ProFormDependency>
      <ProFormDatePicker name="effectDate" label="生效日期" rules={[{ required: true }]} />
      <ProFormDatePicker name="effectEndDate" label="截止日期" rules={[{ required: true }]} />
      <ProFormRadio.Group
        name="personType"
        label="客户类型"
        rules={[{ required: true }]}
        options={[
          {
            label: '全部',
            value: '9',
          },
          {
            label: '个人',
            value: '0',
          },
          {
            label: '非个人',
            value: '1',
          },
        ]}
        disabled={true}
      />
      <ProFormDependency name={['fundRadio', 'personType']}>
        {({ fundRadio, personType }) => {
          return personType == '9' || personType == '0' ? (
            <ProFormSelect
              disabled={fundRadio === '0' || modalType != 'add'}
              name="personalFeeType"
              label="个人费用方式"
              options={[
                {
                  label: '管理费比例',
                  value: '0',
                },
                {
                  label: '固定费率',
                  value: '1',
                },
                {
                  label: '分段管理费比例',
                  value: '2',
                },
                {
                  label: '分段固定费率',
                  value: '3',
                },
              ]}
              placeholder="请选择费用方式"
              rules={[{ required: true }]}
            />
          ) : null;
        }}
      </ProFormDependency>
      <ProFormDependency name={['personalFeeType', 'personType']}>
        {({ personalFeeType, personType }) => {
          if (personType == '9' || personType == '0') {
            if (personalFeeType == '0') {
              return (
                <ProFormText
                  required
                  name="personalCareFee"
                  label="个人管理费比例"
                  placeholder="请输入管理费比例"
                  rules={[{ required: true, message: '请输入管理费比例' }, { validator: numCheck }]}
                  fieldProps={{
                    suffix: '%',
                  }}
                />
              );
            } else if (personalFeeType == '1') {
              return (
                <ProFormText
                  required
                  name="personalCareFee"
                  label="个人固定费率"
                  placeholder="请输入固定费率"
                  rules={[{ required: true, message: '请输入固定费率' }, { validator: numCheck }]}
                  fieldProps={{
                    suffix: '%',
                  }}
                />
              );
            } else {
              return (
                <>
                  <ProFormText
                    allowClear
                    name="section"
                    label="分段区间"
                    placeholder="请输入分割数字，用英文逗号分割"
                    rules={[{ required: true, message: '' }, { validator: sectionCheck }]}
                    width="xl"
                    disabled={modalType === 'add' ? false : true}
                    addonAfter={
                      <Button
                        disabled={modalType === 'add' ? false : true}
                        onClick={() =>
                          handleSection(formRef.current?.getFieldsValue()?.section, 'person')
                        }
                      >
                        确认
                      </Button>
                    }
                  />
                  {perSectionList.length > 0
                    ? perSectionList.map((item: any, index: any) => {
                        return (
                          <ProFormText
                            disabled={modalType === 'add' ? false : true}
                            width="xl"
                            name={`section_${item}`}
                            label={
                              index == 0 ? 'Min-' + item : perSectionList[index - 1] + '-' + item
                            }
                            key={index}
                            placeholder="请输入有效数字"
                            rules={[{ required: true }, { validator: sectionItemCheck }]}
                            addonAfter="%"
                            initialValue=""
                          />
                        );
                      })
                    : null}
                </>
              );
            }
          } else {
            return null;
          }
        }}
      </ProFormDependency>

      <ProFormDependency name={['fundRadio', 'personType']}>
        {({ fundRadio, personType }) => {
          return personType == '9' || personType == '1' ? (
            <ProFormSelect
              disabled={fundRadio === '0' || modalType != 'add'}
              name="impersonalFeeType"
              label="非个人费用方式"
              options={[
                {
                  label: '管理费比例',
                  value: '0',
                },
                {
                  label: '固定费率',
                  value: '1',
                },
                {
                  label: '分段管理费比例',
                  value: '2',
                },
                {
                  label: '分段固定费率',
                  value: '3',
                },
              ]}
              placeholder="请选择费用方式"
              rules={[{ required: true }]}
            />
          ) : null;
        }}
      </ProFormDependency>
      <ProFormDependency name={['impersonalFeeType', 'personType']}>
        {({ impersonalFeeType, personType }) => {
          if (personType == '9' || personType == '1') {
            if (impersonalFeeType == '0') {
              return (
                <ProFormText
                  required
                  name="impersonalCareFee"
                  label="非个人管理费比例"
                  placeholder="请输入管理费比例"
                  rules={[{ required: true, message: '请输入管理费比例' }, { validator: numCheck }]}
                  fieldProps={{
                    suffix: '%',
                  }}
                />
              );
            } else if (impersonalFeeType == '1') {
              return (
                <ProFormText
                  required
                  name="impersonalCareFee"
                  label="非个人固定费率"
                  placeholder="请输入固定费率"
                  rules={[{ required: true, message: '请输入固定费率' }, { validator: numCheck }]}
                  fieldProps={{
                    suffix: '%',
                  }}
                />
              );
            } else {
              return (
                <>
                  <ProFormText
                    disabled={modalType === 'add' ? false : true}
                    allowClear
                    name="im_section"
                    label="分段区间"
                    placeholder="请输入分割数字，用英文逗号分割"
                    rules={[{ required: true, message: '' }, { validator: sectionCheck }]}
                    width="xl"
                    addonAfter={
                      <Button
                        disabled={modalType === 'add' ? false : true}
                        onClick={() =>
                          handleSection(formRef.current?.getFieldsValue()?.im_section, 'imperson')
                        }
                      >
                        确认
                      </Button>
                    }
                  />
                  {imPerSectionList.length > 0
                    ? imPerSectionList.map((item: any, index: any) => {
                        return (
                          <ProFormText
                            disabled={modalType === 'add' ? false : true}
                            width="xl"
                            name={`im_section_${item}`}
                            label={
                              index == 0 ? 'Min-' + item : imPerSectionList[index - 1] + '-' + item
                            }
                            key={index}
                            placeholder="请输入有效数字"
                            rules={[{ required: true }, { validator: sectionItemCheck }]}
                            addonAfter="%"
                            initialValue=""
                          />
                        );
                      })
                    : null}
                </>
              );
            }
          } else {
            return null;
          }
        }}
      </ProFormDependency>

      <ProFormRadio.Group
        name="external"
        label="使用外部投资占比"
        rules={[{ required: true }]}
        options={[
          {
            label: '否',
            value: '0',
          },
          {
            label: '是',
            value: '1',
          },
        ]}
      />
      <ProFormRadio.Group
        name="exchange"
        label="计提场内尾佣"
        rules={[{ required: true }]}
        options={[
          {
            label: '否',
            value: '0',
          },
          {
            label: '是',
            value: '1',
          },
        ]}
      />
      <CommonUpload
        name="fileUrl"
        label="代销协议"
        title="上传文件"
        //accept={'.xls,.xlsx'}
        rules={[{ validator: fileCheck }]}
        required
        fieldProps={{
          maxCount: 1,
          beforeUpload: beforeUpload,
        }}
      />
      <ProFormText
        name="remarkOne"
        label="审批OA号"
        placeholder="请输入审批OA号"
        rules={[{ required: true }]}
      />
      {!isCollapse && (
        <div>
          <ProFormText
            name="subscribeFee"
            label="认购费"
            placeholder="请输入认购费"
            rules={[{ validator: numCheck }]}
            fieldProps={{ suffix: '%' }}
          />
          <ProFormText
            name="purchaseFee"
            label="申购费"
            placeholder="请输入申购费"
            rules={[{ validator: numCheck }]}
            fieldProps={{ suffix: '%' }}
          />
          <ProFormText
            name="redeemFee"
            label="赎回费"
            placeholder="请输入赎回费"
            rules={[{ validator: numCheck }]}
            fieldProps={{ suffix: '%' }}
          />
          <ProFormText
            name="convertFee"
            label="转换赎回费"
            placeholder="请输入转换赎回费"
            rules={[{ validator: numCheck }]}
            fieldProps={{ suffix: '%' }}
          />
          <ProFormText
            name="convertRecuperateFee"
            label="转换补差费"
            placeholder="请输入转换补差费"
            rules={[{ validator: numCheck }]}
            fieldProps={{ suffix: '%' }}
          />
        </div>
      )}
      {/* <div
        className={'btn_expend'}
        onClick={() => setIsCollapse(!isCollapse)}
        style={{ position: 'relative', zIndex: 1 }}
      >
        {!isCollapse ? (
          <>
            收起
            <CaretUpOutlined />
          </>
        ) : (
          <>
            展开
            <CaretDownOutlined />
          </>
        )}
      </div> */}
    </ModalForm>
  );
};

export default DetailModal;
