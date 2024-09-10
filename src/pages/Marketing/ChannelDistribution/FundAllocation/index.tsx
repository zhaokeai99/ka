import React, { useState, useMemo } from 'react';
import { useModel } from 'umi';
import ProTable from '@ant-design/pro-table';
import ProCard from '@ant-design/pro-card';
import PickerComponent from '../PickerComponent';
import { queryFundAllocationList } from '../service';
import { FundAllocationIndex } from '../data';

// 资金配置
export default function (props: any) {
  const { agencyCode } = props.match.params;
  const [{ dateInfo }] = useModel('useMarketingModel');
  const [pickerValues, setPickerValues] = useState<any>({ dateDimension: '1' });
  const initialValue = {
    initialDate: dateInfo.dLastT1Day,
    initialType: '1',
  };

  const pickerOnChange = (value: any) => {
    setPickerValues(value);
  };

  const columns: any[] = useMemo(
    () => [
      {
        title: '产品类型',
        dataIndex: 'fundTypeName',
        key: 'fundTypeName',
        fixed: 'left',
        width: 100,
        search: false,
      },
      {
        title: '申购（万）',
        dataIndex: 'purchaseAmt',
        key: 'purchaseAmt',
        search: false,
        valueType: 'BIFundColor',
      },
      {
        title: '赎回（万）',
        dataIndex: 'redeemAmt',
        key: 'redeemAmt',
        search: false,
        valueType: 'BIFundColor',
      },
      {
        title: '净申购（万）',
        dataIndex: 'netAmt',
        key: 'netAmt',
        search: false,
        valueType: 'BIFundColor',
      },
      {
        title: '申购笔数（万）',
        dataIndex: 'purchaseCnt',
        key: 'purchaseCnt',
        search: false,
        valueType: 'BIFundColor',
      },
      {
        title: '赎回笔数（万）',
        dataIndex: 'redeemCnt',
        key: 'redeemCnt',
        search: false,
        valueType: 'BIFundColor',
      },
      {
        title: '存量（亿）',
        dataIndex: 'stockAmt',
        key: 'stockAmt',
        search: false,
        hideInTable: pickerValues?.dateDimension !== '1',
        valueType: 'BIFundColor',
      },
      {
        title: '收益（万）',
        dataIndex: 'profitAmt',
        key: 'profitAmt',
        search: false,
        valueType: 'BIFundColor',
      },
      {
        title: '累计收益（亿）',
        dataIndex: 'accumProfitAmt',
        key: 'accumProfitAmt',
        search: false,
        valueType: 'BIFundColor',
      },
      {
        dataIndex: 'pickerValues',
        hideInTable: true,
        renderFormItem: (_: any, fieldConfig: any, form: any) => {
          if (fieldConfig.type === 'form') {
            return null;
          }
          const status = form.getFieldValue('status');
          if (status !== open) {
            return <PickerComponent onChange={pickerOnChange} {...initialValue} />;
          }
          return fieldConfig.defaultRender(_);
        },
      },
    ],
    [pickerValues],
  );

  const queryTableList = async () => {
    const { dateDimension, dateDur } = pickerValues as any;
    const { data } = await queryFundAllocationList({
      agencyCode: agencyCode,
      dateDimension: dateDimension || initialValue.initialType,
      dateDur: dateDur || initialValue.initialDate,
    });
    return { data };
  };

  return (
    <ProCard ghost>
      <ProTable<FundAllocationIndex>
        columns={columns}
        scroll={{ x: 'max-content' }}
        rowKey="fundType"
        options={false}
        request={queryTableList}
        onReset={() => {
          setPickerValues({});
        }}
        pagination={false}
      />
    </ProCard>
  );
}
