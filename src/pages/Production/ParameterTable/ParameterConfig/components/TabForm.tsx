import { FEE_MAX } from '@/utils/utils';
import { Form } from 'antd';
import { mapKeys as _mapKeys, mapValues as _mapValues } from 'lodash';
import moment from 'moment';
import { forwardRef, useEffect } from 'react';
import {
  BasicInfo,
  CashSettlement,
  fundParamTradeRateObj,
  fundParamSettlementBusiList,
  InterchangeFees,
  TradingParameters,
} from './index';

const formItemLayoutWithOutLabel = {
  labelCol: { span: 11 },
  wrapperCol: { span: 13 },
};

const TabForm = forwardRef<any, any>(
  ({ disabled = false, name = '', data, index, changeValues }, ref) => {
    const [form] = Form.useForm();

    // 初始化将form绑定到父级ref上
    useEffect(() => {
      ref.current[index] = form;
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
      if (data) {
        const { raiseEndDate, raiseStartDate } = data?.fundParamBasic || {};
        form.setFieldsValue({
          ...data,
          fundParamSettlementBusiList: data?.fundParamSettlementBusiList?.length
            ? data.fundParamSettlementBusiList
            : fundParamSettlementBusiList,
          fundParamBasic: {
            ...data?.fundParamBasic,
            raiseEndDate: raiseEndDate && moment(raiseEndDate),
            raiseStartDate: raiseStartDate && moment(raiseStartDate),
          },
          ...(_mapValues(
            fundParamTradeRateObj,
            (value, key) => data?.fundParamTradeRateList?.[key],
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
            (value, key) => `${key}Str`,
          ) || {}),
        });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    return (
      <div>
        <Form
          contentEditable={false}
          labelWrap
          form={form}
          colon={false}
          name={name}
          onValuesChange={() => changeValues()}
          {...formItemLayoutWithOutLabel}
        >
          <BasicInfo form={form} disabled={disabled} />
          <CashSettlement disabled={disabled} />
          <TradingParameters form={form} disabled={disabled} />
          <InterchangeFees form={form} disabled={disabled} />
        </Form>
      </div>
    );
  },
);

export default TabForm;
