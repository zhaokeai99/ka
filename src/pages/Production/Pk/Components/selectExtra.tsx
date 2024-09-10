import { Select } from 'antd';
import { useEffect, useState } from 'react';
import TitleExtra from './TitleExtra';
import { queryFundLevelIncomeRank } from '../Fund/service';
const { Option } = Select;

const SelectExtra = ({ handleChange }: { handleChange?: any }) => {
  const [optionsData, setOptionsData] = useState([]);
  const [defaultValue1, setDefaultValue1] = useState('');

  const getFundLevelIncomeRank = async () => {
    let result = await queryFundLevelIncomeRank();
    let v = '';
    result = result.map((data: any) => {
      if (data?.defaultValue === 0) v = data?.key;
      return {
        label: data?.value,
        value: data?.key,
      };
    });
    setOptionsData(result);
    setDefaultValue1(v);
  };

  useEffect(() => {
    getFundLevelIncomeRank();
  }, []);

  return (
    <>
      <span>分类标准：</span>
      <Select
        defaultValue={defaultValue1}
        style={{ width: 200 }}
        onChange={(value: string) => handleChange(value)}
        key={defaultValue1}
      >
        {optionsData.map((item: any) => (
          <Option value={item?.value} key={item?.value}>
            {item?.label}
          </Option>
        ))}
      </Select>
      <TitleExtra id="fundInterval" />
    </>
  );
};
export default SelectExtra;
