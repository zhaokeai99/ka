import React, { useState, useCallback, useEffect } from 'react';
import { Select } from 'antd';
import { queryIndustryChainList } from '@/pages/IndustrialChain/Tracking/service';

const { Option } = Select;

type searchType = {
  abnormalDate: string;
  industry: {
    name: string;
    code: string;
    chain: string;
  };
};

type propsType = {
  industryChainName: string;
  searchHandle: (val: searchType) => void;
};

const FilterCom = (props: propsType) => {
  const [list, setList] = useState<any[]>([]);
  const [search, setSearch] = useState<searchType>({
    abnormalDate: '5',
    industry: {
      name: '',
      code: '',
      chain: '0',
    },
  });

  // 获取行业下拉
  const getList = useCallback(async () => {
    const { data, success } = await queryIndustryChainList();

    if (success) {
      setList(data);

      const GFCode = data.filter(
        (item: { industryChainName: string }) =>
          item?.industryChainName === props?.industryChainName,
      );

      const {
        industryChainName: name,
        industryChainCode: code,
        chain,
      } = data?.length
        ? GFCode[0] ?? data[0]
        : { industryChainName: '', industryChainCode: '', chain: '0' };

      const params = {
        ...search,
        industry: {
          chain,
          name,
          code,
        },
      };

      setSearch(params);
      props.searchHandle(params);
    }
  }, []);

  const dateChange = (val: number | string) => {
    const param: any = { ...search, abnormalDate: val };

    setSearch(param);
    props.searchHandle(param);
  };

  const selectChange = (val: any, evt: { chain: any; key: any; children: any }) => {
    const { chain, key, children } = evt;

    const param: any = {
      ...search,
      industry: {
        chain,
        name: children,
        code: key,
      },
    };

    setSearch(param);
    props.searchHandle(param);
  };

  useEffect(() => {
    getList();
  }, []);

  return (
    <div style={{ textAlign: 'center', paddingTop: '10px' }}>
      <Select
        size="small"
        value={search.abnormalDate}
        placeholder="时间范围"
        style={{ width: '45%', marginLeft: '5px' }}
        onChange={dateChange}
      >
        {/* 0：近一月 1：近三月 2：近半年 3：近一年 4：近三年 5：全部 */}
        <Option value="0">近一月</Option>
        <Option value="1">近三月</Option>
        <Option value="2">近半年</Option>
        <Option value="3">近一年</Option>
        <Option value="4">近三年</Option>
        <Option value="5">全部</Option>
      </Select>
      <Select
        showSearch
        size="small"
        labelInValue
        value={{ label: search.industry.name, value: search.industry.code }}
        style={{ width: '45%', marginLeft: '5px' }}
        placeholder="行业切换"
        optionFilterProp="items"
        onChange={selectChange as any}
        filterOption={(input, option) =>
          (option!.children as unknown as string).toLowerCase().includes(input.toLowerCase())
        }
      >
        {list?.map(({ industryChainName, industryChainCode, chain }) => (
          <Option key={industryChainCode} value={industryChainCode} chain={chain}>
            {industryChainName}
          </Option>
        ))}
      </Select>
    </div>
  );
};

export default FilterCom;
