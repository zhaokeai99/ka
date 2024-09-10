import React, { useEffect, useState } from 'react';
import { ProFormSelect } from '@ant-design/pro-components';
import { queryOtcSeatInfos } from '../../service';

const SeatNo = ({ isResetBtn }: any) => {
  const [seatNoList, setSeatNoList] = useState<any>([]);
  const [newSeatNoList, setNewSeatNoList] = useState<any>([]);
  const [seatNoVal, setSeatNoVal] = useState<any>('');

  const checkListFn = (list: any) => {
    return list?.map((item: any) => {
      return {
        ...item,
        label: `${item?.seatno}-${item?.trusteeName}-${item?.securitiesFirmName}`,
        value: item?.seatno,
      };
    });
  };

  const getDataFn = async () => {
    const data = await queryOtcSeatInfos();
    const list = checkListFn(data);
    setSeatNoList(list);
  };

  useEffect(() => {
    getDataFn();
  }, []);

  useEffect(() => {
    setSeatNoVal('');
  }, [isResetBtn]);

  const seatNoChangeFn = (val: any) => {
    setSeatNoVal(val);
    const arr = seatNoList?.filter((item: any) => item?.seatno?.includes(val));
    const list = checkListFn(arr);
    setNewSeatNoList(list);
  };
  return (
    <ProFormSelect
      width="md"
      name="seatNo"
      label="席位号"
      showSearch
      debounceTime={300}
      placeholder="请输入席位号"
      rules={[{ required: true }]}
      options={seatNoVal ? newSeatNoList : seatNoList}
      fieldProps={{
        value: seatNoVal,
        onChange: seatNoChangeFn,
        labelInValue: true,
      }}
    />
  );
};

export default SeatNo;
